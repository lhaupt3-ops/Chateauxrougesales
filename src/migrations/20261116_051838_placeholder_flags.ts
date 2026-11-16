import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "guarantee_is_placeholder" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "notice_is_placeholder" boolean DEFAULT true;
  UPDATE "site_settings" SET "guarantee_is_placeholder" = true, "notice_is_placeholder" = true, "bands_are_placeholder" = true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "guarantee_is_placeholder";
  ALTER TABLE "site_settings" DROP COLUMN "notice_is_placeholder";`)
}
