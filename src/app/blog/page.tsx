import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import BlogCard from '../../components/BlogCard';
import { Metadata } from 'next';
import { absoluteUrl, DEFAULT_IMAGE } from '../../lib/seo';
import { BreadcrumbJsonLd } from '../../components/BreadcrumbJsonLd';
import { readFileWithFrontmatter } from '../../lib/frontmatter';

export function generateMetadata({ searchParams }: { searchParams: { page?: string } }): Metadata {
  const page = parseInt(searchParams.page || '1',10);
  if(page>1){
    return {
      title: `Blog 第${page}页 - Portable Blender Reviews`,
      description: `第${page}页：便携式榨汁机评测、对比、旅行奶昔指南与购买建议。`
    };
  }
  return {
    title: 'Blog: Portable Blender Reviews & Travel Smoothie Guides',
    description: 'All portable blender reviews, comparisons, buyer guides and travel smoothie nutrition tips.'
  };
}

interface BlogEntry { slug: string; title: string; date: string; description: string; }

function truncate160(text: string) {
  const clean = text.replace(/\s+/g,' ').trim();
  if (clean.length <= 160) return clean;
  return clean.slice(0,160).replace(/\s+\S*$/, '') + '…';
}

function readBlogEntries(): BlogEntry[] {
  const blogDir = path.join(process.cwd(), 'src', 'app', 'blog');
  let entries: BlogEntry[] = [];
  try {
    const dirs = fs.readdirSync(blogDir, { withFileTypes: true }).filter(d => d.isDirectory());
    entries = dirs.map(d => {
      const slug = d.name;
      const pagePath = path.join(blogDir, slug, 'page.tsx');
      let title = slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
      let date = '2025-01-01';
      let description = title + ' – portable blender topic.';
      try {
        if (fs.existsSync(pagePath)) {
          const { frontmatter } = readFileWithFrontmatter(pagePath);
            if (frontmatter.title) title = frontmatter.title;
            if (frontmatter.datePublished) date = frontmatter.datePublished;
            if (frontmatter.description) description = frontmatter.description;
        }
      } catch {}
  return { slug, title, date, description: truncate160(description) };
    });
  } catch {}
  // Sort by date desc then title
  return entries.sort((a,b)=> (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}

export default function BlogIndex({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10);
  const perPage = 10;
  const entries = readBlogEntries();
  const totalPages = Math.max(1, Math.ceil(entries.length / perPage));
  const slice = entries.slice((page-1)*perPage, page*perPage);
  const url = absoluteUrl('/blog');

  const listJson = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Portable Blender Blog Index',
    mainEntity: slice.map(e => ({
      '@type': 'BlogPosting',
      headline: e.title,
      url: absoluteUrl(`/blog/${e.slug}`),
      image: [DEFAULT_IMAGE],
      datePublished: e.date
    }))
  };

  return (
    <div className="prose prose-slate max-w-none px-4 md:px-0 py-10 mx-auto">
      <link rel="canonical" href={url} />
      <BreadcrumbJsonLd items={[{ name: 'Home', url: absoluteUrl('/') }, { name: 'Blog', url }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJson) }} />
  <h1 className="mb-3 text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-600">Blog Articles</h1>
      <p className="text-slate-600 text-sm md:text-base max-w-2xl">Portable blender reviews, travel smoothie tips, buyer comparisons.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-10">
        {slice.map((e, idx) => (
          <BlogCard key={e.slug} slug={e.slug} title={e.title} date={e.date} description={e.description} index={idx} />
        ))}
      </div>
      <div className="flex items-center justify-center gap-3 mt-10 text-sm">
        {page > 1 && <Link href={`/blog?page=${page-1}`} className="px-3 py-1 border rounded hover:bg-slate-50">Prev</Link>}
        <span>Page {page} / {totalPages}</span>
        {page < totalPages && <Link href={`/blog?page=${page+1}`} className="px-3 py-1 border rounded hover:bg-slate-50">Next</Link>}
      </div>
    </div>
  );
}
