import type { VendorCategory } from '~/lib/types'
import { CATEGORIES } from '~/lib/constants'
import { Link } from '@tanstack/react-router'

interface PillNavProps {
  current: VendorCategory
  searchQuery?: string
  counts?: Record<string, number>
}

export function PillNav({ current, searchQuery, counts }: PillNavProps) {
  const search = searchQuery ? { q: searchQuery } : undefined

  return (
    <nav className="flex flex-wrap gap-1.5" aria-label="Category filter">
      {CATEGORIES.map((cat) => {
        const isActive = current === cat.value
        const count = counts?.[cat.value]

        return (
          <Link
            key={cat.value}
            to={cat.value === 'all' ? '/' as const : '/$category' as const}
            params={cat.value === 'all' ? undefined : { category: cat.value }}
            search={search}
            className={`
              inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium
              transition-all duration-200
              ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-white/70 dark:bg-white/[0.04] text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-white/[0.08] border border-neutral-200/60 dark:border-white/[0.06] hover:text-neutral-900 dark:hover:text-white'
              }
            `}
          >
            {cat.label}
            {count !== undefined && (
              <span
                className={`text-[11px] tabular-nums ${
                  isActive
                    ? 'text-white/60 dark:text-neutral-900/50'
                    : 'text-neutral-400 dark:text-neutral-500'
                }`}
              >
                {count}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
