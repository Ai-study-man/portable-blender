import '../styles/global.css';
import Layout from '../components/Layout';
import type { Metadata } from 'next';

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
  return (
  <html lang="en" className="min-h-full" suppressHydrationWarning>
      <body>
        <Layout>{children}</Layout>
    <script dangerouslySetInnerHTML={{__html:`(function(){try{const m=window.matchMedia('(prefers-color-scheme: dark)').matches;const s=localStorage.getItem('theme');if(s==='dark'||(!s&&m))document.documentElement.classList.add('dark');}catch(e){}})();`}} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Portable Blenders Travel Guide',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
              logo: (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com') + '/og-cover.jpg'
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Portable Blenders Travel Guide',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com') + '/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
      </body>
    </html>
  );
}
