import { createFileRoute, notFound } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { DirectoryListing } from '~/components/directory-listing'
import { CATEGORIES } from '~/lib/constants'
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
  validateSearch: zodValidator(z.object({ q: z.string().optional() })),
  parseParams: ({ category }) => {
    if (!isValidCategory(category)) {
      throw notFound()
    }
    return { category }
  },
  head: ({ params: { category } }) => {
    if (!isValidCategory(category)) return { meta: [] }
    const seo = SEO_META[category]
    return {
      meta: [
        { title: seo.title },
        { name: 'description', content: seo.description },
        { property: 'og:title', content: seo.title },
        { property: 'og:description', content: seo.description },
      ],
    }
  },
  component: CategoryPage,
})

function CategoryPage() {
  const { category } = Route.useParams()
  const { q } = Route.useSearch()

  if (!isValidCategory(category)) return null

  const seo = SEO_META[category]
  const label = CATEGORIES.find((c) => c.value === category)?.label ?? category

  return (
    <DirectoryListing
      category={category}
      heading={`${label} Peptide Vendors`}
      description={seo.description}
      searchQuery={q ?? ''}
    />
  )
}
