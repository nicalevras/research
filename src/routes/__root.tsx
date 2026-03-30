/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { HamburgerMenu, UserMenu, NavSearch, PeptidesDropdown } from '~/components/nav-dropdowns'
import { AuthModalProvider } from '~/lib/auth-context'
import { AuthModals } from '~/components/auth-modals'
import { SITE_URL } from '~/lib/constants'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Peptide Vendor Directory' },
      {
        name: 'description',
        content: 'Find and compare peptide vendors. Verified ratings, certifications, and detailed reviews for every supplier.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Peptide Vendor Directory' },
      { property: 'og:image', content: `${SITE_URL}/og-image.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [
      { children: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()` },
    ],
  }),
  errorComponent: (props: ErrorComponentProps) => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),
  notFoundComponent: () => (
    <RootDocument>
      <NotFound />
    </RootDocument>
  ),
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
      <body className="min-h-screen">
        <AuthModalProvider>
        <div className="mx-auto w-full max-w-6xl flex min-h-screen flex-col">
          <header className="sticky top-4 z-50 mt-4 bg-white/80 dark:bg-neutral-900/80 rounded-full border border-neutral-200/60 dark:border-white/8 mx-4 sm:mx-6 lg:mx-8 px-2 py-2 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-base" aria-hidden="true">🧪</div>
                <Link to="/" className="text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-white">
                  Peptide Directory
                </Link>
                <div className="hidden md:flex items-center gap-4 ml-2">
                  <div className="h-4 w-px bg-neutral-200 dark:bg-white/10" />
                  <nav className="flex items-center gap-6">
                    <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: 'text-neutral-900 dark:text-white' }} className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
                    <PeptidesDropdown />
                    <span className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">Calculator</span>
                    <span className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">Articles</span>
                  </nav>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NavSearch />
                <div className="md:hidden"><HamburgerMenu /></div>
                <div className="h-4 w-px bg-neutral-200 dark:bg-white/10" />
                <UserMenu />
              </div>
            </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-8">{children}</main>

          <footer className="mx-auto w-full px-4 sm:px-6 lg:px-8 mt-16 border-t border-neutral-200/60 dark:border-white/[0.06] py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400 dark:text-neutral-500">
              <div className="flex items-center gap-4">
                <Link to="/$compound" params={{ compound: 'bpc-157' }} className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  BPC-157
                </Link>
                <Link to="/$compound" params={{ compound: 'tb-500' }} className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  TB-500
                </Link>
                <Link to="/$compound" params={{ compound: 'nad-plus' }} className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  NAD+
                </Link>
                <Link to="/$compound" params={{ compound: 'ipamorelin' }} className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  Ipamorelin
                </Link>
              </div>
              <span>&copy; {new Date().getFullYear()} Peptide Directory</span>
            </div>
          </footer>
        </div>
        <AuthModals />
        </AuthModalProvider>
        <Scripts />
      </body>
    </html>
  )
}
