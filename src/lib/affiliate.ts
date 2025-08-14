import { products } from '../../products';

export function getAffiliateUrl(slug: string): string {
  try {
    const found = products.find(p => p.slug === slug);
    return found?.affiliateUrl || '#';
  } catch {
    return '#';
  }
}

export function findMentionedProduct(content: string): string | undefined {
  if (!content) return undefined;
  const lower = content.toLowerCase();
  for (const p of products) {
    if (lower.includes(p.slug.toLowerCase())) return p.slug;
  }
  return undefined;
}
