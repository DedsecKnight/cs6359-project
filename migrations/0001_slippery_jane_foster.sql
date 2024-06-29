CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"webpage_id" integer NOT NULL,
	"tag_name" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_webpage_id_web_id_fk" FOREIGN KEY ("webpage_id") REFERENCES "public"."web"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
