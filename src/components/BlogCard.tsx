"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export interface BlogCardProps {
  slug: string;
  title: string;
  date: string;
  description: string;
  index?: number;
}

export function BlogCard({ slug, title, date, description }: BlogCardProps) {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
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
  className={`relative group border border-slate-200/70 dark:border-slate-700/60 rounded-2xl p-6 bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all overflow-hidden ring-1 ring-transparent hover:ring-violet-200/70 dark:hover:ring-fuchsia-400/40 hover:-translate-y-1 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${prefersReducedMotion ? 'transition-none' : 'duration-300'}`}
      onAnimationEnd={() => setLoaded(true)}
    >
      {!loaded && <div className="absolute inset-0 skeleton" aria-hidden />}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.09),transparent_60%)]" />
      <h2 className="m-0 text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
        <Link href={`/blog/${slug}`}>{title}</Link>
      </h2>
  <p className="text-[11px] uppercase tracking-wide font-medium text-violet-500/80 dark:text-fuchsia-400/80 mt-2">Published {date}</p>
      <p className="text-sm mt-3 line-clamp-3 text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
      <Link
  className="inline-block mt-5 text-[12px] font-semibold tracking-wide rounded-full px-5 py-2.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 text-white hover:from-fuchsia-500 hover:via-indigo-500 hover:to-violet-600 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-300 dark:focus:ring-fuchsia-400"
        href={`/blog/${slug}`}
      >
        Read more →
      </Link>
  </article>
  );
}

export default BlogCard;
