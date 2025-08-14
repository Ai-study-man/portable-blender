import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const TopProductCard = dynamic(() => import('../components/TopProductCard'), { ssr: false });
import { products as productData } from '../../products';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Best Portable Blenders 2025 | Travel USB Mini Smoothie Guide',
  description: 'Top portable blender picks: tested travel smoothie performance, battery life, USB-C charging, outdoor & gym use.'
};

// Derive showcase from central products data; ensure required fields for card
const showcase = productData.map(p => ({
  ...p,
  features: (p as any).features || [
    'Portable single-serve design',
    'USB rechargeable',
    'Easy clean jar'
  ],
  priceRange: (p as any).priceRange || 'See listing'
}));

const HeroSection = dynamic(() => import('../components/HeroSection'), { ssr: false });

export default function HomePage() {
  const faq = [
    {
      q: 'What makes the best portable blender for travel in 2025?',
      a: 'Look for a USB rechargeable blender with 14–18+ blends per charge, a spill-proof lid, blades that tolerate partially frozen fruit, and an easy rinse-clean jar.'
    },
    { q: 'Can a mini travel blender crush ice?', a: 'Yes, small ice chips or softened cubes work if you add liquid first and pulse. For large solid cubes, pre-crack or let them thaw slightly.' },
    { q: 'Are USB rechargeable blender models airline friendly?', a: 'Most are fine in carry-on. Ensure it is powered off, clean, and keep the lithium battery with you (not checked baggage).' },
    { q: 'How many watts do I really need?', a: 'Real performance is more important than watt claims. Evaluate smoothness with greens, ability to emulsify nut butter, and number of blends per charge.' },
    { q: 'How do I remove protein shake odor?', a: 'Rinse immediately, blend warm water plus a drop of soap for 5–7 seconds, then air dry open. Use baking soda or lemon for stubborn smells.' }
  ];

  const productJson = showcase.map((p, idx) => ({
    '@type': 'Product',
    'name': p.name,
    'brand': p.brand ? { '@type': 'Brand', 'name': p.brand } : undefined,
    'description': p.description,
    'image': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/picture/${p.slug}.jpg`,
    'sku': p.slug,
    'position': idx + 1,
    'aggregateRating': p.rating ? { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviewCount || 1 } : undefined,
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'USD',
      'price': p.priceRange.replace(/[^0-9–-]/g, '').split(/[–-]/)[0] || '0',
      'availability': 'http://schema.org/InStock',
      'url': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/#top-products`
    }
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        'mainEntity': faq.map(f => ({
          '@type': 'Question',
            'name': f.q,
            'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
        }))
      },
      {
        '@type': 'ItemList',
        'name': 'Top 5 Portable Blenders',
        'itemListElement': productJson.map(p => ({ '@type': 'ListItem', position: p.position, url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/#top-products`, item: p }))
      }
    ]
  };

  return (
    <div className="">
      <Script id="ld-home" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero */}
  <HeroSection />

      {/* Quick access blog promo */}
      <div className="px-5 mt-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between bg-white/60 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 rounded-xl px-6 py-4 backdrop-blur-sm shadow-sm">
          <p className="text-sm md:text-base m-0 text-slate-700 dark:text-slate-300 font-medium">Latest travel blender tips & deep-dive reviews on our blog.</p>
          <Link href="/blog" className="text-[12px] font-semibold rounded-full px-5 py-2.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 text-white hover:from-fuchsia-500 hover:via-indigo-500 hover:to-violet-600 shadow transition">Visit Blog →</Link>
        </div>
      </div>

      {/* Top Products */}
      <section id="top-products" className="py-20 md:py-24 px-5 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_20%,rgba(14,165,233,0.06),transparent_60%)]" />
        <div className="max-w-7xl mx-auto relative">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-10 tracking-tight text-slate-800 flex items-center gap-3">
            <span className="inline-block w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 shadow-inner" />
            Top 5 Portable Blenders (2025 Picks)
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {showcase.map(p => <TopProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      {/* FAQ */}
  <section className="relative bg-gradient-to-br from-slate-50 via-white to-violet-50/40 py-20 px-5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(99,102,241,0.08),transparent_60%)]" />
        <div className="max-w-4xl mx-auto relative">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-10 tracking-tight text-slate-800">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {faq.map(item => (
              <details key={item.q} className="group border border-slate-200 rounded-md bg-white p-5 open:shadow-sm transition">
                <summary className="cursor-pointer font-medium text-slate-800 list-none flex items-center justify-between">
                  <span>{item.q}</span>
                  <span className="ml-4 text-slate-400 group-open:rotate-180 transition transform">⌄</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-5 overflow-hidden text-center">
  <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-500 to-fuchsia-600" />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.5),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">Ready to Blend Anywhere in 2025?</h2>
          <p className="text-white/90 max-w-2xl mx-auto leading-relaxed">Compare real-world performance, battery endurance, and ingredient smoothness—then grab the best portable blender for travel that fits your lifestyle.</p>
          <a href="#top-products" className="inline-block mt-8 rounded-full px-8 py-4 text-sm font-semibold tracking-wide text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-[0.97]">See Current Amazon Deals</a>
          <p className="text-[11px] mt-5 text-white/70">Affiliate disclosure: We may earn a commission at no extra cost to you.</p>
        </div>
        <svg className="absolute -top-10 left-0 w-full text-white/10" height="140" viewBox="0 0 1440 140" fill="none" preserveAspectRatio="none">
          <path fill="currentColor" d="M0 70l48 10.5C96 91 192 112 288 110.8c96 1.2 192-18 288-33.8 96-15.8 192-27.8 288-18 96 10 192 42 288 54.2 96 12.2 192 4.2 240-1.3l48-5.5V140H0V70z" />
        </svg>
      </section>
    </div>
  );
}
