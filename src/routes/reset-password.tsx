import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { authClient } from '~/lib/auth-client'
import { ChevronLeftIcon } from '~/components/icons'

const resetSearchSchema = z.object({
  token: z.string().optional(),
  error: z.string().optional(),
})

export const Route = createFileRoute('/reset-password')({
  validateSearch: zodValidator(resetSearchSchema),
  head: () => ({
    meta: [{ title: 'Reset Password — Peptide Vendor Directory' }],
  }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { token, error: urlError } = Route.useSearch()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(urlError === 'INVALID_TOKEN' ? 'This reset link is invalid or has expired.' : '')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Missing reset token. Please request a new reset link.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const { error: authError } = await authClient.resetPassword({
        newPassword: password,
        token,
      })
      if (authError) {
        setError(authError.message ?? 'Failed to reset password')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Something went wrong. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-sm mx-auto mt-20">
        <div className="glass-card-solid p-6 text-center space-y-4">
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Password reset</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 dark:text-white hover:underline"
          >
            Go to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-6"
      >
        <ChevronLeftIcon className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="glass-card-solid p-6 space-y-4">
        <div className="text-center mb-2">
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Set new password</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-neutral-900 dark:bg-white px-3.5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
