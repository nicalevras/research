import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArticlePage } from '~/components/articles/article-page'
import { SITE_URL } from '~/lib/constants'
import { filterVendors } from '~/lib/data'
import { articleSchema, breadcrumbSchema, faqPageSchema } from '~/lib/schema'
import { getArticleBySlug, getRelatedArticles } from '~/lib/articles'

export const Route = createFileRoute('/articles/$slug')({
  loader: async ({ params }) => {
    const article = getArticleBySlug(params.slug)
    if (!article) throw notFound()
    const retatrutideVendors = article.content.includes('RetatrutideVendorTable') || article.content.includes('RetatrutideVendorSnapshot')
      ? await filterVendors({ data: { peptide: 'retatrutide' } })
      : []
    const ghkCuVendors = article.content.includes('GHKCuVendorTable') || article.content.includes('GHKCuVendorSnapshot')
      ? await filterVendors({ data: { peptide: 'ghk-cu' } })
      : []
    const tesamorelinVendors = article.content.includes('TesamorelinVendorTable') || article.content.includes('TesamorelinVendorSnapshot')
      ? await filterVendors({ data: { peptide: 'tesamorelin' } })
      : []
    const bpc157Vendors = article.content.includes('BPC157VendorTable') || article.content.includes('BPC157VendorSnapshot')
      ? await filterVendors({ data: { peptide: 'bpc-157' } })
      : []
    const bpc157Tb500Vendors = article.content.includes('BPC157TB500VendorTable') || article.content.includes('BPC157TB500VendorSnapshot')
      ? await filterVendors({ data: { peptide: 'bpc-157-tb-500' } })
      : []

    return {
      article,
      relatedArticles: getRelatedArticles(article),
      retatrutideVendors,
      ghkCuVendors,
      tesamorelinVendors,
      bpc157Vendors,
      bpc157Tb500Vendors,
    }
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article
    if (!article) return { meta: [], links: [] }

    const canonicalUrl = `${SITE_URL}${article.path}`
    const ogImage = `${SITE_URL}/og-image.png`
    const metaTitle = `${article.title} | AminoRank`

    return {
      meta: [
        { title: metaTitle },
        { name: 'description', content: article.description },
        { property: 'og:title', content: metaTitle },
        { property: 'og:type', content: 'article' },
        { property: 'og:description', content: article.description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: ogImage },
        { property: 'article:published_time', content: article.publishedAt },
        { property: 'article:modified_time', content: article.updatedAt },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: article.title },
        { name: 'twitter:description', content: article.description },
        { name: 'twitter:image', content: ogImage },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        {
          type: 'application/ld+json' as const,
          children: JSON.stringify(articleSchema({
            title: article.title,
            description: article.description,
            path: article.path,
            author: article.author,
            publishedAt: article.publishedAt,
            updatedAt: article.updatedAt,
          })),
        },
        ...(article.faqs && article.faqs.length > 0
          ? [{
              type: 'application/ld+json' as const,
              children: JSON.stringify(faqPageSchema(article.faqs)),
            }]
          : []),
        {
          type: 'application/ld+json' as const,
          children: JSON.stringify(breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Articles', url: '/articles' },
            { name: article.title, url: article.path },
          ])),
        },
      ],
    }
  },
  headers: () => ({
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    'Vary': 'Accept, Accept-Encoding',
  }),
  component: ArticleDetailPage,
})

function ArticleDetailPage() {
  const { article, relatedArticles, retatrutideVendors, ghkCuVendors, tesamorelinVendors, bpc157Vendors, bpc157Tb500Vendors } = Route.useLoaderData()

  return <ArticlePage article={article} relatedArticles={relatedArticles} retatrutideVendors={retatrutideVendors} ghkCuVendors={ghkCuVendors} tesamorelinVendors={tesamorelinVendors} bpc157Vendors={bpc157Vendors} bpc157Tb500Vendors={bpc157Tb500Vendors} />
}
