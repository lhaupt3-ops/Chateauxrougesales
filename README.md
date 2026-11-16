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
3. Deploy. The build command is `npm run build`, which applies migrations before `next build`. In production, Payload also runs `prodMigrations` when the server connects.

Preview deployments are `noindex` and `robots.txt` disallows everything. Production (`VERCEL_ENV=production`) allows crawling except `/admin` and `/api/`. Set `ALLOW_INDEXING=false` if a production deployment should stay out of search until the custom domain is ready.

Scheduled publish and the reminder emails run from the cron in `vercel.json` (`/api/cron/abandonment`, every 15 minutes). That schedule needs a Vercel plan that allows it. The route requires `Authorization: Bearer $CRON_SECRET`.

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
| `RESEND_API_KEY` | No | Transactional email. Without it, messages are logged and the request still succeeds. |
| `RESEND_FROM` | No | From address, for example `Chateaux Rouge <hello@yourdomain.com>`. |
| `NOTIFY_EMAIL` | No | Owner inbox. Site settings can override it. |
| `CALENDLY_STRATEGY_URL` | No | 30–45 minute strategy call. Also editable in Site settings. |
| `CALENDLY_FIT_URL` | No | 15 minute fit call. |
| `CALENDLY_WEBHOOK_SIGNING_KEY` | No | Verifies `POST /api/webhooks/calendly`. Production without the key returns 503. Local dev accepts unsigned payloads. |
| `CRON_SECRET` | Yes, for cron | Bearer token for the reminder and scheduled-publish route. |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | Browser analytics. Loaded only after the consent banner. |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | Defaults to `https://us.i.posthog.com`. |
| `POSTHOG_API_KEY` | No | Server events. Falls back to the public key. |

Site settings in the admin (guarantee, notice, timeline, investment bands, Calendly URLs, notification email) override the matching env values when filled in. Bands stay labeled as placeholders until you turn that checkbox off.

## What is intentionally not invented

There are no client logos, testimonials, or performance stats. Proof, founder portraits, and case studies are empty placeholder blocks. Three journal essays are drafts under a byline named “Editorial desk (placeholder)”. Do not publish them under that name.

Calendly, Resend, and PostHog all no-op cleanly when their keys are missing. The booking screen shows a labeled placeholder and a preview of the confirmation page until a real Calendly URL is saved.

## Application routing

Score version `1` lives in `src/lib/scoring.ts`.

- Qualified (13 or more, no hard fail) opens the strategy calendar.
- Review (8–12, or a researching lead who would otherwise qualify, or a flagged “other” offer) opens the 15-minute fit call.
- Not yet (under 8, price under $1,000, or pre-revenue with no conversations) goes to `/apply/next-steps`.
- Price under $1,000 on a B2B offer is review, not an automatic no.

Partial applications are saved as they go. A returning browser resumes from the id in local storage. The cron emails a partial lead after 30 minutes and an unbooked qualified or review lead after an hour.

## Deviations from the build spec

- Service, vertical, and comparison pages live in code (`src/content/guides.ts`) so the money pages stay in git. A post’s pillar is a select mapped to those URLs, not a CMS relation.
- Payload’s own draft, version history, autosave, and scheduled publish are used instead of a second status field.
- Australia does not have a doorway page. The done-for-you page says the team works in English with founders in Australia, the UK, and the US.
- `/who-we-help/high-ticket-b2c` is not built. The spec marked it optional.
- SMS reminders are consented and described on the confirmation page. Sending them needs a provider that is not in this build. Email reminders are implemented.
- FAQ content is visible and also emitted as FAQPage JSON-LD. Google removed FAQ rich results in May 2026; the markup is there for answer engines and does not change the page.
