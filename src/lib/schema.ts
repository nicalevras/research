import type { Compound, CompoundProfileData, CompoundProfileVendor, Vendor, VendorSummary, Review } from './types'
import { SITE_NAME, SITE_URL } from './constants'

function vendorDescription(vendor: Vendor) {
  return vendor.description
}

function vendorSummaryDescription(vendor: VendorSummary) {
  return vendor.description
}

function absoluteUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : `${SITE_URL}${url}`
}

export function itemListSchema(
  vendors: VendorSummary[],
  listName: string,
  listUrl: string,
  options?: {
    id?: string
  },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(options?.id ? { '@id': options.id } : {}),
    name: listName,
    description: `${listName} on ${SITE_NAME}`,
    url: `${SITE_URL}${listUrl}`,
    numberOfItems: vendors.length,
    itemListElement: vendors.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Organization',
        name: v.name,
        url: `${SITE_URL}/vendors/${v.id}`,
        description: vendorSummaryDescription(v),
        address: {
          '@type': 'PostalAddress',
          addressCountry: v.country,
        },
        ...(v.reviewCount > 0 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: v.rating,
            reviewCount: v.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }),
      },
    })),
  }
}

export function collectionPageSchema({
  name,
  description,
  url,
  mainEntityId,
}: {
  name: string
  description: string
  url: string
  mainEntityId: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: `${SITE_URL}${url}`,
    name,
    description,
    mainEntity: {
      '@id': mainEntityId,
    },
  }
}

export function compoundItemListSchema(
  compounds: Compound[],
  listName: string,
  listUrl: string,
  options?: {
    id?: string
  },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(options?.id ? { '@id': options.id } : {}),
    name: listName,
    description: `${listName} on ${SITE_NAME}`,
    url: `${SITE_URL}${listUrl}`,
    numberOfItems: compounds.length,
    itemListElement: compounds.map((compound, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        name: compound.name,
        url: `${SITE_URL}/peptides/${compound.id}`,
      },
    })),
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

export function organizationSchema(vendor: Vendor, reviews?: Review[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: vendor.name,
    url: vendor.website,
    description: vendorDescription(vendor),
    address: {
      '@type': 'PostalAddress',
      addressCountry: vendor.country,
    },
    ...(vendor.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: vendor.rating,
        reviewCount: vendor.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(reviews && reviews.length > 0 && {
      review: reviews.map((r) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.username },
        datePublished: r.createdAt,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: r.comment,
      })),
    }),
  }
}

export function vendorProfileSchema({
  vendor,
  reviews,
  path,
  title,
  description,
}: {
  vendor: Vendor
  reviews?: Review[]
  path: string
  title: string
  description: string
}) {
  const pageUrl = `${SITE_URL}${path}`
  const webPageId = `${pageUrl}#webpage`
  const organizationId = `${pageUrl}#organization`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': webPageId,
        url: pageUrl,
        name: title,
        description,
        mainEntity: {
          '@id': organizationId,
        },
      },
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: vendor.name,
        url: vendor.website,
        mainEntityOfPage: pageUrl,
        description: vendorDescription(vendor),
        address: {
          '@type': 'PostalAddress',
          addressCountry: vendor.country,
        },
        ...(vendor.logoUrl ? {
          logo: absoluteUrl(vendor.logoUrl),
          image: absoluteUrl(vendor.logoUrl),
        } : {}),
        ...(vendor.reviewCount > 0 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: vendor.rating,
            reviewCount: vendor.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }),
        ...(reviews && reviews.length > 0 && {
          review: reviews.map((review) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: review.username },
            datePublished: review.createdAt,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: review.rating,
              bestRating: 5,
              worstRating: 1,
            },
            reviewBody: review.comment,
          })),
        }),
      },
    ],
  }
}

function peptideVendorItemListSchema({
  compound,
  vendors,
  id,
}: {
  compound: CompoundProfileData
  vendors: CompoundProfileVendor[]
  id?: string
}) {
  return {
    '@type': 'ItemList',
    ...(id ? { '@id': id } : {}),
    name: `${compound.name} Vendors`,
    description: `${compound.name} vendors on ${SITE_NAME}`,
    url: `${SITE_URL}/vendors?peptide=${compound.id}`,
    numberOfItems: vendors.length,
    itemListElement: vendors.map((vendor, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Organization',
        name: vendor.name,
        url: `${SITE_URL}/vendors/${vendor.id}`,
        ...(vendor.logoUrl ? { image: absoluteUrl(vendor.logoUrl) } : {}),
      },
    })),
  }
}

export function peptideProfileSchema({
  compound,
  vendors,
  path,
  title,
  description,
}: {
  compound: CompoundProfileData
  vendors: CompoundProfileVendor[]
  path: string
  title: string
  description: string
}) {
  const pageUrl = `${SITE_URL}${path}`
  const webPageId = `${pageUrl}#webpage`
  const peptideId = `${pageUrl}#peptide`
  const vendorsId = `${pageUrl}#vendors`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': webPageId,
        url: pageUrl,
        name: title,
        description,
        mainEntity: {
          '@id': peptideId,
        },
        hasPart: {
          '@id': vendorsId,
        },
      },
      {
        '@type': 'Thing',
        '@id': peptideId,
        name: compound.name,
        url: pageUrl,
        description: compound.description,
        mainEntityOfPage: pageUrl,
      },
      peptideVendorItemListSchema({
        compound,
        vendors,
        id: vendorsId,
      }),
    ],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }
}

export function webApplicationSchema({
  id,
  name,
  url,
  description,
  applicationCategory,
  operatingSystem,
  offers,
  isAccessibleForFree,
}: {
  id?: string
  name: string
  url: string
  description: string
  applicationCategory: string
  operatingSystem: string
  offers?: {
    '@type': 'Offer'
    price: string
    priceCurrency: string
  }
  isAccessibleForFree?: boolean
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    ...(id ? { '@id': `${SITE_URL}${id}` } : {}),
    name,
    url: `${SITE_URL}${url}`,
    description,
    applicationCategory,
    operatingSystem,
    ...(offers ? { offers } : {}),
    ...(typeof isAccessibleForFree === 'boolean' ? { isAccessibleForFree } : {}),
  }
}
