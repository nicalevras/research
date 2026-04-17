import { SparklesIcon } from '~/components/icons'
import { CopyButton } from '~/components/copy-button'

interface PromoCodeBadgeProps {
  code: string | null
  discountPercent: number | null
  className?: string
}

export function PromoCodeBadge({ code, discountPercent, className = '' }: PromoCodeBadgeProps) {
  if (!code) return null

  return (
    <div className={`inline-flex w-fit max-w-full items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100 ${className}`}>
      <span className="inline-flex shrink-0 items-center gap-2 font-semibold">
        <SparklesIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
        {discountPercent ? `${discountPercent}% off` : 'Promo code'}
      </span>
      <span className="h-5 w-px shrink-0 bg-emerald-200 dark:bg-emerald-400/30" aria-hidden="true" />
      <code className="min-w-0 flex-1 break-all font-semibold tracking-normal text-emerald-800 dark:text-white">
        {code}
      </code>
      <CopyButton
        value={code}
        label="Copy promo code"
        className="h-8 w-8 border-emerald-200/80 bg-white/60 text-emerald-700 hover:bg-white hover:text-emerald-900 dark:border-emerald-400/20 dark:bg-white/10 dark:text-emerald-100 dark:hover:bg-white/15"
      />
    </div>
  )
}
