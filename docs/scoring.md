# Scoring version 3

Three outcomes stay the same: qualified (13 or more), review (8 to 12), not yet (under 8), unless a hard rule applies.

New applications answer `setupFee` instead of a monthly budget band. The commercial model is a one-off setup fee, then commission on cash collected. There is no monthly retainer. The setup amount and the commission percentage are unpublished until the owner sets them.

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
| Can pay a setup fee: yes | 3 |
| Not yet, or not sure | 1 |
| No | 0 |

## Hard rules

- Price under $1,000, and the offer is not B2B: not yet (`hard:price_under_1000`).
- Price under $1,000 on a B2B offer: review (`hard:b2b_low_price_review`).
- Pre-revenue and no conversations: not yet (`hard:pre_revenue_and_no_conversations`).
- Cannot pay a setup fee: not yet (`hard:cannot_pay_setup`).
- A flagged “other” offer that would otherwise pass is held at review.
- Researching demotes an otherwise qualified score to review.

## Older applications

Monthly band answers are still stored on `investment` and still score if `setupFee` is empty. `under_3k` remains not yet (`hard:investment_under_3000`). Those labels stay readable. They are not asked on the form anymore.
