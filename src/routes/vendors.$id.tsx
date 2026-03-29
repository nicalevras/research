import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getVendorById } from '~/lib/data'
import { CATEGORY_LABELS, SITE_URL } from '~/lib/constants'
import { StarRating, CategoryBadge } from '~/components/vendor-ui'
import { breadcrumbSchema, organizationSchema } from '~/lib/schema'
import { CircleAlertIcon, ChevronLeftIcon, ExternalLinkIcon } from '~/components/icons'

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
  loader: ({ params: { id } }) => {
    const vendor = getVendorById(id)
    if (!vendor) throw notFound()
    return { vendor }
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
            { name: CATEGORY_LABELS[vendor.category], url: `/${vendor.category}` },
            { name: vendor.name, url: `/vendors/${vendor.id}` },
          ])),
        },
      ],
    }
  },
  component: VendorDetailPage,
  notFoundComponent: VendorNotFound,
})

function VendorDetailPage() {
  const { vendor } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <Link
        to="/$category"
        params={{ category: vendor.category }}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeftIcon className="h-3.5 w-3.5" />
        Back to {CATEGORY_LABELS[vendor.category]}
      </Link>

      <div className="glass-card-solid p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">{vendor.name}</h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <CategoryBadge category={vendor.category} />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {vendor.location}, {vendor.country}
              </span>
              <span className="text-neutral-200 dark:text-neutral-700">·</span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Est. {vendor.founded}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <StarRating rating={vendor.rating} />
              <span className="text-sm text-neutral-400 dark:text-neutral-500">
                {vendor.reviewCount} reviews
              </span>
            </div>
          </div>

          <a
            href={vendor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 dark:bg-white px-4 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shrink-0"
          >
            Visit Website
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="h-px bg-neutral-100 dark:bg-white/[0.04]" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">About</h2>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {vendor.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Details</h2>

            <div className="space-y-0 rounded-xl border border-neutral-100 dark:border-white/[0.04] divide-y divide-neutral-100 dark:divide-white/[0.04]">
              {[
                { label: 'Category', value: CATEGORY_LABELS[vendor.category] },
                { label: 'Location', value: vendor.location },
                { label: 'Country', value: vendor.country },
                { label: 'Founded', value: String(vendor.founded) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between px-4 py-3 text-sm">
                  <span className="text-neutral-400 dark:text-neutral-500">{row.label}</span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-200">{row.value}</span>
                </div>
              ))}
            </div>

            {vendor.certifications.length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
                  Certifications
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {vendor.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center rounded-lg bg-neutral-50 dark:bg-white/[0.04] border border-neutral-100 dark:border-white/[0.04] px-2.5 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
