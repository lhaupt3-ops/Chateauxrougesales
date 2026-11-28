export const FUNNEL_DEFAULTS = {
  eyebrow: 'Founder-led sales calls',
  headline: 'A process for your sales calls, and someone to run them',
  subhead:
    'I am Lasse. I have run businesses and teams and owned the client conversation. I set up how your sales calls run, then take them for you on commission. You keep the offer, the CRM and the recordings.',
  cta: "See if we're a fit",
  bookingQualified: 'the answers look workable. Pick a time to get clear.',
  bookingNotQualified: 'A few details are still open. Pick a short call so we can both decide.',
  resultTitle: 'Not the moment for outsourced closing',
  resultBody:
    'The answers say outsourced closing would cost more than it returns right now. That is a useful result, not a brush-off. The application is saved if you want to try again.',
  resultCta: 'Are you actually ready for closers?',
  resultGuideBody: 'The free guide. A scorecard, the two conversations, and what to fix before you hire.',
  reapplyLabel: 'Reapply when the numbers have moved',
  fitCallLabel: 'Book a 15-minute fit call',
  proofFounderTitle: 'Founder track record',
  proofFounderBody: 'Add only figures you can attribute. This block stays empty until Site settings or a real case study has them.',
  proofMarksTitle: 'Client marks',
  proofMarksBody: 'No logos until a client has agreed to be named. We will not borrow recognition.',
  proofNamedTitle: 'Named results',
  proofNamedBody: 'Cash collected, close rate before and after, and the time window. Not an average we cannot show.',
  painsEyebrow: 'The cost of waiting',
  painsTitle: 'Where the work piles up',
  systemEyebrow: 'The system',
  systemTitle: 'Four steps. Then a weekly habit.',
  chargeTitle: 'How I charge',
  chargeBody: 'There is no upfront fee. The sales audit is free if you want a diagnosis first. On a pilot I am paid 10% of the cash I help collect. There is no monthly retainer. Pilot length and notice are confirmed in the written agreement.',
  draftGuaranteeTitle: 'Terms are written down before we start',
  draftGuaranteeBody: 'The length of the pilot, the notice period and any guarantee are not published here yet. They go into a short written agreement that you read first. I will not promise revenue or a close rate.',
  guaranteeHeading: 'The guarantee, in words we can keep',
  yesLabel: 'Yes',
  noLabel: 'No',
  scoreHeading: 'Your score',
  progressHint: 'Answer every row. Seven or eight yeses means a closer can be the next look. Two or more nos means fix those first.',
  passHeading: 'A closer can be the next look',
  passBody: 'One no, or none. The process is mostly in place. A closer is a reasonable next conversation if delivery can take the work.',
  failHeading: 'Fix the nos first',
  failBody: 'Two or more nos means a closer will not fix the week. Write the price, the people it is not for, and where a maybe goes. Then look at a setter if the gap is conversations, or a closer if the gap is the decision.',
  passMaxNos: 1,
}

import { unstable_cache } from 'next/cache'
import { getPayloadClient } from './payload'
import { SCORECARD_QUESTIONS } from '@/content/scorecard'

export function filled(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback
}

export type FunnelCopy = typeof FUNNEL_DEFAULTS & { questions: [string, string][] }

export const getFunnel = unstable_cache(async function getFunnel(): Promise<FunnelCopy> {
  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({ slug: 'funnel', overrideAccess: true })) as unknown as Record<string, unknown>
    const rows = Array.isArray(doc.questions) ? doc.questions : []
    const questions = rows
      .map((row) => {
        const item = row as { title?: string; body?: string }
        return [item.title || '', item.body || ''] as [string, string]
      })
      .filter((row) => row[0] && row[1])
    return {
      eyebrow: filled(doc.eyebrow, FUNNEL_DEFAULTS.eyebrow),
      headline: filled(doc.headline, FUNNEL_DEFAULTS.headline),
      subhead: filled(doc.subhead, FUNNEL_DEFAULTS.subhead),
      cta: filled(doc.cta, FUNNEL_DEFAULTS.cta),
      bookingQualified: filled(doc.bookingQualified, FUNNEL_DEFAULTS.bookingQualified),
      bookingNotQualified: filled(doc.bookingNotQualified, FUNNEL_DEFAULTS.bookingNotQualified),
      resultTitle: filled(doc.resultTitle, FUNNEL_DEFAULTS.resultTitle),
      resultBody: filled(doc.resultBody, FUNNEL_DEFAULTS.resultBody),
      resultCta: filled(doc.resultCta, FUNNEL_DEFAULTS.resultCta),
      resultGuideBody: filled(doc.resultGuideBody, FUNNEL_DEFAULTS.resultGuideBody),
      reapplyLabel: filled(doc.reapplyLabel, FUNNEL_DEFAULTS.reapplyLabel),
      fitCallLabel: filled(doc.fitCallLabel, FUNNEL_DEFAULTS.fitCallLabel),
      proofFounderTitle: filled(doc.proofFounderTitle, FUNNEL_DEFAULTS.proofFounderTitle),
      proofFounderBody: filled(doc.proofFounderBody, FUNNEL_DEFAULTS.proofFounderBody),
      proofMarksTitle: filled(doc.proofMarksTitle, FUNNEL_DEFAULTS.proofMarksTitle),
      proofMarksBody: filled(doc.proofMarksBody, FUNNEL_DEFAULTS.proofMarksBody),
      proofNamedTitle: filled(doc.proofNamedTitle, FUNNEL_DEFAULTS.proofNamedTitle),
      proofNamedBody: filled(doc.proofNamedBody, FUNNEL_DEFAULTS.proofNamedBody),
      painsEyebrow: filled(doc.painsEyebrow, FUNNEL_DEFAULTS.painsEyebrow),
      painsTitle: filled(doc.painsTitle, FUNNEL_DEFAULTS.painsTitle),
      systemEyebrow: filled(doc.systemEyebrow, FUNNEL_DEFAULTS.systemEyebrow),
      systemTitle: filled(doc.systemTitle, FUNNEL_DEFAULTS.systemTitle),
      chargeTitle: filled(doc.chargeTitle, FUNNEL_DEFAULTS.chargeTitle),
      chargeBody: filled(doc.chargeBody, FUNNEL_DEFAULTS.chargeBody),
      draftGuaranteeTitle: filled(doc.draftGuaranteeTitle, FUNNEL_DEFAULTS.draftGuaranteeTitle),
      draftGuaranteeBody: filled(doc.draftGuaranteeBody, FUNNEL_DEFAULTS.draftGuaranteeBody),
      guaranteeHeading: filled(doc.guaranteeHeading, FUNNEL_DEFAULTS.guaranteeHeading),
      yesLabel: filled(doc.yesLabel, FUNNEL_DEFAULTS.yesLabel),
      noLabel: filled(doc.noLabel, FUNNEL_DEFAULTS.noLabel),
      scoreHeading: filled(doc.scoreHeading, FUNNEL_DEFAULTS.scoreHeading),
      progressHint: filled(doc.progressHint, FUNNEL_DEFAULTS.progressHint),
      passHeading: filled(doc.passHeading, FUNNEL_DEFAULTS.passHeading),
      passBody: filled(doc.passBody, FUNNEL_DEFAULTS.passBody),
      failHeading: filled(doc.failHeading, FUNNEL_DEFAULTS.failHeading),
      failBody: filled(doc.failBody, FUNNEL_DEFAULTS.failBody),
      passMaxNos: typeof doc.passMaxNos === 'number' ? doc.passMaxNos : 1,
      questions: questions.length ? questions : SCORECARD_QUESTIONS,
    }
  } catch {
    return { ...FUNNEL_DEFAULTS, questions: SCORECARD_QUESTIONS }
  }
}, ['funnel'], { tags: ['funnel'] })
