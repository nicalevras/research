import { pgTable, text, integer, real, timestamp, primaryKey, index } from 'drizzle-orm/pg-core'

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
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('idx_vendors_category').on(t.category),
  index('idx_vendors_country').on(t.country),
])

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
  index('idx_vendor_compounds_compound_id').on(t.compoundId),
])

export const tags = pgTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
})

export const vendorTags = pgTable('vendor_tags', {
  vendorId: text('vendor_id')
    .notNull()
    .references(() => vendors.id, { onDelete: 'cascade' }),
  tagId: text('tag_id')
    .notNull()
    .references(() => tags.id, { onDelete: 'cascade' }),
}, (t) => [
  primaryKey({ columns: [t.vendorId, t.tagId] }),
  index('idx_vendor_tags_tag_id').on(t.tagId),
])
