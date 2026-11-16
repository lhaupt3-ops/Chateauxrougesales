import type { Payload } from 'payload'
import { richText } from '@/lib/lexical'
import { defaultSettings } from '@/lib/settings'

const OLD_GUARANTEE_START = 'Placeholder: we replace a closer'
const OLD_NOTICE_START = 'Placeholder: an initial term, then month to month with written notice'
const OLD_TIMELINE = 'About 14 days to first covered calls, once operations confirms that number.'

export async function refreshMethodologyCopy(payload: Payload) {
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  const patch: Record<string, string> = {}
  if (typeof settings.guaranteeText === 'string' && settings.guaranteeText.startsWith(OLD_GUARANTEE_START)) {
    patch.guaranteeText = defaultSettings.guaranteeText
  }
  if (typeof settings.noticeText === 'string' && settings.noticeText.startsWith(OLD_NOTICE_START)) {
    patch.noticeText = defaultSettings.noticeText
  }
  if (settings.timelineText === OLD_TIMELINE) patch.timelineText = defaultSettings.timelineText
  if (Object.keys(patch).length) {
    await payload.updateGlobal({ slug: 'site-settings', overrideAccess: true, data: patch })
    payload.logger.info('Updated site settings copy to the methodology draft.')
  }

  const drafts = [
    {
      slug: 'what-is-sales-team-as-a-service',
      excerpt:
        'DRAFT. Not for publication. What a managed sales team is, and why the call looks for an honest decision rather than a promised close rate.',
      body: [
        { kind: 'p' as const, text: 'A sales team as a service is a setter, a closer and a sales lead who run the pipeline from the first reply to cash collected. You keep the offer, the clients and the data. The closer’s job, on your buyers’ calls, is to find what is true and help them decide: yes, not yet, or no.' },
        { kind: 'h2' as const, text: 'Two conversations, one standard' },
        { kind: 'p' as const, text: 'We sell the managed team to founders. The team then sells the founder’s offer to the founder’s buyers. The standard is the same: listen, qualify before price, no invented urgency, and a free no. They are not the same meeting.' },
        { kind: 'h2' as const, text: 'What should you expect to pay?' },
        { kind: 'p' as const, text: 'The working shape is a setup fee, a monthly management fee and a commission on cash collected. The bands on the pricing page are a draft until the agreement confirms them. Do not treat a competitor’s round number as a fact.' },
      ],
    },
    {
      slug: 'cost-to-hire-a-high-ticket-closer',
      excerpt:
        'DRAFT. Not for publication. Commission, base and a managed team, with every figure marked as a market observation rather than our rate.',
      body: [
        { kind: 'p' as const, text: 'The cost of a high-ticket closer is the cash you pay, the time you spend managing them, and the deals that die while they learn the offer. Three shapes show up often: commission only, base plus commission, and a managed team that wraps both into a fee plus a share of cash collected. None of the percentages below are our price.' },
        { kind: 'h2' as const, text: 'Commission only' },
        { kind: 'p' as const, text: 'A commission-only closer is paid when cash is collected. The hidden cost is attention. If you still write the call shape and review every conversation, you did not leave sales. You added someone you now have to coach.' },
        { kind: 'h2' as const, text: 'A managed team' },
        { kind: 'p' as const, text: 'You pay for management as well as the seat. Ask who owns the CRM, the recordings and the data if you leave. If the answer is unclear, do not sign. Our own bands stay a draft until they are in an agreement.' },
      ],
    },
    {
      slug: 'how-to-hire-a-high-ticket-closer',
      excerpt:
        'DRAFT. Not for publication. Hire for listening and calm, then hear them sell your offer. Not a personality test.',
      body: [
        { kind: 'p' as const, text: 'Hiring a closer is a buying process. The useful question is whether this person can run your call, on your offer, without inventing pressure your buyers would resent. Research on sales performance points to knowledge and the ability to adapt, more than to a loud personality. That is a research direction, not a result of ours.' },
        { kind: 'h2' as const, text: 'A short pass' },
        { kind: 'p' as const, text: 'Write the offer on one page, including who it is not for and the real refund terms. Ask for a lost call, not a highlight. Run a live practice with you as the buyer who needs to think. Score the questions they asked. Name who coaches them before day one. Put the notes in your CRM from the first conversation.' },
        { kind: 'h2' as const, text: 'When to skip the hire' },
        { kind: 'p' as const, text: 'Skip it if the offer has never been sold, if you want a promised close rate, or if you need someone to invent demand. Those are product and marketing problems. An honest team will say so.' },
      ],
    },
  ]

  for (const draft of drafts) {
    const found = await payload.find({
      collection: 'posts',
      where: { slug: { equals: draft.slug } },
      draft: true,
      limit: 1,
      overrideAccess: true,
    })
    const doc = found.docs[0]
    if (!doc) continue
    const excerpt = typeof doc.excerpt === 'string' ? doc.excerpt : ''
    if (!excerpt.startsWith('DRAFT EXAMPLE')) continue
    await payload.update({
      collection: 'posts',
      id: doc.id,
      draft: true,
      overrideAccess: true,
      data: {
        excerpt: draft.excerpt,
        body: richText(draft.body),
      },
    })
    payload.logger.info(`Updated draft essay ${draft.slug}`)
  }
}
