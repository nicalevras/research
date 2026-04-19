import { HeartIcon } from '~/components/icons'
import { useFavorites } from '~/lib/favorites-context'

type FavoriteButtonProps = {
  vendorId: string
  variant?: 'icon' | 'button'
  initialFavorited?: boolean
  className?: string
}

export function FavoriteButton({ vendorId, variant = 'icon', initialFavorited = false, className = '' }: FavoriteButtonProps) {
  const { favoritesLoaded, authPending, isFavorite, isToggling, toggleFavorite } = useFavorites()
  const active = favoritesLoaded ? isFavorite(vendorId) : initialFavorited
  const toggling = isToggling(vendorId)
  const label = active ? 'Remove from favorites' : 'Save vendor'

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    await toggleFavorite(vendorId)
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={authPending || toggling}
        aria-pressed={active}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 ${active ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15' : 'bg-white/70 text-neutral-700 hover:bg-rose-50 hover:text-rose-600 dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:bg-rose-500/10 dark:hover:text-rose-300'} ${className}`}
      >
        <HeartIcon className="h-5 w-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.6} />
        {active ? 'Saved' : 'Save'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={authPending || toggling}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer disabled:opacity-50 ${active ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15' : 'bg-white/70 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:bg-white/[0.04] dark:text-neutral-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-300'} ${className}`}
    >
      <HeartIcon className="h-5 w-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.6} />
    </button>
  )
}
