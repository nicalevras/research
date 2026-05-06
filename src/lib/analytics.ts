import type { Vendor, VendorSummary } from '~/lib/types'

type PlausibleValue = string | number | boolean | null | undefined
type PlausibleProps = Record<string, PlausibleValue>

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string> }) => void
  }
}

export type AnalyticsSurface =
  | 'top_nav'
  | 'mobile_menu'
  | 'footer'
  | 'home_featured'
  | 'home_resource_card'
  | 'vendor_directory'
  | 'vendor_profile'
  | 'vendor_profile_primary'
  | 'vendor_profile_peptide_table'
  | 'peptide_directory'
  | 'peptide_profile'
  | 'favorites'

const AUTH_EVENT_KEY = 'aminorank:pending-auth-event'

function cleanProps(props?: PlausibleProps) {
  if (!props) return undefined

  const clean: Record<string, string> = {}
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === '') continue
    clean[key] = String(value)
  }

  return Object.keys(clean).length > 0 ? clean : undefined
}

function sourcePath() {
  if (typeof window === 'undefined') return undefined
  return `${window.location.pathname}${window.location.search}`
}

export function trackEvent(eventName: string, props?: PlausibleProps) {
  if (typeof window === 'undefined') return

  window.plausible?.(eventName, {
    props: cleanProps({
      source_path: sourcePath(),
      ...props,
    }),
  })
}

type TrackableVendor = Pick<VendorSummary, 'id' | 'name'> & Partial<Pick<VendorSummary, 'sortOrder' | 'promoCode'>>

function vendorProps(vendor: TrackableVendor) {
  return {
    vendor_slug: vendor.id,
    vendor_name: vendor.name,
    vendor_sort_order: vendor.sortOrder,
    has_promo: Boolean(vendor.promoCode),
  }
}

export function trackVendorProfileClick(vendor: TrackableVendor, surface: AnalyticsSurface, peptideSlug?: string) {
  trackEvent('Vendor Profile Click', {
    ...vendorProps(vendor),
    surface,
    peptide_slug: peptideSlug,
  })
}

export function trackVendorOutboundClick(vendor: Vendor, surface: AnalyticsSurface, peptideSlug?: string) {
  trackEvent('Vendor Outbound Click', {
    ...vendorProps(vendor),
    surface,
    peptide_slug: peptideSlug,
  })
}

export function trackPromoCodeCopy(vendor: Pick<VendorSummary, 'id' | 'name' | 'sortOrder' | 'promoCode' | 'promoDiscountPercent'>, surface: AnalyticsSurface) {
  trackEvent('Promo Code Copy', {
    ...vendorProps(vendor),
    surface,
    promo_discount_percent: vendor.promoDiscountPercent,
  })
}

export function trackPeptideVendorsClick(peptide: { id: string; name: string; vendorCount?: number }, surface: AnalyticsSurface) {
  trackEvent('Peptide Vendors Click', {
    peptide_slug: peptide.id,
    peptide_name: peptide.name,
    vendor_count: peptide.vendorCount,
    surface,
  })
}

export function trackForumClick(surface: AnalyticsSurface) {
  trackEvent('Forum Click', { surface })
}

export function trackFavoriteToggled(vendorId: string, favorited: boolean, surface?: AnalyticsSurface) {
  trackEvent('Favorite Toggled', {
    vendor_slug: vendorId,
    action: favorited ? 'save' : 'remove',
    surface,
  })
}

export function trackReviewSubmitted(vendorId: string, rating: number) {
  trackEvent('Review Submitted', {
    vendor_slug: vendorId,
    rating_bucket: Math.round(rating),
  })
}

export function trackAuthCompleted(eventName: 'Sign In Completed' | 'Sign Up Completed', method: 'email' | 'google') {
  trackEvent(eventName, { method })
}

export function rememberPendingAuthEvent(eventName: 'Sign In Completed' | 'Sign Up Completed') {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(AUTH_EVENT_KEY, eventName)
}

export function consumePendingAuthEvent() {
  if (typeof window === 'undefined') return null

  const eventName = window.localStorage.getItem(AUTH_EVENT_KEY)
  if (eventName !== 'Sign In Completed' && eventName !== 'Sign Up Completed') return null

  window.localStorage.removeItem(AUTH_EVENT_KEY)
  return eventName
}
