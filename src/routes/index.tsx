import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { DirectoryListing, PAGE_SIZE } from '~/components/directory-listing'
import { siteSearchSchema, itemListSchema, breadcrumbSchema } from '~/lib/schema'
import { SITE_URL } from '~/lib/constants'
import { searchDefaults, searchSchema } from '~/lib/search'
import { filterVendors } from '~/lib/data'

export const Route = createFileRoute('/')({
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [stripSearchParams(searchDefaults)],
  },
  loaderDeps: ({ search }) => ({ page: search.page, q: search.q, country: search.country, tags: search.tags }),
  loader: async ({ deps }) => {
    const vendors = await filterVendors({ data: { q: deps.q, country: deps.country, tags: deps.tags } })
    return { ...deps, vendors }
  },
  head: ({ loaderData }) => {
    const { page, q, country } = loaderData ?? {}
    const isFiltered = !!q
    const pageSuffix = page && page > 1 ? ` — Page ${page}` : ''
    const pageTitle = `Peptide Vendor Directory — Find & Compare Peptide Suppliers${pageSuffix}`
    const canonicalParams = new URLSearchParams()
    if (country) canonicalParams.set('country', country)
    if (page && page > 1) canonicalParams.set('page', String(page))
    const canonicalUrl = canonicalParams.size > 0
      ? `${SITE_URL}?${canonicalParams.toString()}`
      : SITE_URL || '/'
    return {
      meta: [
        { title: pageTitle },
        {
          name: 'description',
          content:
            'Compare the best peptide vendors across research, therapeutic, cosmetic, and API supply. Verified ratings, certifications, and detailed reviews for every supplier.',
        },
        ...(isFiltered ? [{ name: 'robots', content: 'noindex, follow' as const }] : []),
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: 'Compare the best peptide vendors across research, therapeutic, cosmetic, and API supply.' },
        { property: 'og:url', content: canonicalUrl },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: 'Compare the best peptide vendors across research, therapeutic, cosmetic, and API supply.' },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        { type: 'application/ld+json', children: JSON.stringify(siteSearchSchema()) },
        ...(() => {
          if (!loaderData?.vendors) return []
          const { vendors, page: p } = loaderData
          const start = ((p ?? 1) - 1) * PAGE_SIZE
          const paginatedVendors = vendors.slice(start, start + PAGE_SIZE)
          return [
            { type: 'application/ld+json' as const, children: JSON.stringify(itemListSchema(paginatedVendors, 'Peptide Vendor Directory', '/')) },
            { type: 'application/ld+json' as const, children: JSON.stringify(breadcrumbSchema([{ name: 'Home', url: '/' }])) },
          ]
        })(),
      ],
    }
  },
  component: HomePage,
})

function HomePage() {
  const { q, country, page, tags } = Route.useSearch()
  const { vendors } = Route.useLoaderData()
  return (
    <DirectoryListing
      heading="Peptide Vendor Directory"
      description="Compare peptide vendors. Verified ratings, certifications, and detailed reviews for every supplier."
      searchQuery={q ?? ''}
      countryFilter={country ?? ''}
      currentPage={page}
      vendors={vendors}
      activeTags={tags ?? ''}
      activeCompound=""
    />
  )
}
