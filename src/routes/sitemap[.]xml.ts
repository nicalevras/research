import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL, COMPOUNDS } from '~/lib/constants'
import { filterVendors } from '~/lib/data'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const vendors = await filterVendors({ data: {} })

        const urls: { loc: string; priority: string; changefreq: string }[] = [
          { loc: '/', priority: '1.0', changefreq: 'daily' },
          { loc: '/calculator', priority: '0.8', changefreq: 'monthly' },
        ]

        for (const vendor of vendors) {
          urls.push({ loc: `/vendors/${vendor.id}`, priority: '0.8', changefreq: 'weekly' })
        }

        for (const compound of COMPOUNDS) {
          urls.push({ loc: `/${compound.id}`, priority: '0.7', changefreq: 'weekly' })
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

        return new Response(xml, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})
