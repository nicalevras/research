import { useState } from 'react'
import type { Review } from '~/lib/types'
import { authClient } from '~/lib/auth-client'
import { useAuthModal } from '~/lib/auth-context'
import { createReview, updateReview, deleteReview } from '~/lib/data'
import { StarIcon, XIcon } from '~/components/icons'
import { useRouter } from '@tanstack/react-router'

function StarPicker({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hover || rating)
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="cursor-pointer"
          >
            <StarIcon
              className={`h-5 w-5 transition-colors ${active ? 'text-amber-400' : 'text-neutral-200 dark:text-neutral-700'}`}
              fill={active ? 'currentColor' : 'none'}
              stroke={active ? 'none' : 'currentColor'}
              strokeWidth={active ? 0 : 1.2}
            />
          </button>
        )
      })}
    </div>
  )
}

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star
        return (
          <StarIcon
            key={star}
            className={`h-3.5 w-3.5 ${filled ? 'text-amber-400' : 'text-neutral-200 dark:text-neutral-700'}`}
            fill={filled ? 'currentColor' : 'none'}
            stroke={filled ? 'none' : 'currentColor'}
            strokeWidth={filled ? 0 : 1.2}
          />
        )
      })}
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

  if (!session) {
    return (
      <div className="rounded-xl border border-neutral-200/60 dark:border-white/[0.06] p-6 text-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          <button type="button" onClick={openSignIn} className="font-medium text-neutral-900 dark:text-white hover:underline cursor-pointer">
            Sign in
          </button>
          {' '}to leave a review
        </p>
      </div>
    )
  }

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
    <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200/60 dark:border-white/[0.06] p-5 space-y-4">
      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
        {existingReview ? 'Edit your review' : 'Write a review'}
      </h3>
      <StarPicker rating={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        rows={3}
        maxLength={2000}
        className="w-full rounded-xl border border-neutral-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all resize-none"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Saving...' : existingReview ? 'Update Review' : 'Submit Review'}
        </button>
        {existingReview && onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-full border border-neutral-200/60 dark:border-white/[0.06] px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
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

  const date = new Date(review.createdAt)
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="py-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-900 dark:text-white">{review.username}</span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">{dateStr}</span>
          </div>
          <ReviewStars rating={review.rating} />
        </div>
        {isOwner && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onEdit}
              className="text-xs text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Edit
            </button>
            <span className="text-neutral-300 dark:text-neutral-600">|</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs text-neutral-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
            >
              {deleting ? '...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{review.comment}</p>
      {deleteError && <p className="text-xs text-red-500 mt-1">{deleteError}</p>}
    </div>
  )
}

export function ReviewsList({ reviews: initialReviews, vendorId }: { reviews: Review[]; vendorId: string }) {
  const { data: session } = authClient.useSession()
  const [editingId, setEditingId] = useState<string | null>(null)

  const userReview = session ? initialReviews.find((r) => r.userId === session.user.id) : undefined
  const hasReviewed = !!userReview

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Reviews {initialReviews.length > 0 && `(${initialReviews.length})`}
      </h2>

      {/* Show review form if user hasn't reviewed yet, or if editing their review */}
      {editingId && userReview ? (
        <ReviewForm
          vendorId={vendorId}
          existingReview={userReview}
          onDone={() => setEditingId(null)}
        />
      ) : !hasReviewed ? (
        <ReviewForm vendorId={vendorId} />
      ) : null}

      {initialReviews.length > 0 ? (
        <div className="rounded-xl border border-neutral-100 dark:border-white/[0.04] divide-y divide-neutral-100 dark:divide-white/[0.04] px-4">
          {initialReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={session?.user.id}
              onEdit={() => setEditingId(review.id)}
              onDeleted={() => setEditingId(null)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-400 dark:text-neutral-500">No reviews yet. Be the first to leave one!</p>
      )}
    </div>
  )
}
