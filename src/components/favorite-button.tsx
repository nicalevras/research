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
        className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 ${active ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15' : 'border-neutral-200/60 bg-white/70 text-neutral-700 hover:bg-neutral-50 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:bg-white/[0.08]'} ${className}`}
      >
        <HeartIcon className="h-4 w-4" fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 0 : 1.8} />
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
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-colors cursor-pointer disabled:opacity-50 ${active ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15' : 'border-neutral-200/60 bg-white/70 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-neutral-500 dark:hover:bg-white/[0.08] dark:hover:text-neutral-200'} ${className}`}
    >
      <HeartIcon className="h-4 w-4" fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 0 : 1.8} />
    </button>
  )
}
