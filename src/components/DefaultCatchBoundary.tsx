import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error('DefaultCatchBoundary Error:', error)

  return (
    <div className="glass-card-solid py-20 flex flex-col items-center justify-center gap-6">
      <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <ErrorComponent error={error} />
      <div className="flex gap-2 items-center">
        <button
          onClick={() => {
            router.invalidate()
          }}
          className="rounded-xl bg-neutral-100 dark:bg-white/[0.06] px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
        >
          Try Again
        </button>
        {isRoot ? (
          <Link
            to="/"
            className="rounded-xl bg-neutral-900 dark:bg-white px-3 py-1.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Home
          </Link>
        ) : (
          <button
            onClick={() => router.history.back()}
            className="rounded-xl bg-neutral-100 dark:bg-white/[0.06] px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  )
}
