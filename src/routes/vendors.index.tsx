import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { DirectoryListing } from '~/components/directory-listing'
import { FEATURE_FILTERS, SITE_URL } from '~/lib/constants'
import { breadcrumbSchema, itemListSchema } from '~/lib/schema'
import { vendorDirectorySearchSchema } from '~/lib/search'
import { filterVendors, getCompounds } from '~/lib/data'
import type { Compound } from '~/lib/types'

const FEATURE_FILTER_BY_ID = new Map(FEATURE_FILTERS.map((feature) => [feature.id, feature]))

function vendorLandingCopy(filters: {
  q?: string
  features?: string
  compound?: string
  compounds: Compound[]
}) {
  const compound = filters.compound ? filters.compounds.find((item) => item.id === filters.compound) : undefined
  const featureIds = filters.features?.split(',').filter(Boolean) ?? []
  const featureLabels = featureIds.flatMap((featureId) => {
    const feature = FEATURE_FILTER_BY_ID.get(featureId)
    return feature ? [feature.name] : []
  })
  const search = filters.q?.trim()
  const searchParams = new URLSearchParams()
  if (search) searchParams.set('q', search)
  if (filters.features) searchParams.set('features', filters.features)
  if (compound) searchParams.set('compound', compound.id)
  const canonicalPath = searchParams.size > 0 ? `/vendors?${searchParams.toString()}` : '/vendors'

  if (compound) {
    return {
      heading: `${compound.name} Vendors`,
      description: `Compare peptide vendors carrying ${compound.name}. Review ratings, vendor profiles, payment methods, and category matches in one place.`,
      pageTitle: `${compound.name} Vendors - Peptide Vendor Directory`,
      listName: `${compound.name} Vendors`,
      canonicalPath,
      noindex: Boolean(search),
    }
  }

  if (featureLabels.length > 0) {
    const label = featureLabels.join(' + ')
    return {
      heading: `${label} Vendors`,
      description: `Compare peptide vendors with ${label.toLowerCase()}. Review ratings, vendor profiles, payment methods, and peptide availability.`,
      pageTitle: `${label} Vendors - Peptide Vendor Directory`,
      listName: `${label} Vendors`,
      canonicalPath,
      noindex: Boolean(search),
    }
  }

  return {
    heading: search ? 'Vendor Search Results' : 'Peptide Vendors',
    description: search
      ? `Search results for peptide vendors matching "${search}".`
      : 'Browse every peptide vendor in the directory. Compare ratings, certifications, promo codes, and vendor details in one place.',
    pageTitle: search ? 'Vendor Search Results - Peptide Vendor Directory' : 'Vendors - Peptide Vendor Directory',
    listName: 'Peptide Vendors',
    canonicalPath,
    noindex: Boolean(search),
  }
}

export const Route = createFileRoute('/vendors/')({
  validateSearch: zodValidator(vendorDirectorySearchSchema),
  loaderDeps: ({ search }) => ({ q: search.q, features: search.features, compound: search.compound }),
  loader: async ({ deps }) => {
    const [vendors, compounds] = await Promise.all([
      filterVendors({ data: { q: deps.q, features: deps.features, compound: deps.compound } }),
      getCompounds(),
    ])
    const landing = vendorLandingCopy({ ...deps, compounds })
    return { ...deps, vendors, compounds, landing }
  },
  head: ({ loaderData }) => {
    const landing = loaderData?.landing ?? vendorLandingCopy({ compounds: [] })
    const pageDescription = landing.description
    const canonicalUrl = `${SITE_URL}${landing.canonicalPath}`

    return {
      meta: [
        { title: landing.pageTitle },
        { name: 'description', content: pageDescription },
        ...(landing.noindex ? [{ name: 'robots', content: 'noindex, follow' as const }] : []),
        { property: 'og:title', content: landing.pageTitle },
        { property: 'og:description', content: pageDescription },
        { property: 'og:url', content: canonicalUrl },
        { name: 'twitter:title', content: landing.pageTitle },
        { name: 'twitter:description', content: pageDescription },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        ...(loaderData?.vendors
          ? [{ type: 'application/ld+json' as const, children: JSON.stringify(itemListSchema(loaderData.vendors, landing.listName, landing.canonicalPath)) }]
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
  const { q, features, compound } = Route.useSearch()
  const { vendors, compounds, landing } = Route.useLoaderData()
  const activeCompoundProfile = compound ? compounds.find((item) => item.id === compound) : undefined

  return (
    <DirectoryListing
      heading={landing.heading}
      description={landing.description}
      searchQuery={q ?? ''}
      vendors={vendors}
      compounds={compounds}
      activeFeatures={features ?? ''}
      activeCompound={compound ?? ''}
      activeCompoundProfile={activeCompoundProfile}
    />
  )
}
