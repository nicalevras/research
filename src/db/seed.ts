import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const client = postgres(connectionString)
const db = drizzle(client, { schema })

const vendorData: (typeof schema.vendors.$inferInsert)[] = [
  {
    id: 'pep-sci',
    name: 'Peptide Sciences',
    website: 'https://peptidesciences.com',
    location: 'Henderson, NV',
    country: 'USA',
    rating: 4.8,
    reviewCount: 1240,
    category: 'research',
    description: 'Premium research peptides with rigorous third-party testing. Known for high purity levels and extensive catalog of over 100 peptide compounds.',
  },
  {
    id: 'limitless-life',
    name: 'Limitless Life Nootropics',
    website: 'https://limitlesslifenootropics.com',
    location: 'Phoenix, AZ',
    country: 'USA',
    rating: 4.5,
    reviewCount: 830,
    category: 'research',
    description: 'Specializes in research-grade peptides and nootropics with a focus on longevity and anti-aging compounds.',
  },
  {
    id: 'pure-rawz',
    name: 'Pure Rawz',
    website: 'https://purerawz.co',
    location: 'Provo, UT',
    country: 'USA',
    rating: 4.6,
    reviewCount: 960,
    category: 'research',
    description: 'Wide selection of research peptides and SARMs with verified COAs on every batch. Popular among biohacking community.',
  },
  {
    id: 'element-sarms',
    name: 'Element SARMs',
    website: 'https://elementsarms.com',
    location: 'Austin, TX',
    country: 'USA',
    rating: 4.3,
    reviewCount: 540,
    category: 'research',
    description: 'Research chemicals supplier offering peptides, SARMs, and nootropics with transparent lab reports.',
  },
  {
    id: 'swiss-chems',
    name: 'Swiss Chems',
    website: 'https://swisschems.is',
    location: 'Zurich',
    country: 'Switzerland',
    rating: 4.4,
    reviewCount: 710,
    category: 'research',
    description: 'European-based supplier of premium research peptides with pharmaceutical-grade quality standards.',
  },
  {
    id: 'canagen',
    name: 'Canagen Therapeutics',
    website: 'https://canagen.io',
    location: 'Vancouver, BC',
    country: 'Canada',
    rating: 4.7,
    reviewCount: 420,
    category: 'therapeutic',
    description: 'Developing peptide-based therapeutics for metabolic disorders and tissue repair. Clinical-stage biotech.',
  },
  {
    id: 'med-peptide',
    name: 'MedPeptide Labs',
    website: 'https://medpeptide.com',
    location: 'Boston, MA',
    country: 'USA',
    rating: 4.9,
    reviewCount: 380,
    category: 'therapeutic',
    description: 'Compounding pharmacy specializing in therapeutic peptides for hormone optimization and injury recovery.',
  },
  {
    id: 'restor-peptide',
    name: 'Restor Peptide Clinic',
    website: 'https://restorpeptide.com',
    location: 'Miami, FL',
    country: 'USA',
    rating: 4.6,
    reviewCount: 620,
    category: 'therapeutic',
    description: 'Telemedicine peptide therapy clinic offering BPC-157, TB-500, and growth hormone secretagogues with physician oversight.',
  },
  {
    id: 'vitality-institute',
    name: 'Vitality Peptide Institute',
    website: 'https://vitalitypeptide.com',
    location: 'Denver, CO',
    country: 'USA',
    rating: 4.5,
    reviewCount: 290,
    category: 'therapeutic',
    description: 'Integrative medicine practice focused on peptide therapy for anti-aging, immune support, and cognitive enhancement.',
  },
  {
    id: 'bio-thera-eu',
    name: 'BioTherapeutics EU',
    website: 'https://biotherapeutics.eu',
    location: 'Munich',
    country: 'Germany',
    rating: 4.7,
    reviewCount: 350,
    category: 'therapeutic',
    description: 'European biotech firm developing peptide-based drugs for autoimmune conditions and regenerative medicine.',
  },
  {
    id: 'skin-peptide-co',
    name: 'The Peptide Company',
    website: 'https://thepeptidecompany.com',
    location: 'Seoul',
    country: 'South Korea',
    rating: 4.3,
    reviewCount: 880,
    category: 'cosmetic',
    description: 'K-beauty inspired peptide skincare formulations. Copper peptides, matrixyl, and argireline-based products.',
  },
  {
    id: 'derma-pep',
    name: 'DermaPep Labs',
    website: 'https://dermapep.com',
    location: 'Los Angeles, CA',
    country: 'USA',
    rating: 4.4,
    reviewCount: 560,
    category: 'cosmetic',
    description: 'Custom peptide synthesis for cosmetic brands. Supplies signal peptides, carrier peptides, and neurotransmitter-inhibiting peptides.',
  },
  {
    id: 'natur-peptide',
    name: 'NaturPeptide',
    website: 'https://naturpeptide.com',
    location: 'Lyon',
    country: 'France',
    rating: 4.6,
    reviewCount: 340,
    category: 'cosmetic',
    description: 'French peptide cosmetics manufacturer specializing in anti-aging and collagen-boosting peptide formulations.',
  },
  {
    id: 'bio-synth-intl',
    name: 'BioSynth International',
    website: 'https://biosynth.com',
    location: 'Shanghai',
    country: 'China',
    rating: 4.2,
    reviewCount: 290,
    category: 'api-supplier',
    description: 'Large-scale custom peptide synthesis for pharmaceutical companies. GMP-compliant API manufacturing.',
  },
  {
    id: 'american-peptide',
    name: 'American Peptide Company',
    website: 'https://americanpeptide.com',
    location: 'San Jose, CA',
    country: 'USA',
    rating: 4.5,
    reviewCount: 410,
    category: 'api-supplier',
    description: 'GMP peptide API manufacturer serving pharmaceutical and biotech industries. Specializing in long-chain and modified peptides.',
  },
  {
    id: 'bac-peptide',
    name: 'BAC Peptide',
    website: 'https://bacpeptide.com',
    location: 'Karlsruhe',
    country: 'Germany',
    rating: 4.6,
    reviewCount: 180,
    category: 'api-supplier',
    description: 'European peptide manufacturer providing custom synthesis and catalog peptides for drug development.',
  },
  {
    id: 'cas-peptide',
    name: 'CAS Peptide Co.',
    website: 'https://caspeptide.com',
    location: 'Hangzhou',
    country: 'China',
    rating: 4.0,
    reviewCount: 220,
    category: 'api-supplier',
    description: 'Cost-effective peptide API supplier with large-scale production capacity. Serves generic drug manufacturers worldwide.',
  },
]

const compoundData: (typeof schema.compounds.$inferInsert)[] = [
  { id: 'bpc-157', name: 'BPC-157', category: 'recovery' },
  { id: 'tb-500', name: 'TB-500', category: 'recovery' },
  { id: 'nad-plus', name: 'NAD+', category: 'anti-aging' },
  { id: 'epitalon', name: 'Epitalon', category: 'anti-aging' },
  { id: 'ghk-cu', name: 'GHK-Cu', category: 'cosmetic' },
  { id: 'ipamorelin', name: 'Ipamorelin', category: 'growth-hormone' },
  { id: 'cjc-1295', name: 'CJC-1295', category: 'growth-hormone' },
  { id: 'ghrp-2', name: 'GHRP-2', category: 'growth-hormone' },
  { id: 'ghrp-6', name: 'GHRP-6', category: 'growth-hormone' },
  { id: 'melanotan-ii', name: 'Melanotan II', category: 'tanning' },
  { id: 'pt-141', name: 'PT-141', category: 'sexual-health' },
  { id: 'thymosin-alpha-1', name: 'Thymosin Alpha-1', category: 'immune' },
  { id: 'mots-c', name: 'MOTS-c', category: 'metabolic' },
  { id: 'ss-31', name: 'SS-31', category: 'mitochondrial' },
  { id: 'glutathione', name: 'Glutathione', category: 'antioxidant' },
  { id: 'selank', name: 'Selank', category: 'cognitive' },
  { id: 'semax', name: 'Semax', category: 'cognitive' },
  { id: 'll-37', name: 'LL-37', category: 'antimicrobial' },
  { id: 'matrixyl', name: 'Matrixyl', category: 'cosmetic' },
  { id: 'argireline', name: 'Argireline', category: 'cosmetic' },
]

// Sample vendor-compound relationships
const vendorCompoundData: (typeof schema.vendorCompounds.$inferInsert)[] = [
  // Peptide Sciences — broad catalog
  { vendorId: 'pep-sci', compoundId: 'bpc-157' },
  { vendorId: 'pep-sci', compoundId: 'tb-500' },
  { vendorId: 'pep-sci', compoundId: 'ipamorelin' },
  { vendorId: 'pep-sci', compoundId: 'cjc-1295' },
  { vendorId: 'pep-sci', compoundId: 'ghrp-2' },
  { vendorId: 'pep-sci', compoundId: 'melanotan-ii' },
  { vendorId: 'pep-sci', compoundId: 'pt-141' },
  { vendorId: 'pep-sci', compoundId: 'selank' },
  { vendorId: 'pep-sci', compoundId: 'semax' },

  // Limitless Life
  { vendorId: 'limitless-life', compoundId: 'bpc-157' },
  { vendorId: 'limitless-life', compoundId: 'nad-plus' },
  { vendorId: 'limitless-life', compoundId: 'epitalon' },
  { vendorId: 'limitless-life', compoundId: 'selank' },
  { vendorId: 'limitless-life', compoundId: 'semax' },
  { vendorId: 'limitless-life', compoundId: 'ss-31' },

  // Pure Rawz
  { vendorId: 'pure-rawz', compoundId: 'bpc-157' },
  { vendorId: 'pure-rawz', compoundId: 'tb-500' },
  { vendorId: 'pure-rawz', compoundId: 'ghrp-6' },
  { vendorId: 'pure-rawz', compoundId: 'melanotan-ii' },
  { vendorId: 'pure-rawz', compoundId: 'ipamorelin' },

  // Element SARMs
  { vendorId: 'element-sarms', compoundId: 'bpc-157' },
  { vendorId: 'element-sarms', compoundId: 'ghrp-2' },
  { vendorId: 'element-sarms', compoundId: 'ghrp-6' },

  // Swiss Chems
  { vendorId: 'swiss-chems', compoundId: 'bpc-157' },
  { vendorId: 'swiss-chems', compoundId: 'tb-500' },
  { vendorId: 'swiss-chems', compoundId: 'ipamorelin' },
  { vendorId: 'swiss-chems', compoundId: 'cjc-1295' },

  // Canagen (therapeutic)
  { vendorId: 'canagen', compoundId: 'bpc-157' },
  { vendorId: 'canagen', compoundId: 'tb-500' },
  { vendorId: 'canagen', compoundId: 'thymosin-alpha-1' },

  // MedPeptide Labs
  { vendorId: 'med-peptide', compoundId: 'bpc-157' },
  { vendorId: 'med-peptide', compoundId: 'tb-500' },
  { vendorId: 'med-peptide', compoundId: 'nad-plus' },
  { vendorId: 'med-peptide', compoundId: 'ipamorelin' },
  { vendorId: 'med-peptide', compoundId: 'cjc-1295' },

  // Restor Peptide
  { vendorId: 'restor-peptide', compoundId: 'bpc-157' },
  { vendorId: 'restor-peptide', compoundId: 'tb-500' },
  { vendorId: 'restor-peptide', compoundId: 'ipamorelin' },

  // Vitality Institute
  { vendorId: 'vitality-institute', compoundId: 'nad-plus' },
  { vendorId: 'vitality-institute', compoundId: 'epitalon' },
  { vendorId: 'vitality-institute', compoundId: 'thymosin-alpha-1' },

  // BioTherapeutics EU
  { vendorId: 'bio-thera-eu', compoundId: 'bpc-157' },
  { vendorId: 'bio-thera-eu', compoundId: 'thymosin-alpha-1' },
  { vendorId: 'bio-thera-eu', compoundId: 'mots-c' },
  { vendorId: 'bio-thera-eu', compoundId: 'll-37' },

  // Cosmetic vendors
  { vendorId: 'skin-peptide-co', compoundId: 'ghk-cu' },
  { vendorId: 'skin-peptide-co', compoundId: 'matrixyl' },
  { vendorId: 'skin-peptide-co', compoundId: 'argireline' },

  { vendorId: 'derma-pep', compoundId: 'ghk-cu' },
  { vendorId: 'derma-pep', compoundId: 'matrixyl' },
  { vendorId: 'derma-pep', compoundId: 'argireline' },

  { vendorId: 'natur-peptide', compoundId: 'ghk-cu' },
  { vendorId: 'natur-peptide', compoundId: 'matrixyl' },
  { vendorId: 'natur-peptide', compoundId: 'glutathione' },

  // API suppliers
  { vendorId: 'bio-synth-intl', compoundId: 'bpc-157' },
  { vendorId: 'bio-synth-intl', compoundId: 'tb-500' },
  { vendorId: 'bio-synth-intl', compoundId: 'glutathione' },

  { vendorId: 'american-peptide', compoundId: 'bpc-157' },
  { vendorId: 'american-peptide', compoundId: 'ipamorelin' },
  { vendorId: 'american-peptide', compoundId: 'cjc-1295' },

  { vendorId: 'bac-peptide', compoundId: 'bpc-157' },
  { vendorId: 'bac-peptide', compoundId: 'epitalon' },
  { vendorId: 'bac-peptide', compoundId: 'thymosin-alpha-1' },

  { vendorId: 'cas-peptide', compoundId: 'glutathione' },
  { vendorId: 'cas-peptide', compoundId: 'bpc-157' },
  { vendorId: 'cas-peptide', compoundId: 'tb-500' },
]

const tagData: (typeof schema.tags.$inferInsert)[] = [
  { id: 'credit-card', name: 'Credit Card' },
  { id: 'crypto', name: 'Crypto Accepted' },
  { id: 'free-shipping', name: 'Free Shipping' },
  { id: 'lab-tested', name: 'Lab Tested' },
  { id: 'gmp-certified', name: 'GMP Certified' },
  { id: 'ships-international', name: 'Ships International' },
  { id: 'money-back', name: 'Money-Back Guarantee' },
  { id: 'same-day-shipping', name: 'Same-Day Shipping' },
  { id: 'coa-available', name: 'COA Available' },
  { id: 'bulk-discounts', name: 'Bulk Discounts' },
]

const vendorTagData: (typeof schema.vendorTags.$inferInsert)[] = [
  // Peptide Sciences
  { vendorId: 'pep-sci', tagId: 'credit-card' },
  { vendorId: 'pep-sci', tagId: 'crypto' },
  { vendorId: 'pep-sci', tagId: 'lab-tested' },
  { vendorId: 'pep-sci', tagId: 'gmp-certified' },
  { vendorId: 'pep-sci', tagId: 'coa-available' },
  { vendorId: 'pep-sci', tagId: 'free-shipping' },

  // Limitless Life
  { vendorId: 'limitless-life', tagId: 'credit-card' },
  { vendorId: 'limitless-life', tagId: 'crypto' },
  { vendorId: 'limitless-life', tagId: 'lab-tested' },
  { vendorId: 'limitless-life', tagId: 'coa-available' },

  // Pure Rawz
  { vendorId: 'pure-rawz', tagId: 'credit-card' },
  { vendorId: 'pure-rawz', tagId: 'crypto' },
  { vendorId: 'pure-rawz', tagId: 'lab-tested' },
  { vendorId: 'pure-rawz', tagId: 'free-shipping' },
  { vendorId: 'pure-rawz', tagId: 'same-day-shipping' },

  // Element SARMs
  { vendorId: 'element-sarms', tagId: 'credit-card' },
  { vendorId: 'element-sarms', tagId: 'lab-tested' },

  // Swiss Chems
  { vendorId: 'swiss-chems', tagId: 'credit-card' },
  { vendorId: 'swiss-chems', tagId: 'crypto' },
  { vendorId: 'swiss-chems', tagId: 'ships-international' },
  { vendorId: 'swiss-chems', tagId: 'gmp-certified' },
  { vendorId: 'swiss-chems', tagId: 'coa-available' },

  // Canagen
  { vendorId: 'canagen', tagId: 'credit-card' },
  { vendorId: 'canagen', tagId: 'gmp-certified' },
  { vendorId: 'canagen', tagId: 'lab-tested' },

  // MedPeptide
  { vendorId: 'med-peptide', tagId: 'credit-card' },
  { vendorId: 'med-peptide', tagId: 'gmp-certified' },
  { vendorId: 'med-peptide', tagId: 'lab-tested' },
  { vendorId: 'med-peptide', tagId: 'money-back' },

  // Restor Peptide
  { vendorId: 'restor-peptide', tagId: 'credit-card' },
  { vendorId: 'restor-peptide', tagId: 'free-shipping' },

  // Vitality Institute
  { vendorId: 'vitality-institute', tagId: 'credit-card' },
  { vendorId: 'vitality-institute', tagId: 'gmp-certified' },

  // BioTherapeutics EU
  { vendorId: 'bio-thera-eu', tagId: 'credit-card' },
  { vendorId: 'bio-thera-eu', tagId: 'ships-international' },
  { vendorId: 'bio-thera-eu', tagId: 'gmp-certified' },
  { vendorId: 'bio-thera-eu', tagId: 'lab-tested' },

  // The Peptide Company
  { vendorId: 'skin-peptide-co', tagId: 'credit-card' },
  { vendorId: 'skin-peptide-co', tagId: 'ships-international' },
  { vendorId: 'skin-peptide-co', tagId: 'free-shipping' },

  // DermaPep
  { vendorId: 'derma-pep', tagId: 'credit-card' },
  { vendorId: 'derma-pep', tagId: 'bulk-discounts' },

  // NaturPeptide
  { vendorId: 'natur-peptide', tagId: 'credit-card' },
  { vendorId: 'natur-peptide', tagId: 'ships-international' },

  // BioSynth
  { vendorId: 'bio-synth-intl', tagId: 'credit-card' },
  { vendorId: 'bio-synth-intl', tagId: 'ships-international' },
  { vendorId: 'bio-synth-intl', tagId: 'gmp-certified' },
  { vendorId: 'bio-synth-intl', tagId: 'bulk-discounts' },

  // American Peptide
  { vendorId: 'american-peptide', tagId: 'credit-card' },
  { vendorId: 'american-peptide', tagId: 'gmp-certified' },
  { vendorId: 'american-peptide', tagId: 'coa-available' },
  { vendorId: 'american-peptide', tagId: 'bulk-discounts' },

  // BAC Peptide
  { vendorId: 'bac-peptide', tagId: 'credit-card' },
  { vendorId: 'bac-peptide', tagId: 'ships-international' },
  { vendorId: 'bac-peptide', tagId: 'gmp-certified' },

  // CAS Peptide
  { vendorId: 'cas-peptide', tagId: 'credit-card' },
  { vendorId: 'cas-peptide', tagId: 'ships-international' },
  { vendorId: 'cas-peptide', tagId: 'bulk-discounts' },
]

async function seed() {
  console.log('🌱 Seeding database...')

  // Clear existing data (order matters for foreign keys)
  console.log('  Clearing existing data...')
  await db.delete(schema.vendorTags)
  await db.delete(schema.tags)
  await db.delete(schema.vendorCompounds)
  await db.delete(schema.compounds)
  await db.delete(schema.vendors)

  // Insert vendors
  console.log(`  Inserting ${vendorData.length} vendors...`)
  await db.insert(schema.vendors).values(vendorData)

  // Insert compounds
  console.log(`  Inserting ${compoundData.length} compounds...`)
  await db.insert(schema.compounds).values(compoundData)

  // Insert vendor-compound relationships
  console.log(`  Inserting ${vendorCompoundData.length} vendor-compound links...`)
  await db.insert(schema.vendorCompounds).values(vendorCompoundData)

  // Insert tags
  console.log(`  Inserting ${tagData.length} tags...`)
  await db.insert(schema.tags).values(tagData)

  // Insert vendor-tag relationships
  console.log(`  Inserting ${vendorTagData.length} vendor-tag links...`)
  await db.insert(schema.vendorTags).values(vendorTagData)

  console.log('✅ Seed complete!')
  await client.end()
  process.exit(0)
}

seed().catch(async (err) => {
  console.error('❌ Seed failed:', err)
  await client.end()
  process.exit(1)
})
