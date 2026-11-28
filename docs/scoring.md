# Scoring version 4

Three outcomes stay the same in name: qualified, review, and not yet. The thresholds moved because the setup-fee question was removed. Qualified is 11 or more, review is 7 to 10, not yet is under 7, unless a hard rule applies.

New applications are not asked whether they can pay a setup fee. The commercial model is no upfront fee: a free sales audit, a free setup, then 10% of cash collected. There is no monthly retainer. An older “no” on the setup-fee question is stored but is not a hard stop, and it adds no points.

## Points

| Answer | Points |
| --- | --- |
| Offer price under $1,000 | 0 |
| $1,000–$2,999 | 2 |
| $3,000–$9,999 | 4 |
| $10,000–$24,999 or $25,000+ | 5 |
| Revenue pre-revenue | 0 |
| Under $10k/mo | 1 |
| $10k–$30k | 3 |
| $30k–$100k | 4 |
| $100k+ | 5 |
| Conversations none | 0 |
| 1–10 | 1 |
| 11–30 | 3 |
| 31+ | 4 |
| Timeline researching | 0 |
| 1–3 months | 1 |
| This month or sooner | 3 |

## Hard rules

- Price under $1,000, and the offer is not B2B: not yet (`hard:price_under_1000`).
- Price under $1,000 on a B2B offer: review (`hard:b2b_low_price_review`).
- Pre-revenue and no conversations: not yet (`hard:pre_revenue_and_no_conversations`).
- A flagged “other” offer that would otherwise pass is held at review.
- Researching demotes an otherwise qualified score to review.

## Who decides

`decisionMakers` is stored on the application (`just_me`, `partner`, or `team`). It is not scored. It does not change qualified, review, or not yet. When the answer is not `just_me`, the booking page and the booking email ask them to bring that person.

## Older applications

Monthly band answers are still stored on `investment` and still score if `setupFee` is empty. `under_3k` remains not yet (`hard:investment_under_3000`). Those labels stay readable. They are not asked on the form anymore. Setup-fee answers from version 3 stay on the record and are ignored when scoring.
