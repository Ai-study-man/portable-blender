import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { absoluteUrl, DEFAULT_IMAGE } from '../../lib/seo';
import { readFileWithFrontmatter } from '../../lib/frontmatter';
import { getTopProducts } from '../../lib/wp';
import { stripTags } from '../../lib/utils';

export function generateMetadata({ searchParams }: { searchParams: { q?: string; page?: string } }): Metadata {
  const page = parseInt(searchParams.page || '1',10);
  const q = (searchParams.q || '').trim();
  if(q){
    if(page>1){
      return { title: `搜索 “${q}” 第${page}页 | Portable Blender Search`, description: `关键词“${q}”第${page}页搜索结果，包含便携式榨汁机文章与产品。` };
    }
    return { title: `搜索 “${q}” | Portable Blender Search`, description: `关键词“${q}”的便携式榨汁机相关文章与产品搜索结果。` };
  }
  if(page>1){
    return { title: `Search 第${page}页 - Portable Blender Articles & Products`, description: `第${page}页搜索索引结果。` };
  }
  return { title: 'Search Portable Blender Articles & Products', description: 'Search portable blender reviews, comparisons, buyer guides and product summaries.' };
}

interface SearchParams { q?: string; page?: string }
interface ResultItem { type: 'blog' | 'product'; title: string; href: string; date?: string; description: string; }

function collectBlogPosts(): ResultItem[] {
  const dir = path.join(process.cwd(), 'src', 'app', 'blog');
  let results: ResultItem[] = [];
  try {
    const dirs = fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory());
    results = dirs.map(d => {
      const slug = d.name;
      const filePath = path.join(dir, slug, 'page.tsx');
      let title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      let date = '';
      let description = '';
      try {
        const { frontmatter } = readFileWithFrontmatter(filePath);
        if (frontmatter.title) title = frontmatter.title;
        if (frontmatter.datePublished) date = frontmatter.datePublished;
        if (frontmatter.description) description = frontmatter.description;
      } catch {}
      return { type: 'blog' as const, title, href: `/blog/${slug}`, date, description };
    });
  } catch {}
  return results;
}

function excerpt(text: string, len = 160) {
  if (!text) return '';
  const clean = stripTags(text).trim();
  if (clean.length <= len) return clean;
  return clean.slice(0, len).replace(/\s+\S*$/, '') + '…';
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const q = (searchParams.q || '').trim().toLowerCase();
  const page = parseInt(searchParams.page || '1', 10);
  const perPage = 10;
  const blog = collectBlogPosts();
  const products = await getTopProducts(50).then(ps => ps.map(p => ({
    type: 'product' as const,
    title: stripTags(p.title.rendered),
    href: `/products/${p.slug}`,
    date: '2025-01-05',
    description: stripTags(p.excerpt?.rendered || '')
  })));
  let combined: ResultItem[] = [...blog, ...products];
  if (q) {
    combined = combined.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
  }
  combined.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const totalPages = Math.max(1, Math.ceil(combined.length / perPage));
  const slice = combined.slice((page - 1) * perPage, page * perPage);
  const url = absoluteUrl('/search');
  const listJson = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: 'Search Results',
    mainEntity: slice.map(r => ({
      '@type': r.type === 'blog' ? 'BlogPosting' : 'Product',
      name: r.title,
      url: absoluteUrl(r.href),
      image: [DEFAULT_IMAGE]
    }))
  };
  return (
    <div className="prose prose-slate max-w-none px-4 md:px-0 py-10 mx-auto">
      <link rel="canonical" href={url} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJson) }} />
      <h1 className="mb-4">Search</h1>
      <form className="flex gap-2 mb-6" method="get" action="/search">
        <input name="q" defaultValue={q} placeholder="Search articles or products..." className="flex-1 border px-3 py-2 rounded" />
        <button className="px-4 py-2 bg-brand text-white rounded" type="submit">Go</button>
      </form>
      {q && <p className="text-sm text-slate-500">Showing results for: <strong>{q}</strong></p>}
      <ul className="divide-y divide-slate-200 not-prose mt-6">
        {slice.map(r => (
          <li key={r.href} className="py-4">
            <h2 className="m-0 text-lg font-semibold"><Link href={r.href}>{r.title}</Link></h2>
            {r.date && <p className="text-xs text-slate-500 mt-0">{r.date}</p>}
            <p className="text-sm mt-1">{excerpt(r.description)}</p>
            <Link href={r.href} className="text-brand text-sm font-medium">View →</Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center gap-3 mt-10 text-sm">
        {page > 1 && <a href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`} className="px-3 py-1 border rounded hover:bg-slate-50">Prev</a>}
        <span>Page {page} / {totalPages}</span>
        {page < totalPages && <a href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`} className="px-3 py-1 border rounded hover:bg-slate-50">Next</a>}
      </div>
    </div>
  );
}
