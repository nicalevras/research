ALTER TABLE "vendors" DROP COLUMN IF EXISTS "location";--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "image_url" text;