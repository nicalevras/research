interface PromoCodeBadgeProps {
  code: string | null
  discountPercent: number | null
  className?: string
}

export function PromoCodeBadge({ code, discountPercent, className = '' }: PromoCodeBadgeProps) {
  if (!code) return null

  return (
    <div className={`inline-flex w-fit max-w-full items-center gap-2 rounded-lg border border-emerald-200/70 bg-emerald-50 px-2.5 py-1.5 text-xs text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100 ${className}`}>
      <span className="shrink-0 font-medium">{discountPercent ? `${discountPercent}% off` : 'Promo code'}</span>
      <code className="min-w-0 break-all rounded bg-white/70 px-1.5 py-0.5 font-semibold tracking-normal text-emerald-950 dark:bg-white/10 dark:text-white">
        {code}
      </code>
    </div>
  )
}
