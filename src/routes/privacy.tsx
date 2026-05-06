import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE_NAME, SITE_URL } from '~/lib/constants'
import { ChevronRightIcon } from '~/components/icons'

export const Route = createFileRoute('/privacy')({
  head: () => {
    const pageTitle = `Privacy Policy - ${SITE_NAME}`
    const pageDescription = `Privacy policy for ${SITE_NAME}, including account, favorites, review, and usage data.`
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
              Last updated May 6, 2026
            </p>
          </div>

          <div className="space-y-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            <p>
              {SITE_NAME} collects and uses information needed to operate accounts, favorites, reviews, vendor discovery, site security, and basic product analytics.
            </p>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Information You Provide</h2>
              <p>
                Account information may include your name, username, email address, password authentication data, sign-in provider, profile image, favorites, reviews, ratings, review comments, account settings, and information you submit through the site.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Information Collected Automatically</h2>
              <p>
                We may collect basic technical information such as session identifiers, IP address, user agent, timestamps, authentication events, and security logs. Theme preference may be stored locally in your browser.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Analytics</h2>
              <p>
                We may use Plausible Analytics to understand aggregate site usage. Plausible is designed to be cookie-free and privacy-focused, and we do not use it to build cross-site advertising profiles.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">How We Use Information</h2>
              <p>
                We use information to provide account access, save favorite vendors, display and manage reviews, calculate vendor ratings, prevent abuse, protect the service, troubleshoot issues, communicate about account actions, and improve the directory.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Public Reviews</h2>
              <p>
                Reviews, ratings, usernames, vendor names, and review timestamps may be visible publicly. Do not include private health information, medical history, dosing information, personal contact details, or sensitive personal data in reviews or account fields.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Affiliate and Outbound Links</h2>
              <p>
                Some outbound vendor links may be affiliate or referral links. When you click those links, the destination vendor or affiliate network may receive information needed to track the referral, such as the referring page or link identifier. Their privacy practices are governed by their own policies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Service Providers</h2>
              <p>
                We may use service providers for hosting, databases, authentication, email delivery, analytics, security, and site operations. These providers may process information only as needed to provide their services to us.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Retention and Deletion</h2>
              <p>
                We keep information for as long as needed to operate the site, comply with legal obligations, resolve disputes, prevent abuse, and maintain records. You can edit or delete reviews, remove favorites, update account details, and delete your account from the account page.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Security</h2>
              <p>
                We use reasonable safeguards designed to protect account and site data, but no website, database, or transmission method can be guaranteed to be completely secure.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Minors</h2>
              <p>
                {SITE_NAME} is intended for adults and is not intended for minors. We do not knowingly collect personal information from minors.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Your Choices and Contact</h2>
              <p>
                You may contact us about privacy questions, account data, or deletion requests at contact@aminorank.com. Depending on where you live, you may have additional privacy rights under applicable law.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
