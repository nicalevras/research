export const SITE_URL = process.env.SITE_URL || ''

export const TAGS: { id: string; name: string; emoji: string }[] = [
  { id: 'credit-card', name: 'Credit Card', emoji: '💳' },
  { id: 'crypto', name: 'Crypto', emoji: '' },
  { id: 'free-shipping', name: 'Free Shipping', emoji: '📦' },
  { id: 'lab-tested', name: 'Lab Tested', emoji: '🔬' },
  { id: 'gmp-certified', name: 'GMP Certified', emoji: '✅' },
  { id: 'ships-international', name: 'Ships International', emoji: '🌍' },
  { id: 'money-back', name: 'Money-Back Guarantee', emoji: '💰' },
  { id: 'same-day-shipping', name: 'Same-Day Shipping', emoji: '⚡' },
  { id: 'coa-available', name: 'COA Available', emoji: '📋' },
  { id: 'bulk-discounts', name: 'Bulk Discounts', emoji: '🏷️' },
]

export const COMPOUNDS: { id: string; name: string }[] = [
  { id: 'bpc-157', name: 'BPC-157' },
  { id: 'tb-500', name: 'TB-500' },
  { id: 'nad-plus', name: 'NAD+' },
  { id: 'epitalon', name: 'Epitalon' },
  { id: 'ghk-cu', name: 'GHK-Cu' },
  { id: 'ipamorelin', name: 'Ipamorelin' },
  { id: 'cjc-1295', name: 'CJC-1295' },
  { id: 'ghrp-2', name: 'GHRP-2' },
  { id: 'ghrp-6', name: 'GHRP-6' },
  { id: 'melanotan-ii', name: 'Melanotan II' },
  { id: 'pt-141', name: 'PT-141' },
  { id: 'thymosin-alpha-1', name: 'Thymosin Alpha-1' },
  { id: 'mots-c', name: 'MOTS-c' },
  { id: 'ss-31', name: 'SS-31' },
  { id: 'glutathione', name: 'Glutathione' },
  { id: 'selank', name: 'Selank' },
  { id: 'semax', name: 'Semax' },
  { id: 'll-37', name: 'LL-37' },
  { id: 'matrixyl', name: 'Matrixyl' },
  { id: 'argireline', name: 'Argireline' },
]

export const COUNTRIES = [
  'All Countries',
  'Canada',
  'China',
  'France',
  'Germany',
  'South Korea',
  'Switzerland',
  'USA',
] as const
