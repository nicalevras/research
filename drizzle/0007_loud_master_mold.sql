ALTER TABLE "vendors" ADD COLUMN "promo_discount_percent" integer;--> statement-breakpoint
UPDATE "vendors" SET "promo_discount_percent" = 10 WHERE "promo_code" IS NOT NULL AND "promo_discount_percent" IS NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "chk_vendors_promo_discount_percent_range" CHECK ("vendors"."promo_discount_percent" IS NULL OR ("vendors"."promo_discount_percent" > 0 AND "vendors"."promo_discount_percent" <= 100));
