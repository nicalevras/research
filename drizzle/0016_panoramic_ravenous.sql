ALTER TABLE "vendors" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
WITH ranked_vendors AS (
  SELECT
    "id",
    row_number() OVER (ORDER BY "rating" DESC, "name" ASC) - 1 AS "sort_order"
  FROM "vendors"
)
UPDATE "vendors"
SET "sort_order" = ranked_vendors."sort_order"
FROM ranked_vendors
WHERE "vendors"."id" = ranked_vendors."id";--> statement-breakpoint
CREATE INDEX "idx_vendors_sort_order" ON "vendors" USING btree ("sort_order");
