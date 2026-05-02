import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

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
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src',
      prerender: {
        enabled: true,
        crawlLinks: true,
        filter: ({ path }) => shouldPrerenderPath(path),
      },
    }),
    viteReact(),
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
