import { Link } from '@tanstack/react-router'
import { AminoRankMark, ChevronRightIcon } from '~/components/icons'
import { trackForumClick } from '~/lib/analytics'
import { SITE_NAME } from '~/lib/constants'

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
      {children}
    </h2>
  )
}

function FooterLink({
  to,
  href,
  target,
  rel,
  onClick,
  children,
}: {
  to?: string
  href?: string
  target?: string
  rel?: string
  onClick?: () => void
  children: React.ReactNode
}) {
  const className =
    'inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'

  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} className={className}>
        {children}
        <ChevronRightIcon className="h-3 w-3 opacity-50" />
      </a>
    )
  }

  return (
    <Link to={to!} className={className}>
      {children}
      <ChevronRightIcon className="h-3 w-3 opacity-50" />
    </Link>
  )
}

export function SiteFooter() {
  return (
    <footer className="mx-4 mt-16 border-t border-neutral-200/60 py-10 dark:border-white/[0.06] sm:mx-6 lg:mx-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
        <div className="max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5 text-[17px] font-[900] font-stretch-semi-expanded tracking-[-1px] text-neutral-900 dark:text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-[#8cff00] dark:bg-white dark:text-neutral-950" aria-hidden="true">
              <AminoRankMark className="h-7 w-7" />
            </span>
            {SITE_NAME}
          </Link>
          <p className="mt-4 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Compare peptide vendors, peptide profiles, promo codes, COAs, payment methods, and research tools in one focused directory.
          </p>
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>

        <nav className="space-y-3" aria-label="Footer directory links">
          <FooterHeading>Navigation</FooterHeading>
          <div className="flex flex-col items-start gap-2">
            <FooterLink to="/vendors">Peptide Vendors</FooterLink>
            <FooterLink to="/peptides">Peptide Catalog</FooterLink>
            <FooterLink href="https://community.aminorank.com/" target="_blank" rel="noopener noreferrer" onClick={() => trackForumClick('footer')}>Community</FooterLink>
            <FooterLink to="/articles">Articles</FooterLink>
            <FooterLink to="/calculator">Calculator</FooterLink>
          </div>
        </nav>

        <nav className="space-y-3" aria-label="Footer account links">
          <FooterHeading>Account</FooterHeading>
          <div className="flex flex-col items-start gap-2">
            <FooterLink to="/favorites">Favorites</FooterLink>
            <FooterLink to="/account">Account</FooterLink>
          </div>
        </nav>

        <nav className="space-y-3" aria-label="Footer legal links">
          <FooterHeading>Legal</FooterHeading>
          <div className="flex flex-col items-start gap-2">
            <FooterLink to="/terms">Terms and Conditions</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/affiliate-disclosure">Affiliate Disclosure</FooterLink>
          </div>
        </nav>
      </div>

      <div className="mt-10 border-t border-neutral-200/60 pt-6 text-neutral-600 dark:border-white/[0.06] dark:text-neutral-300">
        <p className="max-w-5xl text-xs leading-5">
          Some vendor links may be affiliate or referral links. {SITE_NAME} may earn a commission at no additional cost to you. For research comparison and informational purposes only. Not medical advice, diagnosis, treatment, or a recommendation to use any product or compound.
        </p>
      </div>
    </footer>
  )
}
