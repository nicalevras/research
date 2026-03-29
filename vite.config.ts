import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const siteUrl = process.env.SITE_URL || 'https://example.com'

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
      },
      sitemap: {
        enabled: true,
        host: siteUrl,
      },
    }),
    viteReact(),
    nitro(),
  ],
})
