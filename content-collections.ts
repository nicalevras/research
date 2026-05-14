import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { z } from 'zod'

function slugFromPath(path: string) {
  return path.replace(/\.mdx$/, '')
}

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 220))} min read`
}

function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function extractHeadings(content: string) {
  return content
    .split('\n')
    .flatMap((line) => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line)
      if (!match) return []
      const marker = match[1]
      const text = match[2]
      if (!marker || !text) return []
      const rawText = text
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/<[^>]+>/g, '')
        .trim()
      if (!rawText) return []
      return [{
        id: headingId(rawText),
        text: rawText,
        level: marker.length,
      }]
    })
}

const articles = defineCollection({
  name: 'articles',
  directory: 'src/content/articles',
  include: '*.mdx',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    slug: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string(),
    author: z.string(),
    primaryKeyword: z.string(),
    secondaryKeywords: z.array(z.string()),
    category: z.string(),
    readingTime: z.string().optional(),
    affiliateIntent: z.enum(['low', 'medium', 'high']),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    related: z.array(z.string()).optional(),
    sources: z.array(z.object({
      label: z.string(),
      url: z.string(),
    })).optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, {
          behavior: 'wrap',
          properties: {
            className: ['article-heading-anchor'],
          },
        }],
      ],
    })
    const fileSlug = slugFromPath(document._meta.filePath)
    const slug = document.slug.replace(/^\/articles\//, '')

    return {
      ...document,
      slug,
      path: `/articles/${slug}`,
      fileSlug,
      readingTime: document.readingTime ?? estimateReadingTime(document.content),
      headings: extractHeadings(document.content).filter((heading) => heading.level === 2),
      mdx,
    }
  },
})

export default defineConfig({
  content: [articles],
})
