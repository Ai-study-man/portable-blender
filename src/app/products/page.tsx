import { getAllProductSlugs, getTopProducts } from '../../lib/wp';
import { Metadata } from 'next';
import { absoluteUrl } from '../../lib/seo';
import { BreadcrumbJsonLd } from '../../components/BreadcrumbJsonLd';
import TopProductCard from '../../components/TopProductCard';

export function generateMetadata({ searchParams }: { searchParams: { page?: string } }): Metadata {
  const page = parseInt(searchParams.page || '1',10);
  if(page>1){
    return {
      title: `Products 第${page}页 - Portable Blender Catalog`,
      description: `第${page}页：便携式随行榨汁机产品目录，查看更多旅行搅拌机特性与参数。`
    };
  }
  return {
    title: 'Products: Portable & Travel Blender Catalog',
    description: 'Browse portable travel blender product summaries, specs and key feature highlights.'
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10);
  const perPage = 10;
  const products = await getTopProducts(50); // placeholder fetch
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const slice = products.slice((page-1)*perPage, page*perPage).map(p => ({
    name: p.title.rendered.replace(/<[^>]+>/g,''),
    slug: p.slug,
    description: p.excerpt?.rendered.replace(/<[^>]+>/g,'').slice(0,140) || 'Portable blender',
    features: p.acf?.pros?.slice(0,4) || ['USB-C charging','Lightweight','Travel friendly'],
    priceRange: p.acf?.price || '—',
    affiliateUrl: p.acf?.affiliate_url || undefined
  }));
  const url = absoluteUrl('/products');
  return (
    <div className="prose prose-slate max-w-none px-4 md:px-0 py-10 mx-auto">
      <link rel="canonical" href={url} />
      <BreadcrumbJsonLd items={[{ name: 'Home', url: absoluteUrl('/') }, { name: 'Products', url }]} />
      <h1 className="mb-2">Products</h1>
      <p className="text-slate-600 text-sm">Portable & travel blender catalog preview. Click any product for full details.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {slice.map(p => (
          <TopProductCard key={p.slug} product={p} />
        ))}
      </div>
      <div className="flex items-center justify-center gap-3 mt-10 text-sm">
        {page > 1 && <a href={`/products?page=${page-1}`} className="px-3 py-1 border rounded hover:bg-slate-50">Prev</a>}
        <span>Page {page} / {totalPages}</span>
        {page < totalPages && <a href={`/products?page=${page+1}`} className="px-3 py-1 border rounded hover:bg-slate-50">Next</a>}
      </div>
    </div>
  );
}
