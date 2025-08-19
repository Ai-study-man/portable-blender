export function absoluteUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  if (path.startsWith('http')) return path;
  return base.replace(/\/$/, '') + (path.startsWith('/') ? path : '/' + path);
}

export const DEFAULT_IMAGE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com') + '/picture/placeholder-blender.jpg';
