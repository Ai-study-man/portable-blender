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
    date: '2025-08-15',
    description: '2025 buyer guide to the best cordless portable blenders for camping: runtime tests, durability, USB performance, recommendations.'
  },
  {
    slug: 'how-to-make-smoothies-while-traveling',
    title: 'How to Make Smoothies While Traveling: Tips, Tools & Portable Blender Tricks (2025)',
    date: '2025-08-14',
    description: 'Guide to making smoothies while traveling: packing strategies, portable blender workflow, nutrition hacks.'
  },
  {
    slug: 'mini-vs-standard-blender-comparison',
    title: 'Mini Travel Blender vs Standard Blender: Pros, Cons & Use Cases (2025)',
    date: '2025-08-13',
    description: 'Mini travel blender vs standard blender comparison: power, texture quality, portability, maintenance, recipe flexibility, and when a portable blender is enough.'
  },
  {
    slug: 'ninja-portable-blender-review',
    title: 'Ninja Portable Blender Review: Is It Worth It for Travelers? (2025)',
    date: '2025-08-12',
    description: 'In-depth 2025 Ninja portable blender review covering power, battery life, travel usability, pros & cons.'
  },
  {
    slug: 'usb-rechargeable-blender-buyer-guide',
    title: 'USB Rechargeable Blender Buyer Guide (2025): How to Choose the Right Portable Model',
    date: '2025-08-11',
    description: 'Comprehensive 2025 USB rechargeable blender buyer guide: runtime, torque, battery health, safety locks, travel features, comparison factors.'
  },
  {
    slug: 'xiaomi-vs-ninja-portable-blender',
    title: 'Xiaomi Portable Blender vs. Ninja: Which One Wins in 2025?',
    date: '2025-08-10',
    description: 'Head-to-head 2025 comparison of Xiaomi portable blender vs Ninja: power, portability, battery life, travel performance, pros & cons.'
  },
  {
    slug: 'best-portable-blender-summer-recipes',
    title: '7 Quick Summer Travel Smoothie Recipes You Can Make With a Portable Blender (2025)',
    date: '2025-08-09',
    description: 'Seven refreshing summer portable blender recipes: hydration, recovery, antioxidant, high-protein, and low-sugar blends for road trips and camping.'
  },
  {
    slug: 'portable-blender-maintenance-tips',
    title: 'Portable Blender Maintenance Tips: Extend Battery & Blade Life (2025 Guide)',
    date: '2025-08-08',
    description: 'Portable blender maintenance tips: battery care, seal hygiene, blade preservation, charging habits, cleaning routines, storage practices.'
  }
];

export function getBlogIndexSorted() {
  return [...BLOG_INDEX].sort((a,b)=> (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}
