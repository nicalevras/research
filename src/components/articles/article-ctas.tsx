import { ChevronRightIcon } from '~/components/icons'

type ArticleCtaProps = {
  title: string
  description: string
  href: string
  cta: string
}

function ArticleCta({ title, description, href, cta }: ArticleCtaProps) {
  const className = 'mt-6 block rounded-lg border border-neutral-200/80 bg-white p-4 transition-colors hover:bg-neutral-50 dark:border-white/[0.08] dark:bg-neutral-900 dark:hover:bg-white/[0.04]'
  const inner = (
    <>
      <span className="block text-sm font-bold text-neutral-950 dark:text-white">{title}</span>
      <span className="mt-1 block text-sm leading-6 text-neutral-600 dark:text-neutral-300">{description}</span>
      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-950 dark:text-white">
        {cta}
        <ChevronRightIcon className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
      </span>
    </>
  )

  return (
    <a href={href} className={className}>
      {inner}
    </a>
  )
}

export function ProfileCta() {
  return (
    <ArticleCta
      href="/peptides/retatrutide"
      title="Explore the AminoRank retatrutide profile"
      description="Review linked studies, category details, and vendor availability for retatrutide."
      cta="View retatrutide profile"
    />
  )
}

export function VendorCta() {
  return (
    <ArticleCta
      href="/vendors?peptide=retatrutide"
      title="Compare retatrutide research vendors"
      description="Browse vendors by COAs, reviews, discounts, shipping, and payment options."
      cta="View retatrutide vendors"
    />
  )
}

export function CalculatorCta() {
  return (
    <ArticleCta
      href="/calculator"
      title="Use the peptide calculator"
      description="Calculate concentration and syringe-unit math for research planning."
      cta="Open calculator"
    />
  )
}
