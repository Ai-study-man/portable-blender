import '../styles/global.css';
import Layout from '../components/Layout';
import type { Metadata } from 'next';
import Script from 'next/script';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Portable Blenders Travel Guide',
    template: '%s | Portable Blenders Travel Guide'
  },
  description: 'Portable blender reviews, comparisons & buyer guides for travel, camping and active lifestyles.',
  keywords: [
    'portable blender','travel blender','USB blender','mini smoothie blender','camping blender','cordless blender','best portable blenders 2025'
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Portable Blenders Travel Guide',
    description: 'Portable blender reviews, comparisons & buyer guides for travel, camping and active lifestyles.',
    type: 'website',
    url: SITE_URL,
    siteName: 'Portable Blenders Travel Guide',
    images: [
      {
        url: SITE_URL + '/og-cover.jpg',
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
    images: [SITE_URL + '/og-cover.jpg']
  },
  verification: {
    google: 'hF8ARAA0x9mPjQ1__KJJkuyydj8owSSRKTBnLQRTBtE'
  },
  viewport: { width: 'device-width', initialScale: 1 },
  themeColor: '#6366f1'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-9HPMGMXNDZ';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  return (
    <html lang="en" className="min-h-full" suppressHydrationWarning>
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="hF8ARAA0x9mPjQ1__KJJkuyydj8owSSRKTBnLQRTBtE" />
        {/* Performance hints */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        {/* Google Analytics global site tag */}
        <Script id="ga-lib" src={https://www.googletagmanager.com/gtag/js?id=} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','');
        }} />
        {/* Google AdSense (afterInteractive to avoid blocking FCP) */}
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
        <script dangerouslySetInnerHTML={{ __html: (function(){try{const m=window.matchMedia('(prefers-color-scheme: dark)').matches;const s=localStorage.getItem('theme');if(s==='dark'||(!s&&m))document.documentElement.classList.add('dark');}catch(e){}})(); }} />
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
