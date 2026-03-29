import { pgTable, text, integer, real, timestamp, primaryKey } from 'drizzle-orm/pg-core'

export const vendors = pgTable('vendors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  website: text('website').notNull(),
  location: text('location').notNull(),
  country: text('country').notNull(),
  rating: real('rating').notNull().default(0),
  reviewCount: integer('review_count').notNull().default(0),
  category: text('category').notNull(),
  description: text('description').notNull(),
  founded: integer('founded').notNull(),
  certifications: text('certifications').array().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const compounds = pgTable('compounds', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category'),
})

export const vendorCompounds = pgTable('vendor_compounds', {
  vendorId: text('vendor_id')
    .notNull()
    .references(() => vendors.id, { onDelete: 'cascade' }),
  compoundId: text('compound_id')
    .notNull()
    .references(() => compounds.id, { onDelete: 'cascade' }),
}, (t) => [
  primaryKey({ columns: [t.vendorId, t.compoundId] }),
])
