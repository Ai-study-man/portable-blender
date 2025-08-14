import Link from 'next/link';
import BlogCard from '../../components/BlogCard';
import { Metadata } from 'next';
import { absoluteUrl, DEFAULT_IMAGE } from '../../lib/seo';
import { BreadcrumbJsonLd } from '../../components/BreadcrumbJsonLd';
import { readFileWithFrontmatter } from '../../lib/frontmatter';
import { getBlogIndexSorted } from '../../content/blog';

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
  // Use static index for production reliability (no runtime fs at edge / serverless).
  const staticEntries = getBlogIndexSorted();
  // Attempt to enhance with frontmatter (dev optimization; if fs fails it silently continues).
  return staticEntries.map(e => {
    try {
      const filePath = process.cwd() + `/src/app/blog/${e.slug}/page.tsx`;
      const { frontmatter } = readFileWithFrontmatter(filePath);
      return {
        slug: e.slug,
        title: (frontmatter.title as string) || e.title,
        date: (frontmatter.datePublished as string) || e.date,
        description: truncate160((frontmatter.description as string) || e.description)
      };
    } catch {
      return e;
    }
  });
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
          <BlogCard key={e.slug} slug={e.slug} title={e.title} date={e.date} description={e.description} index={idx} thumbnail={(e as any).thumbnail} />
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
