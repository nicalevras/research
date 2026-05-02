import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL } from '~/lib/constants'
import { filterVendors, getPeptideProfileSitemapEntries } from '~/lib/data'
import { APPROVED_PEPTIDE_INDEX_CATEGORIES } from '~/lib/peptide-directory-seo'
import { APPROVED_VENDOR_INDEX_FEATURES } from '~/lib/vendor-directory-seo'

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatLastmod(value?: string) {
  if (!value) return undefined

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  return date.toISOString()
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const [vendors, peptideProfiles] = await Promise.all([
          filterVendors({ data: {} }),
          getPeptideProfileSitemapEntries(),
        ])

        const urls: { loc: string; priority: string; changefreq: string; lastmod?: string }[] = [
          { loc: '/', priority: '1.0', changefreq: 'daily' },
          { loc: '/vendors', priority: '0.9', changefreq: 'daily' },
          { loc: '/peptides', priority: '0.9', changefreq: 'weekly' },
          { loc: '/calculator', priority: '0.8', changefreq: 'monthly' },
        ]

        for (const vendor of vendors) {
          urls.push({
            loc: `/vendors/${vendor.id}`,
            priority: '0.8',
            changefreq: 'weekly',
            lastmod: formatLastmod(vendor.updatedAt),
          })
        }

        for (const peptideProfile of peptideProfiles) {
          urls.push({
            loc: `/peptides/${peptideProfile.id}`,
            priority: '0.7',
            changefreq: 'weekly',
            lastmod: formatLastmod(peptideProfile.updatedAt),
          })
          urls.push({ loc: `/vendors?peptide=${peptideProfile.id}`, priority: '0.7', changefreq: 'weekly' })
        }

        for (const feature of APPROVED_VENDOR_INDEX_FEATURES) {
          urls.push({ loc: `/vendors?features=${feature.id}`, priority: '0.6', changefreq: 'weekly' })
        }

        for (const category of APPROVED_PEPTIDE_INDEX_CATEGORIES) {
          urls.push({ loc: `/peptides?categories=${category.id}`, priority: '0.6', changefreq: 'weekly' })
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${xmlEscape(`${SITE_URL}${u.loc}`)}</loc>
${u.lastmod ? `    <lastmod>${xmlEscape(u.lastmod)}</lastmod>\n` : ''}    <changefreq>${u.changefreq}</changefreq>
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
