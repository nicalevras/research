import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getVendorById, getVendorReviews } from '~/lib/data'
import { getVendorFeatureLabels, SITE_URL } from '~/lib/constants'
import { StarRating } from '~/components/vendor-ui'
import { ReviewsList } from '~/components/reviews'
import { breadcrumbSchema, organizationSchema } from '~/lib/schema'
import { CircleAlertIcon, ChevronRightIcon, ShoppingCartIcon } from '~/components/icons'
import { CountryFlag } from '~/components/flags'
import { FavoriteButton } from '~/components/favorite-button'
import { PromoCodeBadge } from '~/components/promo-code'
import type { Vendor } from '~/lib/types'

function VendorNotFound() {
  return (
    <div className="glass-card-solid py-20 text-center">
      <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center">
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
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5">
        <Shimmer className="h-4 w-12" />
        <Shimmer className="h-3.5 w-3.5" />
        <Shimmer className="h-4 w-28" />
      </div>

      <div className="glass-card-solid overflow-hidden shadow-none">
        {/* Vendor info */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <Shimmer className="shrink-0 w-full sm:w-80 aspect-video rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <Shimmer className="h-8 w-56" />
                <Shimmer className="hidden sm:block h-10 w-32 rounded-xl" />
              </div>
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-4 w-24" />
              <div className="space-y-2 pt-1">
                <Shimmer className="h-4 w-full max-w-xl" />
                <Shimmer className="h-4 w-3/4 max-w-md" />
              </div>
              <Shimmer className="sm:hidden h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Compounds table */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <Shimmer className="h-3 w-28 mb-4" />
          <div className="rounded-xl border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden">
            <div className="border-b border-neutral-200/60 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.02] px-4 py-2.5 flex">
              <Shimmer className="h-3.5 w-16" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-neutral-200/60 dark:border-white/[0.06]">
                <Shimmer className="h-4 w-24" />
                <Shimmer className="h-7 w-14 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews card */}
      <div className="mt-6 glass-card-solid overflow-hidden shadow-none p-6 sm:p-8 space-y-6">
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
            <Shimmer className="h-24 w-full rounded-xl" />
            <Shimmer className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

function VendorDetailPage() {
  const { vendor, reviews } = Route.useLoaderData()
  const features = getVendorFeatureLabels(vendor)

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-sm">
        <Link
          to="/"
          className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          Home
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 text-neutral-300 dark:text-neutral-600" />
        <span className="text-neutral-900 dark:text-white font-medium truncate">
          {vendor.name}
        </span>
      </nav>

      <div className="glass-card-solid overflow-hidden shadow-none">
        {/* Vendor info */}
        <div className="p-6 sm:p-8">
          <div className="space-y-4">
            <div className="min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {vendor.name}
                </h1>
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  <FavoriteButton vendorId={vendor.id} variant="button" />
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                    Shop Now
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <StarRating rating={vendor.rating} />
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {vendor.reviewCount > 0
                    ? `(${vendor.reviewCount} ${vendor.reviewCount === 1 ? 'review' : 'reviews'})`
                    : '(No reviews)'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                <CountryFlag country={vendor.country} />
                <span>{vendor.country}</span>
              </div>
              <p className="max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                {vendor.description}
              </p>
              <PromoCodeBadge code={vendor.promoCode} discountPercent={vendor.promoDiscountPercent} />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {features.map((feature) => (
                  <span key={feature} className="rounded-lg bg-neutral-100 dark:bg-white/[0.06] px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="sm:hidden grid grid-cols-2 gap-3 mt-2">
                <FavoriteButton vendorId={vendor.id} variant="button" className="w-full" />
                <a
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Compounds table */}
        {vendor.compoundNames.length > 0 && (
          <section className="px-6 sm:px-8 pb-6 sm:pb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4">Available Peptides</h2>
            <div className="rounded-xl border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden">
              <table className="w-full text-[13px] border-collapse">
                <colgroup>
                  <col />
                  <col className="w-40" />
                </colgroup>
                <thead>
                  <tr className="border-b border-neutral-200/60 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.02]">
                    <th className="px-4 py-2.5 text-left text-[13px] font-bold text-neutral-500 dark:text-neutral-400">Peptide</th>
                    <th className="px-4 py-2.5 text-right text-[13px] font-bold text-neutral-500 dark:text-neutral-400">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/60 dark:divide-white/[0.06]">
                  {vendor.compoundNames.map((compoundName, index) => (
                    <tr key={`${compoundName}-${index}`} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-200">
                        <Link
                          to="/$compound"
                          params={{ compound: vendor.compoundSlugs[index] }}
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
                          className="inline-flex items-center justify-center rounded-xl bg-neutral-900 dark:bg-white px-3 py-1.5 text-xs font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                        >
                          Buy
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </div>

      {/* Reviews card */}
      <div className="mt-6 glass-card-solid overflow-hidden shadow-none p-6 sm:p-8 space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Reviews
        </h2>
        <ReviewsList reviews={reviews} vendorId={vendor.id} />
      </div>
    </div>
  )
}
