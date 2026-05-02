import { createFileRoute, notFound } from '@tanstack/react-router'
import { PeptideProfile } from '~/components/peptide-profile'
import { SITE_URL } from '~/lib/constants'
import { breadcrumbSchema, peptideProfileSchema } from '~/lib/schema'
import { getCompoundProfile } from '~/lib/data'
import {
  buildPeptideProfileDescription,
  buildPeptideProfileTitle,
  peptideProfilePath,
} from '~/lib/peptide-profile-seo'

export const Route = createFileRoute('/peptides/$compound')({
  loader: async ({ params }) => {
    const profile = await getCompoundProfile({ data: params.compound })
    if (!profile) throw notFound()
    return profile
  },
  head: ({ loaderData }) => {
    const compound = loaderData?.compound
    const vendors = loaderData?.vendors
    const studies = loaderData?.studies
    if (!compound) return { meta: [], links: [] }

    const pageTitle = buildPeptideProfileTitle(compound)
    const pageDescription = buildPeptideProfileDescription(compound, vendors?.length ?? 0, studies?.length ?? 0)
    const canonicalPath = peptideProfilePath(compound.id)
    const canonicalUrl = `${SITE_URL}${canonicalPath}`
    const ogImage = `${SITE_URL}/og-image.png`

    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: pageDescription },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: pageDescription },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: ogImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: pageDescription },
        { name: 'twitter:image', content: ogImage },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        {
          type: 'application/ld+json' as const,
          children: JSON.stringify(peptideProfileSchema({
            compound,
            vendors: vendors ?? [],
            path: canonicalPath,
            title: pageTitle,
            description: pageDescription,
          })),
        },
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
