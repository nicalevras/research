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

const SEO_META: Partial<Record<ValidCategory, { title: string; description: string }>> = {
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
  'custom-synthesis': {
    title: 'Custom Peptide Synthesis Services — Bespoke Peptide Manufacturers',
    description:
      'Find custom peptide synthesis providers. Fmoc solid-phase synthesis, modified peptides, and high-purity custom orders for research and pharmaceutical use.',
  },
  'no-reference': {
    title: 'Peptide Vendors — No Reference Standard',
    description:
      'Browse peptide vendors without reference standards. Compare ratings, certifications, and pricing for research-grade peptide suppliers.',
  },
  ghrp: {
    title: 'GHRP Peptide Vendors — Growth Hormone Releasing Peptides',
    description:
      'Compare vendors selling GHRP peptides including GHRP-2, GHRP-6, and Ipamorelin. Verified quality ratings and lab reports.',
  },
  bpc: {
    title: 'BPC-157 Vendors — Body Protection Compound Suppliers',
    description:
      'Find trusted BPC-157 peptide vendors. Compare pricing, purity, certifications, and customer reviews for Body Protection Compound 157.',
  },
  thymosin: {
    title: 'Thymosin Peptide Vendors — Thymosin Alpha-1 & Beta-4 Suppliers',
    description:
      'Compare thymosin peptide suppliers. Buy Thymosin Alpha-1, TB-500 (Thymosin Beta-4) from verified research and therapeutic vendors.',
  },
  glutathione: {
    title: 'Glutathione Peptide Vendors — Reduced & Liposomal Suppliers',
    description:
      'Find glutathione peptide vendors. Compare reduced glutathione, liposomal glutathione, and injectable formulations from certified suppliers.',
  },
  melanotan: {
    title: 'Melanotan Peptide Vendors — MT-1 & MT-2 Suppliers',
    description:
      'Compare melanotan peptide vendors. Find Melanotan I and Melanotan II from research-grade suppliers with verified quality.',
  },
  epitalon: {
    title: 'Epitalon Peptide Vendors — Epithalamin Suppliers',
    description:
      'Find epitalon peptide vendors. Compare pricing, purity levels, and reviews for epithalamin and pineal gland peptide research.',
  },
  tb500: {
    title: 'TB-500 Peptide Vendors — Thymosin Beta-4 Suppliers',
    description:
      'Compare TB-500 peptide vendors. Find Thymosin Beta-4 from trusted research suppliers with verified lab reports and certifications.',
  },
  'mots-c': {
    title: 'MOTS-c Peptide Vendors — Mitochondrial-Derived Peptide',
    description:
      'Find MOTS-c peptide vendors. Compare mitochondrial-derived peptide suppliers with verified quality, pricing, and customer reviews.',
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
  loaderDeps: ({ search }) => ({ page: search.page, q: search.q, country: search.country }),
  loader: async ({ params, deps }) => {
    const vendors = await filterVendors({ category: params.category, q: deps.q, country: deps.country })
    return { category: params.category, ...deps, vendors }
  },
  head: ({ loaderData }) => {
    const { page, q, country } = loaderData ?? {}
    const category = loaderData?.category
    if (!category || !isValidCategory(category)) return { meta: [], links: [] }
    const seo = SEO_META[category]
    const isFiltered = !!q
    const pageSuffix = page && page > 1 ? ` — Page ${page}` : ''
    const pageTitle = `${seo?.title ?? `${category} — Peptide Vendor Directory`}${pageSuffix}`
    const canonicalParams = new URLSearchParams()
    if (country) canonicalParams.set('country', country)
    if (page && page > 1) canonicalParams.set('page', String(page))
    const canonicalUrl = canonicalParams.size > 0
      ? `${SITE_URL}/${category}?${canonicalParams.toString()}`
      : `${SITE_URL}/${category}`
    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: seo?.description ?? `Browse ${category} peptide vendors.` },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: seo?.description ?? `Browse ${category} peptide vendors.` },
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
  const { q, country, page } = Route.useSearch()
  const { vendors } = Route.useLoaderData()

  if (!isValidCategory(category)) return null

  const seo = SEO_META[category]
  const label = CATEGORIES.find((c) => c.value === category)?.label ?? category

  return (
    <DirectoryListing
      category={category}
      heading={`${label} Peptide Vendors`}
      description={seo?.description ?? `Browse ${label.toLowerCase()} peptide vendors.`}
      searchQuery={q ?? ''}
      countryFilter={country ?? ''}
      currentPage={page}
      vendors={vendors}
    />
  )
}
