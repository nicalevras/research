import type { ReactNode } from 'react'
import { Link, useRouter } from '@tanstack/react-router'

export function NotFound({ children }: { children?: ReactNode }) {
  const router = useRouter()

  return (
    <div className="glass-card-solid py-20 text-center space-y-4">
      <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center">
        <svg className="h-5 w-5 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <p className="flex items-center gap-2 justify-center">
        <button
          onClick={() => router.history.back()}
          className="rounded-xl bg-neutral-100 dark:bg-white/[0.06] px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
        >
          Go back
        </button>
        <Link
          to="/"
          className="rounded-xl bg-neutral-900 dark:bg-white px-3 py-1.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
        >
          Start Over
        </Link>
      </p>
    </div>
  )
}
