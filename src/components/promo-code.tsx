import { TagIcon } from '~/components/icons'
import { CopyButton } from '~/components/copy-button'

interface PromoCodeBadgeProps {
  code: string | null
  discountPercent: number | null
  className?: string
  size?: 'default' | 'compact'
}

export function PromoCodeBadge({ code, discountPercent, className = '', size = 'default' }: PromoCodeBadgeProps) {
  if (!code) return null

  const isCompact = size === 'compact'
  const iconClass = isCompact ? 'h-4 w-4' : 'h-5 w-5'
  const copyButtonClass = isCompact ? 'h-7 w-7' : 'h-8 w-8'

  return (
    <div className={`flex w-full max-w-full items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-2 text-sm text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100 ${className}`}>
      <span className="inline-flex shrink-0 items-center gap-2 font-semibold">
        <TagIcon className={`${iconClass} text-emerald-600 dark:text-emerald-300`} />
        {discountPercent ? `${discountPercent}% off` : 'Promo code'}
      </span>
      <span className="h-5 w-px shrink-0 bg-emerald-200 dark:bg-emerald-400/30" aria-hidden="true" />
      <code className="min-w-0 flex-1 break-all font-semibold tracking-normal text-emerald-800 dark:text-white">
        {code}
      </code>
      <CopyButton
        value={code}
        label="Copy promo code"
        className={`${copyButtonClass} border-emerald-200/80 bg-white/60 text-emerald-700 hover:bg-white hover:text-emerald-900 dark:border-emerald-400/20 dark:bg-white/10 dark:text-emerald-100 dark:hover:bg-white/15`}
      />
    </div>
  )
}
