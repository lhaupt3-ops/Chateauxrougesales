# Chateaux Rouge

Marketing site for Chateaux Rouge, a high-ticket sales team (setters, closers, and a sales lead). Next.js App Router, Payload CMS 3 at `/admin`, Postgres, and Vercel Blob for media when a token is present.

## Local setup

Requires Node.js 22.23.4 or newer and Postgres.

```bash
cp .env.example .env
# Fill DATABASE_URL, PAYLOAD_SECRET, and the optional admin email/password.
npm install
npm run migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The back office is [http://localhost:3000/admin](http://localhost:3000/admin).

`npm run build` runs migrations, then the Next.js production build. `npm test` runs the application scoring tests. `npm run lint` and `npm run typecheck` are the other checks.

### First admin user

Either:

1. Set `PAYLOAD_ADMIN_EMAIL` and `PAYLOAD_ADMIN_PASSWORD` before the first boot. If the users collection is empty, that account is created as an admin.
2. Or leave those blank and open `/admin`. Payload shows the first-user screen when nobody exists yet. The role defaults to admin.

Editors can manage the journal, resources, and case studies. Sales can read and update applications only.

`npm run seed` is safe to re-run. It fills empty settings, the placeholder author, categories, three **draft** essays, and three guide pages. It does not overwrite content that is already there.

## Deploy on Vercel

1. Create a Postgres database (Neon via the Vercel Marketplace, or Vercel Postgres) and a Blob store.
2. Set the environment variables below on the project.
3. Deploy. `npm run build` runs `payload migrate` only when `DATABASE_URL` or `POSTGRES_URL` is set, then builds Next.js. If neither is set, migrate is skipped so a Hobby deploy is not blocked on a missing database. In production, Payload still applies `prodMigrations` the first time the server connects to Postgres.

Preview deployments are `noindex` and `robots.txt` disallows everything. Production (`VERCEL_ENV=production`) allows crawling except `/admin` and `/api/`. Set `ALLOW_INDEXING=false` if a production deployment should stay out of search until the custom domain is ready.

Hobby plans only allow a Vercel cron that runs once a day, so `vercel.json` calls `/api/cron/abandonment` and `/api/cron/publish` at 01:00 UTC. That daily run is a backup. The 15-minute cadence lives in GitHub Actions (`.github/workflows/cron.yml`), which GETs both routes with `Authorization: Bearer ${{ secrets.CRON_SECRET }}`.

If the `CRON_SECRET` repository secret is missing, the workflow exits successfully and does nothing. If the `SITE_URL` repository variable is missing, it uses `https://chateaux-rouge.vercel.app`. Set `CRON_SECRET` in GitHub to the same value as the Vercel env var. No function duration, memory, or region overrides are set, so the deploy stays inside Hobby defaults.

Both routes are safe to call more often than their schedule. A partial-lead reminder is sent once (`partialReminderSentAt`). An unbooked reminder is sent once (`unbookedReminderSentAt`). `/api/cron/publish` runs the Payload jobs queue, which only publishes posts whose scheduled time has arrived. `/api/cron/abandonment` sends the reminders and runs that same queue.

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` or `POSTGRES_URL` | Yes | Postgres connection string. Either name works. |
| `PAYLOAD_SECRET` | Yes | Signs Payload sessions. Long random string. |
| `NEXT_PUBLIC_SITE_URL` | Yes in production | Canonical origin, no trailing slash. Drives `metadataBase`. |
| `ALLOW_INDEXING` | No | `true` or `false` overrides the Vercel production check. |
| `PREVIEW_SECRET` | Yes, to preview drafts | Query secret for `/next/preview`. |
| `PAYLOAD_ADMIN_EMAIL` | No | Creates the first admin when the users table is empty. |
| `PAYLOAD_ADMIN_PASSWORD` | No | Password for that first admin. |
| `BLOB_READ_WRITE_TOKEN` | Yes on Vercel | Vercel Blob. When missing, media is stored in `/media` on disk. |
| `RESEND_API_KEY` | No | Transactional email and Payload password resets. Without it, the Resend adapter is not registered, messages are logged, and the request still succeeds. |
| `RESEND_FROM` | No | From address, for example `Chateaux Rouge <hello@yourdomain.com>`. |
| `NOTIFY_EMAIL` | No | Owner inbox. Site settings can override it. |
| `CALENDLY_STRATEGY_URL` | No | 30–45 minute strategy call. Also editable in Site settings. |
| `CALENDLY_FIT_URL` | No | 15 minute fit call. |
| `CALENDLY_WEBHOOK_SIGNING_KEY` | No | Verifies `POST /api/webhooks/calendly`. Production without the key returns 503. Local dev accepts unsigned payloads. The `invitee.created` payload stores the meeting start and end. |
| `CALENDLY_API_TOKEN` | No | Personal access token. When set, `/api/apply/booked` reads the scheduled event start and end from the Calendly API. |
| `CRON_SECRET` | Yes, for cron | Bearer token for `/api/cron/abandonment` and `/api/cron/publish`. Use the same value as the GitHub Actions secret. |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | Browser analytics. Loaded only after the consent banner. |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | Defaults to `https://us.i.posthog.com`. |
| `POSTHOG_API_KEY` | No | Server events. Falls back to the public key. |

Site settings in the admin (guarantee, notice, timeline, setup fee, commission, Calendly URLs, notification email) override the matching env values when filled in. The setup fee and commission stay “to be confirmed” until you turn those checkboxes off. Nurture email stays off until `nurtureEnabled` is on. See `docs/sequences.md`.

## What is intentionally not invented

There are no client logos, testimonials, or performance stats. Proof, founder portraits, and case studies are empty placeholder blocks. Three journal essays are drafts under a byline named “Editorial desk (placeholder)”. Do not publish them under that name.

Calendly, Resend, and PostHog all no-op cleanly when their keys are missing. The booking screen shows a labeled placeholder and a preview of the confirmation page until a real Calendly URL is saved.

## Application routing

Score version `2` lives in `src/lib/scoring.ts`. An investment under $3,000 a month is not yet, even when the rest of the score would qualify.

- Qualified (13 or more, no hard fail) opens the strategy calendar.
- Review (8–12, or a researching lead who would otherwise qualify, or a flagged “other” offer) opens the 15-minute fit call.
- Not yet (under 8, price under $1,000, investment under $3,000 a month, or pre-revenue with no conversations) goes to `/apply/next-steps`.
- Price under $1,000 on a B2B offer is review, not an automatic no.

Partial applications are saved as they go. A returning browser resumes from the id in local storage. The cron emails a partial lead after 30 minutes and an unbooked qualified or review lead after an hour.

## Deviations from the build spec

- Service, vertical, and comparison pages live in code (`src/content/guides.ts`) so the money pages stay in git. A post’s pillar is a select mapped to those URLs, not a CMS relation.
- Payload’s own draft, version history, autosave, and scheduled publish are used instead of a second status field.
- Australia does not have a doorway page. The done-for-you page says the team works in English with founders in Australia, the UK, and the US.
- `/who-we-help/high-ticket-b2c` is not built. The spec marked it optional.
- SMS reminders are consented and described on the confirmation page. Sending them needs a provider that is not in this build. Email reminders are implemented.
- FAQ content is visible and also emitted as FAQPage JSON-LD. Google removed FAQ rich results in May 2026; the markup is there for answer engines and does not change the page.
