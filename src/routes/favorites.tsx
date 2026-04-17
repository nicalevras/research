import { useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { getSession } from '~/lib/auth.functions'
import { getFavoriteVendors } from '~/lib/data'
import { useAuthModal } from '~/lib/auth-context'
import { useFavorites } from '~/lib/favorites-context'
import { VendorGrid } from '~/components/vendor-grid'
import { ChevronLeftIcon, HeartIcon } from '~/components/icons'

export const Route = createFileRoute('/favorites')({
  loader: async () => {
    const session = await getSession()
    if (!session) return { session: null, vendors: [] }

    const vendors = await getFavoriteVendors()
    return { session, vendors }
  },
  staleTime: 0,
  gcTime: 0,
  head: () => ({
    meta: [
      { title: 'Favorites — Peptide Vendor Directory' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  headers: () => ({
    'Cache-Control': 'private, no-cache, no-store',
  }),
  component: FavoritesPage,
})

function FavoritesAuthGate() {
  const { openSignIn } = useAuthModal()

  return (
    <div className="mx-auto max-w-xl glass-card-solid py-16 px-6 text-center">
      <div className="mx-auto mb-4 h-11 w-11 rounded-xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center">
        <HeartIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-500" strokeWidth={1.6} />
      </div>
      <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">Sign in to view favorites</h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        Save vendors while you browse and come back to them here.
      </p>
      <button
        type="button"
        onClick={() => openSignIn({ message: 'Sign in to view your favorite vendors.' })}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-neutral-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
      >
        Sign In
      </button>
    </div>
  )
}

function FavoritesPage() {
  const { session, vendors } = Route.useLoaderData()
  const { favoriteIds, favoritesLoaded } = useFavorites()

  const visibleVendors = useMemo(() => {
    if (!favoritesLoaded) return vendors
    return vendors.filter((vendor) => favoriteIds.has(vendor.id))
  }, [favoriteIds, favoritesLoaded, vendors])

  if (!session) return <FavoritesAuthGate />

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeftIcon className="h-3.5 w-3.5" />
        Back to Peptides
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">Favorites</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl text-pretty">
          Your saved vendors are listed here.
        </p>
      </div>

      <VendorGrid
        data={visibleVendors}
        initialFavorites
        emptyTitle="No favorites yet"
        emptyDescription="Save vendors from the directory or vendor profile pages."
      />
    </div>
  )
}
