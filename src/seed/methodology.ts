import type { Payload } from 'payload'
import { fallbackFaqs } from '@/content/faqs'
import { richText } from '@/lib/lexical'
import { defaultSettings } from '@/lib/settings'

const OLD_GUARANTEE_START = 'Placeholder: we replace a closer'
const OLD_NOTICE_START = 'Placeholder: an initial term, then month to month with written notice'
const OLD_TIMELINE = 'About 14 days to first covered calls, once operations confirms that number.'
const MARKER = 'Commission draft.'

type Block = { kind: 'p' | 'h2'; text: string }

const drafts: { slug: string; excerpt: string; body: Block[] }[] = [
  {
    slug: 'what-is-sales-team-as-a-service',
    excerpt: 'Commission draft. A managed team is setters, closers and a lead. Not a promised close rate.',
    body: [
      { kind: 'p', text: 'A sales team as a service is a setter, a closer and a sales lead who run the pipeline from the first reply to cash collected. You keep the offer, the clients and the data. On your buyers’ calls, the closer’s job is to find what is true and help them decide: yes, not yet, or no.' },
      { kind: 'h2', text: 'Two conversations' },
      { kind: 'p', text: 'We sell the managed team to founders. The team then sells the founder’s offer to the founder’s buyers. The standard is the same. The meetings are not. Listen first. Qualify before price. No invented urgency. A no is allowed.' },
      { kind: 'h2', text: 'What you pay' },
      { kind: 'p', text: 'The shape is a one-off setup fee, then commission on cash collected. There is no monthly retainer. The setup amount and the commission percentage are still to be confirmed. The agreement is the price.' },
    ],
  },
  {
    slug: 'cost-to-hire-a-high-ticket-closer',
    excerpt: 'Commission draft. Commission, base, or a managed seat. None of these figures are our rate.',
    body: [
      { kind: 'p', text: 'What a closer costs is the cash, the management time, and the deals that stall while they learn the offer. Three shapes are common: commission only, a base plus commission, and a managed team. Any percentage you read elsewhere is a market observation, not our fee.' },
      { kind: 'h2', text: 'Commission only' },
      { kind: 'p', text: 'Pay arrives when cash is collected. The hidden cost is attention. If you still design the call and review every conversation, you did not leave the sales seat.' },
      { kind: 'h2', text: 'A managed team' },
      { kind: 'p', text: 'You pay for the management as well as the person. Ask who owns the CRM, the recordings and the notes if you leave. If that is unclear, do not sign.' },
    ],
  },
  {
    slug: 'how-to-hire-a-high-ticket-closer',
    excerpt: 'Commission draft. Hear them sell your offer. Listening matters more than a loud style.',
    body: [
      { kind: 'p', text: 'Hiring a closer is a buying decision. The question is whether they can run your call without pressure your buyers would resent. Published research on sales performance points more to knowledge and adaptiveness than to personality. That is research, not a result of ours.' },
      { kind: 'h2', text: 'A short pass' },
      { kind: 'p', text: 'Write who the offer is for and who it is not for. Ask for a lost call, not a highlight. Practise with you as the buyer who needs time. Score the questions, not the charm. Name who coaches them before the first live call. Keep the notes in your CRM.' },
      { kind: 'h2', text: 'When to wait' },
      { kind: 'p', text: 'Wait if the offer has never sold, if you want a promised close rate, or if you need someone to invent demand. Those are product problems. Say so.' },
    ],
  },
  {
    slug: 'outsourced-vs-in-house-sales-team',
    excerpt: 'Commission draft. In house you manage the people. Outsourced, you still own the data.',
    body: [
      { kind: 'p', text: 'An in-house team is employees you recruit and coach. An outsourced team is a function you buy. Neither is cheaper in every case, and this draft does not invent a savings figure.' },
      { kind: 'h2', text: 'What actually changes' },
      { kind: 'p', text: 'In house, you own the culture and the payroll. Outsourced, you buy the management as well as the seats, and you should still own the CRM, the recordings and the notes. Outsourced fits when you are the bottleneck and do not want a department yet.' },
      { kind: 'h2', text: 'A year on' },
      { kind: 'p', text: 'A hire that works compounds. A hire that does not is a quiet year. An outsourced team can end on the notice in the contract, which is also its limit: the skill walks unless you kept the system. That is why data ownership is the first question.' },
    ],
  },
  {
    slug: 'appointment-setter-vs-closer',
    excerpt: 'Commission draft. A setter books. A closer runs the call. Empty calendars and full calendars need different help.',
    body: [
      { kind: 'p', text: 'A setter replies, qualifies and confirms. A closer runs the conversation and the days after it. Judging one by the other’s number is how both jobs get done badly.' },
      { kind: 'h2', text: 'Which one first' },
      { kind: 'p', text: 'Look at the last month. Plenty of real conversations that you still take yourself: a closer. Leads that go quiet before anyone replies: a setter. Both, and you are also delivering: the full unit. Nothing sold yet: neither.' },
      { kind: 'h2', text: 'Why the handoff matters' },
      { kind: 'p', text: 'Show rate dies between the booking and the call when the two people never hear each other. One lead, one board, one weekly review. Published research links a reply inside the first hour with a higher chance of qualifying a lead. That finding is not our statistic.' },
    ],
  },
  {
    slug: 'commission-only-closers',
    excerpt: 'Commission draft. Commission-only cuts payroll and leaves the management on you.',
    body: [
      { kind: 'p', text: 'A commission-only closer is paid when cash arrives. That lowers payroll. It does not lower the need for a script, call review and follow-up. If those stay with you, you bought a person and kept the job.' },
      { kind: 'h2', text: 'When it can work' },
      { kind: 'p', text: 'It can work if you already enjoy coaching and you have the hours. It fails when the point of the hire was to stop being the manager. We do not publish our own commission rate here. The agreement would.' },
      { kind: 'h2', text: 'What to ask' },
      { kind: 'p', text: 'Who reviews the calls? Who owns the notes if they leave? What happens after a clear no? A good answer is specific. A vague answer is the risk.' },
    ],
  },
  {
    slug: 'outsourced-sales-team-for-coaches',
    excerpt: 'Commission draft. Coaches stay the voice of the offer. The team should not perform a personality.',
    body: [
      { kind: 'p', text: 'The person who is best at the work is often the only one the market trusts. That does not scale, and a loud closer usually makes it worse. The useful version starts from your own calls, strikes lines you would never say, and strikes claims you cannot prove.' },
      { kind: 'h2', text: 'What has to be true' },
      { kind: 'p', text: 'You have sold the offer yourself, and you can deliver if more people say yes. Whether the price can carry a team is a question, not a universal number. If enrolment is still a theory, wait.' },
      { kind: 'h2', text: 'They are not you' },
      { kind: 'p', text: 'They represent the company and they say so. Pretending to be the founder is a short path to a complaint. The standard on the call is the same as ours: find what is true, then let the buyer decide.' },
    ],
  },
  {
    slug: 'questions-to-ask-a-sales-agency',
    excerpt: 'Commission draft. Ask who owns the data, what a no sounds like, and where the price is written.',
    body: [
      { kind: 'p', text: 'An agency pitch should survive plain questions. If the answers are slogans, you are buying theatre.' },
      { kind: 'h2', text: 'Questions worth asking' },
      { kind: 'p', text: 'Who owns the CRM, the recordings and the notes if you leave? What does a closer do when a buyer says no? Where is the price written, and do you see the agreement before you pay? Do they promise a close rate? A promise of a rate is a reason to walk.' },
      { kind: 'h2', text: 'What we will not pretend' },
      { kind: 'p', text: 'Our setup fee, commission percentage, guarantee and notice period are still drafts. A start date is not confirmed. Named results are not published. Those gaps are on purpose until the wording can be kept.' },
    ],
  },
]

export async function refreshMethodologyCopy(payload: Payload) {
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  const patch: Record<string, unknown> = {}
  if (typeof settings.guaranteeText === 'string' && settings.guaranteeText.startsWith(OLD_GUARANTEE_START)) {
    patch.guaranteeText = defaultSettings.guaranteeText
  }
  if (typeof settings.noticeText === 'string' && settings.noticeText.startsWith(OLD_NOTICE_START)) {
    patch.noticeText = defaultSettings.noticeText
  }
  if (settings.timelineText === OLD_TIMELINE) patch.timelineText = defaultSettings.timelineText
  if (Object.keys(patch).length) {
    try {
      await payload.updateGlobal({ slug: 'site-settings', overrideAccess: true, data: patch })
      payload.logger.info('Updated older site settings sentences.')
    } catch (error) {
      payload.logger.error({ err: error, msg: 'Could not update site settings drafts' })
    }
  }

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
    if (excerpt.startsWith(MARKER)) continue
    const hero = doc.heroImage
    const heroId = hero && typeof hero === 'object' && 'id' in hero ? hero.id : hero
    await payload.update({
      collection: 'posts',
      id: doc.id,
      draft: true,
      overrideAccess: true,
      data: {
        excerpt: draft.excerpt.slice(0, 200),
        body: richText(draft.body),
        _status: 'draft',
        ...(heroId ? { heroImage: heroId } : {}),
        ...(typeof doc.heroImageAlt === 'string' ? { heroImageAlt: doc.heroImageAlt } : {}),
      },
    })
    payload.logger.info(`Rewrote draft essay ${draft.slug}`)
  }

  const answers = new Map<string, string>()
  for (const group of Object.values(fallbackFaqs)) {
    for (const faq of group) answers.set(faq.question, faq.answer)
  }
  const faqs = await payload.find({ collection: 'faqs', limit: 200, overrideAccess: true })
  for (const faq of faqs.docs) {
    const question = typeof faq.question === 'string' ? faq.question : ''
    const answer = typeof faq.answer === 'string' ? faq.answer : ''
    const replacement = answers.get(question)
    const risky = /90-day|no refunds|guaranteed close|we replace a closer/i.test(answer)
    if (!replacement && !risky) continue
    if (replacement && replacement === answer) continue
    await payload.update({
      collection: 'faqs',
      id: faq.id,
      overrideAccess: true,
      data: {
        answer: replacement || 'This answer is a draft. The agreement holds any commercial promise. We do not promise a close rate or say that refunds are unavailable.',
      },
    })
  }

  const resources = [
    { slug: 'sales-team-readiness-scorecard', description: 'The same questions as the application. The result is a next step, not a promise of a fit.' },
    { slug: 'closer-hiring-kit', description: 'A short way to hear someone sell your offer before you hire. Hiring criteria themselves are not confirmed.' },
    { slug: 'show-rate-playbook', description: 'What the confirmation should say, who should attend, and that not being a fit is a fine outcome.' },
  ]
  for (const resource of resources) {
    const found = await payload.find({
      collection: 'resources',
      where: { slug: { equals: resource.slug } },
      limit: 1,
      overrideAccess: true,
    })
    const doc = found.docs[0]
    if (!doc || doc.description === resource.description) continue
    await payload.update({
      collection: 'resources',
      id: doc.id,
      overrideAccess: true,
      data: {
        description: resource.description,
        body: richText([
          { kind: 'p', text: 'This is a working draft so the page can be read. It is not a client case and it does not claim results.' },
          { kind: 'h2', text: 'What you can use' },
          { kind: 'p', text: resource.description },
          { kind: 'h2', text: 'Still missing' },
          { kind: 'p', text: 'A file, a named author, and any proof a client has approved. Add those before you send traffic here.' },
        ]),
      },
    })
  }
}
