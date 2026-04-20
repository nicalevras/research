import type { Compound, VendorCompoundOption } from '~/lib/types'

export function withVendorCounts(compounds: Compound[], vendors: VendorCompoundOption[]): Compound[] {
  const counts = new Map<string, number>()

  for (const vendor of vendors) {
    for (const compoundSlug of new Set(vendor.compoundSlugs)) {
      counts.set(compoundSlug, (counts.get(compoundSlug) ?? 0) + 1)
    }
  }

  return compounds.map((compound) => ({
    ...compound,
    vendorCount: counts.get(compound.id) ?? 0,
  }))
}
