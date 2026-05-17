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

export function GHKCuProfileCta() {
  return (
    <ArticleCta
      href="/peptides/ghk-cu"
      title="Explore the AminoRank GHK-Cu profile"
      description="Review linked studies, category details, and vendor availability for GHK-Cu."
      cta="View GHK-Cu profile"
    />
  )
}

export function TesamorelinProfileCta() {
  return (
    <ArticleCta
      href="/peptides/tesamorelin"
      title="Explore the AminoRank tesamorelin profile"
      description="Review linked studies, category details, and vendor availability for tesamorelin."
      cta="View tesamorelin profile"
    />
  )
}

export function BPC157ProfileCta() {
  return (
    <ArticleCta
      href="/peptides/bpc-157"
      title="Explore the AminoRank BPC-157 profile"
      description="Review linked studies, category details, and vendor availability for BPC-157."
      cta="View BPC-157 profile"
    />
  )
}

export function BPC157TB500ProfileCta() {
  return (
    <ArticleCta
      href="/peptides/bpc-157-tb-500"
      title="Explore the AminoRank BPC-157/TB-500 profile"
      description="Review category details and vendor availability for the BPC-157/TB-500 blend."
      cta="View BPC-157/TB-500 profile"
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

export function BPC157VendorCta() {
  return (
    <ArticleCta
      href="/vendors?peptide=bpc-157"
      title="Compare BPC-157 research vendors"
      description="Browse vendors by COAs, reviews, discounts, shipping, and payment options."
      cta="View BPC-157 vendors"
    />
  )
}

export function BPC157TB500VendorCta() {
  return (
    <ArticleCta
      href="/vendors?peptide=bpc-157-tb-500"
      title="Compare BPC-157/TB-500 research vendors"
      description="Browse blend vendors by COAs, reviews, discounts, shipping, and payment options."
      cta="View BPC-157/TB-500 vendors"
    />
  )
}

export function GHKCuVendorCta() {
  return (
    <ArticleCta
      href="/vendors?peptide=ghk-cu"
      title="Compare GHK-Cu research vendors"
      description="Browse vendors by COAs, reviews, discounts, shipping, and payment options."
      cta="View GHK-Cu vendors"
    />
  )
}

export function TesamorelinVendorCta() {
  return (
    <ArticleCta
      href="/vendors?peptide=tesamorelin"
      title="Compare tesamorelin research vendors"
      description="Browse vendors by COAs, reviews, discounts, shipping, and payment options."
      cta="View tesamorelin vendors"
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
