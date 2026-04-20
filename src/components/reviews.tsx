import { useState } from 'react'
import type { Review } from '~/lib/types'
import { authClient } from '~/lib/auth-client'
import { useAuthModal } from '~/lib/auth-context'
import { createReview, updateReview, deleteReview } from '~/lib/data'
import { StarIcon } from '~/components/icons'
import { useRouter } from '@tanstack/react-router'

const GRADIENT_COLORS = [
  '#f43f5e', '#fb923c', '#f59e0b', '#10b981',
  '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#ec4899', '#0ea5e9',
]

function hashGradient(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const c1 = GRADIENT_COLORS[Math.abs(hash) % GRADIENT_COLORS.length]
  const c2 = GRADIENT_COLORS[Math.abs(hash * 7 + 3) % GRADIENT_COLORS.length]
  const angle = Math.abs(hash * 13) % 360
  return `linear-gradient(${angle}deg, ${c1}, ${c2})`
}

function relativeTime(dateStr: string) {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function StarPicker({ rating, onChange, size = 'lg' }: { rating: number; onChange: (r: number) => void; size?: 'sm' | 'lg' }) {
  const [hover, setHover] = useState(0)
  const current = hover || rating
  const cls = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const half = star - 0.5
        const isHalf = current >= half && current < star
        const isFull = current >= star

        return (
          <div
            key={star}
            className="relative cursor-pointer p-0.5"
            onMouseLeave={() => setHover(0)}
          >
            <StarIcon
              className={`${cls} transition-colors ${isFull ? 'text-amber-400' : 'text-neutral-200 dark:text-neutral-700'}`}
              fill={isFull ? 'currentColor' : 'none'}
              stroke={isFull ? 'none' : 'currentColor'}
              strokeWidth={isFull ? 0 : 1.2}
            />
            {isHalf && (
              <div className="absolute inset-0 p-0.5 overflow-hidden" style={{ width: '50%' }}>
                <StarIcon
                  className={`${cls} text-amber-400`}
                  fill="currentColor"
                  stroke="none"
                />
              </div>
            )}
            <button
              type="button"
              className="absolute inset-y-0 left-0 w-1/2"
              onClick={() => onChange(half)}
              onMouseEnter={() => setHover(half)}
              aria-label={`${half} stars`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 w-1/2"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              aria-label={`${star} stars`}
            />
          </div>
        )
      })}
    </div>
  )
}

export function ReviewStars({ rating, size = 'sm' }: { rating: number; size?: 'xs' | 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'h-5 w-5' : size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5'
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = rating >= star
        const isHalf = !isFull && rating >= star - 0.5
        return (
          <div key={star} className="relative">
            <StarIcon
              className={`${cls} ${isFull ? 'text-amber-400' : 'text-neutral-200 dark:text-neutral-700'}`}
              fill={isFull ? 'currentColor' : 'none'}
              stroke={isFull ? 'none' : 'currentColor'}
              strokeWidth={isFull ? 0 : 1.2}
            />
            {isHalf && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <StarIcon
                  className={`${cls} text-amber-400`}
                  fill="currentColor"
                  stroke="none"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function RatingSummary({ reviews }: { reviews: Review[] }) {
  const total = reviews.length
  const avg = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.floor(r.rating) === star).length,
  }))

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tabular-nums text-neutral-900 dark:text-white leading-none">{avg.toFixed(1)}</span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">out of 5</span>
        </div>
        <ReviewStars rating={avg} size="lg" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {total} {total === 1 ? 'review' : 'reviews'}
        </p>
      </div>
      <div className="space-y-2">
        {dist.map(({ star, count }) => {
          const pct = total > 0 ? (count / total) * 100 : 0
          return (
            <div key={star} className="flex items-center gap-2.5">
              <span className="w-4 text-right text-sm tabular-nums font-bold text-neutral-600 dark:text-neutral-300">{star}</span>
              <div className="flex-1 h-2.5 rounded-lg bg-neutral-200/70 dark:bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-lg bg-neutral-900 dark:bg-white transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-4 text-left text-sm tabular-nums text-neutral-400 dark:text-neutral-500">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase()
  const gradient = hashGradient(name)
  return (
    <div
      className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
      style={{ background: gradient }}
    >
      <span className="text-sm font-bold text-white leading-none drop-shadow-sm">{initial}</span>
    </div>
  )
}

function ReviewForm({ vendorId, existingReview, onDone }: {
  vendorId: string
  existingReview?: Review
  onDone?: () => void
}) {
  const { data: session } = authClient.useSession()
  const { openSignIn } = useAuthModal()
  const router = useRouter()
  const [rating, setRating] = useState(existingReview?.rating ?? 0)
  const [comment, setComment] = useState(existingReview?.comment ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isAuthed = !!session

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (rating === 0) { setError('Please select a rating'); return }
    if (!comment.trim()) { setError('Please write a comment'); return }
    if (comment.trim().length > 2000) { setError('Comment must be under 2000 characters'); return }
    setLoading(true)
    try {
      if (existingReview) {
        await updateReview({ data: { reviewId: existingReview.id, rating, comment } })
      } else {
        await createReview({ data: { vendorId, rating, comment } })
      }
      setRating(0)
      setComment('')
      onDone?.()
      router.invalidate()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
        {existingReview ? 'Edit your review' : 'Write a review'}
      </h3>
      <div className={!isAuthed ? 'opacity-50 pointer-events-none' : ''}>
        <StarPicker rating={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this vendor..."
        rows={4}
        maxLength={2000}
        disabled={!isAuthed}
        className="w-full rounded-lg border border-neutral-200/60 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="flex items-start justify-between -mt-2">
        <div>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">{comment.length}/2000</span>
          {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        </div>
        <div className="flex gap-3">
        {isAuthed ? (
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-neutral-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Saving...' : existingReview ? 'Update Review' : 'Submit Review'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => openSignIn()}
            className="rounded-lg bg-neutral-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Sign in to review
          </button>
        )}
        {existingReview && onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-lg border border-neutral-200/60 dark:border-white/[0.06] px-5 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        </div>
      </div>
    </form>
  )
}

function ReviewCard({ review, currentUserId, onEdit, onDeleted }: {
  review: Review
  currentUserId?: string
  onEdit?: () => void
  onDeleted?: () => void
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const isOwner = currentUserId === review.userId

  const handleDelete = async () => {
    if (!confirm('Delete this review?')) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteReview({ data: { reviewId: review.id } })
      onDeleted?.()
      router.invalidate()
    } catch {
      setDeleteError('Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  const timeAgo = relativeTime(review.createdAt)

  return (
    <article className="rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] p-5 flex gap-4">
      <Avatar name={review.username} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">{review.username}</span>
            <time dateTime={review.createdAt} className="text-[11px] text-neutral-400 dark:text-neutral-500">{timeAgo}</time>
          </div>
          {isOwner && (
            <div className="flex items-center gap-2.5 shrink-0">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="text-[11px] font-medium text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  Edit
                </button>
              )}
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-[11px] font-medium text-neutral-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleting ? '...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
        <div className="mt-1">
          <ReviewStars rating={review.rating} />
        </div>
        <p className="mt-2.5 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{review.comment}</p>
        {deleteError && <p className="text-xs text-red-500 mt-2">{deleteError}</p>}
      </div>
    </article>
  )
}

function ReviewFormSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 w-28 rounded-lg bg-neutral-100 dark:bg-white/[0.06]" />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-7 w-7 rounded-lg bg-neutral-100 dark:bg-white/[0.06]" />
        ))}
      </div>
      <div className="h-[106px] rounded-lg bg-neutral-100 dark:bg-white/[0.06]" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-12 rounded-lg bg-neutral-100 dark:bg-white/[0.06]" />
        <div className="h-10 w-32 rounded-lg bg-neutral-100 dark:bg-white/[0.06]" />
      </div>
    </div>
  )
}

export function ReviewsList({ reviews: initialReviews, vendorId }: { reviews: Review[]; vendorId: string }) {
  const { data: session, isPending } = authClient.useSession()
  const userReview = session ? initialReviews.find((r) => r.userId === session.user.id) : undefined

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <RatingSummary reviews={initialReviews} />
        </div>
        <div className="flex-1 min-w-0">
          {isPending ? (
            <ReviewFormSkeleton />
          ) : (
            <ReviewForm
              key={userReview?.id ?? 'new'}
              vendorId={vendorId}
              existingReview={userReview}
            />
          )}
        </div>
      </div>

      {initialReviews.length > 0 ? (
        <div className="space-y-3">
          {initialReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={session?.user.id}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] py-12 text-center">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">No reviews yet</p>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">Be the first to share your experience</p>
        </div>
      )}
    </div>
  )
}
