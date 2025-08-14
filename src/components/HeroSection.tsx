"use client";

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-28">
  <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50" />
  <div className="absolute -top-32 -left-32 w-[38rem] h-[38rem] rounded-full bg-gradient-to-br from-violet-200/40 via-fuchsia-200/30 to-transparent blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.18),transparent_70%)]" />
      <div className="relative max-w-5xl mx-auto px-5 text-center">
  <h1 className="hero-fade-slide text-3xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-600">
          Best Portable Blenders for Travel in 2025
        </h1>
        <p className="hero-fade-slide-delay-1 text-lg md:text-xl text-slate-700 leading-relaxed max-w-3xl mx-auto">
          Tired of chunky shakes, leaky cups, and weak motors while on the road? This 2025 buyer’s guide helps you pick a reliable mini travel blender that actually blends frozen fruit, protein, and greens—anywhere you go.
        </p>
        <p className="hero-fade-slide-delay-2 max-w-2xl mx-auto mt-5 text-sm md:text-base text-slate-600">
          We hand-tested capacity, blade efficiency, battery endurance, charge speed, and cleaning simplicity to uncover the real best portable blender for travel this year.
        </p>
        <div className="hero-fade-slide-delay-3">
          <Link href="#top-products" className="inline-block mt-8 rounded-full px-8 py-4 text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 hover:from-fuchsia-500 hover:via-indigo-500 hover:to-violet-600 shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-violet-300 active:scale-[0.97]">
            See Top Picks
          </Link>
        </div>
      </div>
  <svg className="absolute bottom-0 left-0 w-full text-violet-50" height="120" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
        <path fill="currentColor" d="M0 48l48 10.7C96 69 192 91 288 90.7 384 91 480 69 576 53.3 672 37 768 27 864 37.3 960 48 1056 80 1152 85.3 1248 91 1344 69 1392 58.7l48-10.7V120H0V48z" />
      </svg>
    </section>
  );
}
