import type { Vendor, Review } from './types'
import { SITE_URL } from './constants'

function vendorDescription(vendor: Vendor) {
  const sample = vendor.compoundNames.slice(0, 3).join(', ')
  return `${vendor.name} lists ${vendor.compoundNames.length} compounds${sample ? ` including ${sample}` : ''}.`
}

export function itemListSchema(
  vendors: Vendor[],
  listName: string,
  listUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description: `${listName} on Peptide Vendor Directory`,
    url: `${SITE_URL}${listUrl}`,
    numberOfItems: vendors.length,
    itemListElement: vendors.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Organization',
        name: v.name,
        url: `${SITE_URL}/vendors/${v.id}`,
        description: vendorDescription(v),
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

export function siteSearchSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Peptide Vendor Directory',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}
