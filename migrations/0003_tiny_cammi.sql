CREATE TABLE IF NOT EXISTS "advertisement_tier" (
	"id" serial PRIMARY KEY NOT NULL,
	"tier_name" text NOT NULL,
	"tier_price" real NOT NULL,
	"tier_rank" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"advertiser_id" integer NOT NULL,
	"credit_card_number" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"billing_account_id" integer NOT NULL,
	"advertisement_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "advertisements" ADD COLUMN "tier_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing_accounts" ADD CONSTRAINT "billing_accounts_advertiser_id_advertiser_credentials_id_fk" FOREIGN KEY ("advertiser_id") REFERENCES "public"."advertiser_credentials"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_billing_account_id_billing_accounts_id_fk" FOREIGN KEY ("billing_account_id") REFERENCES "public"."billing_accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_advertisement_id_advertisements_id_fk" FOREIGN KEY ("advertisement_id") REFERENCES "public"."advertisements"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_tier_id_advertisement_tier_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."advertisement_tier"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
