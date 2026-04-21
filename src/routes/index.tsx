import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BitcoinIcon, ChevronDownIcon, ChevronRightIcon, FileIcon, SearchIcon, TrendingUpIcon, XIcon } from '~/components/icons'
import { FeaturedResources } from '~/components/featured-resources'
import { PeptideGrid } from '~/components/peptide-grid'
import { VendorGrid } from '~/components/vendor-grid'
import { withVendorCounts } from '~/lib/compound-counts'
import { SITE_URL } from '~/lib/constants'
import { breadcrumbSchema, itemListSchema, siteSearchSchema } from '~/lib/schema'
import { getCompounds, getFeaturedVendors, getVendorCompoundOptions } from '~/lib/data'

const quickFilterLinkClass = 'inline-flex shrink-0 items-center rounded-lg border border-neutral-200/60 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-neutral-900 backdrop-blur-sm transition-all hover:bg-white hover:text-neutral-500 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] dark:hover:text-neutral-400'

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
      navigate({ to: '/vendors', search: { compound: value || undefined } })
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
    <div>
      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm dark:bg-white dark:text-neutral-950">
              <span className="mr-1.5" aria-hidden="true">🧪</span>
              Peptide Research
            </div>
            <h1 className="mx-auto max-w-2xl text-3xl font-[900] font-stretch-semi-expanded capitalize leading-tight tracking-[-1px] text-neutral-950 dark:text-white sm:text-4xl">
              Find trusted peptide vendors
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-neutral-600 dark:text-neutral-300">
              Compare vendor ratings, promo codes, COAs, payment methods, and peptide availability in one focused research directory.
            </p>
          </div>

          <div className="mx-auto w-full max-w-2xl space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div role="search" className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search vendors, peptides..."
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

              <div className="flex w-full shrink-0 gap-3 sm:w-auto">
                <div className="relative flex-1 sm:w-44 sm:flex-none">
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

                <div className="relative flex-1 sm:w-44 sm:flex-none">
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
            </div>

            <QuickFilterNav />
          </div>
        </div>
      </section>

      <section className="space-y-5 border-b border-neutral-200/80 pb-6 dark:border-white/[0.08]" aria-label="Featured vendors">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-[800] font-stretch-semi-expanded leading-tight tracking-[-1px] text-neutral-950 dark:text-white">Featured Vendors</h2>
          <Link
            to="/vendors"
            className="inline-flex items-center text-sm font-medium leading-tight text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
          >
            All Vendors
            <ChevronRightIcon className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
        <VendorGrid
          data={vendors}
          emptyTitle="No featured vendors yet"
          emptyDescription="Browse the full vendor directory while featured vendors are being selected."
        />
      </section>

      <section className="mt-6 space-y-5 border-b border-neutral-200/80 pb-6 dark:border-white/[0.08]" aria-label="Featured peptides">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-[800] font-stretch-semi-expanded leading-tight tracking-[-1px] text-neutral-950 dark:text-white">Featured Peptides</h2>
          <Link
            to="/peptides"
            className="inline-flex items-center text-sm font-medium leading-tight text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
          >
            All Peptides
            <ChevronRightIcon className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
        <PeptideGrid
          data={compounds}
          emptyTitle="No featured peptides yet"
          emptyDescription="Browse the peptide directory while featured peptides are being selected."
        />
      </section>

      <div className="mt-6">
        <FeaturedResources />
      </div>
    </div>
  )
}

function QuickFilterNav() {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-neutral-950 dark:text-white">
        <TrendingUpIcon className="h-4 w-4" />
        Trending
      </div>

      <nav
        className="quick-filter-marquee min-w-0 flex-1 overflow-hidden py-1"
        data-paused={isPaused ? 'true' : undefined}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onTouchCancel={() => setIsPaused(false)}
        aria-label="Popular filters"
      >
        <div className="quick-filter-marquee-track flex w-max">
          <QuickFilterLinkSet />
          <QuickFilterLinkSet duplicate />
        </div>
      </nav>
    </div>
  )
}

function QuickFilterLinkSet({ duplicate = false }: { duplicate?: boolean }) {
  const duplicateProps = duplicate ? { 'aria-hidden': true, tabIndex: -1 } : {}

  return (
    <div className="flex shrink-0 gap-3 pr-3">
      <Link to="/vendors" search={{ features: 'coa' }} className={quickFilterLinkClass} {...duplicateProps}>
        <FileIcon className="mr-1.5 h-4 w-4 shrink-0 text-emerald-500" />
        COAs
      </Link>
      <Link to="/vendors" search={{ features: 'international' }} className={quickFilterLinkClass} {...duplicateProps}>
        <span className="mr-1.5 shrink-0" aria-hidden="true">🌍</span>
        International Shipping
      </Link>
      <Link to="/peptides" search={{ categories: 'weight-loss' }} className={quickFilterLinkClass} {...duplicateProps}>
        <span className="mr-1.5 shrink-0" aria-hidden="true">🏋️</span>
        Weight Loss
      </Link>
      <Link to="/vendors" search={{ compound: 'bpc-157' }} className={quickFilterLinkClass} {...duplicateProps}>
        <span className="mr-1.5 shrink-0" aria-hidden="true">🧬</span>
        BPC-157
      </Link>
      <Link to="/peptides" search={{ categories: 'cosmetic' }} className={quickFilterLinkClass} {...duplicateProps}>
        <span className="mr-1.5 shrink-0" aria-hidden="true">✨</span>
        Cosmetic
      </Link>
      <Link to="/peptides" search={{ categories: 'focus' }} className={quickFilterLinkClass} {...duplicateProps}>
        <span className="mr-1.5 shrink-0" aria-hidden="true">🧠</span>
        Focus
      </Link>
      <Link to="/vendors" search={{ features: 'crypto' }} className={quickFilterLinkClass} {...duplicateProps}>
        <BitcoinIcon className="mr-1.5 h-4 w-4 shrink-0" />
        Crypto Accepted
      </Link>
      <Link to="/vendors" search={{ features: 'promo-code' }} className={quickFilterLinkClass} {...duplicateProps}>
        <span className="mr-1.5 shrink-0" aria-hidden="true">🏷️</span>
        Promo Code
      </Link>
    </div>
  )
}
