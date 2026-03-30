import { StarIcon } from '~/components/icons'

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-semibold tabular-nums">{rating.toFixed(1)}</span>
      <div className="flex gap-px">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = rating >= star
          const isHalf = !isFull && rating >= star - 0.5
          return (
            <div key={star} className="relative">
              <StarIcon
                className={`h-3.5 w-3.5 ${isFull ? 'text-amber-400' : 'text-neutral-200 dark:text-neutral-700'}`}
                fill={isFull ? 'currentColor' : 'none'}
                stroke={isFull ? 'none' : 'currentColor'}
                strokeWidth={isFull ? 0 : 1.2}
              />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <StarIcon
                    className="h-3.5 w-3.5 text-amber-400"
                    fill="currentColor"
                    stroke="none"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
