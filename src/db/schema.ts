import { pgTable, text, integer, real, timestamp, boolean, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/pg-core'
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
  description: text('description').notNull(),
  logoUrl: text('logo_url'),
  promoCode: text('promo_code'),
  promoDiscountPercent: integer('promo_discount_percent'),
  verified: boolean('verified').notNull().default(true),
  country: text('country').notNull(),
  compoundNames: text('compound_names').array().notNull(),
  compoundSlugs: text('compound_slugs').array().notNull(),
  hasCoa: boolean('has_coa').notNull().default(false),
  acceptsCreditCard: boolean('accepts_credit_card').notNull().default(false),
  acceptsAch: boolean('accepts_ach').notNull().default(false),
  acceptsCrypto: boolean('accepts_crypto').notNull().default(false),
  fastShipping: boolean('fast_shipping').notNull().default(false),
  shipsInternational: boolean('ships_international').notNull().default(false),
  rating: real('rating').notNull().default(0),
  reviewCount: integer('review_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  check('chk_vendors_promo_discount_percent_range', sql`${t.promoDiscountPercent} IS NULL OR (${t.promoDiscountPercent} > 0 AND ${t.promoDiscountPercent} <= 100)`),
  index('idx_vendors_country').on(t.country),
  index('idx_vendors_compound_slugs').using('gin', t.compoundSlugs),
])

export const vendorFavorites = pgTable('vendor_favorites', {
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  vendorId: text('vendor_id').notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  primaryKey({ name: 'pk_vendor_favorites', columns: [t.userId, t.vendorId] }),
  index('idx_vendor_favorites_user_created_at').on(t.userId, t.createdAt),
  index('idx_vendor_favorites_vendor').on(t.vendorId),
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

export const vendorFavoritesRelations = relations(vendorFavorites, ({ one }) => ({
  user: one(user, { fields: [vendorFavorites.userId], references: [user.id] }),
  vendor: one(vendors, { fields: [vendorFavorites.vendorId], references: [vendors.id] }),
}))

export const vendorsRelations = relations(vendors, ({ many }) => ({
  reviews: many(reviews),
  favorites: many(vendorFavorites),
}))

export const compounds = pgTable('compounds', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('idx_compounds_sort_order').on(t.sortOrder),
])
