import type { Compound, VendorSummary } from '~/lib/types'
import { COUNTRIES, FEATURE_FILTERS } from '~/lib/constants'
import { PillNav } from '~/components/pill-nav'
import { VendorGrid, VendorGridSkeleton } from '~/components/vendor-grid'
import { SearchIcon, XIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '~/components/icons'
import { useNavigate, Link, useRouterState } from '@tanstack/react-router'
import { useMemo, useRef, useCallback, useEffect, useState } from 'react'

export const PAGE_SIZE = 15

interface DirectoryListingProps {
  heading: string
  description: string
  searchQuery: string
  countryFilter: string
  currentPage: number
  vendors: VendorSummary[]
  compounds: Compound[]
  activeFeatures: string
  activeCompound: string
}

export function DirectoryListing({ heading, description, searchQuery, countryFilter, currentPage, vendors, compounds, activeFeatures, activeCompound }: DirectoryListingProps) {
  const navigate = useNavigate()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [localFeatures, setLocalFeatures] = useState<string[]>(() => activeFeatures ? activeFeatures.split(',').filter(Boolean) : [])
  const isGridLoading = useRouterState({
    select: (s) => {
      if (!s.isLoading) return false
      return !s.location.pathname.startsWith('/vendors/')
    },
  })
  const isRouteChanging = useRouterState({
    select: (s) => {
      if (!s.isLoading) return false
      const resolved = s.resolvedLocation?.pathname ?? s.location.pathname
      return resolved !== s.location.pathname && !s.location.pathname.startsWith('/vendors/')
    },
  })

  useEffect(() => {
    if (document.activeElement !== searchRef.current) {
      setLocalQuery(searchQuery)
    }
  }, [searchQuery])

  useEffect(() => {
    setLocalFeatures(activeFeatures ? activeFeatures.split(',').filter(Boolean) : [])
  }, [activeFeatures])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const { paginatedVendors, totalPages } = useMemo(() => {
    const total = Math.max(1, Math.ceil(vendors.length / PAGE_SIZE))
    const start = (currentPage - 1) * PAGE_SIZE
    const paginated = vendors.slice(start, start + PAGE_SIZE)
    return { paginatedVendors: paginated, totalPages: total }
  }, [vendors, currentPage])

  const currentSearch = useMemo(() => {
    const s: Record<string, string | number | undefined> = {}
    if (searchQuery) s.q = searchQuery
    if (countryFilter) s.country = countryFilter
    if (activeFeatures) s.features = activeFeatures
    return s
  }, [searchQuery, countryFilter, activeFeatures])

  const navTo = activeCompound ? ('/$compound' as const) : ('/' as const)
  const navParams = useMemo(() => activeCompound ? { compound: activeCompound } : undefined, [activeCompound])

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        navigate({ to: navTo, params: navParams, search: { ...currentSearch, q: value || undefined, page: undefined } })
      }, 300)
    },
    [navigate, navTo, navParams, currentSearch],
  )

  const handleCountryChange = useCallback(
    (value: string) => {
      const country = value === 'All Countries' ? undefined : value
      navigate({ to: navTo, params: navParams, search: { ...currentSearch, country, page: undefined } })
    },
    [navigate, navTo, navParams, currentSearch],
  )

  const handleToggleFeature = useCallback(
    (featureId: string) => {
      const next = localFeatures.includes(featureId) ? localFeatures.filter((t) => t !== featureId) : [...localFeatures, featureId]
      setLocalFeatures(next)
      const featuresParam = next.length > 0 ? next.join(',') : undefined
      navigate({ to: navTo, params: navParams, search: { ...currentSearch, features: featuresParam, page: undefined } })
    },
    [navigate, navTo, navParams, currentSearch, localFeatures],
  )

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-lg border border-neutral-200/80 bg-white px-5 py-20 dark:border-white/[0.08] dark:bg-neutral-900">
          {isRouteChanging ? (
            <>
              <div className="h-7 w-72 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              <div className="h-4 w-96 max-w-full rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse mt-1.5" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">{heading}</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl text-pretty mt-1.5">{description}</p>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search"
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value)
                handleSearch(e.target.value)
              }}
              className="w-full rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] pl-9 pr-9 py-2 text-sm placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 focus:border-neutral-300 dark:focus:border-white/20 transition-all backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  const { q, page, ...rest } = currentSearch
                  setLocalQuery('')
                  navigate({ to: navTo, params: navParams, search: rest })
                  searchRef.current?.focus()
                }}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                aria-label="Clear search"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex gap-3 shrink-0 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-40">
              <select
                value={activeCompound || ''}
                onChange={(e) => {
                  const val = e.target.value
                  if (val) {
                    navigate({ to: '/$compound', params: { compound: val }, search: {} })
                  } else {
                    navigate({ to: '/', search: {} })
                  }
                }}
                className="w-full appearance-none rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] pl-4 pr-9 py-2 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all backdrop-blur-sm cursor-pointer dark:[color-scheme:dark]"
              >
                <option value="">All Peptides</option>
                {compounds.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            </div>

            <div className="relative flex-1 sm:flex-none sm:w-40">
              <select
                value={countryFilter || 'All Countries'}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] pl-4 pr-9 py-2 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all backdrop-blur-sm cursor-pointer dark:[color-scheme:dark]"
              >
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            </div>
          </div>
        </div>

        <PillNav items={FEATURE_FILTERS} activeItems={localFeatures} onToggleItem={handleToggleFeature} />

        <section aria-label="Vendor listings">
          <h2 className="sr-only">Vendors</h2>
          {isGridLoading ? <VendorGridSkeleton /> : <VendorGrid data={paginatedVendors} />}
        </section>

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="flex items-center justify-center gap-2 pt-4">
            {currentPage > 1 ? (
              <Link
                to={navTo}
                params={navParams}
                search={{ ...currentSearch, page: currentPage - 1 === 1 ? undefined : currentPage - 1 }}
                className="inline-flex items-center gap-1 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-xl border border-neutral-200/60 dark:border-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-neutral-300 dark:text-neutral-600 cursor-not-allowed">
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </span>
            )}

            <span className="text-sm text-neutral-500 dark:text-neutral-400 tabular-nums px-2">
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                to={navTo}
                params={navParams}
                search={{ ...currentSearch, page: currentPage + 1 }}
                className="inline-flex items-center gap-1 rounded-xl bg-neutral-900 dark:bg-white px-3.5 py-1.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-xl border border-neutral-200/60 dark:border-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-neutral-300 dark:text-neutral-600 cursor-not-allowed">
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </span>
            )}
          </nav>
        )}
      </div>
    </>
  )
}

export function DirectoryListingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="mb-8">
        <div className="h-7 w-72 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="h-4 w-96 max-w-full rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse mt-1.5" />
      </div>
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 items-stretch sm:items-center">
        <div className="h-10 flex-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="h-10 flex-1 sm:w-40 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          <div className="h-10 flex-1 sm:w-40 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        </div>
      </div>
      <div className="flex gap-1.5 overflow-hidden mx-[34px]">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-[33.5px] w-28 shrink-0 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        ))}
      </div>
      <VendorGridSkeleton />
    </div>
  )
}
