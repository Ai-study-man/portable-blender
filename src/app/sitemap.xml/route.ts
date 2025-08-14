import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { getAllProductSlugs } from '../../lib/wp';
import { readFileWithFrontmatter } from '../../lib/frontmatter';

function paginate(count: number, perPage: number) {
  const pages: number[] = [];
  const total = Math.max(1, Math.ceil(count / perPage));
  for (let i=1;i<=total;i++) pages.push(i);
  return pages;
}

async function getBlogSlugs() {
  try {
    const blogDir = path.join(process.cwd(), 'src', 'app', 'blog');
    const entries = await readdir(blogDir, { withFileTypes: true });
    return entries
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .filter(name => !name.startsWith('_'));
  } catch {
    return [];
  }
}

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const staticPages = ['', 'about', 'blog', 'products', 'search'];
  const blogSlugs = await getBlogSlugs();
  const productSlugs = await getAllProductSlugs();
  // Blog pagination (assume same perPage as blog index 10)
  const blogPages = paginate(blogSlugs.length, 10).map(p => ({ page: p, loc: p === 1 ? `${base}/blog` : `${base}/blog?page=${p}` }));
  // Product pagination (assume perPage 10 like products page)
  const productPages = paginate(productSlugs.length, 10).map(p => ({ page: p, loc: p === 1 ? `${base}/products` : `${base}/products?page=${p}` }));
  // Search pagination currently unknown count -> skip dynamic; could add popular queries later.

  const entries: { loc: string; priority: string }[] = [];
  // Static pages priorities
  staticPages.forEach(p => {
    const pri = p === '' ? '1.0' : p === 'about' ? '0.8' : p === 'blog' ? '0.7' : p === 'products' ? '0.6' : p === 'search' ? '0.6' : '0.5';
    entries.push({ loc: `${base}/${p}`, priority: pri });
  });
  // Blog posts
  blogSlugs.forEach(slug => entries.push({ loc: `${base}/blog/${slug}`, priority: '0.7' }));
  // Blog pagination pages
  blogPages.filter(p => p.page > 1).forEach(p => entries.push({ loc: p.loc, priority: '0.6' }));
  // Products pages
  productSlugs.forEach(slug => entries.push({ loc: `${base}/products/${slug}`, priority: '0.6' }));
  // Product pagination pages
  productPages.filter(p => p.page > 1).forEach(p => entries.push({ loc: p.loc, priority: '0.6' }));

  const urls = entries
    .map(u => `<url><loc>${u.loc}</loc><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`)
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}
