import { TagIcon } from '~/components/icons'
import { CopyButton } from '~/components/copy-button'

interface PromoCodeBadgeProps {
  code: string | null
  discountPercent: number | null
  className?: string
  size?: 'default' | 'compact'
  fullWidth?: boolean
}

export function PromoCodeBadge({ code, discountPercent, className = '', size = 'default', fullWidth = true }: PromoCodeBadgeProps) {
  if (!code) return null

  const isCompact = size === 'compact'
  const iconClass = isCompact ? 'h-4 w-4' : 'h-5 w-5'
  const copyButtonClass = isCompact ? 'h-5 w-5' : 'h-6 w-6'
  const widthClass = fullWidth ? 'w-full' : 'w-fit'

  return (
    <div className={`flex ${widthClass} max-w-full items-center gap-3 rounded-lg border border-neutral-200/60 bg-neutral-50 p-2 text-sm text-neutral-700 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-neutral-200 ${className}`}>
      <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-neutral-700 dark:text-neutral-200">
        <TagIcon className={`${iconClass} text-neutral-500 dark:text-neutral-400`} />
        {discountPercent ? `${discountPercent}% OFF` : 'Promo code'}
      </span>
      <span className="h-5 w-px shrink-0 bg-neutral-200 dark:bg-white/[0.08]" aria-hidden="true" />
      <div className="group/code min-w-0 flex-1 rounded-lg border border-neutral-200/80 bg-white/80 transition-colors hover:border-emerald-200 hover:bg-emerald-50/60 dark:border-white/[0.08] dark:bg-white/[0.06] dark:hover:border-emerald-400/20 dark:hover:bg-emerald-400/10">
        <div className="flex min-w-0 items-center gap-2 px-2 py-1">
          <code className="min-w-0 flex-1 break-all font-semibold tracking-normal text-neutral-950 dark:text-white">
            {code}
          </code>
          <CopyButton
            value={code}
            label="Copy promo code"
            unstyled
            className={`${copyButtonClass} rounded-lg text-neutral-500 hover:text-emerald-700 dark:text-neutral-300 dark:hover:text-emerald-200`}
          />
        </div>
      </div>
    </div>
  )
}
