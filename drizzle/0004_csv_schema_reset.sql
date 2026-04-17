ALTER TABLE "tags" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "vendor_compounds" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "vendor_tags" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "tags" CASCADE;--> statement-breakpoint
DROP TABLE "vendor_compounds" CASCADE;--> statement-breakpoint
DROP TABLE "vendor_tags" CASCADE;--> statement-breakpoint
DELETE FROM "reviews";--> statement-breakpoint
DELETE FROM "vendors";--> statement-breakpoint
DELETE FROM "compounds";--> statement-breakpoint
ALTER TABLE "compounds" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "compounds" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "compounds" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "compound_names" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "compound_slugs" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "has_coa" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "accepts_credit_card" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "accepts_ach" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "accepts_crypto" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "fast_shipping" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "ships_international" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_compounds_sort_order" ON "compounds" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "idx_vendors_compound_slugs" ON "vendors" USING gin ("compound_slugs");--> statement-breakpoint
ALTER TABLE "compounds" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "vendors" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "vendors" DROP COLUMN "image_url";
