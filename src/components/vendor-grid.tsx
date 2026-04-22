import type { VendorSummary } from '~/lib/types'
import { Link } from '@tanstack/react-router'
import { BadgeCheckIcon, FileIcon, SearchIcon } from '~/components/icons'
import { ReviewStars } from '~/components/reviews'
import { CountryFlag } from '~/components/flags'
import { FavoriteButton } from '~/components/favorite-button'
import { FEATURE_LABELS } from '~/lib/constants'
import { PromoCodeBadge } from '~/components/promo-code'
import { VendorAvatar } from '~/components/vendor-avatar'

function VendorCard({ vendor, initialFavorited = false }: { vendor: VendorSummary; initialFavorited?: boolean }) {
  const reviewLabel = vendor.reviewCount > 0
    ? `(${vendor.reviewCount} ${vendor.reviewCount === 1 ? 'review' : 'reviews'})`
    : '(No reviews)'

  return (
    <article className="flex h-full flex-col rounded-lg border border-neutral-200/80 bg-white p-5 dark:border-white/[0.08] dark:bg-neutral-900">
      <div className="flex flex-1 flex-col gap-4">
        <header>
          <div className="flex min-w-0 items-start gap-2">
            <div className="flex h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-white/[0.08] dark:bg-white/[0.04]">
              <VendorAvatar vendor={vendor} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-start gap-2">
                <Link
                  to="/vendors/$id"
                  params={{ id: vendor.id }}
                  className="block min-w-0 flex-1 truncate text-lg font-bold leading-[1.1] text-neutral-950 transition-colors hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300"
                >
                  {vendor.name}
                </Link>
                <FavoriteButton
                  vendorId={vendor.id}
                  initialFavorited={initialFavorited}
                  className="-mt-1"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-300">
                  <CountryFlag country={vendor.country} />
                  {vendor.country}
                </span>
                {vendor.verified && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-300">
                    <BadgeCheckIcon className="h-3.5 w-3.5 text-sky-500" aria-hidden="true" />
                    Verified
                  </span>
                )}
                {vendor.hasCoa && (
                  <span className="inline-flex shrink-0 items-center rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-300">
                    <FileIcon className="mr-1 h-3.5 w-3.5 text-emerald-500 dark:text-emerald-300" aria-hidden="true" />
                    {FEATURE_LABELS.coa}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 leading-none">
          <ReviewStars rating={vendor.rating} size="md" />
          <span className="text-sm font-semibold leading-none tabular-nums text-neutral-950 dark:text-white">
            {vendor.rating.toFixed(1)}
          </span>
          <span className="text-sm leading-none text-neutral-500 dark:text-neutral-400">
            {reviewLabel}
          </span>
        </div>

        <p className="-mt-1.5 min-h-14 line-clamp-3 text-base leading-7 text-neutral-500 dark:text-neutral-300">
          {vendor.description}
        </p>

        <PromoCodeBadge code={vendor.promoCode} discountPercent={vendor.promoDiscountPercent} size="compact" className="text-base" />

        <div className="flex items-center gap-3">
          <Link
            to="/vendors/$id"
            params={{ id: vendor.id }}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-lg bg-black px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Vendor Profile
          </Link>
        </div>
      </div>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-neutral-200/80 bg-white p-5 dark:border-white/[0.08] dark:bg-neutral-900">
      <div className="flex flex-1 animate-pulse flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
            <div className="space-y-3">
              <div className="h-7 w-36 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-5 w-24 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
        </div>
        <div className="h-6 w-52 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-4 w-4/5 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
        </div>
        <div className="h-10 w-full rounded-lg bg-emerald-50 dark:bg-emerald-400/10" />
        <div className="h-12 w-full rounded-lg bg-neutral-200 dark:bg-neutral-700" />
      </div>
    </div>
  )
}

export function VendorGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

interface VendorGridProps {
  data: VendorSummary[]
  initialFavorites?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export function VendorGrid({ data, initialFavorites = false, emptyTitle = 'No vendors found', emptyDescription = 'Try adjusting your filters' }: VendorGridProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-white/[0.06] py-20 text-center">
        <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center">
          <SearchIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
        </div>
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{emptyTitle}</p>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">{emptyDescription}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {data.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} initialFavorited={initialFavorites} />
      ))}
    </div>
  )
}
