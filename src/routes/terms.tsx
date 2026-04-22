import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE_URL } from '~/lib/constants'
import { ChevronRightIcon } from '~/components/icons'

export const Route = createFileRoute('/terms')({
  head: () => {
    const pageTitle = 'Terms and Conditions - Peptide Directory'
    const pageDescription = 'Terms and conditions for using Peptide Directory.'
    const canonicalUrl = `${SITE_URL}/terms`

    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: pageDescription },
        { name: 'robots', content: 'noindex, follow' },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
    }
  },
  component: TermsPage,
})

function TermsPage() {
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
        <span className="truncate font-medium text-neutral-900 dark:text-white">
          Terms and Conditions
        </span>
      </nav>

      <section className="glass-card-solid p-6 shadow-none">
        <div className="max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl font-[900] font-stretch-semi-expanded leading-tight tracking-[-1px] text-neutral-950 dark:text-white">
              Terms and Conditions
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Last updated April 22, 2026
            </p>
          </div>

          <div className="space-y-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            <p>
              By using Peptide Directory, you agree to use the site for informational and research comparison purposes only.
            </p>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">No Medical Advice</h2>
              <p>
                Content on this site is not medical advice, diagnosis, treatment, or a recommendation to buy or use any compound. Always consult a qualified professional.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Vendor Information</h2>
              <p>
                Vendor profiles, ratings, promo codes, payment methods, COA details, and peptide availability may change. Verify details directly with the vendor before relying on them.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Accounts and Reviews</h2>
              <p>
                You are responsible for the information you submit. Reviews should be accurate, lawful, and free of private health information or sensitive personal data.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Research Use</h2>
              <p>
                Peptide Directory is a comparison directory. The site does not manufacture, sell, prescribe, or dispense peptides or related products.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
