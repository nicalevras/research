import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDownIcon, SearchIcon, XIcon } from '~/components/icons'
import { PeptideGrid } from '~/components/peptide-grid'
import { PillNav } from '~/components/pill-nav'
import { withVendorCounts } from '~/lib/compound-counts'
import { PEPTIDE_CATEGORIES, SITE_URL } from '~/lib/constants'
import { breadcrumbSchema } from '~/lib/schema'
import { getCompounds, getVendorCompoundOptions } from '~/lib/data'
import { peptideDirectorySearchSchema } from '~/lib/search'
import type { Compound } from '~/lib/types'

const PEPTIDE_CATEGORY_BY_ID = new Map(PEPTIDE_CATEGORIES.map((category) => [category.id, category]))

function selectedCategoryIds(categories: string | undefined) {
  return categories?.split(',').filter((categoryId) => PEPTIDE_CATEGORY_BY_ID.has(categoryId)) ?? []
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
    const selectedVendor = deps.vendor ? vendors.find((vendor) => vendor.id === deps.vendor) : undefined
    const compounds = filterCompounds(withVendorCounts(allCompounds, vendors), deps.q, deps.categories, selectedVendor?.compoundSlugs)
    return { ...deps, compounds, vendors }
  },
  head: ({ loaderData }) => {
    const { q, categories, vendor } = loaderData ?? {}
    const isFiltered = !!q || !!categories || !!vendor
    const pageTitle = 'Peptides - Peptide Vendor Directory'
    const pageDescription = 'Browse research peptides and compare vendors carrying each peptide.'
    const canonicalUrl = `${SITE_URL}/peptides`

    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: pageDescription },
        ...(isFiltered ? [{ name: 'robots', content: 'noindex, follow' as const }] : []),
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: pageDescription },
        { property: 'og:url', content: canonicalUrl },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: pageDescription },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        ...(loaderData?.compounds
          ? [{
              type: 'application/ld+json' as const,
              children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Peptides',
                url: canonicalUrl,
                numberOfItems: loaderData.compounds.length,
                itemListElement: loaderData.compounds.map((compound, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'Thing',
                    name: compound.name,
                    url: `${SITE_URL}/peptides/${compound.id}`,
                  },
                })),
              }),
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
  const { q, categories, vendor } = Route.useSearch()
  const { compounds, vendors } = Route.useLoaderData()
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
      const next = localCategories.includes(categoryId)
        ? localCategories.filter((id) => id !== categoryId)
        : [...localCategories, categoryId]

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
    <div className="space-y-6">
      <section className="rounded-lg border border-neutral-200/80 bg-white px-5 py-20 dark:border-white/[0.08] dark:bg-neutral-900">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">Peptides</h1>
        <p className="mt-1.5 max-w-xl text-pretty text-sm text-neutral-500 dark:text-neutral-400">
          Browse research peptides and compare vendors carrying each peptide.
        </p>
      </section>

      <div className="space-y-4">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search peptides..."
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
            <select
              value={vendor ?? ''}
              onChange={(event) => handleVendorChange(event.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-neutral-200/60 bg-white/70 py-2 pl-4 pr-9 text-sm text-neutral-700 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-neutral-300 dark:[color-scheme:dark] dark:focus:ring-white/10"
            >
              <option value="">All Vendors</option>
              {vendors.map((vendorOption) => (
                <option key={vendorOption.id} value={vendorOption.id}>{vendorOption.name}</option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          </div>
        </div>

        <PillNav items={PEPTIDE_CATEGORIES} activeItems={localCategories} onToggleItem={handleToggleCategory} />
      </div>

      <section aria-label="Peptides">
        <PeptideGrid
          data={compounds}
          emptyTitle="No peptides match the current filters"
          emptyDescription="Try adjusting your search, category, or vendor filter."
        />
      </section>
    </div>
  )
}
