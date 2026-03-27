import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { DirectoryListing } from '~/components/directory-listing'
import { JsonLd, siteSearchSchema } from '~/lib/schema'

export const Route = createFileRoute('/')({
  validateSearch: zodValidator(z.object({ q: z.string().optional() })),
  head: () => ({
    meta: [
      { title: 'Peptide Vendor Directory — Find & Compare Peptide Suppliers' },
      {
        name: 'description',
        content:
          'Compare the best peptide vendors across research, therapeutic, cosmetic, and API supply. Verified ratings, certifications, and detailed reviews for every supplier.',
      },
    ],
    scripts: [
      { id: 'site-search-schema', type: 'application/ld+json', children: JSON.stringify(siteSearchSchema()) },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const { q } = Route.useSearch()
  return (
    <DirectoryListing
      category="all"
      heading="Peptide Vendor Directory"
      description="Compare peptide vendors across research, therapeutic, cosmetic, and API supply categories."
      searchQuery={q ?? ''}
    />
  )
}
