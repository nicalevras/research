import { Link } from '@tanstack/react-router'
import { CalculatorIcon, MessageCircleIcon, NewspaperIcon } from '~/components/icons'

const resources = [
  {
    title: 'Community',
    description: 'Join the forum to discuss vendors, peptides, and research with other members.',
    href: 'https://community.aminorank.com/',
    icon: MessageCircleIcon,
    cta: 'View Community',
  },
  {
    title: 'Reconstitution Calculator',
    description: 'Calculate bacteriostatic water volume, accurate dose concentration, and units per dose.',
    to: '/calculator',
    icon: CalculatorIcon,
    cta: 'View Calculator',
  },
  {
    title: 'Articles',
    description: 'Read published research articles, analysis, and peptide-focused writeups in one place.',
    to: '/peptides',
    icon: NewspaperIcon,
    cta: 'View Articles',
  },
] as const

export function FeaturedResources() {
  return (
    <section className="space-y-5" aria-label="Featured resources">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-[800] font-stretch-semi-expanded leading-tight tracking-[-1px] text-neutral-950 dark:text-white">Featured Resources</h2>
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
                    {'to' in resource ? (
                      <Link
                        to={resource.to}
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 transition-colors hover:text-neutral-950 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:text-white"
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    ) : (
                      <a
                        href={resource.href}
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 transition-colors hover:text-neutral-950 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:text-white"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex min-h-7 min-w-0 items-start">
                        {'to' in resource ? (
                          <Link
                            to={resource.to}
                            className="block min-w-0 flex-1 truncate text-lg font-bold leading-[1.1] text-neutral-950 transition-colors hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300"
                          >
                            {resource.title}
                          </Link>
                        ) : (
                          <a
                            href={resource.href}
                            className="block min-w-0 flex-1 truncate text-lg font-bold leading-[1.1] text-neutral-950 transition-colors hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300"
                          >
                            {resource.title}
                          </a>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex shrink-0 items-center rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-300">
                          <span className="mr-1" aria-hidden="true">💡</span>Resource
                        </span>
                      </div>
                    </div>
                  </div>
                </header>

                <p className="-mt-1.5 min-h-14 line-clamp-3 text-base leading-7 text-neutral-500 dark:text-neutral-300">
                  {resource.description}
                </p>

                <div className="mt-auto flex items-center gap-3">
                  {'to' in resource ? (
                    <Link
                      to={resource.to}
                      className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-black px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                    >
                      {resource.cta}
                    </Link>
                  ) : (
                    <a
                      href={resource.href}
                      className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-black px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                    >
                      {resource.cta}
                    </a>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
