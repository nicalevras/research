import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE_NAME, SITE_URL } from '~/lib/constants'
import { ChevronRightIcon } from '~/components/icons'

export const Route = createFileRoute('/terms')({
  head: () => {
    const pageTitle = `Terms and Conditions - ${SITE_NAME}`
    const pageDescription = `Terms and conditions for using ${SITE_NAME}.`
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
              Last updated May 6, 2026
            </p>
          </div>

          <div className="space-y-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            <p>
              By accessing or using {SITE_NAME}, you agree to these terms. If you do not agree, do not use the site.
            </p>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Informational Research Directory</h2>
              <p>
                {SITE_NAME} is a comparison directory for informational and research comparison purposes only. We do not manufacture, sell, prescribe, dispense, ship, test, or verify any peptide, compound, product, or service listed by third-party vendors.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Adults Only</h2>
              <p>
                The site is intended for adults. Minors may not create accounts, submit reviews, or use the site.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">No Medical, Legal, or Safety Advice</h2>
              <p>
                Content on this site is not medical advice, diagnosis, treatment, legal advice, safety advice, or a recommendation to buy, use, consume, inject, compound, or administer any product or compound. Always consult qualified professionals and independently evaluate applicable laws and risks.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Vendor Information</h2>
              <p>
                Vendor profiles, ratings, promo codes, payment methods, COA details, country information, shipping details, product availability, and website links may be incomplete, inaccurate, or out of date. Verify all details directly with the vendor before relying on them.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Third-Party Vendors and Links</h2>
              <p>
                Vendors are independent third parties. {SITE_NAME} is not a party to any transaction between you and a vendor and is not responsible for vendor products, claims, fulfillment, shipping, refunds, payment processing, lab reports, website content, legal compliance, or customer service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Accounts and Reviews</h2>
              <p>
                You are responsible for the information you submit. Reviews must reflect your genuine experience, be accurate to the best of your knowledge, and be lawful. Do not submit fake reviews, compensated reviews without disclosure, reviews on behalf of a vendor, defamatory content, spam, harassment, private health information, medical history, dosing details, or sensitive personal data.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Review Moderation</h2>
              <p>
                We may edit, reject, hide, or remove reviews and account content for policy violations, suspected fraud, conflicts of interest, private information, legal risk, spam, irrelevant content, or operational reasons. We do not remove reviews solely because they are negative.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">User Content License</h2>
              <p>
                By submitting reviews or other content, you give {SITE_NAME} a non-exclusive, worldwide, royalty-free license to host, display, reproduce, modify for formatting, and distribute that content in connection with operating and promoting the site.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Affiliate Relationships</h2>
              <p>
                Some outbound vendor links, coupon links, or other links may be affiliate or referral links. {SITE_NAME} may earn compensation if you click those links or purchase from a third-party vendor. See our Affiliate Disclosure for more information.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Account Suspension and Termination</h2>
              <p>
                We may suspend, restrict, or terminate accounts or access to the site if we believe a user has violated these terms, created risk for other users, submitted abusive or fraudulent content, or interfered with the operation of the service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Disclaimer of Warranties</h2>
              <p>
                The site is provided as is and as available. We do not warrant that the site, vendor information, ratings, reviews, links, data, or content will be accurate, complete, available, secure, uninterrupted, or error-free.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, {SITE_NAME} and its operators are not liable for indirect, incidental, consequential, special, exemplary, or punitive damages, or for losses arising from your use of the site, reliance on site content, interactions with vendors, or third-party products and services.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Changes and Contact</h2>
              <p>
                We may update these terms from time to time. Continued use of the site after changes means you accept the updated terms. Questions may be sent to contact@aminorank.com.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
