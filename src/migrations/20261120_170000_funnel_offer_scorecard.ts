import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "proof_founder_title" varchar DEFAULT 'Founder track record';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "proof_founder_body" varchar DEFAULT 'Add only figures you can attribute. This block stays empty until Site settings or a real case study has them.';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "proof_marks_title" varchar DEFAULT 'Client marks';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "proof_marks_body" varchar DEFAULT 'No logos until a client has agreed to be named. We will not borrow recognition.';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "proof_named_title" varchar DEFAULT 'Named results';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "proof_named_body" varchar DEFAULT 'Cash collected, close rate before and after, and the time window. Not an average we cannot show.';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "pains_eyebrow" varchar DEFAULT 'The cost of waiting';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "pains_title" varchar DEFAULT 'The work piles up in three places.';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "system_eyebrow" varchar DEFAULT 'The system';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "system_title" varchar DEFAULT 'Four stages. Then it is a weekly habit.';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "charge_title" varchar DEFAULT 'How we charge';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "charge_body" varchar DEFAULT 'A one-off setup fee, then commission on cash collected. There is no monthly retainer. The setup amount and the commission percentage are to be confirmed in the agreement.';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "draft_guarantee_title" varchar DEFAULT 'Guarantee and terms are not confirmed';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "draft_guarantee_body" varchar DEFAULT 'To be confirmed. Nothing on this page is a guarantee, a contract length, or a notice period. The agreement is what you can rely on.';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "guarantee_heading" varchar DEFAULT 'The guarantee, in words we can keep';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "yes_label" varchar DEFAULT 'Yes';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "no_label" varchar DEFAULT 'No';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "score_heading" varchar DEFAULT 'Your score';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "progress_hint" varchar DEFAULT 'Answer every row. Seven or eight yeses means a closer can be the next look. Two or more nos means fix those first.';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "pass_max_nos" numeric DEFAULT 1;
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "pass_heading" varchar DEFAULT 'A closer can be the next look';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "pass_body" varchar DEFAULT 'One no, or none. The process is mostly in place. A closer is a reasonable next conversation if delivery can take the work and a setup fee is possible.';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "fail_heading" varchar DEFAULT 'Fix the nos first';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "fail_body" varchar DEFAULT 'Two or more nos means a closer will not fix the week. Write the price, the people it is not for, and where a maybe goes. Then look at a setter if the gap is conversations, or a closer if the gap is the decision.';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "result_guide_body" varchar DEFAULT 'The free guide. A scorecard, the two conversations, and what to fix before you hire.';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "reapply_label" varchar DEFAULT 'Reapply when the numbers have moved';
    ALTER TABLE "funnel" ADD COLUMN IF NOT EXISTS "fit_call_label" varchar DEFAULT 'Book a 15-minute fit call';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "proof_founder_title";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "proof_founder_body";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "proof_marks_title";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "proof_marks_body";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "proof_named_title";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "proof_named_body";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "pains_eyebrow";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "pains_title";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "system_eyebrow";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "system_title";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "charge_title";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "charge_body";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "draft_guarantee_title";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "draft_guarantee_body";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "guarantee_heading";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "yes_label";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "no_label";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "score_heading";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "progress_hint";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "pass_max_nos";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "pass_heading";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "pass_body";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "fail_heading";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "fail_body";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "result_guide_body";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "reapply_label";
    ALTER TABLE "funnel" DROP COLUMN IF EXISTS "fit_call_label";
  `)
}
