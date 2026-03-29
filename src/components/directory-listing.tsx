import type { Vendor, VendorCategory } from '~/lib/types'
import { CATEGORIES, COUNTRIES, TAGS } from '~/lib/constants'
import { PillNav } from '~/components/pill-nav'
import { VendorGrid } from '~/components/vendor-grid'
import { SearchIcon, XIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '~/components/icons'
import { useNavigate, Link } from '@tanstack/react-router'
import { useMemo, useRef, useCallback, useEffect, useState } from 'react'
import { JsonLd, itemListSchema, breadcrumbSchema } from '~/lib/schema'

const PAGE_SIZE = 15

interface DirectoryListingProps {
  category: VendorCategory
  heading: string
  description: string
  searchQuery: string
  countryFilter: string
  currentPage: number
  vendors: Vendor[]
  activeTags: string
}

export function DirectoryListing({ category, heading, description, searchQuery, countryFilter, currentPage, vendors, activeTags }: DirectoryListingProps) {
  const navigate = useNavigate()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [localQuery, setLocalQuery] = useState(searchQuery)

  const activeTagList = useMemo(() => activeTags ? activeTags.split(',').filter(Boolean) : [], [activeTags])

  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

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

  const path = category === 'all' ? '/' : `/${category}`
  const crumbs =
    category === 'all'
      ? [{ name: 'Home', url: '/' }]
      : [
          { name: 'Home', url: '/' },
          { name: heading, url: path },
        ]

  const currentSearch = useMemo(() => {
    const s: Record<string, string | number | undefined> = {}
    if (searchQuery) s.q = searchQuery
    if (countryFilter) s.country = countryFilter
    if (activeTags) s.tags = activeTags
    return s
  }, [searchQuery, countryFilter, activeTags])

  const navTo = category === 'all' ? ('/' as const) : ('/$category' as const)
  const navParams = category === 'all' ? undefined : { category }

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

  const handleToggleTag = useCallback(
    (tagId: string) => {
      const current = activeTagList.includes(tagId)
        ? activeTagList.filter((t) => t !== tagId)
        : [...activeTagList, tagId]
      const tagsParam = current.length > 0 ? current.join(',') : undefined
      navigate({ to: navTo, params: navParams, search: { ...currentSearch, tags: tagsParam, page: undefined } })
    },
    [navigate, navTo, navParams, currentSearch, activeTagList],
  )

  return (
    <>
      <JsonLd data={itemListSchema(paginatedVendors, heading, path)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <div className="space-y-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">{heading}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl text-pretty">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search vendors..."
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value)
                handleSearch(e.target.value)
              }}
              className="w-full rounded-full border border-neutral-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.04] pl-9 pr-9 py-2 text-sm placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 focus:border-neutral-300 dark:focus:border-white/20 transition-all backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  const { q, page, ...rest } = currentSearch
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

          <div className="flex gap-3 shrink-0">
            <div className="relative w-40">
              <select
                value={countryFilter || 'All Countries'}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full appearance-none rounded-full border border-neutral-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.04] pl-4 pr-9 py-2 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all backdrop-blur-sm cursor-pointer"
              >
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            </div>

            <div className="relative w-40">
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value as VendorCategory
                  if (val === 'all') {
                    navigate({ to: '/', search: { q: searchQuery || undefined, country: countryFilter || undefined, tags: activeTags || undefined } })
                  } else {
                    navigate({ to: '/$category', params: { category: val }, search: { q: searchQuery || undefined, country: countryFilter || undefined, tags: activeTags || undefined } })
                  }
                }}
                className="w-full appearance-none rounded-full border border-neutral-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.04] pl-4 pr-9 py-2 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all backdrop-blur-sm cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            </div>
          </div>
        </div>

        <PillNav tags={TAGS} activeTags={activeTagList} onToggleTag={handleToggleTag} />

        <VendorGrid data={paginatedVendors} />

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="flex items-center justify-center gap-2 pt-4">
            {currentPage > 1 ? (
              <Link
                to={navTo}
                params={navParams}
                search={{ ...currentSearch, page: currentPage - 1 === 1 ? undefined : currentPage - 1 }}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200/60 dark:border-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200/60 dark:border-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-neutral-300 dark:text-neutral-600 cursor-not-allowed">
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
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200/60 dark:border-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors"
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200/60 dark:border-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-neutral-300 dark:text-neutral-600 cursor-not-allowed">
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
