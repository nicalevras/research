CREATE TABLE "compound_studies" (
	"id" text PRIMARY KEY NOT NULL,
	"compound_id" text NOT NULL,
	"title" text NOT NULL,
	"source" text NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "compound_studies" ADD CONSTRAINT "compound_studies_compound_id_compounds_id_fk" FOREIGN KEY ("compound_id") REFERENCES "public"."compounds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_compound_studies_compound" ON "compound_studies" USING btree ("compound_id");--> statement-breakpoint
CREATE INDEX "idx_compound_studies_sort_order" ON "compound_studies" USING btree ("sort_order");
