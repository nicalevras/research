import { Link } from '@tanstack/react-router'
import { MDXContent } from '@content-collections/mdx/react'
import type { ComponentProps } from 'react'
import type { Article } from '~/lib/articles'
import { formatArticleDate } from '~/lib/articles'
import { CalculatorCta, GHKCuProfileCta, GHKCuVendorCta, ProfileCta, VendorCta } from '~/components/articles/article-ctas'
import { GHKCuVendorSnapshot, GHKCuVendorTable, RetatrutideVendorSnapshot, RetatrutideVendorTable } from '~/components/articles/vendor-table'
import type { VendorSummary } from '~/lib/types'

type ArticlePageProps = {
  article: Article
  relatedArticles: Article[]
  retatrutideVendors: VendorSummary[]
  ghkCuVendors: VendorSummary[]
}

function articleDateLine(article: Article) {
  const published = formatArticleDate(article.publishedAt)
  const updated = article.updatedAt === article.publishedAt ? undefined : formatArticleDate(article.updatedAt)
  return updated ? `${published} | Updated ${updated}` : published
}

function ArticleToc({ headings }: { headings: Article['headings'] }) {
  if (headings.length === 0) return null

  return (
    <nav className="rounded-lg border border-neutral-200/80 bg-white p-4 dark:border-white/[0.08] dark:bg-neutral-900" aria-label="Table of contents">
      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Table of contents</p>
      <ol className="mt-3 space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-sm font-medium leading-6 text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function SourceList({ sources }: { sources?: Article['sources'] }) {
  if (!sources || sources.length === 0) return null

  return (
    <section className="mt-10 rounded-lg border border-neutral-200/80 bg-white p-5 dark:border-white/[0.08] dark:bg-neutral-900" aria-labelledby="article-sources">
      <h2 id="article-sources" className="text-base font-bold text-neutral-950 dark:text-white">Sources</h2>
      <ul className="mt-3 space-y-2 text-sm leading-6">
        {sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} className="font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-950 dark:text-neutral-200 dark:decoration-neutral-600 dark:hover:text-white">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null

  return (
    <section className="mt-10" aria-labelledby="related-articles">
      <h2 id="related-articles" className="text-base font-bold text-neutral-950 dark:text-white">Related Articles</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            to="/articles/$slug"
            params={{ slug: article.slug }}
            className="rounded-lg border border-neutral-200/80 bg-white p-4 transition-colors hover:bg-neutral-50 dark:border-white/[0.08] dark:bg-neutral-900 dark:hover:bg-white/[0.04]"
          >
            <span className="block text-sm font-bold leading-5 text-neutral-950 dark:text-white">{article.title}</span>
            <span className="mt-2 block text-sm leading-6 text-neutral-500 dark:text-neutral-400">{article.subtitle}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function ArticlePage({ article, relatedArticles, retatrutideVendors, ghkCuVendors }: ArticlePageProps) {
  const mdxComponents = {
    CalculatorCta,
    GHKCuProfileCta,
    GHKCuVendorCta,
    GHKCuVendorSnapshot: (props: Omit<ComponentProps<typeof GHKCuVendorSnapshot>, 'vendors'>) => (
      <GHKCuVendorSnapshot {...props} vendors={ghkCuVendors} />
    ),
    GHKCuVendorTable: (props: Omit<ComponentProps<typeof GHKCuVendorTable>, 'vendors'>) => (
      <GHKCuVendorTable {...props} vendors={ghkCuVendors} />
    ),
    ProfileCta,
    RetatrutideVendorSnapshot: (props: Omit<ComponentProps<typeof RetatrutideVendorSnapshot>, 'vendors'>) => (
      <RetatrutideVendorSnapshot {...props} vendors={retatrutideVendors} />
    ),
    RetatrutideVendorTable: (props: Omit<ComponentProps<typeof RetatrutideVendorTable>, 'vendors'>) => (
      <RetatrutideVendorTable {...props} vendors={retatrutideVendors} />
    ),
    VendorCta,
  }

  return (
    <article className="pt-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm">
        <Link to="/" className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">Home</Link>
        <span className="text-neutral-300 dark:text-neutral-600">/</span>
        <Link to="/articles" className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">Articles</Link>
        <span className="text-neutral-300 dark:text-neutral-600">/</span>
        <span className="truncate font-medium text-neutral-900 dark:text-white">{article.title}</span>
      </nav>

      <header className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-300">{article.category}</span>
          <span className="inline-flex rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-300">{article.readingTime}</span>
        </div>
        <h1 className="mt-4 text-3xl font-[900] font-stretch-semi-expanded leading-tight tracking-[-1px] text-neutral-950 dark:text-white sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-pretty text-lg italic leading-8 text-neutral-500 dark:text-neutral-400">
          {article.subtitle}
        </p>
        <p className="mt-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {articleDateLine(article)} by {article.author}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div className="lg:hidden">
          <ArticleToc headings={article.headings} />
        </div>

        <div className="min-w-0">
          <div className="article-body">
            <MDXContent code={article.mdx} components={mdxComponents} />
          </div>
          <SourceList sources={article.sources} />
          <RelatedArticles articles={relatedArticles} />
        </div>

        <aside className="hidden lg:sticky lg:top-28 lg:block">
          <ArticleToc headings={article.headings} />
        </aside>
      </div>
    </article>
  )
}
