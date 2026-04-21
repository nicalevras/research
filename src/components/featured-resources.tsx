import { Link } from '@tanstack/react-router'
import { ChevronRightIcon, FileIcon, SearchIcon } from '~/components/icons'

const resources = [
  {
    title: 'Vendor Directory',
    description: 'Compare vendor ratings, payment methods, promo codes, and peptide availability.',
    to: '/vendors',
    icon: SearchIcon,
  },
  {
    title: 'Peptide Catalog',
    description: 'Browse compounds by category, vendor availability, and research focus.',
    to: '/peptides',
    icon: FileIcon,
  },
  {
    title: 'Reconstitution Calculator',
    description: 'Calculate bacteriostatic water volume, dose concentration, and units per dose.',
    to: '/calculator',
    icon: FileIcon,
  },
] as const

export function FeaturedResources() {
  return (
    <section className="space-y-5" aria-label="Featured resources">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200/80 pb-3 dark:border-white/[0.08]">
        <h2 className="text-xl font-semibold leading-tight text-neutral-950 dark:text-white">Featured Resources</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => {
          const Icon = resource.icon

          return (
            <article
              key={resource.title}
              className="flex h-full flex-col rounded-lg border border-neutral-200/80 bg-white p-5 dark:border-white/[0.08] dark:bg-neutral-900"
            >
              <div className="flex flex-1 flex-col gap-4">
                <header>
                  <div className="flex min-w-0 items-start gap-2">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-neutral-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-h-7 min-w-0 items-start">
                        <Link
                          to={resource.to}
                          className="block min-w-0 flex-1 truncate text-lg font-semibold leading-none text-neutral-950 transition-colors hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300"
                        >
                          {resource.title}
                        </Link>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex shrink-0 items-center rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-300">
                          Resource
                        </span>
                      </div>
                    </div>
                  </div>
                </header>

                <p className="-mt-1.5 min-h-14 line-clamp-3 text-base leading-7 text-neutral-500 dark:text-neutral-300">
                  {resource.description}
                </p>

                <div className="mt-auto flex items-center gap-3">
                  <Link
                    to={resource.to}
                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-lg bg-black px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                  >
                    Open Resource
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
