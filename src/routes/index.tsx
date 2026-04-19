import { createFileRoute, Link } from '@tanstack/react-router'
import { VendorGrid } from '~/components/vendor-grid'
import { SITE_URL } from '~/lib/constants'
import { breadcrumbSchema, itemListSchema, siteSearchSchema } from '~/lib/schema'
import { getFeaturedVendors } from '~/lib/data'

export const Route = createFileRoute('/')({
  loader: async () => {
    const vendors = await getFeaturedVendors()
    return { vendors }
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
  const { vendors } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-neutral-200/80 bg-white px-5 py-20 dark:border-white/[0.08] dark:bg-neutral-900">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Peptide Vendor Directory
            </h1>
            <p className="mt-1.5 max-w-xl text-pretty text-sm text-neutral-500 dark:text-neutral-400">
              Compare featured peptide vendors with ratings, promo codes, and vendor details.
            </p>
          </div>
          <Link
            to="/vendors"
            className="inline-flex w-full items-center justify-center rounded-lg border border-neutral-200/80 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] sm:w-auto"
          >
            View All Vendors
          </Link>
        </div>
      </section>

      <section className="space-y-3" aria-label="Featured vendors">
        <h2 className="text-sm font-semibold text-neutral-950 dark:text-white">Featured Vendors</h2>
        <VendorGrid
          data={vendors}
          emptyTitle="No featured vendors yet"
          emptyDescription="Browse the full vendor directory while featured vendors are being selected."
        />
      </section>
    </div>
  )
}
