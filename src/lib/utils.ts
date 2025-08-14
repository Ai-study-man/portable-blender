export function stripTags(html: string) {
  return html.replace(/<[^>]*>/g, '');
}

export function formatExcerpt(html: string, words = 30) {
  const text = stripTags(html);
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length <= words) return text;
  return parts.slice(0, words).join(' ') + '…';
}

export function truncate160(text: string) {
  if (!text) return '';
  const clean = text.replace(/\s+/g,' ').trim();
  if (clean.length <= 160) return clean;
  return clean.slice(0,160).replace(/\s+\S*$/, '') + '…';
}
