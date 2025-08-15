import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'User responsibilities and limitations.'
};

export default function TermsPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-3xl mx-auto py-10">
      <h1>Terms of Use</h1>
      <p>Last updated: Aug 15, 2025</p>
      <h2>Acceptance</h2>
      <p>Using this site means accepting these Terms.</p>
      <h2>Content</h2>
      <p>Editorial opinion only; verify specs before purchasing.</p>
      <h2>No Warranty</h2>
      <p>Content provided as-is without warranties.</p>
      <h2>Contact</h2>
      <p>Email: <a href="mailto:editor@example.com">editor@example.com</a></p>
    </div>
  );
}
