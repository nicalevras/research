import { Link } from '@tanstack/react-router'
import { PEPTIDE_CATEGORIES } from '~/lib/constants'
import type { Compound } from '~/lib/types'

const PEPTIDE_CATEGORY_BY_ID = new Map(PEPTIDE_CATEGORIES.map((category) => [category.id, category]))

function hashString(value: string) {
  let hash = 0
  for (let index = 0; index < value.length; index++) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }
  return hash
}

function peptideInitials(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || 'PE'
}

function peptideGradient(id: string) {
  const hash = hashString(id)
  const hue = hash % 360
  const secondHue = (hue + 95 + (hash % 35)) % 360
  const thirdHue = (hue + 205 + (hash % 55)) % 360

  return `linear-gradient(135deg, hsl(${hue} 78% 42%), hsl(${secondHue} 72% 48%), hsl(${thirdHue} 80% 40%))`
}

function PeptideCard({ id, name, description, categories, vendorCount }: Compound) {
  const categoryLabels = categories.flatMap((categoryId) => {
    const category = PEPTIDE_CATEGORY_BY_ID.get(categoryId)
    return category ? [category] : []
  })
  const initials = peptideInitials(name)
  const gradient = peptideGradient(id)

  return (
    <article className="flex h-full flex-col rounded-lg border border-neutral-200/80 bg-white p-5 dark:border-white/[0.08] dark:bg-neutral-900">
      <div className="flex flex-1 flex-col gap-4">
        <header>
          <div className="flex min-w-0 items-start gap-2">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-lg font-semibold tracking-normal text-white shadow-inner"
              style={{ backgroundImage: gradient }}
              aria-hidden="true"
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex min-h-7 min-w-0 items-start">
                <Link
                  to="/peptides/$compound"
                  params={{ compound: id }}
                  className="block min-w-0 flex-1 truncate text-lg font-semibold leading-none text-neutral-950 transition-colors hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300"
                >
                  {name}
                </Link>
              </div>
              {categoryLabels.length > 0 && (
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {categoryLabels.map((category) => (
                    <span key={category.id} className="inline-flex shrink-0 items-center rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-300">
                      <span className="mr-1" aria-hidden="true">{category.emoji}</span>{category.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {typeof vendorCount === 'number' && (
          <div className="flex flex-wrap items-center gap-1.5 leading-none">
            <span className="text-lg font-semibold leading-none tabular-nums text-neutral-950 dark:text-white">
              {vendorCount}
            </span>
            <span className="text-base leading-none text-neutral-500 dark:text-neutral-400">
              {vendorCount === 1 ? 'Vendor' : 'Vendors'}
            </span>
          </div>
        )}

        <p className="-mt-1.5 min-h-14 line-clamp-3 text-base leading-7 text-neutral-500 dark:text-neutral-300">
          {description}
        </p>

        <div className="mt-auto flex flex-col gap-3">
          <Link
            to="/peptides/$compound"
            params={{ compound: id }}
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-neutral-200/60 bg-neutral-50 px-5 py-3 text-center text-base font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:bg-white/[0.08]"
          >
            About {name}
          </Link>
          <Link
            to="/vendors"
            search={{ compound: id }}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-black px-5 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            {name} Vendors
          </Link>
        </div>
      </div>
    </article>
  )
}

interface PeptideGridProps {
  data: Compound[]
  emptyTitle?: string
  emptyDescription?: string
}

export function PeptideGrid({ data, emptyTitle = 'No peptides found', emptyDescription = 'Try adjusting your filters' }: PeptideGridProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200/80 bg-white p-6 text-sm text-neutral-500 dark:border-white/[0.08] dark:bg-neutral-900 dark:text-neutral-400">
        <p className="font-medium text-neutral-600 dark:text-neutral-300">{emptyTitle}</p>
        <p className="mt-1 text-neutral-400 dark:text-neutral-500">{emptyDescription}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((compound) => (
        <PeptideCard key={compound.id} {...compound} />
      ))}
    </div>
  )
}
