import type { Vendor } from '~/lib/types'
import { CATEGORY_LABELS } from '~/lib/constants'
import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-semibold tabular-nums">{rating.toFixed(1)}</span>
      <div className="flex gap-px">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star
          const halfFilled = !filled && rating >= star - 0.5
          return (
            <svg
              key={star}
              className={`h-3.5 w-3.5 ${filled || halfFilled ? 'text-amber-400' : 'text-neutral-200 dark:text-neutral-700'}`}
              viewBox="0 0 20 20"
              fill={filled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={filled ? 0 : 1.2}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )
        })}
      </div>
    </div>
  )
}

function CategoryBadge({ category }: { category: Vendor['category'] }) {
  return (
    <span className="inline-flex items-center rounded-lg bg-neutral-100 dark:bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
      {CATEGORY_LABELS[category]}
    </span>
  )
}

export const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: 'name',
    header: 'Vendor',
    cell: ({ row }) => (
      <Link
        to="/vendors/$id"
        params={{ id: row.original.id }}
        className="font-medium text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => <CategoryBadge category={row.original.category} />,
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => (
      <span className="text-neutral-500 dark:text-neutral-400">
        {row.original.location}
        <span className="text-neutral-300 dark:text-neutral-600 ml-1">·</span>
        <span className="ml-1 text-neutral-400 dark:text-neutral-500">{row.original.country}</span>
      </span>
    ),
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <StarRating rating={row.original.rating} />
        <span className="text-[11px] text-neutral-400 dark:text-neutral-500">{row.original.reviewCount} reviews</span>
      </div>
    ),
  },
  {
    accessorKey: 'certifications',
    header: 'Certifications',
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        {row.original.certifications.length > 0 ? (
          row.original.certifications.map((cert) => (
            <span
              key={cert}
              className="inline-flex items-center rounded-md bg-neutral-50 dark:bg-white/[0.04] border border-neutral-100 dark:border-white/[0.04] px-1.5 py-0.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {cert}
            </span>
          ))
        ) : (
          <span className="text-[11px] text-neutral-300 dark:text-neutral-600">—</span>
        )}
      </div>
    ),
  },
]

export { CategoryBadge, StarRating }
