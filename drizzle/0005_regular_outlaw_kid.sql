CREATE TABLE "vendor_favorites" (
	"user_id" text NOT NULL,
	"vendor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pk_vendor_favorites" PRIMARY KEY("user_id","vendor_id")
);
--> statement-breakpoint
ALTER TABLE "vendor_favorites" ADD CONSTRAINT "vendor_favorites_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_favorites" ADD CONSTRAINT "vendor_favorites_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_vendor_favorites_user_created_at" ON "vendor_favorites" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_vendor_favorites_vendor" ON "vendor_favorites" USING btree ("vendor_id");