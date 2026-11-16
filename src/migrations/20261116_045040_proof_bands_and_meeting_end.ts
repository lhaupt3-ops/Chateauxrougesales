import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "band_low_label" SET DEFAULT '$3,000–$5,000/mo';
  ALTER TABLE "site_settings" ALTER COLUMN "band_mid_label" SET DEFAULT '$5,000–$10,000/mo';
  ALTER TABLE "site_settings" ALTER COLUMN "band_high_label" SET DEFAULT '$10,000–$20,000/mo';
  ALTER TABLE "case_studies" ADD COLUMN "illustrative" boolean DEFAULT false;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_illustrative" boolean DEFAULT false;
  ALTER TABLE "applications" ADD COLUMN "meeting_end_at" timestamp(3) with time zone;
  ALTER TABLE "site_settings" ADD COLUMN "band_top_label" varchar DEFAULT '$20,000+/mo' NOT NULL;
  UPDATE "site_settings" SET "band_low_label" = '$3,000–$5,000/mo' WHERE "band_low_label" = 'Under $5,000/mo';
  UPDATE "site_settings" SET "band_high_label" = '$10,000–$20,000/mo' WHERE "band_high_label" = '$10,000/mo or more';
  UPDATE "site_settings" SET "band_top_label" = '$20,000+/mo' WHERE "band_top_label" IS NULL OR "band_top_label" = '';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "site_settings" SET "band_low_label" = 'Under $5,000/mo' WHERE "band_low_label" = '$3,000–$5,000/mo';
  UPDATE "site_settings" SET "band_high_label" = '$10,000/mo or more' WHERE "band_high_label" = '$10,000–$20,000/mo';
  ALTER TABLE "site_settings" ALTER COLUMN "band_low_label" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "band_mid_label" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "band_high_label" DROP DEFAULT;
  ALTER TABLE "case_studies" DROP COLUMN "illustrative";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_illustrative";
  ALTER TABLE "applications" DROP COLUMN "meeting_end_at";
  ALTER TABLE "site_settings" DROP COLUMN "band_top_label";`)
}
