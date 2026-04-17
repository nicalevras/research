ALTER TABLE "vendors" ADD COLUMN "promo_code" text;--> statement-breakpoint
UPDATE "vendors" SET "promo_code" = 'VIALSOURCE' WHERE "promo_code" IS NULL;
