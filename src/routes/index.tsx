import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BitcoinIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, FileIcon, SearchIcon, XIcon } from '~/components/icons'
import { PeptideGrid } from '~/components/peptide-grid'
import { VendorGrid } from '~/components/vendor-grid'
import { withVendorCounts } from '~/lib/compound-counts'
import { SITE_URL } from '~/lib/constants'
import { breadcrumbSchema, itemListSchema, siteSearchSchema } from '~/lib/schema'
import { getCompounds, getFeaturedVendors, getVendorCompoundOptions } from '~/lib/data'

const quickFilterLinkClass = 'inline-flex shrink-0 items-center rounded-lg border border-neutral-200/60 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-neutral-900 backdrop-blur-sm transition-all hover:bg-white hover:text-neutral-500 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] dark:hover:text-neutral-400'

function quickFilterArrowClass(active: boolean) {
  return `absolute z-10 flex h-[33.5px] w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200/60 bg-white text-neutral-500 transition-colors hover:text-neutral-900 dark:border-white/[0.06] dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white ${
    active ? 'cursor-pointer' : 'pointer-events-none'
  }`
}

export const Route = createFileRoute('/')({
  loader: async () => {
    const [vendors, allCompounds, vendorOptions] = await Promise.all([
      getFeaturedVendors(),
      getCompounds(),
      getVendorCompoundOptions(),
    ])
    const compoundsWithVendorCounts = withVendorCounts(allCompounds, vendorOptions)
    return {
      vendors,
      compounds: compoundsWithVendorCounts.filter((compound) => compound.featured),
      compoundOptions: allCompounds,
      vendorOptions,
    }
  },
  head: ({ loaderData }) => {
    const pageTitle = 'Peptide Vendor Directory - Featured Peptide Vendors'
    const pageDescription = 'Compare featured peptide vendors with ratings, promo codes, and vendor details from the Peptide Vendor Directory.'
    const canonicalUrl = `${SITE_URL}/`

    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: pageDescription },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: pageDescription },
        { property: 'og:url', content: canonicalUrl },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: pageDescription },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        { type: 'application/ld+json', children: JSON.stringify(siteSearchSchema()) },
        ...(loaderData?.vendors
          ? [{ type: 'application/ld+json' as const, children: JSON.stringify(itemListSchema(loaderData.vendors, 'Featured Peptide Vendors', '/')) }]
          : []),
        ...(loaderData?.compounds
          ? [{
              type: 'application/ld+json' as const,
              children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Featured Peptides',
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
        { type: 'application/ld+json', children: JSON.stringify(breadcrumbSchema([{ name: 'Home', url: '/' }])) },
      ],
    }
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    'Vary': 'Accept, Accept-Encoding',
  }),
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const { vendors, compounds, compoundOptions, vendorOptions } = Route.useLoaderData()
  const [query, setQuery] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        navigate({ to: '/vendors', search: { q: value || undefined } })
      }, 300)
    },
    [navigate],
  )

  const handlePeptideChange = useCallback(
    (value: string) => {
      if (value) {
        navigate({ to: '/peptides/$compound', params: { compound: value }, search: {} })
      } else {
        navigate({ to: '/vendors', search: {} })
      }
    },
    [navigate],
  )

  const handleVendorChange = useCallback(
    (value: string) => {
      navigate({ to: '/peptides', search: { vendor: value || undefined } })
    },
    [navigate],
  )

  return (
    <div className="space-y-6">
      <section className="py-8">
        <div className="max-w-3xl">
          <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-neutral-950 dark:text-white sm:text-4xl">
            Find trusted peptide vendors faster
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-neutral-600 dark:text-neutral-300">
            Compare vendor ratings, promo codes, COAs, payment methods, and peptide availability in one focused research directory.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/vendors"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-neutral-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 sm:w-auto"
            >
              Browse Vendors
            </Link>
            <a
              href="#"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-neutral-200/80 bg-white/70 px-5 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition-colors hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.10] sm:w-auto"
            >
              Join Community
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-3" aria-label="Featured vendors">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div role="search" className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(event) => handleSearch(event.target.value)}
              className="w-full rounded-lg border border-neutral-200/60 bg-white/70 py-2 pl-9 pr-9 text-sm text-neutral-900 placeholder-neutral-400 backdrop-blur-sm transition-all focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-white dark:placeholder-neutral-500 dark:focus:border-white/20 dark:focus:ring-white/10"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  if (debounceRef.current) clearTimeout(debounceRef.current)
                  setQuery('')
                }}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                aria-label="Clear search"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-44">
            <select
              defaultValue=""
              onChange={(event) => handlePeptideChange(event.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-neutral-200/60 bg-white/70 py-2 pl-4 pr-9 text-sm text-neutral-700 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-neutral-300 dark:[color-scheme:dark] dark:focus:ring-white/10"
            >
              <option value="">All Peptides</option>
              {compoundOptions.map((compound) => (
                <option key={compound.id} value={compound.id}>{compound.name}</option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          </div>

          <div className="relative w-full sm:w-44">
            <select
              defaultValue=""
              onChange={(event) => handleVendorChange(event.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-neutral-200/60 bg-white/70 py-2 pl-4 pr-9 text-sm text-neutral-700 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-neutral-300 dark:[color-scheme:dark] dark:focus:ring-white/10"
            >
              <option value="">All Vendors</option>
              {vendorOptions.map((vendorOption) => (
                <option key={vendorOption.id} value={vendorOption.id}>{vendorOption.name}</option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          </div>
        </div>

        <QuickFilterNav />

        <div className="flex items-end justify-between gap-3 border-b border-neutral-200/80 pb-3 dark:border-white/[0.08]">
          <h2 className="text-xl font-semibold leading-none tracking-tight text-neutral-950 dark:text-white">Featured Vendors</h2>
          <Link
            to="/vendors"
            className="text-sm font-normal text-neutral-900 transition-colors hover:text-neutral-500 dark:text-white dark:hover:text-neutral-400"
          >
            View All
          </Link>
        </div>
        <VendorGrid
          data={vendors}
          emptyTitle="No featured vendors yet"
          emptyDescription="Browse the full vendor directory while featured vendors are being selected."
        />
      </section>

      <section className="space-y-3" aria-label="Featured peptides">
        <div className="flex items-center justify-between gap-3 border-b border-neutral-200/80 pb-3 dark:border-white/[0.08]">
          <h2 className="text-xl font-semibold leading-none tracking-tight text-neutral-950 dark:text-white">Featured Peptides</h2>
          <Link
            to="/peptides"
            className="text-sm font-normal text-neutral-900 transition-colors hover:text-neutral-500 dark:text-white dark:hover:text-neutral-400"
          >
            View All
          </Link>
        </div>
        <PeptideGrid
          data={compounds}
          emptyTitle="No featured peptides yet"
          emptyDescription="Browse the peptide directory while featured peptides are being selected."
        />
      </section>
    </div>
  )
}

function QuickFilterNav() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={() => scroll('left')}
        className={`${quickFilterArrowClass(canScrollLeft)} -left-1`}
        aria-label="Scroll popular filters left"
      >
        <ChevronLeftIcon className="h-3.5 w-3.5" />
      </button>

      <nav
        ref={scrollRef}
        className="mx-[34px] flex gap-1.5 overflow-x-auto py-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        aria-label="Popular filters"
      >
        <Link to="/vendors" search={{ features: 'coa' }} className={quickFilterLinkClass}>
          <FileIcon className="mr-1.5 h-4 w-4 shrink-0 text-emerald-500" />
          COAs
        </Link>
        <Link to="/vendors" search={{ features: 'international' }} className={quickFilterLinkClass}>
          <span className="mr-1.5 shrink-0" aria-hidden="true">🌍</span>
          International Shipping
        </Link>
        <Link to="/peptides" search={{ categories: 'weight-loss' }} className={quickFilterLinkClass}>
          <span className="mr-1.5 shrink-0" aria-hidden="true">🏋️</span>
          Weight Loss
        </Link>
        <Link to="/peptides/$compound" params={{ compound: 'bpc-157' }} className={quickFilterLinkClass}>
          <span className="mr-1.5 shrink-0" aria-hidden="true">🧬</span>
          BPC-157
        </Link>
        <Link to="/peptides" search={{ categories: 'cosmetic' }} className={quickFilterLinkClass}>
          <span className="mr-1.5 shrink-0" aria-hidden="true">✨</span>
          Cosmetic
        </Link>
        <Link to="/peptides" search={{ categories: 'focus' }} className={quickFilterLinkClass}>
          <span className="mr-1.5 shrink-0" aria-hidden="true">🧠</span>
          Focus
        </Link>
        <Link to="/vendors" search={{ features: 'crypto' }} className={quickFilterLinkClass}>
          <BitcoinIcon className="mr-1.5 h-4 w-4 shrink-0" />
          Crypto Accepted
        </Link>
        <Link to="/vendors" search={{ features: 'promo-code' }} className={quickFilterLinkClass}>
          <span className="mr-1.5 shrink-0" aria-hidden="true">🏷️</span>
          Promo Code
        </Link>
      </nav>

      <button
        type="button"
        onClick={() => scroll('right')}
        className={`${quickFilterArrowClass(canScrollRight)} -right-1`}
        aria-label="Scroll popular filters right"
      >
        <ChevronRightIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
