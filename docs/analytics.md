# Analytics taxonomy

PostHog is the funnel store. The browser SDK loads only after the visitor chooses **Allow analytics** (`cr_consent=granted`). Persistence stays `localStorage+cookie`. There is no cookieless mode. Declining analytics leaves the banner choice, the application itself, and essential cookies untouched.

Server events use the application id as `distinct_id` and are sent only when that application stored `analyticsConsent`. The browser calls `posthog.identify(applicationId, { email_domain_type })` at the same moment, so client and server events join on that id. `email_domain_type` is `free` or `business`. The address itself is not a person property and is not put on these events.

`post_slug` is the last journal slug in `localStorage` (`cr_last_post`), written on `/blog/[slug]` only after consent. It is an empty string when the visitor has not read a post in this browser.

## Funnel

`visit → CTA → apply → each step → submitted → outcome → booked`

| Stage | Event | Where |
| --- | --- | --- |
| Visit | `$pageview` | Every consented route change |
| CTA | `cta_clicked` | Header, mobile nav, hero, guide footer, post, pricing, email forms, sticky bar |
| Apply loaded | `apply_started` | Wizard mount |
| Email saved | `apply_email_submitted` | Wizard email step, or an inline email form that creates the application |
| Each step | `apply_step_viewed`, `apply_step_completed` | Wizard |
| Submitted | `application_submitted` | Browser after `/api/apply/complete`, and the server |
| Routed | `route_assigned` | Server, with the submission |
| Outcome | `apply_outcome_viewed` | `/apply/book`, `/apply/next-steps`, `/apply/confirmed` |
| Booked | `call_booked`, then `call_booked_server`, then `call_booking_confirmed` | Embed, our API, Calendly webhook |
| Left unfinished | `apply_abandoned` | Browser `pagehide` after identify, and the beacon to `/api/apply/abandon` |

Funnels should count unique people. `application_submitted` and `apply_abandoned` are emitted from both the browser and the server on purpose, on the same distinct id.

## Identity and person properties

| Call | When | Properties |
| --- | --- | --- |
| `posthog.identify` | `/api/apply/start` returns in the wizard or `EmailCapture`. Also on wizard load when `cr_application_id` is already in `localStorage` or the `id` query is present. The resume response adds `email_domain_type` once the stored email is known. | `{ email_domain_type }` |
| `posthog.setPersonProperties` | Wizard `finish()` after `/api/apply/complete` returns | `{ tier, score, offer_type }` |
| `$set_once` on the three server events below | First time we see this person | `initial_utm_source`, `initial_utm_medium`, `initial_utm_campaign`, `initial_landing_page`, `initial_referrer` |

Empty first-touch values are omitted from `$set_once`, so a blank first hit does not lock the person property.

The application stores first touch in `utmSource`, `utmMedium`, `utmCampaign`, `landingPage`, and `referrer`. Those are the values copied onto the server events and into `$set_once`.

## Booking events

These three are not interchangeable. Counting `call_booked` is the embed click. Counting `call_booking_confirmed` is Calendly’s webhook.

| Event | Source | Properties |
| --- | --- | --- |
| `call_booked` | Calendly embed (`calendly.event_scheduled`) | `event_type` (`strategy` or `fit`), `source: 'embed'` |
| `call_booked_server` | `POST /api/apply/booked` | `event_type`, `lead_time_hours`, `source` (`embed` or `preview`) |
| `call_booking_confirmed` | Calendly webhook `invitee.created` | `event_type`, `meeting_start_at`, `lead_time_hours` |
| `call_canceled` | Calendly webhook `invitee.canceled` | `event_type` |

`lead_time_hours` is hours from the capture until `meeting_start_at`. A preview confirmation (no live Calendly URL) emits `call_booked_server` with `source: 'preview'` and does not emit `call_booked`.

## Client events

| Event | Properties | When |
| --- | --- | --- |
| `$pageview` | `path`, `$current_url` | Consented route change. Autocapture of pageviews is off. |
| `cta_clicked` | `location`, `page`, `variant`, `post_slug`. Button clicks also send `target: '/apply'`. | See locations below. |
| `apply_started` | `entry`, `variant: 'email_first'`, `post_slug` | Wizard has loaded. This stays the load event, not the email save. |
| `apply_email_submitted` | `entry`, `email_domain_type` | Wizard email step saved, once per wizard session. Also when `EmailCapture` creates the application, because that path skips the wizard email step. |
| `apply_step_viewed` | `step_id`, `step_index` | A step is shown, including the first one. |
| `apply_step_completed` | `step_id`, `answer`, `time_on_step_ms` | A step saved. `answer` is option values only. |
| `apply_back_clicked` | `step_id` | Back. |
| `lead_partial_saved` | `applicationId` | Browser, the first time `/api/apply/start` returns inside the wizard. |
| `application_submitted` | `tier`, `score`, `next` | Wizard `finish()`, then person properties `{ tier, score, offer_type }`. |
| `apply_abandoned` | `last_step` | `pagehide` while the wizard is unfinished and identify has succeeded. Sent with `sendBeacon`. |
| `apply_outcome_viewed` | `tier`, `page` | `page` is `book`, `next-steps`, or `confirmed`. |
| `calendly_viewed` | `event_type` | Embed loaded the event type. |
| `calendly_time_selected` | `event_type` | A slot was selected. |
| `call_booked` | `event_type`, `source: 'embed'` | Embed reported `calendly.event_scheduled`. |
| `waitlist_joined` | `reason` | Next-steps form. Also emitted on the server. |
| `calendar_added` | `provider` (`google`, `outlook`, `ics`) | Confirmation page. |
| `confirmation_video_played` | `video_id`, `percent` | Intro play. |
| `confirmation_video_completed` | `video_id`, `percent` | Intro ended (direct video file). |
| `blog_read` | `slug`, `category`, `scroll_depth`, `read_time` | 25 / 50 / 75 / 100 percent of a post. |
| `lead_magnet_submitted` | `resource`, `page` | Resource gate. Also emitted on the server. |
| `nurture_resource_downloaded` | `resource` | Resource gate, with the magnet event. |

### `cta_clicked` locations

`variant: 'button'` and `target: '/apply'` unless noted.

| `location` | Control |
| --- | --- |
| `header` | Header “Apply for a sales team” |
| `mobile_nav` | The same label inside the mobile menu |
| `hero` | Homepage hero link |
| `guide_footer` | Guide footer button, and a guide “related” card whose href is `/apply` |
| `post_inline` | Link under a journal post, and an inline post CTA block that points at `/apply` |
| `pricing` | Homepage pricing section, and the Apply link on `/pricing` |
| `sticky` | Mobile bar after 40% scroll on a post. Same button properties, including `target` and `post_slug`. |
| Email-form locations (`hero`, `footer`, `guide`, `blog_end`, `blog_inline`, and any other `EmailCapture` `location`) | `variant: 'email'`. No `target`. `post_slug` is still set. |

`page` is `window.location.pathname` at the click.

### `apply_step_completed.answer`

Only option keys are sent: `offerType`, `pricePoint`, `monthlyRevenue`, `monthlyConversations`, `salesSetup`, `needs`, `timeline`, `setupFee`. Older applications may still have `investment`.

These are removed even if a caller passed them: `email`, `phone`, `firstName`, `lastName`, `website`, `notes`. Free text such as `offerOther` and `company` is removed too. `needs` stays a list of option values.

### Wizard steps

`email`, `offer`, `price`, `revenue`, `conversations`, `setup`, `needs`, `timeline`, `setupFee`, `contact`.

`step_index` is zero-based.

## Server events

`application_submitted`, `route_assigned`, and `lead_partial_saved` each include the stored application context:

`utm_source`, `utm_medium`, `utm_campaign`, `landing_page`, `referrer`, `last_blog_post`, `device`, `entry`, plus `$set_once` first-touch properties when any of those values are non-empty.

| Event | Other properties |
| --- | --- |
| `lead_partial_saved` | `applicationId`, `emailDomainType` |
| `application_submitted` | `score`, `tier`, `offerType`, `pricePoint`, `revenue`, `conversations`, `timeline`, `setupFee` |
| `lead_magnet_view` | `resource`, `page` |
| `lead_magnet_optin` | `resource`, `page` |
| `route_assigned` | `tier`, `reasons` |
| `apply_abandoned` | `last_step` from the beacon body, or the stored step |
| `call_booked_server` | See the booking table |
| `call_booking_confirmed` | See the booking table |
| `call_canceled` | `event_type` |
| `waitlist_joined` | `reason` |
| `lead_magnet_submitted` | `resource`, `page` |

`POST /api/apply/complete` returns `{ ok, tier, score, next }` so the browser can emit its own `application_submitted` and set person properties before the redirect.

## What is not sent

Email, phone, name, website, and notes are not properties of `apply_step_completed`. Identify receives the domain type, not the email. Consent denied means no browser SDK and no server capture for that application.
