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
    founded: 2012,
    certifications: ['GMP', 'ISO 9001'],
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
    founded: 2015,
    certifications: ['GMP'],
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
    founded: 2017,
    certifications: ['GMP'],
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
    founded: 2019,
    certifications: [],
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
    founded: 2016,
    certifications: ['GMP', 'ISO 17025'],
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
    founded: 2014,
    certifications: ['GMP', 'FDA IND', 'Health Canada'],
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
    founded: 2011,
    certifications: ['PCAB', 'GMP', 'DEA Licensed'],
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
    founded: 2018,
    certifications: ['HIPAA Compliant'],
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
    founded: 2019,
    certifications: ['GMP'],
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
    founded: 2013,
    certifications: ['EMA GMP', 'ISO 13485'],
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
    founded: 2016,
    certifications: ['KFDA', 'ISO 22716'],
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
    founded: 2015,
    certifications: ['ISO 22716', 'COSMOS'],
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
    founded: 2013,
    certifications: ['ECOCERT', 'ISO 9001'],
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
    founded: 2008,
    certifications: ['GMP', 'ISO 9001', 'FDA DMF'],
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
    founded: 2005,
    certifications: ['FDA GMP', 'ISO 9001'],
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
    founded: 1998,
    certifications: ['GMP', 'ISO 17025', 'EMA'],
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
    founded: 2010,
    certifications: ['GMP', 'ISO 9001'],
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

async function seed() {
  console.log('🌱 Seeding database...')

  // Clear existing data (order matters for foreign keys)
  console.log('  Clearing existing data...')
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

  console.log('✅ Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
