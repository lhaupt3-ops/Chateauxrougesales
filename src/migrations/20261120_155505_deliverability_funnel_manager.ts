import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_users_role" ADD VALUE 'manager';
  CREATE TABLE "funnel_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "funnel" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'A managed sales function',
  	"headline" varchar DEFAULT 'Your high-ticket sales team, installed and run.' NOT NULL,
  	"subhead" varchar DEFAULT 'Setters, closers and a sales lead who run the pipeline from the first reply to cash collected. The calls are honest. A no is an acceptable outcome. You keep the offer, the data and the recordings.' NOT NULL,
  	"cta" varchar DEFAULT 'See if we''re a fit' NOT NULL,
  	"guarantee_note" varchar DEFAULT 'Shown from Site settings when the guarantee is no longer a placeholder.',
  	"result_title" varchar DEFAULT 'Not the moment for a full team',
  	"result_body" varchar DEFAULT 'The answers say a managed team would cost more than it returns right now. That is a useful result, not a brush-off. The application is saved if you want to try again.',
  	"result_cta" varchar DEFAULT 'Are you actually ready for closers?',
  	"booking_qualified" varchar DEFAULT 'the answers look workable. Pick a time to get clear.',
  	"booking_not_qualified" varchar DEFAULT 'A few details are still open. Pick a short call so we can both decide.',
  	"unsubscribe_line" varchar DEFAULT 'You can unsubscribe in one click. We stop this sequence if you book, apply again, or unsubscribe.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "applications" ADD COLUMN "last_touch_page" varchar;
  ALTER TABLE "applications" ADD COLUMN "gclid" varchar;
  ALTER TABLE "applications" ADD COLUMN "fbclid" varchar;
  ALTER TABLE "applications" ADD COLUMN "li_fat_id" varchar;
  ALTER TABLE "subscribers" ADD COLUMN "utm_source" varchar;
  ALTER TABLE "subscribers" ADD COLUMN "utm_medium" varchar;
  ALTER TABLE "subscribers" ADD COLUMN "utm_campaign" varchar;
  ALTER TABLE "subscribers" ADD COLUMN "utm_term" varchar;
  ALTER TABLE "subscribers" ADD COLUMN "utm_content" varchar;
  ALTER TABLE "subscribers" ADD COLUMN "gclid" varchar;
  ALTER TABLE "subscribers" ADD COLUMN "fbclid" varchar;
  ALTER TABLE "subscribers" ADD COLUMN "li_fat_id" varchar;
  ALTER TABLE "subscribers" ADD COLUMN "referrer" varchar;
  ALTER TABLE "subscribers" ADD COLUMN "landing_page" varchar;
  ALTER TABLE "subscribers" ADD COLUMN "last_touch_page" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "meta_ads_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "meta_pixel_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "meta_access_token" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "linkedin_ads_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "linkedin_partner_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "linkedin_access_token" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "google_ads_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "google_ads_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "google_conversion_label" varchar;
  ALTER TABLE "funnel_questions" ADD CONSTRAINT "funnel_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."funnel"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "funnel_questions_order_idx" ON "funnel_questions" USING btree ("_order");
  CREATE INDEX "funnel_questions_parent_id_idx" ON "funnel_questions" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "funnel_questions" CASCADE;
  DROP TABLE "funnel" CASCADE;
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'admin'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'sales');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'admin'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  ALTER TABLE "applications" DROP COLUMN "last_touch_page";
  ALTER TABLE "applications" DROP COLUMN "gclid";
  ALTER TABLE "applications" DROP COLUMN "fbclid";
  ALTER TABLE "applications" DROP COLUMN "li_fat_id";
  ALTER TABLE "subscribers" DROP COLUMN "utm_source";
  ALTER TABLE "subscribers" DROP COLUMN "utm_medium";
  ALTER TABLE "subscribers" DROP COLUMN "utm_campaign";
  ALTER TABLE "subscribers" DROP COLUMN "utm_term";
  ALTER TABLE "subscribers" DROP COLUMN "utm_content";
  ALTER TABLE "subscribers" DROP COLUMN "gclid";
  ALTER TABLE "subscribers" DROP COLUMN "fbclid";
  ALTER TABLE "subscribers" DROP COLUMN "li_fat_id";
  ALTER TABLE "subscribers" DROP COLUMN "referrer";
  ALTER TABLE "subscribers" DROP COLUMN "landing_page";
  ALTER TABLE "subscribers" DROP COLUMN "last_touch_page";
  ALTER TABLE "site_settings" DROP COLUMN "meta_ads_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "meta_pixel_id";
  ALTER TABLE "site_settings" DROP COLUMN "meta_access_token";
  ALTER TABLE "site_settings" DROP COLUMN "linkedin_ads_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "linkedin_partner_id";
  ALTER TABLE "site_settings" DROP COLUMN "linkedin_access_token";
  ALTER TABLE "site_settings" DROP COLUMN "google_ads_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "google_ads_id";
  ALTER TABLE "site_settings" DROP COLUMN "google_conversion_label";`)
}
