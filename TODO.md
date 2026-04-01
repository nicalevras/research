# Future TODO

## Performance

### Add Cloudflare CDN in front of Railway
Railway's built-in CDN caches static assets (JS, CSS, images) but treats HTML as dynamic — every SSR page request hits your server. All `Cache-Control` headers are already in place in the codebase and ready to be consumed by a CDN.

**When to do this:** When traffic grows enough that you want edge caching on HTML responses (the "1000 visitors, 12 DB hits" benefit).

**How:**
1. Add your domain to Cloudflare (free tier)
2. Point your domain's nameservers to Cloudflare's (DNS change at your registrar)
3. Add a Cache Rule in Cloudflare dashboard to cache HTML responses (free tier doesn't cache HTML by default)
4. Railway stays as your origin server — no migration, no code changes
5. Cloudflare reads your existing `Cache-Control: public, max-age=300, stale-while-revalidate=3600` headers automatically

**What's already done:**
- `index.tsx`, `$compound.tsx`, `vendors.$id.tsx` — `public, max-age=300, stale-while-revalidate=3600`
- `account.tsx`, `reset-password.tsx` — `private, no-cache, no-store`
- `sitemap[.]xml.ts` — `public, max-age=3600, stale-while-revalidate=86400`
- `Vary: Accept, Accept-Encoding` on listing pages

### Add og-image.png
`__root.tsx` references `${SITE_URL}/og-image.png` but the file doesn't exist in `/public`. Create a 1200x630 Open Graph image for social sharing.

## SEO

### robots.txt absolute sitemap URL
`public/robots.txt` uses `Sitemap: /sitemap.xml` (relative). The Sitemaps protocol spec recommends an absolute URL. Update to `Sitemap: ${SITE_URL}/sitemap.xml` when SITE_URL is finalized — or generate robots.txt dynamically like the sitemap route.

## Testing

### Add critical path test coverage
No test files exist. Priority areas:
- Auth flows (sign-in, sign-up, sign-out, password reset)
- Review CRUD (create, update, delete, rating recalculation)
- Input validation (username sanitization, comment length, rating bounds)
- `filterVendors` query with compound/tag/search combinations

## Monitoring

### Add error reporting
No error monitoring in place. Consider Sentry or similar for structured error reporting in production. The Railway logs work but won't alert you proactively.
