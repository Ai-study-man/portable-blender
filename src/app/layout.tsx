import '../styles/global.css';
import Layout from '../components/Layout';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    default: 'Portable Blenders Travel Guide',
    template: '%s | Portable Blenders Travel Guide'
  },
  description: 'Portable blender reviews, comparisons & buyer guides for travel, camping and active lifestyles.'
  ,openGraph: {
    title: 'Portable Blenders Travel Guide',
    description: 'Portable blender reviews, comparisons & buyer guides for travel, camping and active lifestyles.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
    images: [
      {
        url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com') + '/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Portable Blenders Travel Guide'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portable Blenders Travel Guide',
    description: 'Independent portable blender reviews & travel smoothie tips.',
    images: [(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com') + '/og-cover.jpg']
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-9HPMGMXNDZ';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  return (
    <html lang="en" className="min-h-full" suppressHydrationWarning>
      <head>
        {/* Google Analytics global site tag */}
        <Script id="ga-lib" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`
        }} />
        {/* Google AdSense */}
        <Script
          id="adsense-lib"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4372695356377122"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Layout>{children}</Layout>
        {/* Theme hydration script */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{const m=window.matchMedia('(prefers-color-scheme: dark)').matches;const s=localStorage.getItem('theme');if(s==='dark'||(!s&&m))document.documentElement.classList.add('dark');}catch(e){}})();` }} />
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Portable Blenders Travel Guide',
              url: siteUrl,
              logo: siteUrl + '/og-cover.jpg'
            })
          }}
        />
        {/* WebSite / SearchAction JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Portable Blenders Travel Guide',
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: siteUrl + '/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
      </body>
    </html>
  );
}
