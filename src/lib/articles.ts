import { allArticles } from 'content-collections'

export type Article = (typeof allArticles)[number]

export function getPublishedArticles() {
  return allArticles
    .filter((article) => !article.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getArticleBySlug(slug: string) {
  return getPublishedArticles().find((article) => article.slug === slug)
}

export function getRelatedArticles(article: Article, limit = 3) {
  const published = getPublishedArticles()
  const explicit = article.related
    ?.flatMap((slug) => {
      const normalized = slug.replace(/^\/articles\//, '')
      const related = published.find((item) => item.slug === normalized)
      return related ? [related] : []
    }) ?? []

  if (explicit.length >= limit) return explicit.slice(0, limit)

  const fallback = published.filter((item) => (
    item.slug !== article.slug
    && !explicit.some((related) => related.slug === item.slug)
    && item.category === article.category
  ))

  return [...explicit, ...fallback].slice(0, limit)
}

export function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}
