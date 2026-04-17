import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { authClient } from '~/lib/auth-client'
import { useAuthModal } from '~/lib/auth-context'
import { getFavoriteVendorIds, setVendorFavorite } from '~/lib/data'

type FavoritesContextValue = {
  favoriteIds: Set<string>
  favoritesLoaded: boolean
  authPending: boolean
  isFavorite: (vendorId: string) => boolean
  isToggling: (vendorId: string) => boolean
  toggleFavorite: (vendorId: string) => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favoriteIds: new Set(),
  favoritesLoaded: false,
  authPending: true,
  isFavorite: () => false,
  isToggling: () => false,
  toggleFavorite: async () => {},
})

const FAVORITES_AUTH_MESSAGE = 'Sign in to save vendors to your favorites.'

function isUnauthorizedError(err: unknown) {
  return err instanceof Error && err.message.toLowerCase().includes('unauthorized')
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending: authPending } = authClient.useSession()
  const { openSignIn } = useAuthModal()
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set())
  const [favoritesLoaded, setFavoritesLoaded] = useState(false)
  const [togglingIds, setTogglingIds] = useState<Set<string>>(() => new Set())
  const userId = session?.user.id

  useEffect(() => {
    let cancelled = false

    if (authPending) return () => {
      cancelled = true
    }

    if (!userId) {
      setFavoriteIds(new Set())
      setFavoritesLoaded(true)
      return () => {
        cancelled = true
      }
    }

    setFavoritesLoaded(false)
    getFavoriteVendorIds()
      .then((ids) => {
        if (!cancelled) setFavoriteIds(new Set(ids))
      })
      .catch(() => {
        if (!cancelled) setFavoriteIds(new Set())
      })
      .finally(() => {
        if (!cancelled) setFavoritesLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [authPending, userId])

  const isFavorite = useCallback((vendorId: string) => favoriteIds.has(vendorId), [favoriteIds])
  const isToggling = useCallback((vendorId: string) => togglingIds.has(vendorId), [togglingIds])

  const toggleFavorite = useCallback(async (vendorId: string) => {
    if (authPending) return

    if (!userId) {
      openSignIn({ message: FAVORITES_AUTH_MESSAGE })
      return
    }

    if (togglingIds.has(vendorId)) return

    const nextFavorited = !favoriteIds.has(vendorId)

    setTogglingIds((prev) => {
      const next = new Set(prev)
      next.add(vendorId)
      return next
    })
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (nextFavorited) next.add(vendorId)
      else next.delete(vendorId)
      return next
    })

    try {
      const result = await setVendorFavorite({ data: { vendorId, favorited: nextFavorited } })
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        if (result.favorited) next.add(result.vendorId)
        else next.delete(result.vendorId)
        return next
      })
    } catch (err) {
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        if (nextFavorited) next.delete(vendorId)
        else next.add(vendorId)
        return next
      })
      if (isUnauthorizedError(err)) {
        openSignIn({ message: FAVORITES_AUTH_MESSAGE })
      }
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev)
        next.delete(vendorId)
        return next
      })
    }
  }, [authPending, favoriteIds, openSignIn, togglingIds, userId])

  const value = useMemo(() => ({
    favoriteIds,
    favoritesLoaded,
    authPending,
    isFavorite,
    isToggling,
    toggleFavorite,
  }), [authPending, favoriteIds, favoritesLoaded, isFavorite, isToggling, toggleFavorite])

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
