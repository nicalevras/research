import { createFileRoute } from '@tanstack/react-router'
import { FEATURE_FILTERS, PEPTIDE_CATEGORIES, SITE_URL } from '~/lib/constants'
import { filterVendors, getCompounds, getVendorCompoundOptions } from '~/lib/data'

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const [vendors, compounds, vendorOptions] = await Promise.all([
          filterVendors({ data: {} }),
          getCompounds(),
          getVendorCompoundOptions(),
        ])

        const urls: { loc: string; priority: string; changefreq: string }[] = [
          { loc: '/', priority: '1.0', changefreq: 'daily' },
          { loc: '/vendors', priority: '0.9', changefreq: 'daily' },
          { loc: '/peptides', priority: '0.9', changefreq: 'weekly' },
          { loc: '/calculator', priority: '0.8', changefreq: 'monthly' },
        ]

        for (const vendor of vendors) {
          urls.push({ loc: `/vendors/${vendor.id}`, priority: '0.8', changefreq: 'weekly' })
        }

        for (const compound of compounds) {
          urls.push({ loc: `/peptides/${compound.id}`, priority: '0.7', changefreq: 'weekly' })
          urls.push({ loc: `/vendors?compound=${compound.id}`, priority: '0.7', changefreq: 'weekly' })
        }

        for (const feature of FEATURE_FILTERS) {
          urls.push({ loc: `/vendors?features=${feature.id}`, priority: '0.6', changefreq: 'weekly' })
        }

        for (const category of PEPTIDE_CATEGORIES) {
          urls.push({ loc: `/peptides?categories=${category.id}`, priority: '0.6', changefreq: 'weekly' })
        }

        for (const vendor of vendorOptions) {
          urls.push({ loc: `/peptides?vendor=${vendor.id}`, priority: '0.5', changefreq: 'weekly' })
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${xmlEscape(`${SITE_URL}${u.loc}`)}</loc>
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
