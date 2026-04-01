import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getVendorById, getVendorCompounds, getVendorReviews } from '~/lib/data'
import { SITE_URL } from '~/lib/constants'
import { StarRating } from '~/components/vendor-ui'
import { ReviewsList } from '~/components/reviews'
import { breadcrumbSchema, organizationSchema, reviewSchema } from '~/lib/schema'
import { CircleAlertIcon, ChevronRightIcon, ExternalLinkIcon, ShoppingCartIcon } from '~/components/icons'
import { CountryFlag } from '~/components/flags'

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

export const Route = createFileRoute('/vendors/$id')({
  loader: async ({ params: { id } }) => {
    const vendor = await getVendorById({ data: id })
    if (!vendor) throw notFound()
    const [compounds, reviews] = await Promise.all([
      getVendorCompounds({ data: vendor.id }),
      getVendorReviews({ data: vendor.id }),
    ])
    return { vendor, compounds, reviews }
  },
  head: ({ loaderData }) => {
    const vendor = loaderData?.vendor
    const reviews = loaderData?.reviews
    if (!vendor) return { meta: [], links: [] }
    const pageTitle = `${vendor.name} — Peptide Vendor Profile`
    const pageDescription = vendor.description.slice(0, 160)
    const canonicalUrl = `${SITE_URL}/vendors/${vendor.id}`
    const ogImage = vendor.imageUrl || `${SITE_URL}/og-image.png`
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
          children: JSON.stringify(organizationSchema(vendor)),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: vendor.name, url: `/vendors/${vendor.id}` },
          ])),
        },
        ...(reviews && reviews.length > 0
          ? reviews.map((r) => ({
              type: 'application/ld+json' as const,
              children: JSON.stringify(reviewSchema(r, vendor.name)),
            }))
          : []),
      ],
    }
  },
  pendingComponent: VendorSkeleton,
  component: VendorDetailPage,
  notFoundComponent: VendorNotFound,
})

function Shimmer({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-neutral-100 dark:bg-white/[0.06] ${className ?? ''}`} />
}

function VendorSkeleton() {
  return (
    <div className="space-y-6">
      <Shimmer className="h-4 w-28" />
      <div className="glass-card-solid overflow-hidden shadow-none">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <Shimmer className="shrink-0 w-full sm:w-80 aspect-video rounded-xl" />
            <div className="flex-1 space-y-3">
              <Shimmer className="h-8 w-56" />
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-4 w-24" />
              <div className="space-y-2 pt-1">
                <Shimmer className="h-4 w-full max-w-xl" />
                <Shimmer className="h-4 w-3/4 max-w-md" />
              </div>
            </div>
          </div>
        </div>
        <div className="h-px bg-neutral-100 dark:bg-white/[0.04]" />
        <div className="p-6 sm:p-8 pb-0 sm:pb-0">
          <Shimmer className="h-3 w-28" />
        </div>
        <div className="mt-4 divide-y divide-neutral-200/60 dark:divide-white/[0.06]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between px-6 sm:px-8 py-3">
              <Shimmer className="h-4 w-24" />
              <Shimmer className="h-3 w-16" />
            </div>
          ))}
        </div>
        <div className="h-px bg-neutral-100 dark:bg-white/[0.04]" />
        <div className="p-6 sm:p-8 space-y-6">
          <Shimmer className="h-3 w-16" />
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 py-4">
              <Shimmer className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-4 w-20" />
                <Shimmer className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function VendorDetailPage() {
  const { vendor, compounds, reviews } = Route.useLoaderData()

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
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="shrink-0 w-full sm:w-80 aspect-video rounded-xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden">
              {vendor.imageUrl && (
                <img src={vendor.imageUrl} alt={vendor.name} width={640} height={360} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {vendor.name}
                </h1>
                <a
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shrink-0"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  Shop Now
                </a>
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
              <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-2xl text-pretty">
                {vendor.description}
              </p>
              <a
                href={vendor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors mt-2"
              >
                <ShoppingCartIcon className="h-4 w-4" />
                Shop Now
              </a>
            </div>
          </div>
        </div>

        {/* Compounds table */}
        {compounds.length > 0 && (
          <section className="px-6 sm:px-8 pb-6 sm:pb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4">Available Peptides</h2>
            <div className="rounded-xl border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden">
              <table className="w-full text-[13px] border-collapse">
                <colgroup>
                  <col className="w-1/2" />
                  <col />
                  <col className="w-1/2" />
                </colgroup>
                <thead>
                  <tr className="border-b border-neutral-200/60 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.02]">
                    <th className="px-4 py-2.5 text-left text-[13px] font-bold text-neutral-500 dark:text-neutral-400">Peptide</th>
                    <th className="px-4 py-2.5 text-left text-[13px] font-bold text-neutral-500 dark:text-neutral-400">COA</th>
                    <th className="px-4 py-2.5 text-right text-[13px] font-bold text-neutral-500 dark:text-neutral-400">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/60 dark:divide-white/[0.06]">
                  {compounds.map((compound) => (
                    <tr key={compound.id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-200">{compound.name}</td>
                      <td className="px-4 py-3 text-left">
                        {compound.coaUrl ? (
                          <a
                            href={compound.coaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap"
                          >
                            View
                            <ExternalLinkIcon className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-neutral-300 dark:text-neutral-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={vendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
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
