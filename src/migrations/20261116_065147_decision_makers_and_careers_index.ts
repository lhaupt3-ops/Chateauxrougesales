import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_applications_decision_makers" AS ENUM('just_me', 'partner', 'team');
  ALTER TABLE "applications" ADD COLUMN "decision_makers" "enum_applications_decision_makers";
  ALTER TABLE "site_settings" ADD COLUMN "careers_is_placeholder" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "applications" DROP COLUMN "decision_makers";
  ALTER TABLE "site_settings" DROP COLUMN "careers_is_placeholder";
  DROP TYPE "public"."enum_applications_decision_makers";`)
}
