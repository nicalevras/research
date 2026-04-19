import { createFileRoute, redirect } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { DirectoryListing } from '~/components/directory-listing'
import { SITE_URL } from '~/lib/constants'
import { breadcrumbSchema, itemListSchema } from '~/lib/schema'
import { vendorDirectorySearchSchema } from '~/lib/search'
import { filterVendors, getCompounds } from '~/lib/data'

export const Route = createFileRoute('/vendors/')({
  validateSearch: zodValidator(vendorDirectorySearchSchema),
  beforeLoad: ({ location }) => {
    const searchParams = new URLSearchParams(location.searchStr)
    if (searchParams.has('page')) {
      searchParams.delete('page')
      const query = searchParams.toString()
      throw redirect({
        href: `/vendors${query ? `?${query}` : ''}${location.hash ? `#${location.hash}` : ''}`,
        statusCode: 301,
      })
    }
  },
  loaderDeps: ({ search }) => ({ q: search.q, country: search.country, features: search.features }),
  loader: async ({ deps }) => {
    const [vendors, compounds] = await Promise.all([
      filterVendors({ data: { q: deps.q, country: deps.country, features: deps.features } }),
      getCompounds(),
    ])
    return { ...deps, vendors, compounds }
  },
  head: ({ loaderData }) => {
    const { q, country, features } = loaderData ?? {}
    const isFiltered = !!q || !!country || !!features
    const pageTitle = 'Vendors - Peptide Vendor Directory'
    const pageDescription = 'Browse every peptide vendor in the directory. Compare ratings, certifications, promo codes, and vendor details in one place.'
    const canonicalUrl = `${SITE_URL}/vendors`

    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: pageDescription },
        ...(isFiltered ? [{ name: 'robots', content: 'noindex, follow' as const }] : []),
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: pageDescription },
        { property: 'og:url', content: canonicalUrl },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: pageDescription },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        ...(loaderData?.vendors
          ? [{ type: 'application/ld+json' as const, children: JSON.stringify(itemListSchema(loaderData.vendors, 'Peptide Vendors', '/vendors')) }]
          : []),
        {
          type: 'application/ld+json' as const,
          children: JSON.stringify(breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Vendors', url: '/vendors' },
          ])),
        },
      ],
    }
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    'Vary': 'Accept, Accept-Encoding',
  }),
  component: VendorsPage,
})

function VendorsPage() {
  const { q, country, features } = Route.useSearch()
  const { vendors, compounds } = Route.useLoaderData()

  return (
    <DirectoryListing
      heading="Vendors"
      description="Browse every peptide vendor in the directory. Compare ratings, certifications, promo codes, and vendor details in one place."
      searchQuery={q ?? ''}
      countryFilter={country ?? ''}
      vendors={vendors}
      compounds={compounds}
      activeFeatures={features ?? ''}
      activeCompound=""
    />
  )
}
