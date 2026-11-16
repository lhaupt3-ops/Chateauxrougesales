import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_applications_outcome" AS ENUM('open', 'won', 'lost', 'no_show');
  CREATE TYPE "public"."enum_bookings_status" AS ENUM('scheduled', 'canceled', 'no_show', 'completed');
  CREATE TYPE "public"."enum_subscribers_kind" AS ENUM('waitlist', 'guide', 'marketing');
  CREATE TABLE "bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"who" varchar NOT NULL,
  	"email" varchar,
  	"when" timestamp(3) with time zone,
  	"status" "enum_bookings_status" DEFAULT 'scheduled' NOT NULL,
  	"calendly_url" varchar,
  	"application_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"email" varchar NOT NULL,
  	"kind" "enum_subscribers_kind" DEFAULT 'waitlist' NOT NULL,
  	"unsubscribed" boolean DEFAULT false,
  	"source" varchar,
  	"application_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "posts" ADD COLUMN "seo_status" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_seo_status" varchar;
  ALTER TABLE "applications" ADD COLUMN "name" varchar;
  ALTER TABLE "applications" ADD COLUMN "score_band" varchar;
  ALTER TABLE "applications" ADD COLUMN "call_notes" varchar;
  ALTER TABLE "applications" ADD COLUMN "objections" varchar;
  ALTER TABLE "applications" ADD COLUMN "posthog_distinct_id" varchar;
  ALTER TABLE "applications" ADD COLUMN "ip_address" varchar;
  ALTER TABLE "applications" ADD COLUMN "user_agent" varchar;
  ALTER TABLE "applications" ADD COLUMN "assignee_id" integer;
  ALTER TABLE "applications" ADD COLUMN "next_follow_up_at" timestamp(3) with time zone;
  ALTER TABLE "applications" ADD COLUMN "outcome" "enum_applications_outcome" DEFAULT 'open';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "bookings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "subscribers_id" integer;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "bookings_application_idx" ON "bookings" USING btree ("application_id");
  CREATE INDEX "bookings_updated_at_idx" ON "bookings" USING btree ("updated_at");
  CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");
  CREATE UNIQUE INDEX "subscribers_application_idx" ON "subscribers" USING btree ("application_id");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  ALTER TABLE "applications" ADD CONSTRAINT "applications_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bookings_fk" FOREIGN KEY ("bookings_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "applications_assignee_idx" ON "applications" USING btree ("assignee_id");
  CREATE INDEX "payload_locked_documents_rels_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("bookings_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  UPDATE "applications" SET "name" = NULLIF(btrim(concat(coalesce("first_name", ''), ' ', coalesce("last_name", ''))), '');
  UPDATE "applications" SET "name" = "email" WHERE "name" IS NULL OR "name" = '';
  UPDATE "applications" SET "score_band" = CASE "tier" WHEN 'qualified' THEN 'Qualified' WHEN 'review' THEN 'Review' WHEN 'not_yet' THEN 'Not yet' ELSE '' END;
  UPDATE "applications" SET "assignee_id" = "assigned_to_id" WHERE "assignee_id" IS NULL AND "assigned_to_id" IS NOT NULL;
  UPDATE "applications" SET "posthog_distinct_id" = "public_id" WHERE ("posthog_distinct_id" IS NULL OR "posthog_distinct_id" = '') AND "public_id" IS NOT NULL;
  UPDATE "applications" SET "outcome" = 'open' WHERE "outcome" IS NULL;
  INSERT INTO "bookings" ("who", "email", "when", "status", "calendly_url", "application_id")
  SELECT
    coalesce(nullif("name", ''), "email", 'Untitled'),
    "email",
    "meeting_start_at",
    CASE
      WHEN "booking_status" = 'canceled' THEN 'canceled'::"enum_bookings_status"
      WHEN "status" = 'no_show' THEN 'no_show'::"enum_bookings_status"
      ELSE 'scheduled'::"enum_bookings_status"
    END,
    "calendly_event_uri",
    "id"
  FROM "applications"
  WHERE "meeting_start_at" IS NOT NULL OR "status" = 'booked' OR "booking_status" IN ('scheduled', 'canceled');
  INSERT INTO "subscribers" ("name", "email", "kind", "unsubscribed", "source", "application_id")
  SELECT
    coalesce(nullif("name", ''), "email"),
    "email",
    CASE
      WHEN "waitlist" IS TRUE THEN 'waitlist'::"enum_subscribers_kind"
      WHEN "source" = 'lead_magnet' OR ("resource_slug" IS NOT NULL AND "resource_slug" <> '') THEN 'guide'::"enum_subscribers_kind"
      ELSE 'marketing'::"enum_subscribers_kind"
    END,
    coalesce("email_unsubscribed", false),
    "source",
    "id"
  FROM "applications"
  WHERE "email" IS NOT NULL AND "email" <> ''
    AND ("waitlist" IS TRUE OR "marketing_consent" IS TRUE OR "consent_marketing" IS TRUE OR "source" = 'lead_magnet' OR ("resource_slug" IS NOT NULL AND "resource_slug" <> ''));`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "bookings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "subscribers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "bookings" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  ALTER TABLE "applications" DROP CONSTRAINT "applications_assignee_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_bookings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_subscribers_fk";
  
  DROP INDEX "applications_assignee_idx";
  DROP INDEX "payload_locked_documents_rels_bookings_id_idx";
  DROP INDEX "payload_locked_documents_rels_subscribers_id_idx";
  ALTER TABLE "posts" DROP COLUMN "seo_status";
  ALTER TABLE "_posts_v" DROP COLUMN "version_seo_status";
  ALTER TABLE "applications" DROP COLUMN "name";
  ALTER TABLE "applications" DROP COLUMN "score_band";
  ALTER TABLE "applications" DROP COLUMN "call_notes";
  ALTER TABLE "applications" DROP COLUMN "objections";
  ALTER TABLE "applications" DROP COLUMN "posthog_distinct_id";
  ALTER TABLE "applications" DROP COLUMN "ip_address";
  ALTER TABLE "applications" DROP COLUMN "user_agent";
  ALTER TABLE "applications" DROP COLUMN "assignee_id";
  ALTER TABLE "applications" DROP COLUMN "next_follow_up_at";
  ALTER TABLE "applications" DROP COLUMN "outcome";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "bookings_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "subscribers_id";
  DROP TYPE "public"."enum_applications_outcome";
  DROP TYPE "public"."enum_bookings_status";
  DROP TYPE "public"."enum_subscribers_kind";`)
}
