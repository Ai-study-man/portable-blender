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
  // Attempt to locate a static image in /public/picture/<slug>.jpg
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

  return (
    <div className="section">
      <div className="container product-detail">
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
              const staticMeta = staticProducts.find(p => p.slug === product.slug) as any || {};
              const ratingValue = product.acf?.rating || staticMeta.rating || 4;
              const reviewCount = (product.acf as any)?.reviewCount || staticMeta.reviewCount || 5;
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
                aggregateRating: ratingValue ? {
                  '@type': 'AggregateRating',
                  ratingValue: ratingValue.toString(),
                  reviewCount: reviewCount
                } : undefined
              };
            })())
          }}
        />
        <nav className="breadcrumbs"><Link href="/">Home</Link> / <span>{title}</span></nav>
        <h1>{title}</h1>
        {hasStaticImage && (
          <div className="my-6 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center border border-slate-200 dark:border-slate-600">
            <div className="relative w-full max-w-xl aspect-[4/3]">
              <Image
                src={staticImageRel}
                alt={title}
                fill
                sizes="(max-width:768px) 100vw, 640px"
                className="object-contain p-3"
                placeholder="blur"
                blurDataURL={shimmerDataURL(640,480)}
                priority={false}
              />
            </div>
          </div>
        )}
        {price && <p className="price">Approx. Price: {price}</p>}
        {affiliate && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">We may earn a commission if you purchase through our links.</p>
            <a href={affiliate} target="_blank" rel="nofollow sponsored noopener" className="btn primary">Buy on Amazon</a>
          </div>
        )}
        <div className="columns">
          <div className="main" dangerouslySetInnerHTML={{ __html: content }} />
          <aside className="sidebar">
            {pros.length > 0 && (
              <div className="box">
                <h3>Pros</h3>
                <ul>{pros.map((p,i)=><li key={i}>{p}</li>)}</ul>
              </div>
            )}
            {cons.length > 0 && (
              <div className="box warn">
                <h3>Cons</h3>
                <ul>{cons.map((c,i)=><li key={i}>{c}</li>)}</ul>
              </div>
            )}
          </aside>
        </div>
      </div>
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
