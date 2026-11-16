import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "users"
   SET "role" = 'admin'
   WHERE "role" IS NULL
      OR btrim("role"::text) = '';

   UPDATE "users"
   SET "role" = 'admin'
   WHERE lower("email") = 'lhaupt3@gmail.com'
     AND "role" IS DISTINCT FROM 'admin';

   UPDATE "site_settings"
   SET "resend_from" = NULL
   WHERE "resend_from" ILIKE '%resend.dev%';

   DO $$
   DECLARE
     app_ids integer[];
     rel record;
     child record;
   BEGIN
     SELECT COALESCE(array_agg(a.id), ARRAY[]::integer[])
       INTO app_ids
     FROM "applications" a
     WHERE a.id IN (7, 8, 9)
       AND lower(a.email) = 'lhaupt3@gmail.com'
       AND btrim(concat_ws(' ', NULLIF(btrim(a.first_name), ''), NULLIF(btrim(a.last_name), ''))) = 'TEST Lasse'
       AND (
         (a.id = 7 AND a.public_id = 'f5df5722-d8d1-43fe-ad89-ce83f1938137')
         OR (a.id = 8 AND a.public_id = '4dfb2ed7-f24b-4d67-95f5-6bb64e218533')
         OR (a.id = 9 AND a.public_id = '547c4644-98e6-4013-8643-04b076008db0')
       );

     IF COALESCE(cardinality(app_ids), 0) = 0 THEN
       RETURN;
     END IF;

     IF to_regclass('public._applications_v') IS NOT NULL
        AND EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = '_applications_v'
            AND column_name = 'parent_id'
        )
     THEN
       FOR rel IN
         SELECT n.nspname AS schema_name,
                c.relname AS table_name,
                att.attname AS column_name,
                ref.attname AS ref_column
         FROM pg_constraint con
         JOIN pg_class c ON c.oid = con.conrelid
         JOIN pg_namespace n ON n.oid = c.relnamespace
         JOIN pg_class rc ON rc.oid = con.confrelid
         JOIN pg_namespace rn ON rn.oid = rc.relnamespace
         JOIN pg_attribute att ON att.attrelid = c.oid AND att.attnum = con.conkey[1]
         JOIN pg_attribute ref ON ref.attrelid = rc.oid AND ref.attnum = con.confkey[1]
         WHERE con.contype = 'f'
           AND rn.nspname = 'public'
           AND rc.relname = '_applications_v'
           AND array_length(con.conkey, 1) = 1
           AND c.relkind = 'r'
           AND c.oid <> rc.oid
       LOOP
         EXECUTE format(
           'DELETE FROM %I.%I WHERE %I IN (SELECT %I FROM %I.%I WHERE parent_id = ANY (%s::int[]))',
           rel.schema_name,
           rel.table_name,
           rel.column_name,
           rel.ref_column,
           'public',
           '_applications_v',
           quote_literal(app_ids)
         );
       END LOOP;

       DELETE FROM "_applications_v" WHERE parent_id = ANY (app_ids);
     END IF;

     FOR rel IN
       SELECT n.nspname AS schema_name,
              c.relname AS table_name,
              att.attname AS column_name,
              c.oid AS table_oid
       FROM pg_constraint con
       JOIN pg_class c ON c.oid = con.conrelid
       JOIN pg_namespace n ON n.oid = c.relnamespace
       JOIN pg_class rc ON rc.oid = con.confrelid
       JOIN pg_namespace rn ON rn.oid = rc.relnamespace
       JOIN pg_attribute att ON att.attrelid = c.oid AND att.attnum = con.conkey[1]
       WHERE con.contype = 'f'
         AND rn.nspname = 'public'
         AND rc.relname = 'applications'
         AND array_length(con.conkey, 1) = 1
         AND c.relkind = 'r'
         AND c.oid <> rc.oid
     LOOP
       FOR child IN
         SELECT cn.nspname AS schema_name,
                cc.relname AS table_name,
                catt.attname AS column_name,
                ratt.attname AS ref_column
         FROM pg_constraint ccon
         JOIN pg_class cc ON cc.oid = ccon.conrelid
         JOIN pg_namespace cn ON cn.oid = cc.relnamespace
         JOIN pg_attribute catt ON catt.attrelid = cc.oid AND catt.attnum = ccon.conkey[1]
         JOIN pg_attribute ratt ON ratt.attrelid = ccon.confrelid AND ratt.attnum = ccon.confkey[1]
         WHERE ccon.contype = 'f'
           AND ccon.confrelid = rel.table_oid
           AND array_length(ccon.conkey, 1) = 1
           AND cc.relkind = 'r'
           AND cc.oid <> rel.table_oid
       LOOP
         EXECUTE format(
           'DELETE FROM %I.%I WHERE %I IN (SELECT %I FROM %I.%I WHERE %I = ANY (%s::int[]))',
           child.schema_name,
           child.table_name,
           child.column_name,
           child.ref_column,
           rel.schema_name,
           rel.table_name,
           rel.column_name,
           quote_literal(app_ids)
         );
       END LOOP;

       EXECUTE format(
         'DELETE FROM %I.%I WHERE %I = ANY (%s::int[])',
         rel.schema_name,
         rel.table_name,
         rel.column_name,
         quote_literal(app_ids)
       );
     END LOOP;

     DELETE FROM "applications" WHERE id = ANY (app_ids);
   END $$;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Data repair. Promoting the owner, clearing the sandbox sender, and deleting the test applications are not reversed.
}
