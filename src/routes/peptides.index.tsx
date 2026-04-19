import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE_URL } from '~/lib/constants'
import { breadcrumbSchema } from '~/lib/schema'
import { getCompounds } from '~/lib/data'

export const Route = createFileRoute('/peptides/')({
  loader: async () => {
    const compounds = await getCompounds()
    return { compounds }
  },
  head: ({ loaderData }) => {
    const pageTitle = 'Peptides - Peptide Vendor Directory'
    const pageDescription = 'Browse research peptides and compare vendors carrying each peptide.'
    const canonicalUrl = `${SITE_URL}/peptides`

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
        ...(loaderData?.compounds
          ? [{
              type: 'application/ld+json' as const,
              children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Peptides',
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
        {
          type: 'application/ld+json' as const,
          children: JSON.stringify(breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Peptides', url: '/peptides' },
          ])),
        },
      ],
    }
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    'Vary': 'Accept, Accept-Encoding',
  }),
  component: PeptidesPage,
})

function PeptideCard({ id, name }: { id: string; name: string }) {
  return (
    <Link
      to="/peptides/$compound"
      params={{ compound: id }}
      className="group rounded-lg border border-neutral-200/80 bg-white p-5 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-white/[0.08] dark:bg-neutral-900 dark:hover:border-white/[0.14] dark:hover:bg-white/[0.04]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200/80 bg-neutral-50 text-lg dark:border-white/[0.08] dark:bg-white/[0.04]" aria-hidden="true">
          🧪
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold leading-tight text-neutral-950 dark:text-white">{name}</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Compare vendors carrying {name}.</p>
        </div>
      </div>
    </Link>
  )
}

function PeptidesPage() {
  const { compounds } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-neutral-200/80 bg-white px-5 py-20 dark:border-white/[0.08] dark:bg-neutral-900">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">Peptides</h1>
        <p className="mt-1.5 max-w-xl text-pretty text-sm text-neutral-500 dark:text-neutral-400">
          Browse research peptides and compare vendors carrying each peptide.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Peptides">
        {compounds.map((compound) => (
          <PeptideCard key={compound.id} id={compound.id} name={compound.name} />
        ))}
      </section>
    </div>
  )
}
