import { createFileRoute, notFound, stripSearchParams } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { DirectoryListing } from '~/components/directory-listing'
import { CATEGORIES, SITE_URL } from '~/lib/constants'
import { searchDefaults, searchSchema } from '~/lib/search'
import { filterVendors } from '~/lib/data'
import type { VendorCategory } from '~/lib/types'

const VALID_CATEGORIES = new Set(
  CATEGORIES.filter((c) => c.value !== 'all').map((c) => c.value),
)

type ValidCategory = Exclude<VendorCategory, 'all'>

const SEO_META: Record<ValidCategory, { title: string; description: string }> = {
  research: {
    title: 'Research Peptide Vendors — Lab-Grade Peptide Suppliers',
    description:
      'Find top-rated research peptide suppliers. Verified lab reports, GMP certifications, and community reviews for BPC-157, TB-500, Epitalon, and more.',
  },
  therapeutic: {
    title: 'Therapeutic Peptide Clinics & Suppliers',
    description:
      'Discover peptide therapy clinics and therapeutic peptide vendors. Physician-supervised programs for healing, anti-aging, and hormone optimization.',
  },
  cosmetic: {
    title: 'Cosmetic Peptide Brands — Anti-Aging Skincare Peptides',
    description:
      'Compare cosmetic peptide suppliers. Copper peptides, matrixyl, argireline, and more for anti-aging skincare formulations.',
  },
  'api-supplier': {
    title: 'Peptide API Manufacturers — GMP Bulk Peptide Suppliers',
    description:
      'Find GMP-certified peptide API manufacturers for pharmaceutical production. Custom peptide synthesis, bulk orders, and regulatory compliance.',
  },
}

function isValidCategory(value: string): value is ValidCategory {
  return VALID_CATEGORIES.has(value as ValidCategory)
}

export const Route = createFileRoute('/$category')({
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [stripSearchParams(searchDefaults)],
  },
  parseParams: ({ category }) => {
    if (!isValidCategory(category)) {
      throw notFound()
    }
    return { category }
  },
  loaderDeps: ({ search }) => ({ page: search.page, q: search.q, country: search.country, tags: search.tags }),
  loader: async ({ params, deps }) => {
    const vendors = await filterVendors({ data: { category: params.category, q: deps.q, country: deps.country, tags: deps.tags } })
    return { category: params.category, ...deps, vendors }
  },
  head: ({ loaderData }) => {
    const { page, q, country } = loaderData ?? {}
    const category = loaderData?.category
    if (!category || !isValidCategory(category)) return { meta: [], links: [] }
    const seo = SEO_META[category]
    const isFiltered = !!q
    const pageSuffix = page && page > 1 ? ` — Page ${page}` : ''
    const pageTitle = `${seo.title}${pageSuffix}`
    const canonicalParams = new URLSearchParams()
    if (country) canonicalParams.set('country', country)
    if (page && page > 1) canonicalParams.set('page', String(page))
    const canonicalUrl = canonicalParams.size > 0
      ? `${SITE_URL}/${category}?${canonicalParams.toString()}`
      : `${SITE_URL}/${category}`
    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: seo.description },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: seo.description },
        { property: 'og:url', content: canonicalUrl },
        ...(isFiltered ? [{ name: 'robots', content: 'noindex, follow' as const }] : []),
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
    }
  },
  component: CategoryPage,
})

function CategoryPage() {
  const { category } = Route.useParams()
  const { q, country, page, tags } = Route.useSearch()
  const { vendors } = Route.useLoaderData()

  if (!isValidCategory(category)) return null

  const seo = SEO_META[category]
  const label = CATEGORIES.find((c) => c.value === category)?.label ?? category

  return (
    <DirectoryListing
      category={category}
      heading={`${label} Peptide Vendors`}
      description={seo.description}
      searchQuery={q ?? ''}
      countryFilter={country ?? ''}
      currentPage={page}
      vendors={vendors}
      activeTags={tags ?? ''}
    />
  )
}
