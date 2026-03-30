import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getVendorById, getVendorCompounds, getVendorReviews } from '~/lib/data'
import { SITE_URL } from '~/lib/constants'
import { StarRating } from '~/components/vendor-ui'
import { ReviewsList } from '~/components/reviews'
import { breadcrumbSchema, organizationSchema } from '~/lib/schema'
import { CircleAlertIcon, ChevronLeftIcon, ShoppingCartIcon, ExternalLinkIcon } from '~/components/icons'

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
    if (!vendor) return { meta: [], links: [] }
    const pageTitle = `${vendor.name} — Peptide Vendor Profile`
    const pageDescription = vendor.description.slice(0, 160)
    const canonicalUrl = `${SITE_URL}/vendors/${vendor.id}`
    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: pageDescription },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: pageDescription },
        { property: 'og:url', content: canonicalUrl },
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

      <div className="glass-card-solid p-6 sm:p-8 space-y-8 shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-5">
            <Shimmer className="shrink-0 w-full sm:w-40 aspect-[2/1] rounded-xl" />
            <div className="space-y-3">
              <Shimmer className="h-7 w-48" />
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-4 w-24" />
              <Shimmer className="h-4 w-full max-w-md" />
              <Shimmer className="h-4 w-3/4 max-w-sm" />
            </div>
          </div>
          <Shimmer className="h-10 w-28 rounded-full" />
        </div>

        <div className="h-px bg-neutral-100 dark:bg-white/[0.04]" />

        <div className="space-y-3">
          <Shimmer className="h-3 w-20" />
          <div className="rounded-xl border border-neutral-100 dark:border-white/[0.04] divide-y divide-neutral-100 dark:divide-white/[0.04]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <Shimmer className="h-4 w-24" />
                <Shimmer className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-neutral-100 dark:bg-white/[0.04]" />

        <div className="space-y-4">
          <Shimmer className="h-3 w-20" />
          <div className="rounded-xl border border-neutral-100 dark:border-white/[0.04] divide-y divide-neutral-100 dark:divide-white/[0.04] px-4">
            {[1, 2].map((i) => (
              <div key={i} className="py-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Shimmer className="h-4 w-20" />
                  <Shimmer className="h-3 w-16" />
                </div>
                <Shimmer className="h-3.5 w-16" />
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function VendorDetailPage() {
  const { vendor, compounds, reviews } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeftIcon className="h-3.5 w-3.5" />
        Back to Peptides
      </Link>

      <div className="glass-card-solid p-6 sm:p-8 space-y-8 shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="shrink-0 w-full sm:w-40 aspect-[2/1] rounded-xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden">
              {vendor.imageUrl && (
                <img src={vendor.imageUrl} alt={vendor.name} className="h-full w-full object-cover" />
              )}
            </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">{vendor.name}</h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {vendor.country}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={vendor.rating} />
              <span className="text-sm text-neutral-400 dark:text-neutral-500">
                {vendor.reviewCount} {vendor.reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-2xl text-pretty">
              {vendor.description}
            </p>
          </div>
          </div>

          <a
            href={vendor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-neutral-900 dark:bg-white px-4 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shrink-0"
          >
            View Website
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="h-px bg-neutral-100 dark:bg-white/[0.04]" />

        {compounds.length > 0 && (
          <div>
            <div className="rounded-xl border border-neutral-100 dark:border-white/[0.04] overflow-hidden">
              <table className="w-full text-[13px]">
                <colgroup>
                  <col className="w-1/2" />
                  <col />
                  <col className="w-1/2" />
                </colgroup>
                <thead>
                  <tr className="bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-100 dark:border-white/[0.04]">
                    <th className="px-4 py-2.5 text-left font-bold text-neutral-500 dark:text-neutral-400">Peptide</th>
                    <th className="px-4 py-2.5 text-left font-bold text-neutral-500 dark:text-neutral-400">COA</th>
                    <th className="px-4 py-2.5 text-right font-bold text-neutral-500 dark:text-neutral-400">Buy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.04]">
                  {compounds.map((compound) => (
                    <tr key={compound.id}>
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
                          <span className="text-neutral-300 dark:text-neutral-600 block text-center">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={vendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/70 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/8 text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-white/[0.08] hover:text-neutral-900 dark:hover:text-white transition-all duration-200"
                        >
                          <ShoppingCartIcon className="h-3.5 w-3.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="h-px bg-neutral-100 dark:bg-white/[0.04]" />

        <ReviewsList reviews={reviews} vendorId={vendor.id} />
      </div>
    </div>
  )
}
