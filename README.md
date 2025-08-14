# Portable Blenders Travel Guide (Next.js + Headless WordPress)

A starter affiliate review site for "Portable Blenders for Travel" using Next.js 14 App Router and a headless WordPress backend.

## Features
- Home page with hero, top 5 products (fetched from WP), FAQ, CTA
- Product detail dynamic route with static generation
- About static page
- Simple Astra-like clean styling (utility-light)
- SEO via Next.js Metadata API + next-seo default template
- Revalidation every 5 minutes for product lists

## Assumptions
- WordPress at https://mywp.com with a custom post type `product`
- ACF fields: pros (repeater/array), cons (array), rating (1-5), affiliate_url, price, short_specs
- Featured image available via `_embed` query param

## Environment Variables (optional later)
You could move the hardcoded URL to an env var:
```
WP_API_BASE=https://mywp.com/wp-json/wp/v2
```
Then access via `process.env.WP_API_BASE`.

## Development
Install deps and run dev server:
```
npm install
npm run dev
```

Open http://localhost:3000.

## Deployment (Vercel)
- Push repository to GitHub
- Import into Vercel
- Set (optional) env vars
- Build command: `npm run build`
- Output: `.next`

## Next Steps (Ideas)
- Add sitemap & robots.txt
- Add structured data (Product, FAQ)
- Implement /api/revalidate for on-demand ISR
- Add search & category filters
- Add responsiveness audits & Core Web Vitals tracking
- Integrate analytics + affiliate click tracking

## License
MIT
