import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { getVendorById, getVendorReviews } from '~/lib/data'
import { FEATURE_FILTERS, FEATURE_LABELS, SITE_URL } from '~/lib/constants'
import { ReviewsList, ReviewStars } from '~/components/reviews'
import { breadcrumbSchema, organizationSchema } from '~/lib/schema'
import { BadgeCheckIcon, BitcoinIcon, CircleAlertIcon, ChevronRightIcon, FileIcon } from '~/components/icons'
import { CountryFlag } from '~/components/flags'
import { FavoriteButton } from '~/components/favorite-button'
import { PromoCodeBadge } from '~/components/promo-code'
import { VendorAvatar } from '~/components/vendor-avatar'
import type { Vendor } from '~/lib/types'

function VendorNotFound() {
  return (
    <div className="glass-card-solid py-20 text-center">
      <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center">
        <CircleAlertIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
      </div>
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Vendor not found</h2>
      <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">The vendor you&apos;re looking for doesn&apos;t exist.</p>
    </div>
  )
}

function vendorDescription(vendor: Vendor) {
  return vendor.description
}

type DetailItem = {
  label: string
  icon: ReactNode
}

const FEATURE_FILTER_BY_ID = new Map(FEATURE_FILTERS.map((feature) => [feature.id, feature]))

function isDetailItem(item: DetailItem | undefined): item is DetailItem {
  return Boolean(item)
}

function featureFilterIcon(featureId: string, className: string): ReactNode {
  if (featureId === 'crypto') return <BitcoinIcon className={className} aria-hidden="true" />

  const emoji = FEATURE_FILTER_BY_ID.get(featureId)?.emoji
  return emoji ? <span className="shrink-0" aria-hidden="true">{emoji}</span> : null
}

export const Route = createFileRoute('/vendors/$id')({
  loader: async ({ params: { id } }) => {
    const vendor = await getVendorById({ data: id })
    if (!vendor) throw notFound()
    const reviews = await getVendorReviews({ data: vendor.id })
    return { vendor, reviews }
  },
  head: ({ loaderData }) => {
    const vendor = loaderData?.vendor
    const reviews = loaderData?.reviews
    if (!vendor) return { meta: [], links: [] }
    const pageTitle = `${vendor.name} — Peptide Vendor Profile`
    const pageDescription = vendorDescription(vendor).slice(0, 160)
    const canonicalUrl = `${SITE_URL}/vendors/${vendor.id}`
    const ogImage = `${SITE_URL}/og-image.png`
    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: pageDescription },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: pageDescription },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: ogImage },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: pageDescription },
        { name: 'twitter:image', content: ogImage },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(organizationSchema(vendor, reviews)),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Vendors', url: '/vendors' },
            { name: vendor.name, url: `/vendors/${vendor.id}` },
          ])),
        },
      ],
    }
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    'Vary': 'Accept, Accept-Encoding',
  }),
  pendingComponent: VendorSkeleton,
  component: VendorDetailPage,
  notFoundComponent: VendorNotFound,
})

function Shimmer({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-neutral-100 dark:bg-white/[0.06] ${className ?? ''}`} />
}

function VendorSkeleton() {
  return (
    <div className="pt-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5">
        <Shimmer className="h-4 w-12" />
        <Shimmer className="h-3.5 w-3.5" />
        <Shimmer className="h-4 w-28" />
      </div>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="glass-card-solid overflow-hidden shadow-none p-5">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Shimmer className="h-14 w-14 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-3">
                <Shimmer className="h-7 w-56 max-w-full" />
                <Shimmer className="h-5 w-52 max-w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Shimmer className="h-4 w-full max-w-xl" />
              <Shimmer className="h-4 w-3/4 max-w-md" />
            </div>
            <Shimmer className="h-12 w-full rounded-lg" />
            <Shimmer className="h-11 w-full rounded-lg" />
          </div>
        </div>

        <div className="glass-card-solid overflow-hidden shadow-none p-5">
          <div className="space-y-5">
            <div className="rounded-lg border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden">
              <div className="border-b border-neutral-200/60 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.02] px-4 py-2.5">
                <Shimmer className="h-3.5 w-28" />
              </div>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="grid grid-cols-[1fr_1.4fr] gap-4 border-b border-neutral-200/60 px-4 py-3 last:border-b-0 dark:border-white/[0.06]">
                  <Shimmer className="h-4 w-20" />
                  <Shimmer className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compounds table */}
      <div className="mt-6 glass-card-solid overflow-hidden shadow-none p-5">
        <Shimmer className="h-3 w-28 mb-4" />
        <div className="rounded-lg border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden">
          <div className="border-b border-neutral-200/60 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.02] px-4 py-2.5 flex">
            <Shimmer className="h-3.5 w-16" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-neutral-200/60 dark:border-white/[0.06]">
              <Shimmer className="h-4 w-24" />
              <Shimmer className="h-7 w-14 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Reviews card */}
      <div className="mt-6 glass-card-solid overflow-hidden shadow-none p-5 space-y-6">
        <Shimmer className="h-3 w-16" />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <Shimmer className="h-12 w-20" />
            <Shimmer className="h-5 w-32" />
            <Shimmer className="h-3 w-20" />
          </div>
          <div className="flex-1 space-y-3">
            <Shimmer className="h-4 w-28" />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Shimmer key={i} className="h-7 w-7" />
              ))}
            </div>
            <Shimmer className="h-24 w-full rounded-lg" />
            <Shimmer className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

function VendorDetailPage() {
  const { vendor, reviews } = Route.useLoaderData()
  const detailIconClass = 'h-3.5 w-3.5 shrink-0'
  const paymentFeatures: DetailItem[] = ([
    vendor.acceptsCreditCard ? { label: 'Credit Card', icon: featureFilterIcon('credit-card', detailIconClass) } : undefined,
    vendor.acceptsAch ? { label: 'ACH', icon: featureFilterIcon('ach', detailIconClass) } : undefined,
    vendor.acceptsCrypto ? { label: 'Crypto', icon: featureFilterIcon('crypto', detailIconClass) } : undefined,
  ] as Array<DetailItem | undefined>).filter(isDetailItem)
  const shippingFeatures: DetailItem[] = ([
    vendor.fastShipping ? { label: FEATURE_LABELS['fast-shipping'], icon: featureFilterIcon('fast-shipping', detailIconClass) } : undefined,
    vendor.shipsInternational ? { label: FEATURE_LABELS.international, icon: featureFilterIcon('international', detailIconClass) } : undefined,
  ] as Array<DetailItem | undefined>).filter(isDetailItem)
  const detailItems = (items: DetailItem[]) => (
    <span className="inline-flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          {item.icon}
          {item.label}
        </span>
      ))}
    </span>
  )
  const quickInfoRows = [
    {
      label: 'Status',
      value: vendor.verified ? (
        <span className="inline-flex items-center justify-end gap-1.5">
          <BadgeCheckIcon className={`${detailIconClass} text-sky-500`} aria-hidden="true" />
          Verified
        </span>
      ) : 'Not listed',
      muted: !vendor.verified,
    },
    {
      label: 'Country',
      value: (
        <span className="inline-flex items-center justify-end gap-1.5">
          <CountryFlag country={vendor.country} />
          {vendor.country}
        </span>
      ),
    },
    {
      label: 'COAs',
      value: vendor.hasCoa ? (
        <span className="inline-flex items-center justify-end gap-1.5">
          <FileIcon className={`${detailIconClass} text-emerald-500 dark:text-emerald-300`} aria-hidden="true" />
          {FEATURE_LABELS.coa}
        </span>
      ) : 'Not listed',
      muted: !vendor.hasCoa,
    },
    { label: 'Payments', value: paymentFeatures.length > 0 ? detailItems(paymentFeatures) : 'Not listed', muted: paymentFeatures.length === 0 },
    { label: 'Shipping', value: shippingFeatures.length > 0 ? detailItems(shippingFeatures) : 'Not listed', muted: shippingFeatures.length === 0 },
  ]

  return (
    <div className="pt-6">
      <nav className="mb-6 flex items-center gap-1.5 text-sm">
        <Link
          to="/"
          className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          Home
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 text-neutral-300 dark:text-neutral-600" />
        <Link
          to="/vendors"
          className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          Vendors
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 text-neutral-300 dark:text-neutral-600" />
        <span className="text-neutral-900 dark:text-white font-medium truncate">
          {vendor.name}
        </span>
      </nav>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="glass-card-solid overflow-hidden shadow-none p-5">
          <div className="space-y-4">
            <header className="flex min-w-0 flex-col gap-4">
              <div className="relative flex min-w-0 items-start gap-2 pr-10">
                <div className="flex h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-white/[0.08] dark:bg-white/[0.04]">
                  <VendorAvatar vendor={vendor} />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <h1 className="truncate text-xl font-bold leading-[1.1] text-neutral-950 dark:text-white">
                    {vendor.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-1.5 leading-none">
                    <ReviewStars rating={vendor.rating} size="md" />
                    <span className="text-sm font-semibold leading-none tabular-nums text-neutral-950 dark:text-white">
                      {vendor.rating.toFixed(1)}
                    </span>
                    <span className="text-sm leading-none text-neutral-500 dark:text-neutral-400">
                      {vendor.reviewCount > 0 ? `(${vendor.reviewCount} ${vendor.reviewCount === 1 ? 'review' : 'reviews'})` : '(No reviews)'}
                    </span>
                  </div>
                </div>
                <FavoriteButton vendorId={vendor.id} className="absolute right-0 top-0" />
              </div>
            </header>

            <PromoCodeBadge code={vendor.promoCode} discountPercent={vendor.promoDiscountPercent} fullWidth={false} />

            <p className="max-w-3xl text-base leading-7 text-neutral-500 dark:text-neutral-300">
              {vendor.description}
            </p>

            <a
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-black px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              View Website
            </a>
          </div>
        </div>

        <aside className="glass-card-solid overflow-hidden shadow-none p-5">
          <div className="space-y-5">
            <div className="rounded-lg border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200/60 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.02]">
                    <th colSpan={2} className="px-4 py-2.5 text-left text-sm font-bold text-neutral-900 dark:text-white">
                      Vendor Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/60 dark:divide-white/[0.06]">
                  {quickInfoRows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row" className="px-4 py-3 text-left text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                        {row.label}
                      </th>
                      <td className={`px-4 py-3 text-right text-sm font-semibold leading-5 ${row.muted ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-900 dark:text-white'}`}>
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </aside>
      </section>

      {/* Compounds table */}
      {vendor.compoundNames.length > 0 && (
        <section className="mt-6 glass-card-solid overflow-hidden shadow-none p-5">
          <div className="rounded-lg border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <colgroup>
                <col />
                <col className="w-40" />
              </colgroup>
              <thead>
                <tr className="border-b border-neutral-200/60 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.02]">
                  <th className="px-4 py-2.5 text-left text-sm font-bold text-neutral-900 dark:text-white">Available Peptides</th>
                  <th className="px-4 py-2.5 text-right text-sm font-bold text-neutral-900 dark:text-white" aria-label="Vendor link" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60 dark:divide-white/[0.06]">
                {vendor.compoundNames.map((compoundName, index) => {
                  const compoundSlug = vendor.compoundSlugs[index]
                  if (!compoundSlug) return null

                  return (
                    <tr key={compoundSlug} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-200">
                        <Link
                          to="/peptides/$compound"
                          params={{ compound: compoundSlug }}
                          className="hover:underline"
                        >
                          {compoundName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={vendor.website}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 dark:bg-white px-3 py-1.5 text-xs font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                        >
                          Buy
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Reviews card */}
      <div className="mt-6 glass-card-solid overflow-hidden shadow-none p-5 space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Reviews
        </h2>
        <ReviewsList reviews={reviews} vendorId={vendor.id} />
      </div>
    </div>
  )
}
