import type { Compound, VendorSummary } from '~/lib/types'
import { FEATURE_FILTERS } from '~/lib/constants'
import { PillNav } from '~/components/pill-nav'
import { VendorGrid, VendorGridSkeleton } from '~/components/vendor-grid'
import { SearchIcon, XIcon, ChevronDownIcon } from '~/components/icons'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useMemo, useRef, useCallback, useEffect, useState } from 'react'

interface DirectoryListingProps {
  heading: string
  description: string
  resultSummary: string
  searchQuery: string
  vendors: VendorSummary[]
  compounds: Compound[]
  activeFeatures: string
  activeCompound: string
  activeCompoundProfile?: Compound
}

export function DirectoryListing({ heading, description, resultSummary, searchQuery, vendors, compounds, activeFeatures, activeCompound, activeCompoundProfile }: DirectoryListingProps) {
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

  const currentSearch = useMemo(() => {
    const s: Record<string, string | undefined> = {}
    if (searchQuery) s.q = searchQuery
    if (activeFeatures) s.features = activeFeatures
    if (activeCompound) s.peptide = activeCompound
    return s
  }, [searchQuery, activeFeatures, activeCompound])

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        navigate({ to: '/vendors', search: { ...currentSearch, q: value || undefined } })
      }, 300)
    },
    [navigate, currentSearch],
  )

  const handleToggleFeature = useCallback(
    (featureId: string) => {
      const next = localFeatures.includes(featureId) ? [] : [featureId]
      setLocalFeatures(next)
      const featuresParam = next.length > 0 ? next.join(',') : undefined
      navigate({ to: '/vendors', search: { ...currentSearch, features: featuresParam } })
    },
    [navigate, currentSearch, localFeatures],
  )

  return (
    <>
      <div>
        <div className="py-16">
          {isRouteChanging ? (
            <div className="mx-auto max-w-3xl">
              <div className="mx-auto h-9 w-72 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              <div className="mx-auto mt-4 h-4 w-96 max-w-full rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          ) : (
            <div className="max-w-3xl">
              <h1 className="max-w-2xl text-3xl font-[900] font-stretch-semi-expanded capitalize leading-tight tracking-[-1px] text-neutral-950 dark:text-white sm:text-4xl">{heading}</h1>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-neutral-600 dark:text-neutral-300">
                {description}
                {activeCompoundProfile && (
                  <>
                    {' '}
                    Learn more about{' '}
                    <Link
                      to="/peptides/$compound"
                      params={{ compound: activeCompoundProfile.id }}
                      className="font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-600 dark:text-white dark:decoration-white/30 dark:hover:text-neutral-300"
                    >
                      {activeCompoundProfile.name}
                    </Link>
                    .
                  </>
                )}
              </p>
              <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {resultSummary}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search vendors..."
              aria-label="Search vendors"
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value)
                handleSearch(e.target.value)
              }}
              className="w-full rounded-lg border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] pl-9 pr-9 py-2 text-sm placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 focus:border-neutral-300 dark:focus:border-white/20 transition-all backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  const { q, ...rest } = currentSearch
                  setLocalQuery('')
                  navigate({ to: '/vendors', search: rest })
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
              <label htmlFor="vendor-directory-peptide-filter" className="sr-only">
                Filter vendors by peptide
              </label>
              <select
                id="vendor-directory-peptide-filter"
                value={activeCompound || ''}
                onChange={(e) => {
                  const val = e.target.value
                  navigate({ to: '/vendors', search: { ...currentSearch, peptide: val || undefined } })
                }}
                className="native-select w-full appearance-none rounded-lg border border-neutral-200/60 bg-white/70 py-2 pl-4 pr-9 text-sm text-neutral-700 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-neutral-300 dark:focus:ring-white/10 cursor-pointer"
              >
                <option value="">All Peptides</option>
                {compounds.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <PillNav items={FEATURE_FILTERS} activeItems={localFeatures} onToggleItem={handleToggleFeature} />
        </div>

        <section className="mt-4" aria-label="Vendor listings">
          <h2 className="sr-only">Vendors</h2>
          {isGridLoading ? <VendorGridSkeleton /> : <VendorGrid data={vendors} />}
        </section>
      </div>
    </>
  )
}
