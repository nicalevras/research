import { StarIcon } from '~/components/icons'

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-semibold tabular-nums">{rating.toFixed(1)}</span>
      <div className="flex gap-px">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star
          const halfFilled = !filled && rating >= star - 0.5
          return (
            <StarIcon
              key={star}
              className={`h-3.5 w-3.5 ${filled || halfFilled ? 'text-amber-400' : 'text-neutral-200 dark:text-neutral-700'}`}
              fill={filled ? 'currentColor' : 'none'}
              stroke={filled ? 'none' : 'currentColor'}
              strokeWidth={filled ? 0 : 1.2}
            />
          )
        })}
      </div>
    </div>
  )
}
