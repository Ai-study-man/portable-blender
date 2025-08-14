import { getAllProductSlugs, getProductBySlug } from '../../../lib/wp';
import { Metadata } from 'next';
import Link from 'next/link';
import { stripTags, truncate160 } from '../../../lib/utils';
import { BreadcrumbJsonLd } from '../../../components/BreadcrumbJsonLd';
import { ArticleJsonLd } from '../../../components/ArticleJsonLd';
import { absoluteUrl, DEFAULT_IMAGE } from '../../../lib/seo';
import path from 'path';
import fs from 'fs';
import Image from 'next/image';
import { getGitLastModified, readFileWithFrontmatter } from '../../../lib/frontmatter';
import { shimmerDataURL } from '../../../lib/placeholder';
import { products as staticProducts } from '../../../../products';
import { findRelated } from '../../../lib/related';

/*
---
title: Product Detail
author: Editorial Team
datePublished: 2025-01-05
description: Portable blender product detail & review page.
keywords: [portable blender, travel blender, cordless portable blender]
---
*/

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found', description: 'Product not found.' };
  const title = stripTags(product.title.rendered);
  const rawDesc = stripTags(product.excerpt?.rendered || '');
  const description = rawDesc.length>155 ? rawDesc.slice(0,155).replace(/\s+\S*$/,'') + '…' : rawDesc;
  return { title: `${title} | Portable Blender Features`, description };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) return <div className="container section"><h1>Not Found</h1><p>Product not found.</p></div>;
  const title = stripTags(product.title.rendered);
  const content = product.content.rendered;
  const pros = product.acf?.pros || [];
  const cons = product.acf?.cons || [];
  const affiliate = product.acf?.affiliate_url;
  const price = product.acf?.price;
  const url = absoluteUrl(`/products/${product.slug}`);
  const fmPath = path.join(process.cwd(), 'src', 'app', 'products', '[slug]', 'page.tsx');
  let fm: any = {};
  try { fm = readFileWithFrontmatter(fmPath).frontmatter; } catch {}
  const published = fm.datePublished || '2025-01-05';
  const modified = fm.dateModified || getGitLastModified(fmPath) || published;
  const author = fm.author || 'Editorial Team';
  const staticMeta = staticProducts.find(p => p.slug === product.slug) as any || {};
  const ratingValue = product.acf?.rating || staticMeta.rating;
  const reviewCount = (product.acf as any)?.reviewCount || staticMeta.reviewCount;
  const features: string[] = staticMeta.features || [];
  const staticImageRel = `/picture/${product.slug}.jpg`;
  const staticImageAbs = path.join(process.cwd(), 'public', 'picture', `${product.slug}.jpg`);
  const hasStaticImage = fs.existsSync(staticImageAbs);
  const displayImage = hasStaticImage ? staticImageRel : DEFAULT_IMAGE;
  // derive related products (simple keyword match against static list as placeholder)
  const relatedProducts = staticProducts
    .filter(p => p.slug !== product.slug)
    .map(p => ({
      slug: p.slug,
      name: p.name,
      score: similarity(p.name, title)
    }))
    .sort((a,b)=> b.score - a.score)
    .slice(0,3);

  function renderStars(val?: number){
    if(!val) return null;
    const full = Math.floor(val);
    const half = val - full >= 0.5;
    const total = 5;
    const stars = [] as JSX.Element[];
    for(let i=0;i<full;i++) stars.push(<span key={i} aria-hidden className="text-amber-500">★</span>);
    if(half) stars.push(<span key="half" aria-hidden className="text-amber-500">☆</span>);
    while(stars.length < total) stars.push(<span key={'e'+stars.length} aria-hidden className="text-slate-300 dark:text-slate-600">★</span>);
    return <div className="flex items-center gap-1 text-sm" aria-label={`Rating ${val} out of 5`}>
      {stars}<span className="ml-1 text-xs text-slate-500 dark:text-slate-400">{val.toFixed(1)}{reviewCount?` (${reviewCount.toLocaleString()} reviews)`:''}</span>
    </div>;
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-10 max-w-6xl mx-auto">
      <link rel="canonical" href={url} />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: absoluteUrl('/') },
        { name: 'Products', url: absoluteUrl('/products') },
        { name: title, url }
      ]} />
      <ArticleJsonLd
        url={url}
        title={title}
        description={truncate160(stripTags(product.excerpt?.rendered || ''))}
        author={author}
        datePublished={published}
        dateModified={modified}
        image={displayImage}
        type="Article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify((() => {
            const rating = ratingValue || 4;
            const rc = reviewCount || 5;
            return {
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: title,
              description: truncate160(stripTags(product.excerpt?.rendered || '')),
              image: [displayImage],
              sku: product.slug,
              brand: staticMeta.brand ? { '@type': 'Brand', name: staticMeta.brand } : undefined,
              url,
              offers: product.acf?.price ? {
                '@type': 'Offer',
                priceCurrency: 'USD',
                price: product.acf?.price.replace(/[^0-9.]/g,'') || '0.00',
                availability: 'https://schema.org/InStock',
                url
              } : undefined,
              aggregateRating: rating ? {
                '@type': 'AggregateRating',
                ratingValue: rating.toString(),
                reviewCount: rc
              } : undefined
            };
          })())
        }}
      />
      <nav className="text-xs mb-6 text-slate-500 dark:text-slate-400"><Link href="/" className="hover:underline">Home</Link> / <Link href="/products" className="hover:underline">Products</Link> / <span className="text-slate-700 dark:text-slate-300">{title}</span></nav>
        <header className="grid gap-8 md:grid-cols-2 items-start mb-10">
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-4 flex items-center justify-center aspect-[4/3] overflow-hidden">
            <Image
              src={displayImage}
              alt={title}
              width={640}
              height={480}
              className="object-contain w-full h-full"
              placeholder="blur"
              blurDataURL={shimmerDataURL(640,480)}
              priority={false}
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">{title}</h1>
            {staticMeta.brand && <p className="text-sm font-medium text-violet-600 dark:text-fuchsia-400 mb-2">Brand: {staticMeta.brand}</p>}
            {renderStars(ratingValue)}
            {price && <p className="mt-3 text-sm text-slate-700 dark:text-slate-300"><span className="font-semibold">Approx. Price:</span> {price}</p>}
            {features.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-300 list-disc ml-4 marker:text-violet-400 dark:marker:text-fuchsia-400">
                {features.map((f:string,i:number)=><li key={i}>{f}</li>)}
              </ul>
            )}
            {affiliate && (
              <div className="mt-6">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">We may earn a commission if you purchase through our links.</p>
                <a href={affiliate} target="_blank" rel="nofollow sponsored noopener" className="inline-block rounded-full px-6 py-3 text-xs font-semibold tracking-wide text-white bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 hover:from-fuchsia-500 hover:via-indigo-500 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:focus:ring-fuchsia-400 shadow-md hover:shadow-lg transition">Buy on Amazon</a>
              </div>
            )}
          </div>
        </header>

        <section className="prose prose-slate dark:prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: content }} />

        <section className="grid gap-8 md:grid-cols-2 mb-16">
          {pros.length > 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-800/60 backdrop-blur p-5">
              <h2 className="text-base font-semibold mb-3 tracking-wide text-slate-800 dark:text-slate-200">Pros</h2>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300 list-disc ml-4 marker:text-violet-400 dark:marker:text-fuchsia-400">
                {pros.map((p:string,i:number)=><li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          {cons.length > 0 && (
            <div className="rounded-xl border border-rose-200 dark:border-rose-500/40 bg-rose-50/60 dark:bg-rose-900/20 backdrop-blur p-5">
              <h2 className="text-base font-semibold mb-3 tracking-wide text-rose-700 dark:text-rose-300">Cons</h2>
              <ul className="space-y-1 text-sm text-rose-700/80 dark:text-rose-200 list-disc ml-4 marker:text-rose-400 dark:marker:text-rose-300">
                {cons.map((c:string,i:number)=><li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
        </section>
        {/* Feature comparison / CTA section */}
        <section className="mb-16">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-800/70 backdrop-blur p-6">
            <h2 className="text-lg font-semibold mb-4 tracking-tight">Key Feature Snapshot</h2>
            <div className="overflow-x-auto -mx-2 md:mx-0">
              <table className="min-w-[560px] w-full text-sm border border-slate-200 dark:border-slate-600">
                <thead className="bg-slate-50 dark:bg-slate-700/40">
                  <tr className="text-left">
                    <th className="p-2 font-medium">Attribute</th>
                    <th className="p-2 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                  {staticMeta.brand && (
                    <tr><td className="p-2 text-slate-600 dark:text-slate-300">Brand</td><td className="p-2">{staticMeta.brand}</td></tr>
                  )}
                  {price && (
                    <tr><td className="p-2 text-slate-600 dark:text-slate-300">Approx. Price</td><td className="p-2">{price}</td></tr>
                  )}
                  {ratingValue && (
                    <tr><td className="p-2 text-slate-600 dark:text-slate-300">Rating</td><td className="p-2">{ratingValue.toFixed(1)}{reviewCount?` / 5 (${reviewCount.toLocaleString()} reviews)`:''}</td></tr>
                  )}
                  {features.slice(0,5).map((f,i)=>(
                    <tr key={i}><td className="p-2 text-slate-600 dark:text-slate-300">Feature {i+1}</td><td className="p-2">{f}</td></tr>
                  ))}
                  {!features.length && (
                    <tr><td className="p-2 text-slate-600 dark:text-slate-300">Features</td><td className="p-2 italic text-slate-500">Not listed</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {affiliate && (
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <a href={affiliate} target="_blank" rel="nofollow sponsored noopener" className="inline-flex justify-center items-center rounded-full px-7 py-3 text-xs font-semibold tracking-wide text-white bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 hover:from-fuchsia-500 hover:via-indigo-500 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:focus:ring-fuchsia-400 shadow-md hover:shadow-lg transition">
                  View Price on Amazon
                </a>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm leading-snug">Affiliate disclosure: buying through our link may earn a small commission that helps maintain independent testing.</p>
              </div>
            )}
          </div>
        </section>
      <div className="mt-16 border-t pt-8">
        <h2 className="text-lg font-semibold mb-4">Related Products</h2>
        <ul className="grid sm:grid-cols-3 gap-4 list-none pl-0">
          {relatedProducts.map(r => (
            <li key={r.slug} className="text-sm border rounded-lg p-3 bg-white/60 dark:bg-slate-700/40 backdrop-blur">
              <a href={`/products/${r.slug}`} className="font-medium hover:underline block mb-1">{r.name}</a>
              <a href={`/products/${r.slug}`} className="text-[11px] text-violet-600 dark:text-fuchsia-400 hover:underline">View Details →</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function similarity(a:string,b:string){
  const as = a.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const bs = b.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const set = new Set(as);
  let match = 0; bs.forEach(w=>{ if(set.has(w)) match++; });
  return match;
}
