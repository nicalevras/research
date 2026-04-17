import { createFileRoute, notFound, stripSearchParams } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { DirectoryListing, PAGE_SIZE } from '~/components/directory-listing'
import { SITE_URL } from '~/lib/constants'
import { itemListSchema, breadcrumbSchema } from '~/lib/schema'
import { searchDefaults, searchSchema } from '~/lib/search'
import { filterVendors, getCompounds } from '~/lib/data'

export const Route = createFileRoute('/$compound')({
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [stripSearchParams(searchDefaults)],
  },
  loaderDeps: ({ search }) => ({ page: search.page, q: search.q, country: search.country, features: search.features }),
  loader: async ({ params, deps }) => {
    const compounds = await getCompounds()
    const compoundRecord = compounds.find((c) => c.id === params.compound)
    if (!compoundRecord) {
      throw notFound()
    }

    const vendors = await filterVendors({ data: { q: deps.q, country: deps.country, features: deps.features, compound: params.compound } })
    return { compound: params.compound, compoundName: compoundRecord.name, compounds, ...deps, vendors }
  },
  head: ({ loaderData }) => {
    const { page, q, country, compound, compoundName } = loaderData ?? {}
    if (!compound) return { meta: [], links: [] }
    const name = compoundName ?? compound
    const isFiltered = !!q
    const pageSuffix = page && page > 1 ? ` — Page ${page}` : ''
    const pageTitle = `${name} Vendors — Peptide Suppliers${pageSuffix}`
    const pageDescription = `Find and compare vendors selling ${name}. Verified ratings and reviews for every supplier.`
    const canonicalParams = new URLSearchParams()
    if (country) canonicalParams.set('country', country)
    if (page && page > 1) canonicalParams.set('page', String(page))
    const canonicalUrl = canonicalParams.size > 0
      ? `${SITE_URL}/${compound}?${canonicalParams.toString()}`
      : `${SITE_URL}/${compound}`
    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: pageDescription },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: pageDescription },
        { property: 'og:url', content: canonicalUrl },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: pageDescription },
        ...(isFiltered ? [{ name: 'robots', content: 'noindex, follow' as const }] : []),
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: (() => {
        if (!loaderData?.vendors) return []
        const { vendors, page: p } = loaderData
        const start = ((p ?? 1) - 1) * PAGE_SIZE
        const paginatedVendors = vendors.slice(start, start + PAGE_SIZE)
        return [
          { type: 'application/ld+json' as const, children: JSON.stringify(itemListSchema(paginatedVendors, `${name} Vendors`, `/${compound}`)) },
          { type: 'application/ld+json' as const, children: JSON.stringify(breadcrumbSchema([{ name: 'Home', url: '/' }, { name: `${name} Vendors`, url: `/${compound}` }])) },
        ]
      })(),
    }
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    'Vary': 'Accept, Accept-Encoding',
  }),
  component: CompoundPage,
})

function CompoundPage() {
  const { compound } = Route.useParams()
  const { q, country, page, features } = Route.useSearch()
  const { vendors, compounds, compoundName } = Route.useLoaderData()

  return (
    <DirectoryListing
      heading={`${compoundName} Vendors`}
      description={`Compare vendors selling ${compoundName}. Verified ratings and reviews for every supplier.`}
      searchQuery={q ?? ''}
      countryFilter={country ?? ''}
      currentPage={page}
      vendors={vendors}
      compounds={compounds}
      activeFeatures={features ?? ''}
      activeCompound={compound}
    />
  )
}
