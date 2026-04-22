import { Link } from '@tanstack/react-router'
import { ChevronRightIcon } from '~/components/icons'

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
      {children}
    </h2>
  )
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
    >
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
          <Link to="/" className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight text-neutral-950 dark:text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-base dark:bg-white" aria-hidden="true">
              🧪
            </span>
            Peptide Directory
          </Link>
          <p className="mt-4 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Compare peptide vendors, peptide profiles, promo codes, COAs, payment methods, and research tools in one focused directory.
          </p>
        </div>

        <nav className="space-y-3" aria-label="Footer directory links">
          <FooterHeading>Directory</FooterHeading>
          <div className="flex flex-col items-start gap-2">
            <FooterLink to="/vendors">Peptide Vendors</FooterLink>
            <FooterLink to="/peptides">Peptide Catalog</FooterLink>
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
          </div>
        </nav>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-neutral-200/60 pt-6 text-sm text-neutral-400 dark:border-white/[0.06] dark:text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Peptide Directory</p>
        <p className="max-w-2xl leading-6">
          For research comparison only. Not medical advice, diagnosis, or treatment.
        </p>
      </div>
    </footer>
  )
}
