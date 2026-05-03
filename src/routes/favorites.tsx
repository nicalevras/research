import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getSession } from '~/lib/auth.functions'
import { getFavoriteVendors } from '~/lib/data'
import { useAuthModal } from '~/lib/auth-context'
import { useFavorites } from '~/lib/favorites-context'
import { VendorGrid } from '~/components/vendor-grid'
import { HeartIcon } from '~/components/icons'
import { SITE_NAME } from '~/lib/constants'

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
      { title: `Favorites — ${SITE_NAME}` },
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
      <div className="mx-auto mb-4 h-11 w-11 rounded-lg bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center">
        <HeartIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-500" strokeWidth={1.6} />
      </div>
      <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">Sign in to view favorites</h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        Save vendors while you browse and come back to them here.
      </p>
      <button
        type="button"
        onClick={() => openSignIn({ message: 'Sign in to view your favorite vendors.' })}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-neutral-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
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

  if (!session) {
    return (
      <div>
        <FavoritesHero />
        <FavoritesAuthGate />
      </div>
    )
  }

  return (
    <div>
      <FavoritesHero />

      <section className="mt-6" aria-label="Favorite vendors">
        <VendorGrid
          data={visibleVendors}
          initialFavorites
          emptyTitle="No favorites yet"
          emptyDescription="Save vendors from the directory or vendor profile pages."
        />
      </section>
    </div>
  )
}

function FavoritesHero() {
  return (
    <section className="py-16">
      <div className="max-w-3xl">
        <h1 className="max-w-2xl text-3xl font-[900] font-stretch-semi-expanded capitalize leading-tight tracking-[-1px] text-neutral-950 dark:text-white sm:text-4xl">
          Favorites
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-neutral-600 dark:text-neutral-300">
          Your saved peptide vendors are listed here.
        </p>
      </div>
    </section>
  )
}
