import React from 'react';

interface ArticleJsonLdProps {
  type?: 'Article' | 'BlogPosting';
  url: string;
  title: string;
  description: string;
  author: string;
  datePublished: string; // ISO
  dateModified?: string; // ISO
  image: string;
}

export function ArticleJsonLd({ type = 'Article', url, title, description, author, datePublished, dateModified, image }: ArticleJsonLdProps) {
  const json = {
    '@context': 'https://schema.org',
    '@type': type,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: title,
    name: title,
    description,
    author: { '@type': 'Person', name: author },
    publisher: {
      '@type': 'Organization',
      name: 'Portable Blenders Travel Guide',
      logo: {
        '@type': 'ImageObject',
        url: image
      }
    },
    image: [image],
    datePublished,
    dateModified: dateModified || datePublished
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
