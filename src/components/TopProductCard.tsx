"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { shimmerDataURL } from '../lib/placeholder';

interface ShowcaseProduct {
  name: string;
  slug: string;
  description: string;
  features: string[];
  priceRange: string;
  affiliateUrl?: string;
}

export default function TopProductCard({ product }: { product: ShowcaseProduct }) {
  const baseAffiliate = process.env.NEXT_PUBLIC_AFFILIATE_BASE_URL || process.env.AMAZON_AFFILIATE_URL;
  // Treat placeholder '#' or empty strings as missing
  const explicit = product.affiliateUrl && product.affiliateUrl !== '#' ? product.affiliateUrl : undefined;
  const finalUrl = explicit || (baseAffiliate ? `${baseAffiliate.replace(/\/$/, '')}/${product.slug}` : '#');

  const [ratio, setRatio] = useState<number | null>(null); // width / height
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  function handleClick() {
    const ts = new Date().toISOString();
    // Basic client-side tracking; can later swap for analytics event
    // eslint-disable-next-line no-console
    if (finalUrl === '#') {
      console.warn('[AFFILIATE_MISSING]', { product: product.name, slug: product.slug });
    }
    console.log('[AFFILIATE_CLICK]', { product: product.name, slug: product.slug, at: ts, url: finalUrl });
  }

  // Compute a clamped aspect-ratio so wildly tall/wide images don't break layout
  const clampedRatio = ratio ? Math.min(Math.max(ratio, 0.75), 1.6) : null; // allow between 3:4 and ~16:10
  const containerStyle: React.CSSProperties = clampedRatio
    ? { aspectRatio: clampedRatio.toString() }
    : { aspectRatio: '4 / 3' }; // fallback before image loads

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (prefersReducedMotion) { setVisible(true); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } });
    }, { threshold: 0.25 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [prefersReducedMotion]);
  return (
    <article
      ref={ref as any}
  className={`h-full flex flex-col rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all overflow-hidden ring-1 ring-transparent hover:ring-violet-200/70 dark:hover:ring-fuchsia-400/40 hover:-translate-y-1 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${prefersReducedMotion ? 'transition-none' : 'duration-300'} `}
    >
      <div
        className="relative w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-700 dark:to-slate-600 flex items-center justify-center overflow-hidden group"
        style={containerStyle}
      >
  <div className={`absolute inset-0 ${loaded ? 'opacity-0 pointer-events-none transition-opacity duration-300' : 'opacity-100'} skeleton`} aria-hidden={!loaded} />
  {!imgError ? (
          <Image
            src={`/picture/${product.slug}.jpg`}
            alt={product.name}
            fill={false}
            width={400}
            height={300}
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, (max-width:1280px) 20vw, 240px"
            placeholder="blur"
            blurDataURL={shimmerDataURL(400,300)}
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" 
            onLoad={(e) => {
              const imgEl = (e.target as HTMLImageElement);
              if (imgEl.naturalWidth && imgEl.naturalHeight) {
                setRatio(imgEl.naturalWidth / imgEl.naturalHeight);
              }
              setLoaded(true);
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          // 退回到原生 img 进一步验证问题
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/picture/${product.slug}.jpg`}
            alt={product.name}
            className="max-w-full max-h-full object-contain p-2"
            onLoad={(e) => {
              const el = e.currentTarget;
              if (el.naturalWidth && el.naturalHeight) setRatio(el.naturalWidth / el.naturalHeight);
              setLoaded(true);
            }}
            onError={(e) => {
              const t = e.currentTarget;
              if (!t.dataset.fallback){
                t.dataset.fallback='1';
                t.src='/picture/placeholder-blender.svg';
              }
            }}
          />
        )}
      </div>
      <div className="flex flex-col p-5 flex-1">
        <h3 className="text-base md:text-[1.05rem] font-bold tracking-tight mb-2 line-clamp-2 text-slate-800 dark:text-slate-100">
          <a href={`/products/${product.slug}`} className="hover:underline">{product.name}</a>
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed line-clamp-4">{product.description}</p>
  <ul className="list-disc ml-4 mb-3 space-y-1 text-[11px] leading-snug text-slate-600 dark:text-slate-400 marker:text-violet-400 dark:marker:text-fuchsia-400">
          {product.features.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
        <p className="text-[11px] font-semibold text-slate-700/90 dark:text-slate-300 mt-auto mb-4">Price Range: {product.priceRange}</p>
        <a
          href={finalUrl}
          onClick={handleClick}
            className="relative inline-block text-center rounded-full px-5 py-2.5 text-[12px] font-semibold text-white tracking-wide bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 hover:from-fuchsia-500 hover:via-indigo-500 hover:to-violet-600 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-300 active:scale-[0.97] dark:focus:ring-fuchsia-400"
          rel="nofollow sponsored noopener"
          target="_blank"
        >
          Buy on Amazon
        </a>
      </div>
    </article>
  );
}
