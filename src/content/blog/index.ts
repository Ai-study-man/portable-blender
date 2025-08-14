// Centralized static blog index to avoid runtime fs directory reads failing in some deployment environments.
// Each entry maps to a blog article folder under app/blog/<slug>/page.tsx.
// Keep metadata minimal; date/description can be overridden by page frontmatter if needed.

export interface BlogIndexEntry {
  slug: string;
  title: string;
  date: string; // ISO date
  description: string;
}

export const BLOG_INDEX: BlogIndexEntry[] = [
  {
    slug: 'best-cordless-portable-blenders-camping',
    title: 'Best Cordless Portable Blenders for Camping and Outdoor Trips (2025 Guide)',
    date: '2025-01-15',
    description: '2025 buyer guide to the best cordless portable blenders for camping: runtime tests, durability, USB performance, recommendations.'
  },
  {
    slug: 'ninja-portable-blender-review',
    title: 'Ninja Portable Blender Review: Is It Worth It for Travelers? (2025)',
    date: '2025-01-10',
    description: 'In-depth 2025 Ninja portable blender review covering power, battery life, travel usability, pros & cons.'
  },
  {
    slug: 'how-to-make-smoothies-while-traveling',
    title: 'How to Make Smoothies While Traveling: Tips, Tools & Portable Blender Tricks (2025)',
    date: '2025-02-01',
    description: 'Guide to making smoothies while traveling: packing strategies, portable blender workflow, nutrition hacks.'
  },
  {
    slug: 'mini-vs-standard-blender-comparison',
    title: 'Mini Travel Blender vs Standard Blender: Pros, Cons & Use Cases (2025)',
    date: '2025-02-08',
    description: 'Mini travel blender vs standard blender comparison: power, texture quality, portability, maintenance, recipe flexibility, and when a portable blender is enough.'
  }
  // Add future articles here.
];

export function getBlogIndexSorted() {
  return [...BLOG_INDEX].sort((a,b)=> (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}
