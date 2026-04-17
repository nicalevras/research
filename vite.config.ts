import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const PRIVATE_ROUTES = new Set(['/account', '/favorites'])

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
        filter: ({ path }) => !PRIVATE_ROUTES.has(path.split('?')[0]),
      },
    }),
    viteReact(),
    nitro({
      routeRules: {
        '/account': { prerender: false },
        '/favorites': { prerender: false },
      },
    }),
  ],
})
