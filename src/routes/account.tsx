import { useState } from 'react'
import { createFileRoute, Link, redirect, useRouter } from '@tanstack/react-router'
import { getSession } from '~/lib/auth.functions'
import { getUserReviews, updateReview, deleteReview, changeUsername, getHasPassword, deleteAccountAndCleanup } from '~/lib/data'
import { authClient } from '~/lib/auth-client'
import { StarIcon, ChevronLeftIcon, KeyIcon, TrashIcon, PenIcon, UserIcon } from '~/components/icons'

export const Route = createFileRoute('/account')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/' })
    return { session }
  },
  loader: async () => {
    const [reviews, hasPassword] = await Promise.all([
      getUserReviews(),
      getHasPassword(),
    ])
    return { reviews, hasPassword }
  },
  head: () => ({
    meta: [{ title: 'Account — Peptide Vendor Directory' }],
  }),
  component: AccountPage,
})

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

function ChangeUsernameSection({ currentUsername }: { currentUsername: string }) {
  const [username, setUsername] = useState(currentUsername)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const trimmed = username.trim()
    if (!trimmed) { setError('Username is required'); return }
    if (trimmed.length < 2) { setError('Username must be at least 2 characters'); return }
    if (trimmed.length > 30) { setError('Username must be 30 characters or fewer'); return }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) { setError('Username can only contain letters, numbers, hyphens, and underscores'); return }
    if (trimmed === currentUsername) { setError('Username is unchanged'); return }

    setLoading(true)
    try {
      await changeUsername({ data: { username: trimmed } })
      setSuccess('Username updated successfully')
      router.invalidate()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card-solid p-6 space-y-4">
      <div className="flex items-center gap-2">
        <UserIcon className="h-4 w-4 text-neutral-400 dark:text-neutral-500" strokeWidth={1.5} />
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Change Username</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="your-username"
          maxLength={30}
          autoComplete="username"
          className="w-full rounded-xl border border-neutral-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-emerald-500">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Updating...' : 'Update Username'}
        </button>
      </form>
    </div>
  )
}

function ChangePasswordSection({ isOAuthOnly }: { isOAuthOnly: boolean }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (isOAuthOnly) {
    return (
      <div className="glass-card-solid p-6 space-y-4">
        <div className="flex items-center gap-2">
          <KeyIcon className="h-4 w-4 text-neutral-400 dark:text-neutral-500" strokeWidth={1.5} />
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Password</h2>
        </div>
        <p className="text-sm text-neutral-400 dark:text-neutral-500">
          Your account uses Google sign-in. No password is set.
        </p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const { error: authError } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })
      if (authError) {
        setError(authError.message ?? 'Failed to change password')
      } else {
        setSuccess('Password changed successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card-solid p-6 space-y-4">
      <div className="flex items-center gap-2">
        <KeyIcon className="h-4 w-4 text-neutral-400 dark:text-neutral-500" strokeWidth={1.5} />
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          autoComplete="current-password"
          className="w-full rounded-xl border border-neutral-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          autoComplete="new-password"
          className="w-full rounded-xl border border-neutral-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          autoComplete="new-password"
          className="w-full rounded-xl border border-neutral-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-emerald-500">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}

function DeleteAccountSection({ isOAuthOnly }: { isOAuthOnly: boolean }) {
  const [confirming, setConfirming] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await deleteAccountAndCleanup({
        data: isOAuthOnly ? {} : { password },
      })
      window.location.href = '/'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = isOAuthOnly ? confirmText === 'DELETE' : !!password

  return (
    <div className="glass-card-solid p-6 space-y-4 border-red-200/60 dark:border-red-500/10">
      <div className="flex items-center gap-2">
        <TrashIcon className="h-4 w-4 text-red-400 dark:text-red-500" strokeWidth={1.5} />
        <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">Delete Account</h2>
      </div>

      {!confirming ? (
        <>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Permanently delete your account and all associated data including reviews. This action cannot be undone.
          </p>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-full border border-red-200 dark:border-red-500/20 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            Delete Account
          </button>
        </>
      ) : (
        <form onSubmit={handleDelete} className="space-y-3">
          {isOAuthOnly ? (
            <>
              <p className="text-sm text-red-500">Type <strong>DELETE</strong> to confirm account deletion.</p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                autoComplete="off"
                className="w-full rounded-xl border border-red-200/80 dark:border-red-500/20 bg-white/70 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </>
          ) : (
            <>
              <p className="text-sm text-red-500">Enter your password to confirm deletion.</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-red-200/80 dark:border-red-500/20 bg-white/70 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="rounded-full bg-red-600 dark:bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Deleting...' : 'Confirm Delete'}
            </button>
            <button
              type="button"
              onClick={() => { setConfirming(false); setPassword(''); setConfirmText(''); setError('') }}
              className="rounded-full border border-neutral-200/60 dark:border-white/[0.06] px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

type UserReview = {
  id: string
  userId: string
  username: string
  vendorId: string
  vendorName: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

function UserReviewCard({ review, onUpdated }: { review: UserReview; onUpdated: () => void }) {
  const [editing, setEditing] = useState(false)
  const [rating, setRating] = useState(review.rating)
  const [comment, setComment] = useState(review.comment)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (rating === 0) { setError('Please select a rating'); return }
    if (!comment.trim()) { setError('Please write a comment'); return }
    if (comment.trim().length > 2000) { setError('Comment must be under 2000 characters'); return }
    setLoading(true)
    try {
      await updateReview({ data: { reviewId: review.id, rating, comment } })
      setEditing(false)
      onUpdated()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this review?')) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteReview({ data: { reviewId: review.id } })
      onUpdated()
    } catch {
      setDeleteError('Failed to delete review')
    } finally {
      setDeleting(false)
    }
  }

  const date = new Date(review.createdAt)
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  if (editing) {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Link
            to="/vendors/$id"
            params={{ id: review.vendorId }}
            className="text-sm font-medium text-neutral-900 dark:text-white hover:underline"
          >
            {review.vendorName}
          </Link>
        </div>
        <form onSubmit={handleUpdate} className="space-y-3">
          <StarPicker rating={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
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
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setRating(review.rating); setComment(review.comment); setError('') }}
              className="rounded-full border border-neutral-200/60 dark:border-white/[0.06] px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <Link
            to="/vendors/$id"
            params={{ id: review.vendorId }}
            className="text-sm font-medium text-neutral-900 dark:text-white hover:underline"
          >
            {review.vendorName}
          </Link>
          <div className="flex items-center gap-2">
            <ReviewStars rating={review.rating} />
            <span className="text-xs text-neutral-400 dark:text-neutral-500">{dateStr}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Edit review"
          >
            <PenIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Delete review"
          >
            <TrashIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{review.comment}</p>
      {deleteError && <p className="text-xs text-red-500">{deleteError}</p>}
    </div>
  )
}

function AccountPage() {
  const { session } = Route.useRouteContext() as { session: { user: { name: string; email: string; id: string; username?: string } } }
  const { reviews, hasPassword } = Route.useLoaderData()
  const router = useRouter()
  const currentUsername = (session.user as Record<string, unknown>).username as string || ''
  const isOAuthOnly = !hasPassword

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeftIcon className="h-3.5 w-3.5" />
        Back to Peptides
      </Link>

      {/* Account info */}
      <div className="glass-card-solid p-6 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">Account</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {currentUsername && <span className="font-medium text-neutral-700 dark:text-neutral-200">@{currentUsername}</span>}
          {currentUsername && ' \u00b7 '}
          {session.user.name} &middot; {session.user.email}
        </p>
      </div>

      {/* Username section */}
      <ChangeUsernameSection currentUsername={currentUsername} />

      {/* Reviews section */}
      <div className="glass-card-solid p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          Your Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {reviews.length > 0 ? (
          <div className="rounded-xl border border-neutral-100 dark:border-white/[0.04] divide-y divide-neutral-100 dark:divide-white/[0.04]">
            {reviews.map((review: UserReview) => (
              <UserReviewCard
                key={review.id}
                review={review}
                onUpdated={() => router.invalidate()}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400 dark:text-neutral-500">
            You haven&apos;t written any reviews yet.
          </p>
        )}
      </div>

      <ChangePasswordSection isOAuthOnly={isOAuthOnly} />
      <DeleteAccountSection isOAuthOnly={isOAuthOnly} />
    </div>
  )
}
