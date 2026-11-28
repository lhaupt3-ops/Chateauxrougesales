# Content changes

The public site now describes a managed sales team whose standard is an honest decision: yes, not yet, or no. Founder-facing pages and buyer-call pages are kept apart. No person, book, program or coined method is named. Research is labelled as research.

## What changed

- Homepage: the hero no longer treats “$3k and up” as a confirmed niche. A new section separates the call we have with founders from the calls closers run for buyers. Proof cards stay unpublished until a real case study is published.
- Services, who-we-help and comparison pages: headlines and the “who it is for” lines now describe a working picture. Price floors are questions the application asks, not a published rate card. The agency-versus-freelance page no longer advertises replacement as a locked promise.
- About: the standards page. Five tests, the lines we do not cross, and an explicit note that hiring, KPIs, the guarantee and the fee are unconfirmed.
- How it works: the install (read, install, staff, review) and the buyer call (open, discover, qualify, decide) are separate.
- Pricing: a one-off setup fee, then commission on cash collected. No monthly retainer and no “From $3,000/month”. The setup amount and the commission percentage stay “to be confirmed” while their placeholder flags are on.
- Application: the budget question is now whether they can pay a setup fee. Older monthly-band answers stay on the record and still display. Scoring is version 3. See `docs/scoring.md`.
- Book, confirmation and next-steps: the call is for clarity, the decision-maker should attend, and a poor fit gets a plain next step plus an optional waitlist that does not chase.
- Email: fit result, booking, reminders, waitlist, guide and the owner note use the same voice. Password reset already uses the shared layout.
- Journal: eight draft essays are rewritten by slug and kept as drafts. Hero images and SEO fields are left in place.
- Careers, results, resources and the course-page FAQ now say the same thing: no published hiring plan, no published results, drafts are drafts, and a price under $1,000 is a working rule.
- Site settings changes revalidate the homepage, the pricing page and the root layout.
- SEO: home, apply, pricing, about and how-it-works metadata, plus the organisation description in JSON-LD, promise process rather than outcomes. Guide schema uses each page’s updated description.

## Placeholders that still need a real decision

These stay editable in Site settings, or as empty proof blocks. Do not publish them as fact until they are confirmed and, where a number is involved, substantiated.

- Ideal client profile beyond “has already sold, can deliver, will share recordings.”
- Offer menu beyond the four pages already on the site (audit, install, managed team, and any training add-on).
- The setup fee amount and the commission percentage. Both flags stay on until you enter a figure you will honour. There is no monthly retainer.
- Guarantee wording. `guaranteeIsPlaceholder` stays on, so the homepage shows a draft notice instead of whatever text is stored, including a 90-day pipeline promise. Turn the flag off only after a lawyer has reviewed wording the agreement can keep.
- Contract length and notice. `noticeIsPlaceholder` stays on for the same reason. The terms page says commercial terms are a draft pending review.
- Time to first covered calls.
- Hiring profile, employment status of closers, and the replacement rule.
- KPI targets (speed to lead, show rate, close rate, talk share, scorecard bands).
- Named results, logos, portraits and testimonials. Case studies stay unpublished, and the illustrative label stays available.
- Intro video, strategist name, and SMS. The confirmation page hides those until they are set.
- Lawyer review of refund and consumer-rights wording for each market. The site says a change-of-mind policy does not replace legal rights. It does not state a policy.

## v1 honest offer (branch `v1-honest-offer`)

The site now describes what exists today: one founder who installs the call process and takes the calls himself. A team is described as later, not as a product.

- Offer shape (later confirmed): optional free sales audit, then a pilot with no setup fee and 10% of cash collected, no retainer. Setting, lead generation and a staffed team are named as not offered yet.
- Homepage, pricing, services (index and the four pages), about, how it works, FAQs, funnel defaults, SEO titles, JSON-LD, llms.txt, footer and the apply next-steps/book pages are first person and no longer mention setters, a sales lead or a staffed team as existing.
- Services pages for a full team and for appointment setting are marked `status: 'later'`, are `noindex`, and hide the apply prompts.
- The hero card no longer shows invented sample figures. It shows a blank weekly report.
- Copy stored in the database (Funnel global, Faqs collection, Site settings) overrides these defaults when present. Check the admin after deploy.

## v1 prices confirmed (branch `v1-honest-offer`)

Lasse confirmed the numbers on 28 Nov 2026: the audit is free, the setup is free, and commission is 10% of cash collected. There is no retainer and no audit credit.

- Canonical figures live in `src/content/offer.ts`. Site settings can still override the setup and commission labels when their placeholder flags are off. If the flags are still on in the production database, the site falls back to these figures so a preview (and a later production merge) show the right numbers without a database edit.
- Funnel scoring is version 4. The setup-fee question is no longer asked. Thresholds are qualified at 11 or more, review at 7 to 10. An older “cannot pay a setup fee” answer is not a hard stop. See `docs/scoring.md`.
- Copy on pricing, home, services, FAQs, the apply confirmation and next-steps pages, the scorecard, and the switched-off nurture defaults now says there is no upfront fee.
- Pilot length and notice stay “To be confirmed”.
