import { createFileRoute, notFound } from '@tanstack/react-router'
import { PeptideProfile } from '~/components/peptide-profile'
import { SITE_URL } from '~/lib/constants'
import { breadcrumbSchema } from '~/lib/schema'
import { getCompoundProfile } from '~/lib/data'

export const Route = createFileRoute('/peptides/$compound')({
  loader: async ({ params }) => {
    const profile = await getCompoundProfile({ data: params.compound })
    if (!profile) throw notFound()
    return profile
  },
  head: ({ loaderData }) => {
    const compound = loaderData?.compound
    const vendors = loaderData?.vendors
    if (!compound) return { meta: [], links: [] }

    const pageTitle = `${compound.name} Peptide Profile - Peptide Vendor Directory`
    const pageDescription = compound.description || `${compound.name} peptide profile and vendors carrying this peptide.`
    const canonicalPath = `/peptides/${compound.id}`
    const canonicalUrl = `${SITE_URL}${canonicalPath}`

    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: pageDescription.slice(0, 160) },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: pageDescription.slice(0, 160) },
        { property: 'og:url', content: canonicalUrl },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: pageDescription.slice(0, 160) },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        ...(vendors
          ? [{
              type: 'application/ld+json' as const,
              children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: `${compound.name} Vendors`,
                url: `${SITE_URL}/vendors?peptide=${compound.id}`,
                numberOfItems: vendors.length,
                itemListElement: vendors.map((vendor, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'Organization',
                    name: vendor.name,
                    url: `${SITE_URL}/vendors/${vendor.id}`,
                  },
                })),
              }),
            }]
          : []),
        {
          type: 'application/ld+json' as const,
          children: JSON.stringify(breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Peptides', url: '/peptides' },
            { name: compound.name, url: canonicalPath },
          ])),
        },
      ],
    }
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    'Vary': 'Accept, Accept-Encoding',
  }),
  component: PeptideProfilePage,
})

function PeptideProfilePage() {
  const { compound, vendors, studies } = Route.useLoaderData()

  return <PeptideProfile compound={compound} vendors={vendors} studies={studies} />
}
