import { Link } from '@tanstack/react-router'
import { PEPTIDE_CATEGORIES } from '~/lib/constants'
import type { CompoundProfileData, CompoundProfileVendor, CompoundStudy } from '~/lib/types'
import { ChevronRightIcon } from '~/components/icons'
import { ReviewStars } from '~/components/reviews'
import { VendorAvatar } from '~/components/vendor-avatar'
import { peptideIconLabel, peptideIconTheme } from '~/lib/peptide-icons'

const PEPTIDE_CATEGORY_BY_ID = new Map(PEPTIDE_CATEGORIES.map((category) => [category.id, category]))

interface PeptideProfileProps {
  compound: CompoundProfileData
  vendors: CompoundProfileVendor[]
  studies: CompoundStudy[]
}

export function PeptideProfile({ compound, vendors, studies }: PeptideProfileProps) {
  const categoryLabels = compound.categories.flatMap((categoryId) => {
    const category = PEPTIDE_CATEGORY_BY_ID.get(categoryId)
    return category ? [category] : []
  })
  const iconLabel = peptideIconLabel(compound.id, compound.name)
  const iconTheme = peptideIconTheme(compound.categories)
  const vendorLabel = vendors.length === 1 ? 'Vendor' : 'Vendors'

  return (
    <div className="pt-6">
      <nav className="mb-6 flex items-center gap-1.5 text-sm">
        <Link
          to="/"
          className="text-neutral-400 transition-colors hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white"
        >
          Home
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 text-neutral-300 dark:text-neutral-600" />
        <Link
          to="/peptides"
          className="text-neutral-400 transition-colors hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white"
        >
          Peptides
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 text-neutral-300 dark:text-neutral-600" />
        <span className="truncate font-medium text-neutral-900 dark:text-white">
          {compound.name}
        </span>
      </nav>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="glass-card-solid overflow-hidden p-5 shadow-none">
          <div className="space-y-4">
            <header className="flex min-w-0 flex-col gap-4">
              <div className="flex min-w-0 items-start gap-2">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg px-1 text-center text-[11px] font-bold leading-none tracking-normal ${iconTheme}`}
                  aria-hidden="true"
                >
                  <span className="whitespace-pre-line">{iconLabel}</span>
                </div>
                <div className="flex min-h-14 min-w-0 flex-1 flex-col justify-between">
                  <h1 className="truncate text-xl font-bold leading-[1.1] text-neutral-950 dark:text-white">
                    {compound.name}
                  </h1>
                  {categoryLabels.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
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

            <div className="flex flex-wrap items-center gap-1.5 leading-none">
              <span className="text-sm font-semibold leading-none text-neutral-950 dark:text-white">
                {vendors.length}
              </span>
              <span className="text-sm leading-none text-neutral-500 dark:text-neutral-400">
                {vendorLabel}
              </span>
            </div>

            <p className="max-w-3xl text-base leading-7 text-neutral-500 dark:text-neutral-300">
              {compound.description}
            </p>

            <Link
              to="/vendors"
              search={{ peptide: compound.id }}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-black px-5 py-3 text-base font-bold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              View Vendors
            </Link>
          </div>
        </div>

        <aside
          className="glass-card-solid overflow-hidden p-5 shadow-none"
          aria-labelledby="peptide-studies-heading"
        >
          <h2 id="peptide-studies-heading" className="sr-only">
            Linked studies for {compound.name}
          </h2>
          <div className="rounded-lg border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden">
            <div className="max-h-64 overflow-y-scroll">
              <table className="w-full border-collapse text-sm" aria-label="Linked studies">
              <colgroup>
                <col />
                <col className="w-24" />
              </colgroup>
              <thead>
                <tr className="border-b border-neutral-200/60 dark:border-white/[0.06]">
                  <th className="sticky top-0 z-10 bg-neutral-50 px-4 py-2.5 text-left text-sm font-bold text-neutral-900 dark:bg-white/[0.02] dark:text-white">Studies</th>
                  <th className="sticky top-0 z-10 bg-neutral-50 px-4 py-2.5 text-right text-sm font-bold text-neutral-900 dark:bg-white/[0.02] dark:text-white" aria-label="Study source link" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60 dark:divide-white/[0.06]">
                {studies.length > 0 ? studies.map((study) => (
                  <tr key={study.id} className="transition-colors hover:bg-neutral-50 dark:hover:bg-white/[0.02]">
                    <td className="pl-4 py-3 text-xs font-normal text-neutral-700 dark:text-neutral-200">
                      {study.title}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={study.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                      >
                        {study.source}
                      </a>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={2} className="px-4 py-5 text-sm text-neutral-500 dark:text-neutral-400">
                      No linked studies have been added for {compound.name} yet.
                    </td>
                  </tr>
                )}
              </tbody>
              </table>
            </div>
          </div>
        </aside>
      </section>

      <section
        className="mt-6 glass-card-solid overflow-hidden p-5 shadow-none"
        aria-labelledby="peptide-vendors-heading"
      >
        <h2 id="peptide-vendors-heading" className="sr-only">
          {compound.name} Vendors
        </h2>
        <div className="rounded-lg border border-neutral-200/60 dark:border-white/[0.06] overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <colgroup>
              <col />
              <col className="w-32" />
            </colgroup>
            <thead>
              <tr className="border-b border-neutral-200/60 bg-neutral-50 dark:border-white/[0.06] dark:bg-white/[0.02]">
                <th colSpan={2} className="px-4 py-2.5 text-left text-sm font-bold text-neutral-900 dark:text-white">
                  {compound.name} Vendors
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 dark:divide-white/[0.06]">
              {vendors.length > 0 ? vendors.map((vendor) => (
                <tr key={vendor.id} className="transition-colors hover:bg-neutral-50 dark:hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-white/[0.08] dark:bg-white/[0.04]">
                        <VendorAvatar vendor={vendor} />
                      </div>
                      <div className="min-w-0">
                        <Link
                          to="/vendors/$id"
                          params={{ id: vendor.id }}
                          className="block truncate font-semibold text-neutral-700 hover:underline dark:text-neutral-200"
                        >
                          {vendor.name}
                        </Link>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <ReviewStars rating={vendor.rating} size="sm" />
                          <span className="text-xs font-semibold tabular-nums text-neutral-900 dark:text-white">
                            {vendor.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/vendors/$id"
                      params={{ id: vendor.id }}
                      className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                      Profile
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={2} className="px-4 py-5 text-sm text-neutral-500 dark:text-neutral-400">
                    No vendors are currently listed for {compound.name}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}
