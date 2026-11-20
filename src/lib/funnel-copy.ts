export const FUNNEL_DEFAULTS = {
  eyebrow: 'A managed sales function',
  headline: 'Your high-ticket sales team, installed and run.',
  subhead:
    'Setters, closers and a sales lead who run the pipeline from the first reply to cash collected. The calls are honest. A no is an acceptable outcome. You keep the offer, the data and the recordings.',
  cta: "See if we're a fit",
  bookingQualified: 'the answers look workable. Pick a time to get clear.',
  bookingNotQualified: 'A few details are still open. Pick a short call so we can both decide.',
  resultTitle: 'Not the moment for a full team',
  resultBody:
    'The answers say a managed team would cost more than it returns right now. That is a useful result, not a brush-off. The application is saved if you want to try again.',
  resultCta: 'Are you actually ready for closers?',
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
      questions: questions.length ? questions : SCORECARD_QUESTIONS,
    }
  } catch {
    return { ...FUNNEL_DEFAULTS, questions: SCORECARD_QUESTIONS }
  }
}, ['funnel'], { tags: ['funnel'] })
