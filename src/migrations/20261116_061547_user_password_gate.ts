import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "must_change_password" boolean DEFAULT true;
  ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "previous_login_at" timestamp(3) with time zone;
  UPDATE "users" SET "must_change_password" = false WHERE "email" IN ('lhaupt3@gmail.com', 'lhaupt3+seos@gmail.com');`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "must_change_password";
  ALTER TABLE "users" DROP COLUMN "last_login_at";
  ALTER TABLE "users" DROP COLUMN "previous_login_at";`)
}
