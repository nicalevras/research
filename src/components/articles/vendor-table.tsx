import { Link } from '@tanstack/react-router'
import type { VendorSummary } from '~/lib/types'
import { ChevronRightIcon } from '~/components/icons'
import { trackVendorOutboundClick } from '~/lib/analytics'

type VendorTableVariant = 'full' | 'promo' | 'trust' | 'payment' | 'shipping'

type RetatrutideVendorTableProps = {
  vendors: VendorSummary[]
  variant?: VendorTableVariant
  title?: string
  limit?: number
}

type PeptideVendorTableProps = RetatrutideVendorTableProps & {
  peptideSlug: string
  peptideName: string
}

type PeptideVendorSnapshotProps = {
  vendors: VendorSummary[]
  title?: string
  peptideSlug: string
  peptideName: string
}

function yesNo(value: boolean) {
  return value ? 'Yes' : 'No'
}

function paymentMethods(vendor: VendorSummary) {
  const methods = [
    vendor.acceptsCreditCard ? 'Card' : undefined,
    vendor.acceptsAch ? 'ACH' : undefined,
    vendor.acceptsCrypto ? 'Crypto' : undefined,
  ].filter(Boolean)

  return methods.length > 0 ? methods.join(', ') : 'Not listed'
}

function shippingSummary(vendor: VendorSummary) {
  const shipping = [
    vendor.fastShipping ? 'Fast shipping' : undefined,
    vendor.shipsInternational ? 'International' : undefined,
  ].filter(Boolean)

  return shipping.length > 0 ? shipping.join(', ') : 'Standard'
}

function promoSummary(vendor: VendorSummary) {
  if (!vendor.promoCode) return 'None listed'
  return vendor.promoDiscountPercent ? `${vendor.promoDiscountPercent}% off (${vendor.promoCode})` : vendor.promoCode
}

function VendorWebsiteLink({ vendor, peptideSlug }: { vendor: VendorSummary; peptideSlug: string }) {
  return (
    <a
      href={vendor.website}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={() => trackVendorOutboundClick(vendor, 'article_vendor_table', peptideSlug)}
      className="inline-flex items-center gap-1"
    >
      Buy
      <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  )
}

function visibleVendors(vendors: VendorSummary[], variant: VendorTableVariant, limit: number) {
  const filtered = variant === 'promo'
    ? vendors.filter((vendor) => vendor.promoCode)
    : variant === 'trust'
      ? vendors.filter((vendor) => vendor.hasCoa)
      : variant === 'payment'
        ? vendors.filter((vendor) => vendor.acceptsCreditCard || vendor.acceptsAch || vendor.acceptsCrypto)
        : variant === 'shipping'
          ? vendors.filter((vendor) => vendor.fastShipping || vendor.shipsInternational)
          : vendors
  return filtered.slice(0, limit)
}

function FullRows({ vendors, peptideSlug }: { vendors: VendorSummary[]; peptideSlug: string }) {
  return (
    <>
      {vendors.map((vendor) => (
        <tr key={vendor.id}>
          <td>
            <Link to="/vendors/$id" params={{ id: vendor.id }}>{vendor.name}</Link>
          </td>
          <td>{vendor.country}</td>
          <td>{vendor.rating.toFixed(1)} ({vendor.reviewCount})</td>
          <td>{yesNo(vendor.hasCoa)}</td>
          <td>{promoSummary(vendor)}</td>
          <td>{paymentMethods(vendor)}</td>
          <td>{shippingSummary(vendor)}</td>
          <td>
            <VendorWebsiteLink vendor={vendor} peptideSlug={peptideSlug} />
          </td>
        </tr>
      ))}
    </>
  )
}

function PromoRows({ vendors, peptideSlug }: { vendors: VendorSummary[]; peptideSlug: string }) {
  return (
    <>
      {vendors.map((vendor) => (
        <tr key={vendor.id}>
          <td>
            <Link to="/vendors/$id" params={{ id: vendor.id }}>{vendor.name}</Link>
          </td>
          <td>{vendor.promoDiscountPercent ? `${vendor.promoDiscountPercent}%` : 'Listed'}</td>
          <td>{vendor.promoCode ?? 'None listed'}</td>
          <td>{yesNo(vendor.hasCoa)}</td>
          <td>{paymentMethods(vendor)}</td>
          <td>
            <VendorWebsiteLink vendor={vendor} peptideSlug={peptideSlug} />
          </td>
        </tr>
      ))}
    </>
  )
}

function TrustRows({ vendors, peptideSlug }: { vendors: VendorSummary[]; peptideSlug: string }) {
  return (
    <>
      {vendors.map((vendor) => (
        <tr key={vendor.id}>
          <td>
            <Link to="/vendors/$id" params={{ id: vendor.id }}>{vendor.name}</Link>
          </td>
          <td>{vendor.country}</td>
          <td>{yesNo(vendor.hasCoa)}</td>
          <td>{vendor.rating.toFixed(1)}</td>
          <td>{vendor.reviewCount}</td>
          <td>{vendor.verified ? 'Verified listing' : 'Listed vendor'}</td>
          <td>
            <VendorWebsiteLink vendor={vendor} peptideSlug={peptideSlug} />
          </td>
        </tr>
      ))}
    </>
  )
}

function PaymentRows({ vendors, peptideSlug }: { vendors: VendorSummary[]; peptideSlug: string }) {
  return (
    <>
      {vendors.map((vendor) => (
        <tr key={vendor.id}>
          <td>
            <Link to="/vendors/$id" params={{ id: vendor.id }}>{vendor.name}</Link>
          </td>
          <td>{vendor.acceptsCreditCard ? 'Yes' : 'No'}</td>
          <td>{vendor.acceptsAch ? 'Yes' : 'No'}</td>
          <td>{vendor.acceptsCrypto ? 'Yes' : 'No'}</td>
          <td>{promoSummary(vendor)}</td>
          <td>
            <VendorWebsiteLink vendor={vendor} peptideSlug={peptideSlug} />
          </td>
        </tr>
      ))}
    </>
  )
}

function ShippingRows({ vendors, peptideSlug }: { vendors: VendorSummary[]; peptideSlug: string }) {
  return (
    <>
      {vendors.map((vendor) => (
        <tr key={vendor.id}>
          <td>
            <Link to="/vendors/$id" params={{ id: vendor.id }}>{vendor.name}</Link>
          </td>
          <td>{vendor.country}</td>
          <td>{vendor.fastShipping ? 'Yes' : 'No'}</td>
          <td>{vendor.shipsInternational ? 'Yes' : 'No'}</td>
          <td>{vendor.rating.toFixed(1)} ({vendor.reviewCount})</td>
          <td>
            <VendorWebsiteLink vendor={vendor} peptideSlug={peptideSlug} />
          </td>
        </tr>
      ))}
    </>
  )
}

function PeptideVendorTable({
  vendors,
  variant = 'full',
  title,
  limit = 8,
  peptideSlug,
  peptideName,
}: PeptideVendorTableProps) {
  const rows = visibleVendors(vendors, variant, limit)
  const resolvedTitle = title ?? `${peptideName} Research Vendors On AminoRank`

  if (rows.length === 0) {
    return (
      <aside className="my-6 rounded-lg border border-neutral-200/80 bg-white p-4 text-sm text-neutral-600 dark:border-white/[0.08] dark:bg-neutral-900 dark:text-neutral-300">
        No matching {peptideName} vendor data is currently available for this table.
      </aside>
    )
  }

  return (
    <section className="my-8" aria-label={resolvedTitle}>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="m-0 text-lg font-bold leading-tight text-neutral-950 dark:text-white">{resolvedTitle}</h3>
        <a href={`/vendors?peptide=${peptideSlug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-950 dark:text-white">
          View all {peptideName} vendors
          <ChevronRightIcon className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
        </a>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200/80 dark:border-white/[0.08]">
        <table className="min-w-[760px]">
          <thead>
            {variant === 'promo' ? (
              <tr>
                <th>Vendor</th>
                <th>Discount</th>
                <th>Promo Code</th>
                <th>COAs</th>
                <th>Payment</th>
                <th>Website</th>
              </tr>
            ) : variant === 'trust' ? (
              <tr>
                <th>Vendor</th>
                <th>Country</th>
                <th>COAs</th>
                <th>Rating</th>
                <th>Reviews</th>
                <th>Notes</th>
                <th>Website</th>
              </tr>
            ) : variant === 'payment' ? (
              <tr>
                <th>Vendor</th>
                <th>Card</th>
                <th>ACH</th>
                <th>Crypto</th>
                <th>Promo</th>
                <th>Website</th>
              </tr>
            ) : variant === 'shipping' ? (
              <tr>
                <th>Vendor</th>
                <th>Country</th>
                <th>Fast Shipping</th>
                <th>International</th>
                <th>Rating</th>
                <th>Website</th>
              </tr>
            ) : (
              <tr>
                <th>Vendor</th>
                <th>Country</th>
                <th>Rating</th>
                <th>COAs</th>
                <th>Promo</th>
                <th>Payment</th>
                <th>Shipping</th>
                <th>Website</th>
              </tr>
            )}
          </thead>
          <tbody>
            {variant === 'promo'
              ? <PromoRows vendors={rows} peptideSlug={peptideSlug} />
              : variant === 'trust'
                ? <TrustRows vendors={rows} peptideSlug={peptideSlug} />
                : variant === 'payment'
                  ? <PaymentRows vendors={rows} peptideSlug={peptideSlug} />
                  : variant === 'shipping'
                    ? <ShippingRows vendors={rows} peptideSlug={peptideSlug} />
                    : <FullRows vendors={rows} peptideSlug={peptideSlug} />}
          </tbody>
        </table>
      </div>

    </section>
  )
}

function PeptideVendorSnapshot({
  vendors,
  title,
  peptideSlug,
  peptideName,
}: PeptideVendorSnapshotProps) {
  if (vendors.length === 0) return null
  const resolvedTitle = title ?? `Current ${peptideName} Vendor Snapshot`

  const withCoas = vendors.filter((vendor) => vendor.hasCoa).length
  const withPromos = vendors.filter((vendor) => vendor.promoCode).length
  const acceptsCard = vendors.filter((vendor) => vendor.acceptsCreditCard).length
  const acceptsAch = vendors.filter((vendor) => vendor.acceptsAch).length
  const acceptsCrypto = vendors.filter((vendor) => vendor.acceptsCrypto).length
  const fastShipping = vendors.filter((vendor) => vendor.fastShipping).length
  const international = vendors.filter((vendor) => vendor.shipsInternational).length
  const reviewed = vendors.filter((vendor) => vendor.reviewCount > 0).length

  const stats = [
    { label: 'Listed vendors', value: vendors.length },
    { label: 'With COAs', value: withCoas },
    { label: 'With promo codes', value: withPromos },
    { label: 'Accept cards', value: acceptsCard },
    { label: 'Accept ACH', value: acceptsAch },
    { label: 'Accept crypto', value: acceptsCrypto },
    { label: 'Fast shipping', value: fastShipping },
    { label: 'International shipping', value: international },
    { label: 'With reviews', value: reviewed },
  ]

  return (
    <aside className="my-8 rounded-lg border border-neutral-200/80 bg-white p-5 dark:border-white/[0.08] dark:bg-neutral-900" aria-label={resolvedTitle}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="m-0 text-lg font-bold leading-tight text-neutral-950 dark:text-white">{resolvedTitle}</h3>
        <a href={`/vendors?peptide=${peptideSlug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-950 dark:text-white">
          View live directory
          <ChevronRightIcon className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
        </a>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-neutral-200/70 bg-neutral-50 p-3 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <div className="text-2xl font-[900] leading-none text-neutral-950 dark:text-white">{stat.value}</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export function RetatrutideVendorTable(props: RetatrutideVendorTableProps) {
  return <PeptideVendorTable {...props} peptideSlug="retatrutide" peptideName="Retatrutide" />
}

export function RetatrutideVendorSnapshot(props: Omit<PeptideVendorSnapshotProps, 'peptideSlug' | 'peptideName'>) {
  return <PeptideVendorSnapshot {...props} peptideSlug="retatrutide" peptideName="Retatrutide" />
}

export function GHKCuVendorTable(props: RetatrutideVendorTableProps) {
  return <PeptideVendorTable {...props} peptideSlug="ghk-cu" peptideName="GHK-Cu" />
}

export function GHKCuVendorSnapshot(props: Omit<PeptideVendorSnapshotProps, 'peptideSlug' | 'peptideName'>) {
  return <PeptideVendorSnapshot {...props} peptideSlug="ghk-cu" peptideName="GHK-Cu" />
}
