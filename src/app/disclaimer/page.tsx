import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Editorial disclaimer and limitations.'
};

export default function DisclaimerPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-3xl mx-auto py-10">
      <h1>Disclaimer</h1>
      <p>Information for educational purposes only. Performance may vary.</p>
      <p>Always follow manufacturer instructions. You assume responsibility for usage.</p>
      <h2>Affiliate & Ads</h2>
      <p>Revenue does not influence test results or verdicts.</p>
    </div>
  );
}
