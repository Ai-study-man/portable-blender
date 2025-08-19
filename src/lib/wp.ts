export const WP_API_BASE = 'https://mywp.com/wp-json/wp/v2';

// Import real product data
import { products as realProducts } from '../../products';

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_image?: { url: string }[];
  };
  featured_media: number;
}

export interface WPProduct extends WPPost {
  acf?: {
    pros?: string[];
    cons?: string[];
    rating?: number;
    affiliate_url?: string;
    price?: string;
    short_specs?: string;
  };
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  // Cast to any to allow Next.js cache options while keeping TS strict
  const res = await fetch(url, { ...(init as any), next: { revalidate: 300 } } as any);
  if (!res.ok) throw new Error('WP fetch failed: ' + res.status + ' ' + url);
  return res.json();
}

// Simple mock dataset used when remote fetch fails (e.g., during initial scaffold build)
const mockProducts: WPProduct[] = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  slug: `sample-portable-blender-${i + 1}`,
  title: { rendered: `Sample Portable Blender ${i + 1}` },
  excerpt: { rendered: `Short teaser for sample portable blender ${i + 1}. Great for travel smoothies.` },
  content: { rendered: `<p>This is mock content for <strong>Sample Portable Blender ${i + 1}</strong>. It illustrates how a real product review body might look with <em>pros, cons, usage tests</em> and battery performance notes.</p>` },
  featured_media: 0,
  yoast_head_json: { title: `Sample Portable Blender ${i + 1}`, description: `Mock description for blender ${i + 1}.` },
  acf: {
    pros: ['Lightweight', 'USB-C charging', 'Dishwasher safe jar'],
    cons: ['Limited ice crushing'],
    rating: 5 - (i % 3),
    affiliate_url: 'https://example.com/affiliate-link',
    price: '$39.99',
    short_specs: '300W eq. motor, 400ml jar'
  }
}));

function shouldUseMock(reason: string) {
  if (process.env.USE_WP_MOCK === '1') return true; // explicit opt-in
  // Fallback automatically during scaffold if network fails
  return false; // Use real product data from products.ts instead of mock data
}

export async function getTopProducts(limit = 5): Promise<WPProduct[]> {
  const url = `${WP_API_BASE}/product?per_page=${limit}&_embed`;
  try {
    if (shouldUseMock('topProducts')) return mockProducts.slice(0, limit);
    
    // Convert real products to WPProduct format
    const wpProducts: WPProduct[] = realProducts.slice(0, limit).map((realProduct, index) => ({
      id: index + 1,
      slug: realProduct.slug,
      title: { rendered: realProduct.name },
      excerpt: { rendered: realProduct.description },
      content: { rendered: `<p>${realProduct.description}</p><h3>Key Features:</h3><ul>${(realProduct as any).features?.map((f: string) => `<li>${f}</li>`).join('') || ''}</ul>` },
      featured_media: 0,
      yoast_head_json: { 
        title: realProduct.name, 
        description: realProduct.description 
      },
      acf: {
        pros: (realProduct as any).features || ['Portable design', 'Easy to use', 'Good performance'],
        cons: ['Limited capacity'],
        rating: (realProduct as any).rating || 4.5,
        affiliate_url: realProduct.affiliateUrl || '#',
        price: (realProduct as any).priceRange || 'See listing',
        short_specs: `${(realProduct as any).brand || 'Generic'} brand portable blender`
      }
    }));
    
    return wpProducts;
  } catch {
    return mockProducts.slice(0, limit);
  }
}

export async function getProductBySlug(slug: string): Promise<WPProduct | null> {
  const url = `${WP_API_BASE}/product?slug=${slug}&_embed`;
  try {
    if (shouldUseMock('productBySlug')) return mockProducts.find(p => p.slug === slug) || mockProducts[0];
    
    // Find product in real product data
    const realProduct = realProducts.find(p => p.slug === slug);
    if (!realProduct) return null;
    
    // Convert real product to WPProduct format
    const wpProduct: WPProduct = {
      id: realProducts.indexOf(realProduct) + 1,
      slug: realProduct.slug,
      title: { rendered: realProduct.name },
      excerpt: { rendered: realProduct.description },
      content: { rendered: `<p>${realProduct.description}</p><h3>Key Features:</h3><ul>${(realProduct as any).features?.map((f: string) => `<li>${f}</li>`).join('') || ''}</ul>` },
      featured_media: 0,
      yoast_head_json: { 
        title: realProduct.name, 
        description: realProduct.description 
      },
      acf: {
        pros: (realProduct as any).features || ['Portable design', 'Easy to use', 'Good performance'],
        cons: ['Limited capacity'],
        rating: (realProduct as any).rating || 4.5,
        affiliate_url: realProduct.affiliateUrl || '#',
        price: (realProduct as any).priceRange || 'See listing',
        short_specs: `${(realProduct as any).brand || 'Generic'} brand portable blender`
      }
    };
    
    return wpProduct;
  } catch {
    return mockProducts.find(p => p.slug === slug) || null;
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  const url = `${WP_API_BASE}/product?per_page=100&_fields=slug`;
  try {
    if (shouldUseMock('allSlugs')) return mockProducts.map(p => p.slug);
    // Use real product data from products.ts
    return realProducts.map(p => p.slug);
  } catch {
    return mockProducts.map(p => p.slug);
  }
}
