import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach the editorial team.'
};

export default function ContactPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-3xl mx-auto py-10">
      <h1>Contact</h1>
      <p>Email us for suggestions or corrections.</p>
      <h2>Email</h2>
      <p><a href="mailto:editor@example.com">editor@example.com</a></p>
      <h2>Response Time</h2>
      <p>We usually reply within 2-3 business days.</p>
    </div>
  );
}
