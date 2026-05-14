import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import contentCollections from '@content-collections/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

const PRIVATE_ROUTES = new Set(['/account', '/favorites'])

function shouldPrerenderPath(path: string) {
  if (path.includes('?')) return false
  const pathname = path.split('?')[0] ?? path
  if (PRIVATE_ROUTES.has(pathname)) return false
  return pathname === '/' || !pathname.endsWith('/')
}

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      }),
    },
    contentCollections(),
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src',
      prerender: {
        enabled: true,
        crawlLinks: true,
        concurrency: 2,
        retryCount: 2,
        retryDelay: 500,
        filter: ({ path }) => shouldPrerenderPath(path),
      },
    }),
    viteReact({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    nitro({
      publicAssets: [
        {
          dir: 'public/images',
          baseURL: 'images',
          maxAge: 60 * 60 * 24 * 365,
        },
        {
          dir: 'public',
          baseURL: '',
          maxAge: 60 * 60 * 24 * 365,
          ignore: ['images/**'],
        },
      ],
      routeRules: {
        '/account': { prerender: false },
        '/favorites': { prerender: false },
      },
    }),
  ],
})
