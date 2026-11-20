import { revalidatePath, revalidateTag } from 'next/cache'
import type { GlobalConfig } from 'payload'
import { canEditFunnel, canReadFunnel } from '@/access/roles'
import { FUNNEL_DEFAULTS } from '@/lib/funnel-copy'
import { SCORECARD_QUESTIONS } from '@/content/scorecard'

export const Funnel: GlobalConfig = {
  slug: 'funnel',
  label: 'Funnel',
  admin: {
    group: 'Journal',
    description: 'Conversion copy. Empty fields fall back to the live wording, so clearing a field does not blank the page.',
  },
  access: {
    read: canReadFunnel,
    update: canEditFunnel,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath('/')
          revalidatePath('/apply')
          revalidatePath('/apply/book')
          revalidatePath('/apply/next-steps')
          revalidatePath('/resources/closer-readiness-scorecard')
          revalidateTag('funnel', 'max')
        } catch (error) {
          const message = error instanceof Error ? error.message : ''
          if (!message.includes('static generation store missing')) console.error('[revalidate] funnel', error)
        }
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Landing',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: FUNNEL_DEFAULTS.eyebrow },
            { name: 'headline', type: 'text', required: true, defaultValue: FUNNEL_DEFAULTS.headline },
            { name: 'subhead', type: 'textarea', required: true, defaultValue: FUNNEL_DEFAULTS.subhead },
            { name: 'cta', type: 'text', required: true, defaultValue: FUNNEL_DEFAULTS.cta },
          ],
        },
        {
          label: 'Offer & proof',
          fields: [
            { name: 'proofFounderTitle', type: 'text', defaultValue: FUNNEL_DEFAULTS.proofFounderTitle },
            { name: 'proofFounderBody', type: 'textarea', defaultValue: FUNNEL_DEFAULTS.proofFounderBody },
            { name: 'proofMarksTitle', type: 'text', defaultValue: FUNNEL_DEFAULTS.proofMarksTitle },
            { name: 'proofMarksBody', type: 'textarea', defaultValue: FUNNEL_DEFAULTS.proofMarksBody },
            { name: 'proofNamedTitle', type: 'text', defaultValue: FUNNEL_DEFAULTS.proofNamedTitle },
            { name: 'proofNamedBody', type: 'textarea', defaultValue: FUNNEL_DEFAULTS.proofNamedBody },
            { name: 'painsEyebrow', type: 'text', defaultValue: FUNNEL_DEFAULTS.painsEyebrow },
            { name: 'painsTitle', type: 'text', defaultValue: FUNNEL_DEFAULTS.painsTitle },
            { name: 'systemEyebrow', type: 'text', defaultValue: FUNNEL_DEFAULTS.systemEyebrow },
            { name: 'systemTitle', type: 'text', defaultValue: FUNNEL_DEFAULTS.systemTitle },
            { name: 'chargeTitle', type: 'text', defaultValue: FUNNEL_DEFAULTS.chargeTitle },
            { name: 'chargeBody', type: 'textarea', defaultValue: FUNNEL_DEFAULTS.chargeBody },
            { name: 'draftGuaranteeTitle', type: 'text', defaultValue: FUNNEL_DEFAULTS.draftGuaranteeTitle },
            { name: 'draftGuaranteeBody', type: 'textarea', defaultValue: FUNNEL_DEFAULTS.draftGuaranteeBody },
            { name: 'guaranteeHeading', type: 'text', defaultValue: FUNNEL_DEFAULTS.guaranteeHeading },
          ],
        },
        {
          label: 'Scorecard',
          fields: [
            {
              name: 'questions',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
              ],
              defaultValue: SCORECARD_QUESTIONS.map(([title, body]) => ({ title, body })),
              admin: { description: 'Order is the step order. Yes and No stay the two options.' },
            },
            { name: 'yesLabel', type: 'text', defaultValue: FUNNEL_DEFAULTS.yesLabel },
            { name: 'noLabel', type: 'text', defaultValue: FUNNEL_DEFAULTS.noLabel },
            { name: 'scoreHeading', type: 'text', defaultValue: FUNNEL_DEFAULTS.scoreHeading },
            { name: 'progressHint', type: 'textarea', defaultValue: FUNNEL_DEFAULTS.progressHint },
            { name: 'passMaxNos', type: 'number', defaultValue: 1, min: 0, max: 8, admin: { description: 'A score with this many nos, or fewer, uses the pass copy. More nos use the fail copy.' } },
            { name: 'passHeading', type: 'text', defaultValue: FUNNEL_DEFAULTS.passHeading },
            { name: 'passBody', type: 'textarea', defaultValue: FUNNEL_DEFAULTS.passBody },
            { name: 'failHeading', type: 'text', defaultValue: FUNNEL_DEFAULTS.failHeading },
            { name: 'failBody', type: 'textarea', defaultValue: FUNNEL_DEFAULTS.failBody },
          ],
        },
        {
          label: 'Result',
          fields: [
            { name: 'resultTitle', type: 'text', defaultValue: FUNNEL_DEFAULTS.resultTitle },
            { name: 'resultBody', type: 'textarea', defaultValue: FUNNEL_DEFAULTS.resultBody },
            { name: 'resultCta', type: 'text', defaultValue: FUNNEL_DEFAULTS.resultCta },
            { name: 'resultGuideBody', type: 'textarea', defaultValue: FUNNEL_DEFAULTS.resultGuideBody },
            { name: 'reapplyLabel', type: 'text', defaultValue: FUNNEL_DEFAULTS.reapplyLabel },
            { name: 'fitCallLabel', type: 'text', defaultValue: FUNNEL_DEFAULTS.fitCallLabel },
          ],
        },
        {
          label: 'Booking',
          fields: [
            { name: 'bookingQualified', type: 'text', defaultValue: FUNNEL_DEFAULTS.bookingQualified },
            { name: 'bookingNotQualified', type: 'text', defaultValue: FUNNEL_DEFAULTS.bookingNotQualified },
          ],
        },
        {
          label: 'Emails',
          fields: [
            {
              name: 'unsubscribeLine',
              type: 'textarea',
              defaultValue: 'You can unsubscribe in one click. We stop this sequence if you book, apply again, or unsubscribe.',
            },
          ],
        },
      ],
    },
  ],
}
