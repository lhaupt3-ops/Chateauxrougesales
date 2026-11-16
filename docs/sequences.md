# Email sequences

Two sequences, both off until Site settings → `nurtureEnabled` is switched on.

- Nurture: five emails over about three weeks (`nurture-1` immediately, then 3, 7, 14 and 21 days). Used for review, not yet, waitlist and lead-magnet opt-ins.
- Follow-up: three emails (about 1 hour, 1 day, 3 days). `partial-1` to `partial-3` for unfinished applications. `qualified-1` to `qualified-3` for a qualified lead who has not booked.

The cron that already runs every 15 minutes calls `GET /api/cron/abandonment`. While `nurtureEnabled` is off, that job sends nothing, including the older one-off reminders.

Each send is stored on the application in `sequenceLog` as `{ key, at }`. A key already in the log is not sent again. The sequence stops when the application is booked, the address unsubscribes, or a newer application exists for the same email.

Every email includes a one-click unsubscribe link and a `List-Unsubscribe` header. `GET` or `POST /api/email/unsubscribe?token=` marks every application for that address as unsubscribed.

## Edit the copy

Admin → Email sequences. Each step has a subject, heading and body. A blank body falls back to the copy in `src/lib/sequences.ts`.

## Preview

Log in to `/admin` as an admin, then:

```
curl -X POST https://chateauxrouge.com/api/admin/sequence-preview \
  -H "content-type: application/json" \
  -H "cookie: <your admin session cookie>" \
  -d '{"kind":"nurture"}'
```

`kind` is `nurture`, `partial` or `qualified`. The messages go to the logged-in admin’s email, with `[Preview]` on the subject. This works while `nurtureEnabled` is off.
