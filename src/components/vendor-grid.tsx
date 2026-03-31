import type { Vendor } from '~/lib/types'
import { Link } from '@tanstack/react-router'
import { ExternalLinkIcon, ShoppingCartIcon, SearchIcon } from '~/components/icons'
import { ReviewStars } from '~/components/reviews'
import { CountryFlag } from '~/components/flags'

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden flex flex-col">
      <Link
        to="/vendors/$id"
        params={{ id: vendor.id }}
        aria-label={`${vendor.name} image`}
        className="aspect-[16/9] block bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
      >
        {vendor.imageUrl && (
          <img src={vendor.imageUrl} alt={vendor.name} className="h-full w-full object-cover" loading="lazy" />
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <Link
          to="/vendors/$id"
          params={{ id: vendor.id }}
          className="block text-base font-bold text-neutral-900 dark:text-white hover:underline"
        >
          {vendor.name}
        </Link>
        <div className="flex items-center gap-1 h-5">
          <span className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-white">{vendor.rating.toFixed(1)}</span>
          <ReviewStars rating={vendor.rating} size="xs" />
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
            {vendor.reviewCount > 0 ? `(${vendor.reviewCount})` : '(No reviews)'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-neutral-500 dark:text-neutral-400">
          <CountryFlag country={vendor.country} />
          <span>{vendor.country}</span>
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
          {vendor.description}
        </p>

        <div className="mt-auto pt-3 border-t border-neutral-200/60 dark:border-white/[0.06] flex gap-5">
          <Link
            to="/vendors/$id"
            params={{ id: vendor.id }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200/60 dark:border-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors flex-1"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            Learn more
          </Link>
          <a
            href={vendor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 dark:bg-white px-3.5 py-1.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex-1"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            Shop Now
          </a>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-[16/9] bg-neutral-100 dark:bg-neutral-800" />
      <div className="p-5 flex flex-col flex-1">
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-3 w-1/2 rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-3 w-1/3 rounded bg-neutral-100 dark:bg-neutral-800" />
        </div>
        <div className="mt-5 mb-5 space-y-2">
          <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-3 w-2/3 rounded bg-neutral-100 dark:bg-neutral-800" />
        </div>
        <div className="mt-auto pt-5 border-t border-neutral-200/60 dark:border-white/[0.06] flex gap-5">
          <div className="h-9 flex-1 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-9 flex-1 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
        </div>
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
  data: Vendor[]
}

export function VendorGrid({ data }: VendorGridProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-white/[0.06] py-20 text-center">
        <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center">
          <SearchIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
        </div>
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">No vendors found</p>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {data.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  )
}
