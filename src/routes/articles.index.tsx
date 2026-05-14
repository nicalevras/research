import { createFileRoute, Link } from '@tanstack/react-router'
import { NewspaperIcon } from '~/components/icons'
import { SITE_NAME, SITE_URL } from '~/lib/constants'
import { breadcrumbSchema, collectionPageSchema } from '~/lib/schema'
import { formatArticleDate, getPublishedArticles } from '~/lib/articles'

const pageTitle = `Peptide Research Articles & Vendor Guides | ${SITE_NAME}`
const pageDescription = `Read peptide research articles, vendor guides, study breakdowns, and ${SITE_NAME} updates.`
const canonicalPath = '/articles'
const canonicalUrl = `${SITE_URL}${canonicalPath}`
const ogImage = `${SITE_URL}/og-image.png`

export const Route = createFileRoute('/articles/')({
  loader: () => ({
    articles: getPublishedArticles(),
  }),
  head: () => ({
    meta: [
      { title: pageTitle },
      { name: 'description', content: pageDescription },
      { property: 'og:title', content: pageTitle },
      { property: 'og:type', content: 'website' },
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
        children: JSON.stringify(collectionPageSchema({
          name: pageTitle,
          description: pageDescription,
          url: canonicalPath,
        })),
      },
      {
        type: 'application/ld+json' as const,
        children: JSON.stringify(breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Articles', url: canonicalPath },
        ])),
      },
    ],
  }),
  headers: () => ({
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    'Vary': 'Accept, Accept-Encoding',
  }),
  component: ArticlesPage,
})

function ArticlesPage() {
  const { articles } = Route.useLoaderData()

  return (
    <div>
      <section className="py-16">
        <div className="max-w-3xl">
          <h1 className="max-w-2xl text-3xl font-[900] font-stretch-semi-expanded capitalize leading-tight tracking-[-1px] text-neutral-950 dark:text-white sm:text-4xl">
            Peptide Research Articles
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-neutral-600 dark:text-neutral-300">
            Read peptide research articles, vendor guides, study breakdowns, and {SITE_NAME} updates.
          </p>
        </div>
      </section>

      <section className="mt-6" aria-label="Articles">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="flex h-full flex-col rounded-lg border border-neutral-200/80 bg-white p-5 dark:border-white/[0.08] dark:bg-neutral-900"
            >
              <div className="flex h-full flex-col gap-4">
                <header className="space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-neutral-200/80 bg-neutral-50 text-neutral-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-neutral-300">
                    <NewspaperIcon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <Link
                      to="/articles/$slug"
                      params={{ slug: article.slug }}
                      className="block text-lg font-bold leading-[1.1] text-neutral-950 transition-colors hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300"
                    >
                      {article.title}
                    </Link>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-300">
                        {article.category}
                      </span>
                      <span className="inline-flex items-center rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-300">
                        {article.readingTime}
                      </span>
                    </div>
                  </div>
                </header>

                <p className="text-base leading-7 text-neutral-500 dark:text-neutral-300">
                  {article.subtitle}
                </p>

                <div className="mt-auto space-y-3">
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {formatArticleDate(article.publishedAt)}
                  </p>
                  <Link
                    to="/articles/$slug"
                    params={{ slug: article.slug }}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-neutral-200/80 bg-neutral-50 px-5 py-3 text-base font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:bg-white/[0.08] dark:hover:text-white"
                  >
                    Read Article
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
