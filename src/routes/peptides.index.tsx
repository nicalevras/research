import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDownIcon, SearchIcon, XIcon } from '~/components/icons'
import { PeptideGrid } from '~/components/peptide-grid'
import { PillNav } from '~/components/pill-nav'
import { withVendorCounts } from '~/lib/compound-counts'
import { PEPTIDE_CATEGORIES, SITE_NAME, SITE_URL } from '~/lib/constants'
import { breadcrumbSchema, collectionPageSchema, compoundItemListSchema } from '~/lib/schema'
import { getCompounds, getVendorCompoundOptions } from '~/lib/data'
import { peptideDirectorySearchSchema } from '~/lib/search'
import type { Compound } from '~/lib/types'
import {
  peptideCategoryPath,
  peptideSearchPath,
  peptideVendorPath,
  resolvePeptideDirectorySeoContext,
} from '~/lib/peptide-directory-seo'

const PEPTIDE_CATEGORY_BY_ID = new Map(PEPTIDE_CATEGORIES.map((category) => [category.id, category]))

type PeptideDirectoryLanding = {
  heading: string
  description: string
  pageTitle: string
  listName: string
  resultSummary: string
}

type PeptideDirectorySeo = {
  canonicalPath: string
  noindex: boolean
  indexable: boolean
}

function selectedCategoryIds(categories: string | undefined) {
  return categories?.split(',').filter((categoryId) => PEPTIDE_CATEGORY_BY_ID.has(categoryId)) ?? []
}

function vendorPeptidesHeading(vendorName: string) {
  return /\bpeptides?$/i.test(vendorName.trim()) ? vendorName : `${vendorName} Peptides`
}

function peptideCountLabel(count: number) {
  return `${count} peptide${count === 1 ? '' : 's'}`
}

function peptideLandingCopy(filters: {
  query?: string
  categoryIds: string[]
  vendorName?: string
  peptideCount: number
  indexable: boolean
}): PeptideDirectoryLanding {
  const search = filters.query
  const categoryLabels = filters.categoryIds.flatMap((categoryId) => {
    const category = PEPTIDE_CATEGORY_BY_ID.get(categoryId)
    return category ? [category.name] : []
  })
  const peptideCountSummary = `Showing ${peptideCountLabel(filters.peptideCount)}`

  if (categoryLabels.length > 0) {
    const label = categoryLabels.join(' + ')
    return {
      heading: `${label} Peptides`,
      description: `Browse ${label.toLowerCase()} research peptides and compare vendors carrying each peptide.`,
      pageTitle: `${label} Peptides - ${SITE_NAME}`,
      listName: `${label} Peptides`,
      resultSummary: filters.indexable && categoryLabels.length === 1
        ? `${peptideCountSummary} in ${label}.`
        : `${peptideCountSummary} matching current filters.`,
    }
  }

  if (filters.vendorName) {
    const vendorHeading = vendorPeptidesHeading(filters.vendorName)

    return {
      heading: vendorHeading,
      description: `Browse research peptides listed for ${filters.vendorName}. Compare peptide profiles and matching vendor availability.`,
      pageTitle: `${vendorHeading} - ${SITE_NAME}`,
      listName: vendorHeading,
      resultSummary: search
        ? `${peptideCountSummary} matching current filters.`
        : `${peptideCountSummary} listed for ${filters.vendorName}.`,
    }
  }

  return {
    heading: search ? 'Peptide Search Results' : 'Peptides',
    description: search
      ? `Search results for peptides matching "${search}".`
      : 'Browse research peptides and compare vendors carrying each peptide.',
    pageTitle: search ? `Peptide Search Results - ${SITE_NAME}` : `Peptides - ${SITE_NAME}`,
    listName: 'Peptides',
    resultSummary: search
      ? `${peptideCountSummary} matching your search.`
      : `${peptideCountSummary} in the directory.`,
  }
}

function peptideSeo(filters: {
  query?: string
  categoryIds: string[]
  invalidCategoryIds: string[]
  vendorId?: string
  hasInvalidVendor: boolean
}): PeptideDirectorySeo {
  const singleCategoryId = filters.categoryIds.length === 1 ? filters.categoryIds[0] : undefined
  const hasMultipleCategories = filters.categoryIds.length > 1
  const hasInvalidParams = filters.invalidCategoryIds.length > 0 || filters.hasInvalidVendor

  if (singleCategoryId && (filters.query || filters.vendorId || hasInvalidParams)) {
    return {
      canonicalPath: peptideCategoryPath(singleCategoryId),
      noindex: true,
      indexable: false,
    }
  }

  if (hasMultipleCategories) {
    return {
      canonicalPath: '/peptides',
      noindex: true,
      indexable: false,
    }
  }

  if (filters.query) {
    return {
      canonicalPath: peptideSearchPath(filters.query),
      noindex: true,
      indexable: false,
    }
  }

  if (filters.vendorId) {
    return {
      canonicalPath: peptideVendorPath(filters.vendorId),
      noindex: true,
      indexable: false,
    }
  }

  if (hasInvalidParams) {
    return {
      canonicalPath: '/peptides',
      noindex: true,
      indexable: false,
    }
  }

  if (singleCategoryId) {
    return {
      canonicalPath: peptideCategoryPath(singleCategoryId),
      noindex: false,
      indexable: true,
    }
  }

  return {
    canonicalPath: '/peptides',
    noindex: false,
    indexable: true,
  }
}

function filterCompounds(compounds: Compound[], q: string | undefined, categories: string | undefined, vendorCompoundSlugs: string[] | undefined) {
  const query = q?.trim().toLowerCase()
  const selectedCategories = selectedCategoryIds(categories)

  return compounds.filter((compound) => {
    const matchesQuery = !query || compound.name.toLowerCase().includes(query) || compound.id.includes(query)
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.some((categoryId) => compound.categories.includes(categoryId))
    const matchesVendor = !vendorCompoundSlugs || vendorCompoundSlugs.includes(compound.id)
    return matchesQuery && matchesCategory && matchesVendor
  })
}

export const Route = createFileRoute('/peptides/')({
  validateSearch: zodValidator(peptideDirectorySearchSchema),
  loaderDeps: ({ search }) => ({ q: search.q, categories: search.categories, vendor: search.vendor }),
  loader: async ({ deps }) => {
    const [allCompounds, vendors] = await Promise.all([
      getCompounds(),
      getVendorCompoundOptions(),
    ])
    const seoContext = resolvePeptideDirectorySeoContext(deps, vendors)
    const q = seoContext.query
    const categories = seoContext.validCategoryIds.join(',') || undefined
    const vendor = seoContext.validVendor?.id
    const compounds = filterCompounds(
      withVendorCounts(allCompounds, vendors),
      q,
      categories,
      seoContext.validVendor?.compoundSlugs,
    )
    const seo = peptideSeo({
      query: seoContext.query,
      categoryIds: seoContext.validCategoryIds,
      invalidCategoryIds: seoContext.invalidCategoryIds,
      vendorId: seoContext.validVendor?.id,
      hasInvalidVendor: seoContext.hasInvalidVendor,
    })
    const landing = peptideLandingCopy({
      query: seoContext.query,
      categoryIds: seoContext.validCategoryIds,
      vendorName: seoContext.validVendor?.name,
      peptideCount: compounds.length,
      indexable: seo.indexable,
    })

    return { q, categories, vendor, compounds, vendors, landing, seo }
  },
  head: ({ loaderData }) => {
    const landing = loaderData?.landing ?? peptideLandingCopy({
      categoryIds: [],
      peptideCount: 0,
      indexable: true,
    })
    const seo = loaderData?.seo ?? {
      canonicalPath: '/peptides',
      noindex: false,
      indexable: true,
    }
    const pageDescription = landing.description
    const canonicalUrl = `${SITE_URL}${seo.canonicalPath}`
    const ogImage = `${SITE_URL}/og-image.png`
    const itemListId = seo.indexable ? `${canonicalUrl}#peptide-list` : undefined

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
        ...(loaderData?.compounds && seo.indexable
          ? [{
              type: 'application/ld+json' as const,
              children: JSON.stringify(compoundItemListSchema(loaderData.compounds, landing.listName, seo.canonicalPath, itemListId ? { id: itemListId } : undefined)),
            }]
          : []),
        {
          type: 'application/ld+json' as const,
          children: JSON.stringify(breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Peptides', url: '/peptides' },
          ])),
        },
      ],
    }
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    'Vary': 'Accept, Accept-Encoding',
  }),
  component: PeptidesPage,
})

function PeptidesPage() {
  const navigate = useNavigate()
  const { q, categories, vendor, compounds, vendors, landing } = Route.useLoaderData()
  const searchRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const [localQuery, setLocalQuery] = useState(q ?? '')
  const [localCategories, setLocalCategories] = useState<string[]>(() => selectedCategoryIds(categories))

  useEffect(() => {
    if (document.activeElement !== searchRef.current) {
      setLocalQuery(q ?? '')
    }
  }, [q])

  useEffect(() => {
    setLocalCategories(selectedCategoryIds(categories))
  }, [categories])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const currentSearch = useMemo(() => {
    const search: { q?: string; categories?: string; vendor?: string } = {}
    if (q) search.q = q
    if (categories) search.categories = categories
    if (vendor) search.vendor = vendor
    return search
  }, [q, categories, vendor])

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        navigate({ to: '/peptides', search: { ...currentSearch, q: value || undefined } })
      }, 300)
    },
    [navigate, currentSearch],
  )

  const handleToggleCategory = useCallback(
    (categoryId: string) => {
      const next = localCategories.includes(categoryId) ? [] : [categoryId]

      setLocalCategories(next)
      navigate({
        to: '/peptides',
        search: {
          ...currentSearch,
          categories: next.length > 0 ? next.join(',') : undefined,
        },
      })
    },
    [navigate, currentSearch, localCategories],
  )

  const handleVendorChange = useCallback(
    (value: string) => {
      navigate({
        to: '/peptides',
        search: {
          ...currentSearch,
          vendor: value || undefined,
        },
      })
    },
    [navigate, currentSearch],
  )

  return (
    <div>
      <section className="py-16">
        <div className="max-w-3xl">
          <h1 className="max-w-2xl text-3xl font-[900] font-stretch-semi-expanded capitalize leading-tight tracking-[-1px] text-neutral-950 dark:text-white sm:text-4xl">{landing.heading}</h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-neutral-600 dark:text-neutral-300">
            {landing.description}
          </p>
          <p className="sr-only">
            {landing.resultSummary}
          </p>
        </div>
      </section>

      <div>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search peptides..."
              aria-label="Search peptides"
              value={localQuery}
              onChange={(event) => {
                setLocalQuery(event.target.value)
                handleSearch(event.target.value)
              }}
              className="w-full rounded-lg border border-neutral-200/60 bg-white/70 py-2 pl-9 pr-9 text-sm backdrop-blur-sm transition-all placeholder-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:border-white/[0.06] dark:bg-white/[0.04] dark:placeholder-neutral-500 dark:focus:border-white/20 dark:focus:ring-white/10"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  const rest = { ...currentSearch }
                  delete rest.q
                  setLocalQuery('')
                  navigate({ to: '/peptides', search: rest })
                  searchRef.current?.focus()
                }}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                aria-label="Clear search"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-48">
            <label htmlFor="peptide-directory-vendor-filter" className="sr-only">
              Filter peptides by vendor
            </label>
            <select
              id="peptide-directory-vendor-filter"
              value={vendor ?? ''}
              onChange={(event) => handleVendorChange(event.target.value)}
              className="native-select w-full cursor-pointer appearance-none rounded-lg border border-neutral-200/60 bg-white/70 py-2 pl-4 pr-9 text-sm text-neutral-700 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-neutral-300 dark:focus:ring-white/10"
            >
              <option value="">All Vendors</option>
              {vendors.map((vendorOption) => (
                <option key={vendorOption.id} value={vendorOption.id}>{vendorOption.name}</option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          </div>
        </div>

        <div className="mt-4">
          <PillNav items={PEPTIDE_CATEGORIES} activeItems={localCategories} onToggleItem={handleToggleCategory} />
        </div>
      </div>

      <section className="mt-6" aria-label="Peptides">
        <h2 className="sr-only">Peptide listings</h2>
        <PeptideGrid
          data={compounds}
          emptyTitle="No peptides match the current filters"
          emptyDescription="Try adjusting your search, category, or vendor filter."
        />
      </section>
    </div>
  )
}
