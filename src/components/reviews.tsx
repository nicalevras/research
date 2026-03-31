import { useState } from 'react'
import type { Review } from '~/lib/types'
import { authClient } from '~/lib/auth-client'
import { useAuthModal } from '~/lib/auth-context'
import { createReview, updateReview, deleteReview } from '~/lib/data'
import { StarIcon } from '~/components/icons'
import { useRouter } from '@tanstack/react-router'

const AVATAR_COLORS = [
  'bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500',
  'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500',
  'bg-violet-500', 'bg-purple-500', 'bg-pink-500', 'bg-sky-500',
]

function hashColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
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

function StarPicker({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  const [hover, setHover] = useState(0)
  const current = hover || rating

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
              className={`h-7 w-7 transition-colors ${isFull ? 'text-amber-400' : 'text-neutral-200 dark:text-neutral-700'}`}
              fill={isFull ? 'currentColor' : 'none'}
              stroke={isFull ? 'none' : 'currentColor'}
              strokeWidth={isFull ? 0 : 1.2}
            />
            {isHalf && (
              <div className="absolute inset-0 p-0.5 overflow-hidden" style={{ width: '50%' }}>
                <StarIcon
                  className="h-7 w-7 text-amber-400"
                  fill="currentColor"
                  stroke="none"
                />
              </div>
            )}
            {/* Left half - click for x.5 */}
            <button
              type="button"
              className="absolute inset-y-0 left-0 w-1/2"
              onClick={() => onChange(half)}
              onMouseEnter={() => setHover(half)}
              aria-label={`${half} stars`}
            />
            {/* Right half - click for x.0 */}
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

function ReviewStars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5'
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

export function RatingSummary({ reviews }: { reviews: Review[] }) {
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
        <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
          {total} {total === 1 ? 'review' : 'reviews'}
        </p>
      </div>
      <div className="space-y-2">
        {dist.map(({ star, count }) => {
          const pct = total > 0 ? (count / total) * 100 : 0
          return (
            <div key={star} className="flex items-center gap-2.5">
              <span className="w-4 text-right text-[13px] tabular-nums font-bold text-neutral-600 dark:text-neutral-300">{star}</span>
              <div className="flex-1 h-2.5 rounded-full bg-neutral-200/70 dark:bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-neutral-900 dark:bg-white transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-4 text-left text-[13px] tabular-nums text-neutral-400 dark:text-neutral-500">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase()
  const color = hashColor(name)
  return (
    <div className={`h-9 w-9 rounded-full ${color} flex items-center justify-center shrink-0 shadow-sm`}>
      <span className="text-sm font-bold text-white leading-none">{initial}</span>
    </div>
  )
}

export function ReviewForm({ vendorId, existingReview, onDone }: {
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
        className="w-full rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="rounded-full bg-neutral-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Saving...' : existingReview ? 'Update Review' : 'Submit Review'}
          </button>
        ) : (
          <button
            type="button"
            onClick={openSignIn}
            className="rounded-full bg-neutral-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Sign in to review
          </button>
        )}
        {existingReview && onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-full border border-neutral-200 dark:border-white/[0.06] px-5 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        </div>
      </div>
    </form>
  )
}

export function ReviewCard({ review, currentUserId, onEdit, onDeleted }: {
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
    <div className="rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/[0.04] p-5 flex gap-4">
      <Avatar name={review.username} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-neutral-900 dark:text-white">{review.username}</span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">{timeAgo}</span>
          </div>
          {isOwner && (
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onEdit}
                className="text-[11px] font-medium text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Edit
              </button>
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
        <p className="mt-2.5 text-[13px] text-neutral-600 dark:text-neutral-300 leading-relaxed">{review.comment}</p>
        {deleteError && <p className="text-xs text-red-500 mt-2">{deleteError}</p>}
      </div>
    </div>
  )
}

function ReviewFormSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 w-28 rounded bg-neutral-100 dark:bg-white/[0.06]" />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-7 w-7 rounded bg-neutral-100 dark:bg-white/[0.06]" />
        ))}
      </div>
      <div className="h-[106px] rounded-xl bg-neutral-100 dark:bg-white/[0.06]" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-12 rounded bg-neutral-100 dark:bg-white/[0.06]" />
        <div className="h-10 w-32 rounded-full bg-neutral-100 dark:bg-white/[0.06]" />
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
              onEdit={() => {}}
              onDeleted={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/[0.04] py-12 text-center">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">No reviews yet</p>
          <p className="text-[13px] text-neutral-400 dark:text-neutral-500 mt-1">Be the first to share your experience</p>
        </div>
      )}
    </div>
  )
}
