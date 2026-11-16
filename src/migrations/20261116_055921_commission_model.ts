import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_applications_sequence_kind" AS ENUM('none', 'nurture', 'partial', 'qualified');
  CREATE TABLE "email_sequences_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"delay_hours" numeric NOT NULL,
  	"subject" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "email_sequences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "applications" ADD COLUMN "setup_fee" varchar;
  ALTER TABLE "applications" ADD COLUMN "email_unsubscribed" boolean DEFAULT false;
  ALTER TABLE "applications" ADD COLUMN "marketing_consent" boolean DEFAULT false;
  ALTER TABLE "applications" ADD COLUMN "unsubscribe_token" varchar;
  ALTER TABLE "applications" ADD COLUMN "nurture_enrolled_at" timestamp(3) with time zone;
  ALTER TABLE "applications" ADD COLUMN "sequence_kind" "enum_applications_sequence_kind";
  ALTER TABLE "applications" ADD COLUMN "sequence_log" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "discovery_call_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "nurture_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "setup_fee_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "setup_fee_is_placeholder" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "commission_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "commission_is_placeholder" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "legal_name" varchar DEFAULT 'Lasse Haupt';
  ALTER TABLE "site_settings" ADD COLUMN "legal_email" varchar DEFAULT 'lhaupt3@gmail.com';
  ALTER TABLE "site_settings" ADD COLUMN "legal_country" varchar DEFAULT 'Australia';
  ALTER TABLE "site_settings" ADD COLUMN "governing_law" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "governing_law_is_placeholder" boolean DEFAULT true;
  ALTER TABLE "email_sequences_steps" ADD CONSTRAINT "email_sequences_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_sequences"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "email_sequences_steps_order_idx" ON "email_sequences_steps" USING btree ("_order");
  CREATE INDEX "email_sequences_steps_parent_id_idx" ON "email_sequences_steps" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "email_sequences_steps" CASCADE;
  DROP TABLE "email_sequences" CASCADE;
  ALTER TABLE "applications" DROP COLUMN "setup_fee";
  ALTER TABLE "applications" DROP COLUMN "email_unsubscribed";
  ALTER TABLE "applications" DROP COLUMN "marketing_consent";
  ALTER TABLE "applications" DROP COLUMN "unsubscribe_token";
  ALTER TABLE "applications" DROP COLUMN "nurture_enrolled_at";
  ALTER TABLE "applications" DROP COLUMN "sequence_kind";
  ALTER TABLE "applications" DROP COLUMN "sequence_log";
  ALTER TABLE "site_settings" DROP COLUMN "discovery_call_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "nurture_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "setup_fee_label";
  ALTER TABLE "site_settings" DROP COLUMN "setup_fee_is_placeholder";
  ALTER TABLE "site_settings" DROP COLUMN "commission_label";
  ALTER TABLE "site_settings" DROP COLUMN "commission_is_placeholder";
  ALTER TABLE "site_settings" DROP COLUMN "legal_name";
  ALTER TABLE "site_settings" DROP COLUMN "legal_email";
  ALTER TABLE "site_settings" DROP COLUMN "legal_country";
  ALTER TABLE "site_settings" DROP COLUMN "governing_law";
  ALTER TABLE "site_settings" DROP COLUMN "governing_law_is_placeholder";
  DROP TYPE "public"."enum_applications_sequence_kind";`)
}
