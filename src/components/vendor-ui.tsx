import { ReviewStars } from '~/components/reviews'

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-semibold tabular-nums">{rating.toFixed(1)}</span>
      <ReviewStars rating={rating} />
    </div>
  )
}
