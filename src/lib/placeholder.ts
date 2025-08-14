export function shimmer(width: number, height: number, radius = 0) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" version="1.1">\n  <defs>\n    <linearGradient id="g">\n      <stop stop-color="#f3f4f6" offset="20%" />\n      <stop stop-color="#e5e7eb" offset="50%" />\n      <stop stop-color="#f3f4f6" offset="70%" />\n    </linearGradient>\n  </defs>\n  <rect rx="${radius}" ry="${radius}" width="${width}" height="${height}" fill="#f3f4f6" />\n  <rect rx="${radius}" ry="${radius}" width="${width}" height="${height}" fill="url(#g)">\n    <animate attributeName="x" from="-${width}" to="${width}" dur="1.2s" repeatCount="indefinite"  />\n  </rect>\n</svg>`;
}

export function toBase64(str: string) {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64');
  }
  return window.btoa(str);
}

export function shimmerDataURL(w = 400, h = 300) {
  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h, 8))}`;
}
