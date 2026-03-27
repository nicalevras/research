import type { VendorCategory } from '~/lib/types'
import { CATEGORIES } from '~/lib/constants'
import { filterVendors } from '~/lib/data'
import { PillNav } from '~/components/pill-nav'
import { DataTable } from '~/components/data-table'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useRef, useCallback, useEffect, useState } from 'react'
import {
  JsonLd,
  itemListSchema,
  breadcrumbSchema,
} from '~/lib/schema'

const VALID_CATEGORIES = CATEGORIES.filter((c) => c.value !== 'all').map((c) => c.value)

interface DirectoryListingProps {
  category: VendorCategory
  heading: string
  description: string
  searchQuery: string
}

export function DirectoryListing({ category, heading, description, searchQuery }: DirectoryListingProps) {
  const navigate = useNavigate()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [localQuery, setLocalQuery] = useState(searchQuery)

  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const { vendors, counts } = useMemo(() => {
    const filtered = filterVendors({ category, q: searchQuery })
    const c: Record<string, number> = {
      all: filterVendors({ q: searchQuery }).length,
    }
    for (const cat of VALID_CATEGORIES) {
      c[cat] = filterVendors({ category: cat, q: searchQuery }).length
    }
    return { vendors: filtered, counts: c }
  }, [category, searchQuery])

  const path = category === 'all' ? '/' : `/${category}`
  const crumbs =
    category === 'all'
      ? [{ name: 'Home', url: '/' }]
      : [
          { name: 'Home', url: '/' },
          { name: heading, url: path },
        ]

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const currentPath = category === 'all' ? '/' as const : '/$category' as const
        const params = category === 'all' ? undefined : { category }
        navigate({
          to: currentPath,
          params,
          search: { q: value || undefined },
        })
      }, 300)
    },
    [navigate, category],
  )

  return (
    <>
      <JsonLd data={itemListSchema(vendors, heading, path)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <div className="space-y-8">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">{heading}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl text-balance">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <PillNav
            current={category}
            searchQuery={searchQuery}
            counts={counts}
          />

          <div className="w-full sm:w-64">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
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
                    const currentPath = category === 'all' ? '/' as const : '/$category' as const
                    const params = category === 'all' ? undefined : { category }
                    navigate({ to: currentPath, params, search: {} })
                    searchRef.current?.focus()
                  }}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <DataTable data={vendors} />
      </div>
    </>
  )
}
