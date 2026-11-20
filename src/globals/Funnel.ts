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
            { name: 'guaranteeNote', type: 'textarea', defaultValue: 'Shown from Site settings when the guarantee is no longer a placeholder.' },
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
            },
          ],
        },
        {
          label: 'Result',
          fields: [
            { name: 'resultTitle', type: 'text', defaultValue: FUNNEL_DEFAULTS.resultTitle },
            { name: 'resultBody', type: 'textarea', defaultValue: FUNNEL_DEFAULTS.resultBody },
            { name: 'resultCta', type: 'text', defaultValue: FUNNEL_DEFAULTS.resultCta },
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
