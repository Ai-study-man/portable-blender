import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Details on analytics, advertising cookies and data usage.'
};

export default function PrivacyPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-3xl mx-auto py-10">
      <h1>Privacy Policy</h1>
      <p>Last updated: Aug 15, 2025</p>
      <h2>Information We Collect</h2>
      <ul>
        <li><strong>Analytics:</strong> Anonymous aggregate usage via Google Analytics.</li>
        <li><strong>Advertising:</strong> Google AdSense cookies for contextual ads.</li>
        <li><strong>Emails:</strong> Messages you send for feedback.</li>
      </ul>
      <h2>Use</h2>
      <p>Improve content relevance and support monetization.</p>
      <h2>Your Choices</h2>
      <p>Block cookies in browser settings or opt-out at Google Ad Settings.</p>
      <h2>Contact</h2>
      <p>Email: <a href="mailto:editor@example.com">editor@example.com</a></p>
    </div>
  );
}
