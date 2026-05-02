import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { DirectoryListing } from '~/components/directory-listing'
import { SITE_URL } from '~/lib/constants'
import { breadcrumbSchema, collectionPageSchema, itemListSchema } from '~/lib/schema'
import { vendorDirectorySearchSchema } from '~/lib/search'
import { filterVendors, getCompounds } from '~/lib/data'
import type { Compound } from '~/lib/types'
import {
  APPROVED_VENDOR_INDEX_FEATURES,
  resolveVendorDirectorySeoContext,
  vendorFeaturePath,
  vendorPeptidePath,
  vendorSearchPath,
} from '~/lib/vendor-directory-seo'

const FEATURE_FILTER_BY_ID = new Map(APPROVED_VENDOR_INDEX_FEATURES.map((feature) => [feature.id, feature]))

type VendorDirectoryLanding = {
  heading: string
  description: string
  pageTitle: string
  listName: string
  resultSummary: string
}

type VendorDirectorySeo = {
  canonicalPath: string
  noindex: boolean
  indexable: boolean
}

function vendorCountLabel(count: number) {
  return `${count} vendor${count === 1 ? '' : 's'}`
}

function vendorLandingCopy(filters: {
  query?: string
  featureIds: string[]
  peptide?: Compound
  vendorCount: number
  indexable: boolean
}): VendorDirectoryLanding {
  const featureLabels = filters.featureIds.flatMap((featureId) => {
    const feature = FEATURE_FILTER_BY_ID.get(featureId)
    return feature ? [feature.name] : []
  })
  const search = filters.query
  const compound = filters.peptide
  const countSummaryPrefix = `Showing ${vendorCountLabel(filters.vendorCount)}`

  if (compound) {
    const compoundVendorTitle = `${compound.name} Peptide Vendors`

    return {
      heading: compoundVendorTitle,
      description: `Compare peptide vendors carrying ${compound.name}. Review ratings, vendor profiles, payment methods, and category matches in one place.`,
      pageTitle: `${compoundVendorTitle} - Peptide Vendor Directory`,
      listName: compoundVendorTitle,
      resultSummary: filters.indexable
        ? `${countSummaryPrefix} that currently list ${compound.name}.`
        : `${countSummaryPrefix} matching vendors.`,
    }
  }

  if (featureLabels.length > 0) {
    const label = featureLabels.join(' + ')
    return {
      heading: `${label} Vendors`,
      description: `Compare peptide vendors with ${label.toLowerCase()}. Review ratings, vendor profiles, payment methods, and peptide availability.`,
      pageTitle: `${label} Vendors - Peptide Vendor Directory`,
      listName: `${label} Vendors`,
      resultSummary: filters.indexable && featureLabels.length === 1
        ? `${countSummaryPrefix} marked with ${label}.`
        : `${countSummaryPrefix} matching vendors.`,
    }
  }

  return {
    heading: search ? 'Vendor Search Results' : 'Peptide Vendors',
    description: search
      ? `Search results for peptide vendors matching "${search}".`
      : 'Browse every peptide vendor in the directory. Compare ratings, certifications, promo codes, and vendor details in one place.',
    pageTitle: search ? 'Vendor Search Results - Peptide Vendor Directory' : 'Vendors - Peptide Vendor Directory',
    listName: 'Peptide Vendors',
    resultSummary: search
      ? `${countSummaryPrefix} matching your search.`
      : `${countSummaryPrefix} in the directory.`,
  }
}

function vendorSeo(filters: {
  query?: string
  featureIds: string[]
  invalidFeatureIds: string[]
  peptide?: Compound
  hasInvalidPeptide: boolean
}): VendorDirectorySeo {
  const singleFeatureId = filters.featureIds.length === 1 ? filters.featureIds[0] : undefined
  const hasMultipleFeatures = filters.featureIds.length > 1
  const hasInvalidParams = filters.invalidFeatureIds.length > 0 || filters.hasInvalidPeptide

  if (filters.peptide && (filters.query || filters.featureIds.length > 0 || hasInvalidParams)) {
    return {
      canonicalPath: vendorPeptidePath(filters.peptide.id),
      noindex: true,
      indexable: false,
    }
  }

  if (singleFeatureId && (filters.query || hasInvalidParams)) {
    return {
      canonicalPath: vendorFeaturePath(singleFeatureId),
      noindex: true,
      indexable: false,
    }
  }

  if (hasMultipleFeatures) {
    return {
      canonicalPath: '/vendors',
      noindex: true,
      indexable: false,
    }
  }

  if (filters.query && !hasInvalidParams) {
    return {
      canonicalPath: vendorSearchPath(filters.query),
      noindex: true,
      indexable: false,
    }
  }

  if (hasInvalidParams) {
    return {
      canonicalPath: '/vendors',
      noindex: true,
      indexable: false,
    }
  }

  if (filters.peptide) {
    return {
      canonicalPath: vendorPeptidePath(filters.peptide.id),
      noindex: false,
      indexable: true,
    }
  }

  if (singleFeatureId) {
    return {
      canonicalPath: vendorFeaturePath(singleFeatureId),
      noindex: false,
      indexable: true,
    }
  }

  return {
    canonicalPath: '/vendors',
    noindex: false,
    indexable: true,
  }
}

export const Route = createFileRoute('/vendors/')({
  validateSearch: zodValidator(vendorDirectorySearchSchema),
  loaderDeps: ({ search }) => ({ q: search.q, features: search.features, peptide: search.peptide }),
  loader: async ({ deps }) => {
    const compounds = await getCompounds()
    const seoContext = resolveVendorDirectorySeoContext(deps, compounds)
    const features = seoContext.validFeatureIds.join(',') || undefined
    const peptide = seoContext.validPeptide?.id
    const q = seoContext.query
    const vendors = await filterVendors({ data: { q, features, peptide } })
    const seo = vendorSeo({
      query: seoContext.query,
      featureIds: seoContext.validFeatureIds,
      invalidFeatureIds: seoContext.invalidFeatureIds,
      peptide: seoContext.validPeptide,
      hasInvalidPeptide: seoContext.hasInvalidPeptide,
    })
    const landing = vendorLandingCopy({
      query: seoContext.query,
      featureIds: seoContext.validFeatureIds,
      peptide: seoContext.validPeptide,
      vendorCount: vendors.length,
      indexable: seo.indexable,
    })

    return {
      q,
      features,
      peptide,
      vendors,
      compounds,
      landing,
      seo,
    }
  },
  head: ({ loaderData }) => {
    const landing = loaderData?.landing ?? vendorLandingCopy({
      featureIds: [],
      vendorCount: 0,
      indexable: true,
    })
    const seo = loaderData?.seo ?? {
      canonicalPath: '/vendors',
      noindex: false,
      indexable: true,
    }
    const pageDescription = landing.description
    const canonicalUrl = `${SITE_URL}${seo.canonicalPath}`
    const ogImage = `${SITE_URL}/og-image.png`
    const itemListId = seo.indexable ? `${canonicalUrl}#vendor-list` : undefined

    return {
      meta: [
        { title: landing.pageTitle },
        { name: 'description', content: pageDescription },
        ...(seo.noindex ? [{ name: 'robots', content: 'noindex, follow' as const }] : []),
        { property: 'og:title', content: landing.pageTitle },
        { property: 'og:type', content: 'website' },
        { property: 'og:description', content: pageDescription },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: ogImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: landing.pageTitle },
        { name: 'twitter:description', content: pageDescription },
        { name: 'twitter:image', content: ogImage },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        ...(seo.indexable
          ? [{
              type: 'application/ld+json' as const,
              children: JSON.stringify(collectionPageSchema({
                name: landing.pageTitle,
                description: pageDescription,
                url: seo.canonicalPath,
                mainEntityId: itemListId!,
              })),
            }]
          : []),
        ...(loaderData?.vendors && seo.indexable
          ? [{ type: 'application/ld+json' as const, children: JSON.stringify(itemListSchema(loaderData.vendors, landing.listName, seo.canonicalPath, itemListId ? { id: itemListId } : undefined)) }]
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
  const { q, features, vendors, compounds, landing, peptide } = Route.useLoaderData()
  const activeCompoundProfile = peptide ? compounds.find((item) => item.id === peptide) : undefined

  return (
    <DirectoryListing
      heading={landing.heading}
      description={landing.description}
      resultSummary={landing.resultSummary}
      searchQuery={q ?? ''}
      vendors={vendors}
      compounds={compounds}
      activeFeatures={features ?? ''}
      activeCompound={peptide ?? ''}
      activeCompoundProfile={activeCompoundProfile}
    />
  )
}
