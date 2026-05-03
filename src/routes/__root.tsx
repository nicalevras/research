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
import { AminoRankMark } from '~/components/icons'
import { HamburgerMenu, UserMenu, NavSearch } from '~/components/nav-dropdowns'
import { AuthModalProvider } from '~/lib/auth-context'
import { FavoritesProvider } from '~/lib/favorites-context'
import { AuthModals } from '~/components/auth-modals'
import { SiteFooter } from '~/components/site-footer'
import { SITE_NAME, SITE_URL } from '~/lib/constants'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SITE_NAME },
      {
        name: 'description',
        content: 'Find and compare peptide vendors. Verified ratings, certifications, and detailed reviews for every supplier.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:image', content: `${SITE_URL}/og-image.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: `${SITE_URL}/og-image.png` },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/images/ui/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/images/ui/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
    scripts: [
      { children: `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})()` },
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
          <FavoritesProvider>
            <div className="mx-auto w-full max-w-6xl flex min-h-screen flex-col">
              <header className="relative sticky top-4 z-50 mt-4 bg-white/80 dark:bg-neutral-900/80 rounded-lg border border-neutral-200/60 dark:border-white/[0.06] mx-4 sm:mx-6 lg:mx-8 p-2.5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-[#8cff00] dark:bg-white dark:text-neutral-950" aria-hidden="true">
                      <AminoRankMark className="h-7 w-7" />
                    </div>
                    <Link to="/" className="text-[17px] font-[900] font-stretch-semi-expanded tracking-[-1px] text-neutral-900 dark:text-white">
                      AminoRank
                    </Link>
                    <div className="hidden md:flex items-center gap-4 ml-2">
                      <div className="h-4 w-px bg-neutral-200 dark:bg-white/10" />
                      <nav className="flex items-center gap-6">
                        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: 'text-neutral-900 dark:text-white' }} className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
                        <Link to="/vendors" activeProps={{ className: 'text-neutral-900 dark:text-white' }} className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">Vendors</Link>
                        <Link to="/peptides" activeProps={{ className: 'text-neutral-900 dark:text-white' }} className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">Peptides</Link>
                        <Link to="/calculator" className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">Tools</Link>
                      </nav>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <NavSearch />
                    <div className="md:hidden"><HamburgerMenu /></div>
                    <UserMenu />
                  </div>
                </div>
              </header>

              <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-0">{children}</main>

              <SiteFooter />
            </div>
            <AuthModals />
          </FavoritesProvider>
        </AuthModalProvider>
        <Scripts />
      </body>
    </html>
  )
}
