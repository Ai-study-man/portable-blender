import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'How affiliate links help fund independent testing.'
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-3xl mx-auto py-10">
      <h1>Affiliate Disclosure</h1>
      <p>Some links are affiliate links. Purchases may earn us a small commission at no extra cost to you. This funds extended testing and comparisons.</p>
      <h2>Selection Criteria</h2>
      <p>Products chosen for performance, not commission rate.</p>
      <h2>Questions</h2>
      <p>Contact: <a href="mailto:editor@example.com">editor@example.com</a></p>
    </div>
  );
}
