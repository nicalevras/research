import { pgTable, text, integer, real, timestamp, boolean, primaryKey, index, uniqueIndex, unique } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

// ── Better Auth tables ──────────────────────────────────────────────

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  username: text('username').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [
  uniqueIndex('user_username_idx').on(sql`lower(${t.username})`),
])

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
}, (t) => [
  index('session_userId_idx').on(t.userId),
])

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [
  index('account_userId_idx').on(t.userId),
])

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [
  index('verification_identifier_idx').on(t.identifier),
])

// ── Application tables ──────────────────────────────────────────────

export const vendors = pgTable('vendors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  website: text('website').notNull(),
  country: text('country').notNull(),
  imageUrl: text('image_url'),
  rating: real('rating').notNull().default(0),
  reviewCount: integer('review_count').notNull().default(0),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('idx_vendors_country').on(t.country),
])

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  vendorId: text('vendor_id').notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  rating: real('rating').notNull(),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('idx_reviews_user_vendor').on(t.userId, t.vendorId),
  index('idx_reviews_vendor').on(t.vendorId),
  index('idx_reviews_user').on(t.userId),
])

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(user, { fields: [reviews.userId], references: [user.id] }),
  vendor: one(vendors, { fields: [reviews.vendorId], references: [vendors.id] }),
}))

export const vendorsRelations = relations(vendors, ({ many }) => ({
  reviews: many(reviews),
}))

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
  coaUrl: text('coa_url'),
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
