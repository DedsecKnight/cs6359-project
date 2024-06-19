CREATE TABLE IF NOT EXISTS "admin_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"credentials_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "advertisements" (
	"id" serial PRIMARY KEY NOT NULL,
	"advertiser_id" integer NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "advertiser_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"credentials_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "credentials_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "web" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admin_credentials" ADD CONSTRAINT "admin_credentials_credentials_id_credentials_id_fk" FOREIGN KEY ("credentials_id") REFERENCES "public"."credentials"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_advertiser_id_advertiser_credentials_id_fk" FOREIGN KEY ("advertiser_id") REFERENCES "public"."advertiser_credentials"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "advertiser_credentials" ADD CONSTRAINT "advertiser_credentials_credentials_id_credentials_id_fk" FOREIGN KEY ("credentials_id") REFERENCES "public"."credentials"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
