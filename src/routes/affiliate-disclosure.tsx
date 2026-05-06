import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE_NAME, SITE_URL } from '~/lib/constants'
import { ChevronRightIcon } from '~/components/icons'

export const Route = createFileRoute('/affiliate-disclosure')({
  head: () => {
    const pageTitle = `Affiliate Disclosure - ${SITE_NAME}`
    const pageDescription = `Affiliate disclosure for ${SITE_NAME}, including how vendor links may earn commissions.`
    const canonicalUrl = `${SITE_URL}/affiliate-disclosure`

    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: pageDescription },
        { name: 'robots', content: 'noindex, follow' },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
    }
  },
  component: AffiliateDisclosurePage,
})

function AffiliateDisclosurePage() {
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
          Affiliate Disclosure
        </span>
      </nav>

      <section className="glass-card-solid p-6 shadow-none">
        <div className="max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl font-[900] font-stretch-semi-expanded leading-tight tracking-[-1px] text-neutral-950 dark:text-white">
              Affiliate Disclosure
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Last updated May 6, 2026
            </p>
          </div>

          <div className="space-y-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            <p>
              {SITE_NAME} may earn commissions, referral fees, or other compensation when you click vendor links, coupon links, or other outbound links and make a purchase from a third-party vendor.
            </p>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Affiliate Links</h2>
              <p>
                Some vendor profile links, coupon links, buttons, and other outbound links are affiliate or referral links. If you use those links, the vendor or affiliate network may track the referral and compensate {SITE_NAME} at no additional cost to you.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Editorial Independence</h2>
              <p>
                Affiliate relationships do not guarantee a vendor rating, ranking, recommendation, review outcome, profile placement, or favorable coverage. Vendor information, user reviews, and directory content should be evaluated independently.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Reviews and Ratings</h2>
              <p>
                User reviews and ratings should reflect genuine user experiences. We do not sell positive reviews, require positive reviews, or remove reviews solely because they are negative.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Vendor Information</h2>
              <p>
                Vendor availability, product listings, pricing, promo codes, payment methods, COAs, shipping policies, and affiliate terms may change. Verify important details directly with the vendor before purchasing.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Research Use</h2>
              <p>
                {SITE_NAME} is a comparison directory and does not manufacture, sell, prescribe, dispense, ship, test, or verify peptides or related products. Content on this site is for informational and research comparison purposes only and is not medical advice or a recommendation to buy or use any compound.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Third-Party Vendors</h2>
              <p>
                Purchases, fulfillment, refunds, product quality, product claims, shipping, payment processing, and legal compliance are handled by third-party vendors, not {SITE_NAME}. Review each vendor's own policies before making a purchase.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">Contact</h2>
              <p>
                Questions about affiliate relationships may be sent to contact@aminorank.com.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
