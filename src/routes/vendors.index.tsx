import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { DirectoryListing } from '~/components/directory-listing'
import { SITE_NAME, SITE_URL } from '~/lib/constants'
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

const FEATURE_PAGE_TITLES: Record<string, string> = {
  coa: `Best Peptide Vendors With Lab Results 2026 | ${SITE_NAME}`,
  'credit-card': `Best Peptide Vendors That Accept Credit Cards 2026 | ${SITE_NAME}`,
  ach: `Best Peptide Vendors That Accept ACH 2026 | ${SITE_NAME}`,
  crypto: `Best Peptide Vendors That Accept Crypto 2026 | ${SITE_NAME}`,
  'promo-code': `Best Peptide Vendors With Discounts 2026 | ${SITE_NAME}`,
  international: `Best Peptide Vendors That Ship Internationally 2026 | ${SITE_NAME}`,
  'fast-shipping': `Best Peptide Vendors With Fast Shipping 2026 | ${SITE_NAME}`,
}

const FEATURE_PAGE_HEADINGS: Record<string, string> = {
  coa: 'Peptide Vendors With Lab Results',
  'credit-card': 'Credit Card Accepted Peptide Vendors',
  ach: 'ACH Accepted Peptide Vendors',
  crypto: 'Crypto Accepted Peptide Vendors',
  'promo-code': 'Peptide Vendors With Discounts',
  international: 'International Shipping Peptide Vendors',
  'fast-shipping': 'Fast Shipping Peptide Vendors',
}

const FEATURE_PAGE_DESCRIPTIONS: Record<string, { hero: string; meta: string }> = {
  coa: {
    hero: 'Compare peptide vendors with lab results by reviews, peptide availability, payment methods, and exclusive discounts.',
    meta: `Compare peptide vendors with lab results by reviews, peptide availability, payment methods, and exclusive discounts on ${SITE_NAME}.`,
  },
  'credit-card': {
    hero: 'Compare peptide vendors that accept credit cards by reviews, lab results, peptide availability, and exclusive discounts.',
    meta: `Compare peptide vendors that accept credit cards by reviews, lab results, peptide availability, and exclusive discounts on ${SITE_NAME}.`,
  },
  ach: {
    hero: 'Compare peptide vendors that accept ACH by reviews, lab results, peptide availability, and exclusive discounts.',
    meta: `Compare peptide vendors that accept ACH by reviews, lab results, peptide availability, and exclusive discounts on ${SITE_NAME}.`,
  },
  crypto: {
    hero: 'Compare peptide vendors that accept crypto by reviews, lab results, peptide availability, and exclusive discounts.',
    meta: `Compare peptide vendors that accept crypto by reviews, lab results, peptide availability, and exclusive discounts on ${SITE_NAME}.`,
  },
  'promo-code': {
    hero: 'Compare peptide vendors with exclusive discounts by reviews, lab results, peptide availability, and payment methods.',
    meta: `Compare peptide vendors with exclusive discounts by reviews, lab results, peptide availability, and payment methods on ${SITE_NAME}.`,
  },
  international: {
    hero: 'Compare peptide vendors that ship internationally by reviews, lab results, peptide availability, payment methods, and exclusive discounts.',
    meta: `Compare peptide vendors that ship internationally by reviews, lab results, peptide availability, payment methods, and exclusive discounts on ${SITE_NAME}.`,
  },
  'fast-shipping': {
    hero: 'Compare peptide vendors with fast shipping by reviews, lab results, peptide availability, payment methods, and exclusive discounts.',
    meta: `Compare peptide vendors with fast shipping by reviews, lab results, peptide availability, payment methods, and exclusive discounts on ${SITE_NAME}.`,
  },
}

type VendorDirectoryLanding = {
  heading: string
  description: string
  pageDescription?: string
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
      description: `Compare ${compound.name} peptide vendors by reviews, lab results, payment methods, and exclusive discounts.`,
      pageDescription: `Compare ${compound.name} peptide vendors by reviews, lab results, payment methods, and exclusive discounts on ${SITE_NAME}.`,
      pageTitle: `Best ${compound.name} Peptide Vendors 2026: Reviews & Discounts | ${SITE_NAME}`,
      listName: compoundVendorTitle,
      resultSummary: filters.indexable
        ? `${countSummaryPrefix} that currently list ${compound.name}.`
        : `${countSummaryPrefix} matching vendors.`,
    }
  }

  if (featureLabels.length > 0) {
    const label = featureLabels.join(' + ')
    const singleFeatureId = filters.featureIds.length === 1 ? filters.featureIds[0] : undefined
    const featureHeading = singleFeatureId ? FEATURE_PAGE_HEADINGS[singleFeatureId] : undefined
    const featureTitle = singleFeatureId ? FEATURE_PAGE_TITLES[singleFeatureId] : undefined
    const featureDescription = singleFeatureId ? FEATURE_PAGE_DESCRIPTIONS[singleFeatureId] : undefined
    return {
      heading: featureHeading ?? `${label} Vendors`,
      description: featureDescription?.hero ?? `Compare peptide vendors with ${label.toLowerCase()}. Review ratings, vendor profiles, payment methods, and peptide availability.`,
      pageDescription: featureDescription?.meta,
      pageTitle: featureTitle ?? `${label} Vendors - ${SITE_NAME}`,
      listName: `${label} Vendors`,
      resultSummary: filters.indexable && featureLabels.length === 1
        ? `${countSummaryPrefix} marked with ${label}.`
        : `${countSummaryPrefix} matching vendors.`,
    }
  }

  return {
    heading: search ? 'Vendor Search Results' : 'All Peptide Vendors',
    description: search
      ? `Showing vendor results for "${search}".`
      : 'Browse peptide vendors by reviews, lab results, peptide availability, accepted payment methods, and exclusive discounts.',
    pageDescription: search
      ? `Search peptide vendor results for "${search}" on ${SITE_NAME}.`
      : `Browse peptide vendors with reviews, lab results, peptide availability, accepted payment methods, and exclusive discounts on ${SITE_NAME}.`,
    pageTitle: search ? `Vendor Search Results | ${SITE_NAME}` : `Best Peptide Vendors 2026: Reviews & Discounts | ${SITE_NAME}`,
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
    const pageDescription = landing.pageDescription ?? landing.description
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
