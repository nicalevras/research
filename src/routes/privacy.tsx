import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE_URL } from '~/lib/constants'
import { ChevronRightIcon } from '~/components/icons'

export const Route = createFileRoute('/privacy')({
  head: () => {
    const pageTitle = 'Privacy Policy - Peptide Directory'
    const pageDescription = 'Privacy policy for Peptide Directory, including account, favorites, review, and usage data.'
    const canonicalUrl = `${SITE_URL}/privacy`

    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: pageDescription },
        { name: 'robots', content: 'noindex, follow' },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
    }
  },
  component: PrivacyPage,
})

function PrivacyPage() {
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
          Privacy Policy
        </span>
      </nav>

      <section className="glass-card-solid p-6 shadow-none">
        <div className="max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl font-[900] font-stretch-semi-expanded leading-tight tracking-[-1px] text-neutral-950 dark:text-white">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Last updated April 22, 2026
            </p>
          </div>

          <div className="space-y-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            <p>
              Peptide Directory collects only the information needed to operate accounts, favorites, reviews, and site preferences.
            </p>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Information We Use</h2>
              <p>
                Account information may include your name, username, email address, sign-in provider, favorites, reviews, and basic session data. Theme preference may be stored locally in your browser.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">How We Use It</h2>
              <p>
                We use this information to provide account access, save favorite vendors, display reviews, protect the service, and keep the directory usable.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Research Content</h2>
              <p>
                The directory is for research comparison. Do not submit private health information, medical history, or sensitive personal details in reviews or account fields.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Your Choices</h2>
              <p>
                You can update your account details, remove favorites, edit or delete reviews, and delete your account from the account page.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
