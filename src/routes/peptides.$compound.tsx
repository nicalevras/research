import { createFileRoute, notFound } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { DirectoryListing } from '~/components/directory-listing'
import { SITE_URL } from '~/lib/constants'
import { itemListSchema, breadcrumbSchema } from '~/lib/schema'
import { vendorDirectorySearchSchema } from '~/lib/search'
import { filterVendors, getCompounds } from '~/lib/data'

export const Route = createFileRoute('/peptides/$compound')({
  validateSearch: zodValidator(vendorDirectorySearchSchema),
  loaderDeps: ({ search }) => ({ q: search.q, country: search.country, features: search.features }),
  loader: async ({ params, deps }) => {
    const compounds = await getCompounds()
    const compoundRecord = compounds.find((c) => c.id === params.compound)
    if (!compoundRecord) {
      throw notFound()
    }

    const vendors = await filterVendors({
      data: {
        q: deps.q,
        country: deps.country,
        features: deps.features,
        compound: params.compound,
      },
    })

    return {
      compound: params.compound,
      compoundName: compoundRecord.name,
      compoundDescription: compoundRecord.description,
      compounds,
      ...deps,
      vendors,
    }
  },
  head: ({ loaderData }) => {
    const { q, country, features, compound, compoundName, compoundDescription, vendors } = loaderData ?? {}
    if (!compound) return { meta: [], links: [] }

    const name = compoundName ?? compound
    const isFiltered = !!q || !!country || !!features
    const pageTitle = `${name} Vendors - Peptide Vendor Directory`
    const pageDescription = compoundDescription || `${name} vendor listings and reviews on Peptide Vendor Directory.`
    const canonicalPath = `/peptides/${compound}`
    const canonicalUrl = `${SITE_URL}${canonicalPath}`

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
      scripts: [
        ...(vendors
          ? [{ type: 'application/ld+json' as const, children: JSON.stringify(itemListSchema(vendors, `${name} Vendors`, canonicalPath)) }]
          : []),
        {
          type: 'application/ld+json' as const,
          children: JSON.stringify(breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Peptides', url: '/peptides' },
            { name: `${name} Vendors`, url: canonicalPath },
          ])),
        },
      ],
    }
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    'Vary': 'Accept, Accept-Encoding',
  }),
  component: PeptideVendorsPage,
})

function PeptideVendorsPage() {
  const { compound } = Route.useParams()
  const { q, country, features } = Route.useSearch()
  const { vendors, compounds, compoundName, compoundDescription } = Route.useLoaderData()

  return (
    <DirectoryListing
      heading={`${compoundName} Vendors`}
      description={compoundDescription}
      searchQuery={q ?? ''}
      countryFilter={country ?? ''}
      vendors={vendors}
      compounds={compounds}
      activeFeatures={features ?? ''}
      activeCompound={compound}
    />
  )
}
