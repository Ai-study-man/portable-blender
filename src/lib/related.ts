import fs from 'fs';
import path from 'path';

interface RelatedItem { title: string; href: string; score: number; type: 'blog' | 'product'; }

interface RelatedInput {
  title: string;
  keywords?: string[];
}

// Very lightweight keyword-based related picker across blog folder names and product slugs.
export function findRelated(input: string | RelatedInput, max = 3): RelatedItem[] {
  const currentTitle = typeof input === 'string' ? input : input.title;
  const baseKeywords = typeof input === 'string' ? extractKeywords(currentTitle) : [
    ...extractKeywords(currentTitle),
    ...(input.keywords || []).map(k => k.toLowerCase())
  ];
  const keywords = Array.from(new Set(baseKeywords));
  const blogDir = path.join(process.cwd(), 'src', 'app', 'blog');
  let blogItems: RelatedItem[] = [];
  try {
    const entries = fs.readdirSync(blogDir, { withFileTypes: true });
    blogItems = entries.filter(e => e.isDirectory()).map(e => {
      const slug = e.name;
      const title = slugToTitle(slug);
      return { title, href: `/blog/${slug}`, type: 'blog', score: score(title, keywords) };
    });
  } catch {}

  // Placeholder product slugs from mock (could be fetched asynchronously in future)
  const productSlugs = ['sample-portable-blender-1','sample-portable-blender-2','sample-portable-blender-3'];
  const productItems: RelatedItem[] = productSlugs.map(slug => ({
    title: slugToTitle(slug),
    href: `/products/${slug}`,
    type: 'product',
    score: score(slugToTitle(slug), keywords) * 0.8 // slight penalty so blogs rank first
  }));

  return [...blogItems, ...productItems]
    .filter(i => !currentTitle.toLowerCase().includes(i.title.toLowerCase()))
    .sort((a,b) => b.score - a.score)
    .slice(0, max);
}

function extractKeywords(title: string): string[] {
  return title.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 3 && !stop.has(w));
}

function score(candidateTitle: string, kw: string[]) {
  const lc = candidateTitle.toLowerCase();
  return kw.reduce((acc, k) => acc + (lc.includes(k) ? 1 : 0), 0);
}

function slugToTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const stop = new Set(['with','from','that','this','your','portable','blender','blenders','mini','travel','vs','2025','guide']);
