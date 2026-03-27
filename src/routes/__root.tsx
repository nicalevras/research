/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { ReactNode } from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { ThemeToggle } from '~/components/theme-toggle'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Peptide Vendor Directory' },
      {
        name: 'description',
        content: 'Find and compare peptide vendors across research, therapeutic, cosmetic, and API supply categories.',
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [
      { children: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()` },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen antialiased">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex min-h-screen flex-col">
          <header className="py-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-white">
                Peptide Directory
              </Link>
              <div className="flex items-center gap-5">
                <nav className="flex items-center gap-1 text-sm">
                  <Link
                    to="/"
                    activeProps={{ className: 'bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white' }}
                    activeOptions={{ exact: true }}
                    className="rounded-lg px-3 py-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Vendors
                  </Link>
                </nav>
                <div className="h-4 w-px bg-neutral-200 dark:bg-white/10" />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-16 border-t border-neutral-200/60 dark:border-white/[0.06] py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400 dark:text-neutral-500">
              <div className="flex items-center gap-4">
                <Link to="/" className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  Research
                </Link>
                <Link to="/$category" params={{ category: 'therapeutic' }} className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  Therapeutic
                </Link>
                <Link to="/$category" params={{ category: 'cosmetic' }} className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  Cosmetic
                </Link>
                <Link to="/$category" params={{ category: 'api-supplier' }} className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  API Suppliers
                </Link>
              </div>
              <span>&copy; {new Date().getFullYear()} Peptide Directory</span>
            </div>
          </footer>
        </div>
        {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
        <Scripts />
      </body>
    </html>
  )
}
