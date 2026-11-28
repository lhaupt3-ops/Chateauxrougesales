import { randomBytes } from 'crypto'
import type { Payload } from 'payload'
import { renderEmail } from './email-layout'
import { sendEmail } from './email'
import { absoluteUrl } from './site'

export type SequenceKey =
  | 'nurture-1'
  | 'nurture-2'
  | 'nurture-3'
  | 'nurture-4'
  | 'nurture-5'
  | 'partial-1'
  | 'partial-2'
  | 'partial-3'
  | 'qualified-1'
  | 'qualified-2'
  | 'qualified-3'

export type SequenceStep = {
  key: SequenceKey
  delayHours: number
  subject: string
  heading: string
  paragraphs: string[]
}

const GUIDE = '/resources/are-you-ready-for-closers'

export const SEQUENCE_STEPS: SequenceStep[] = [
  {
    key: 'nurture-1',
    delayHours: 0,
    subject: 'The two conversations hiding inside one sales call',
    heading: 'Most offers are sold in one call that is doing two jobs',
    paragraphs: [
      'A useful way to look at a sales call is to split it. One conversation earns the right to talk about the offer. The other decides whether this person should buy.',
      'When one person tries to do both, the first half gets rushed and the second half gets vague. Setters open the conversation and book the right people. Closers run the decision.',
      'The free guide walks the split, a short scorecard, and the red flags that show up when a founder hires a closer too early.',
    ],
  },
  {
    key: 'nurture-2',
    delayHours: 72,
    subject: 'A scorecard for the sales process you already have',
    heading: 'Score the process before you hire anyone',
    paragraphs: [
      'Before a closer is useful, four things have to exist: an offer with a real price, a way to start conversations, a call that can be repeated, and a place where the follow-up lives.',
      'Give each one a yes or a no. Two or more nos means a hire will not fix the gap. The work is the process, then the person.',
      'The guide has the eight questions we use for that check. None of them require a number we have not earned.',
    ],
  },
  {
    key: 'nurture-3',
    delayHours: 168,
    subject: 'What a setter does, and what a closer must not do',
    heading: 'The roles only work when they stay separate',
    paragraphs: [
      'A setter starts conversations, qualifies against the offer, and books a decision conversation. A closer runs that conversation and owns the follow-up on the maybes.',
      'Asking a closer to also prospect usually means neither job is done. Asking a setter to discount the offer usually means the price was never held.',
      'If you only have room for one person, decide which conversation is currently missing. Hire for that one.',
    ],
  },
  {
    key: 'nurture-4',
    delayHours: 336,
    subject: 'Four moves inside a decision call',
    heading: 'A call structure you can listen back to',
    paragraphs: [
      'A decision call can stay short if it has a shape. Open with what they came to decide. Restate the problem in their words. Walk the offer against that problem. Then ask for a decision, including a clean no.',
      'The follow-up is part of the call. A maybe without a date is a lost conversation, not a pipeline.',
      'Record the calls you would be happy for a new hire to copy. If you would not play one to a stranger, the script is not ready.',
    ],
  },
  {
    key: 'nurture-5',
    delayHours: 504,
    subject: 'When outsourced closing is worth another look',
    heading: 'Reapply when the process can hold a person',
    paragraphs: [
      'Outsourced closing is a fit when conversations are already happening, the offer price can carry a closer, and you can pay a one-off setup fee. After that, the model is commission on cash collected. There is no monthly retainer.',
      'The setup amount and the commission percentage are still to be confirmed in writing. Nothing on the site is a quote.',
      'If that describes you now, the application is open. If it does not, keep the guide and come back when it does.',
    ],
  },
  {
    key: 'partial-1',
    delayHours: 1,
    subject: 'Your application is still open',
    heading: 'You can finish it in a few minutes',
    paragraphs: [
      'You started an application and stopped before the end. The answers you already gave are saved.',
      'The questions left are about your offer, your lead flow, and whether a one-off setup fee is possible. There is no monthly retainer to estimate.',
    ],
  },
  {
    key: 'partial-2',
    delayHours: 24,
    subject: 'The part of the application that decides the path',
    heading: 'Price, conversations, and the setup fee',
    paragraphs: [
      'Three answers do most of the sorting. What the offer costs. Whether conversations are already happening. Whether you can pay a setup fee.',
      'If the price is still moving, or there are no conversations yet, the honest result is usually “not yet”. That is a useful result. It is not a rejection of the offer.',
    ],
  },
  {
    key: 'partial-3',
    delayHours: 72,
    subject: 'We will leave the application here',
    heading: 'Finish it, or take the guide instead',
    paragraphs: [
      'This is the last note about the unfinished application. You can complete it whenever the numbers are real.',
      'If you would rather read first, the free guide is a self-audit of the sales process. It does not ask you to book anything.',
    ],
  },
  {
    key: 'qualified-1',
    delayHours: 1,
    subject: 'Your strategy call is still open',
    heading: 'A time is the next step',
    paragraphs: [
      'The application came back as a fit for a strategy call. Nothing starts until that conversation, and a no is a fine outcome.',
      'Bring the person who can approve a setup fee. The amount and the commission percentage are confirmed in writing, not on the call alone.',
    ],
  },
  {
    key: 'qualified-2',
    delayHours: 24,
    subject: 'What to have in front of you on the call',
    heading: 'Three numbers, not a pitch deck',
    paragraphs: [
      'The useful preparation is short. The offer price. How many sales conversations you start in a month. Where those conversations come from.',
      'If a number is a guess, say so. A guessed pipeline is how a team gets hired for a process that is not there.',
    ],
  },
  {
    key: 'qualified-3',
    delayHours: 72,
    subject: 'We will close the open calendar link',
    heading: 'Book, or reapply when the timing is real',
    paragraphs: [
      'This is the last note about the unbooked strategy call. The link stays on your confirmation page until you book or start a new application.',
      'If the timing moved, leave it. Reapply when the conversations and the setup fee are both real.',
    ],
  },
]

const BY_KEY = new Map(SEQUENCE_STEPS.map((step) => [step.key, step]))

export function stepsFor(kind: 'nurture' | 'partial' | 'qualified'): SequenceStep[] {
  const prefix = `${kind}-`
  return SEQUENCE_STEPS.filter((step) => step.key.startsWith(prefix))
}

export function dueStepKeys(input: {
  kind: 'nurture' | 'partial' | 'qualified' | 'none' | null | undefined
  enrolledAt?: string | null
  sent?: string[] | null
  now: number
  stopped: boolean
}): SequenceKey[] {
  if (input.stopped || !input.kind || input.kind === 'none' || !input.enrolledAt) return []
  const enrolled = new Date(input.enrolledAt).getTime()
  if (!Number.isFinite(enrolled)) return []
  const sent = new Set(input.sent || [])
  return stepsFor(input.kind)
    .filter((step) => !sent.has(step.key) && input.now - enrolled >= step.delayHours * 60 * 60 * 1000)
    .map((step) => step.key)
}

export function newUnsubscribeToken(): string {
  return randomBytes(24).toString('hex')
}

export function unsubscribeUrl(token: string): string {
  return absoluteUrl(`/api/email/unsubscribe?token=${encodeURIComponent(token)}`)
}

type ApplicationRow = {
  id: number | string
  email?: string | null
  status?: string | null
  tier?: string | null
  sequenceKind?: string | null
  nurtureEnrolledAt?: string | null
  sequenceLog?: unknown
  emailUnsubscribed?: boolean | null
  unsubscribeToken?: string | null
  createdAt?: string
  publicId?: string | null
  firstName?: string | null
}

function sentKeys(log: unknown): string[] {
  if (!Array.isArray(log)) return []
  return log.map((item) => (item && typeof item === 'object' && 'key' in item ? String(item.key) : '')).filter(Boolean)
}

function kindOf(doc: ApplicationRow): 'nurture' | 'partial' | 'qualified' | 'none' {
  if (doc.sequenceKind === 'nurture' || doc.sequenceKind === 'partial' || doc.sequenceKind === 'qualified') return doc.sequenceKind
  return 'none'
}

export async function sendDueSequenceEmails(payload: Payload, now = Date.now()): Promise<{ sent: number; skipped: boolean }> {
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  if (settings.nurtureEnabled !== true) return { sent: 0, skipped: true }

  const cms = await payload.findGlobal({ slug: 'email-sequences', overrideAccess: true }).catch(() => null)
  const overrides = new Map<string, { subject?: string; heading?: string; body?: string }>()
  const steps = cms && Array.isArray(cms.steps) ? cms.steps : []
  for (const step of steps) {
    if (step && typeof step === 'object' && 'key' in step && step.key) {
      overrides.set(String(step.key), step as { subject?: string; heading?: string; body?: string })
    }
  }

  const found = await payload.find({
    collection: 'applications',
    where: {
      and: [
        { sequenceKind: { in: ['nurture', 'partial', 'qualified'] } },
        { emailUnsubscribed: { not_equals: true } },
        { status: { not_equals: 'booked' } },
      ],
    },
    limit: 100,
    overrideAccess: true,
    depth: 0,
  })

  let sent = 0
  for (const raw of found.docs) {
    const doc = raw as ApplicationRow
    if (!doc.email) continue
    const newer = await payload.find({
      collection: 'applications',
      where: {
        and: [{ email: { equals: doc.email } }, { createdAt: { greater_than: doc.createdAt } }],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const stopped = newer.docs.length > 0 || doc.status === 'booked' || doc.emailUnsubscribed === true
    const keys = dueStepKeys({
      kind: kindOf(doc),
      enrolledAt: doc.nurtureEnrolledAt,
      sent: sentKeys(doc.sequenceLog),
      now,
      stopped,
    })
    if (!keys.length) continue
    const token = doc.unsubscribeToken || newUnsubscribeToken()
    const log = Array.isArray(doc.sequenceLog) ? [...doc.sequenceLog] : []
    for (const key of keys) {
      const base = BY_KEY.get(key)
      if (!base) continue
      const override = overrides.get(key)
      const paragraphs = override?.body
        ? String(override.body)
            .split(/\n\s*\n/)
            .map((part) => part.trim())
            .filter(Boolean)
        : base.paragraphs
      const rendered = renderEmail({
        preheader: paragraphs[0] || base.heading,
        eyebrow: 'Chateaux Rouge',
        heading: override?.heading || base.heading,
        paragraphs: [
          ...paragraphs,
          'You can unsubscribe in one click. We stop this sequence if you book, apply again, or unsubscribe.',
        ],
        cta: {
          label: key.startsWith('qualified') ? 'Book the strategy call' : key.startsWith('partial') ? 'Finish the application' : 'Read the guide',
          href: absoluteUrl(key.startsWith('qualified') ? `/apply/book?id=${doc.publicId || ''}` : key.startsWith('partial') ? `/apply?id=${doc.publicId || ''}` : GUIDE),
        },
      })
      const unsub = unsubscribeUrl(token)
      const result = await sendEmail({
        to: doc.email,
        subject: override?.subject || base.subject,
        html: rendered.html,
        text: `${rendered.text}\n\nUnsubscribe: ${unsub}`,
        headers: {
          'List-Unsubscribe': `<${unsub}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      })
      if (!result.sent) continue
      log.push({ key, at: new Date(now).toISOString(), sent: true })
      sent += 1
    }
    await payload.update({
      collection: 'applications',
      id: doc.id,
      overrideAccess: true,
      data: { sequenceLog: log, unsubscribeToken: token },
    })
  }
  return { sent, skipped: false }
}

export async function sendSequencePreview(payload: Payload, to: string, kind: 'nurture' | 'partial' | 'qualified'): Promise<number> {
  let count = 0
  for (const step of stepsFor(kind)) {
    const rendered = renderEmail({
      preheader: 'Preview. This was not sent to a lead.',
      eyebrow: 'Preview',
      heading: step.heading,
      paragraphs: ['This is a test of the sequence. It was sent only to you.', ...step.paragraphs],
      cta: { label: 'Open the guide', href: absoluteUrl(GUIDE) },
    })
    const result = await sendEmail({
      to,
      subject: `[Preview] ${step.subject}`,
      html: rendered.html,
      text: rendered.text,
    })
    if (result.sent || result.skipped) count += 1
  }
  return count
}
