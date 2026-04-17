ALTER TABLE "vendors" ADD COLUMN "description" text;--> statement-breakpoint
UPDATE "vendors" SET "description" = "name" || ' is a peptide vendor listed in the Peptide Vendor Directory.' WHERE "description" IS NULL;--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "description" SET NOT NULL;
