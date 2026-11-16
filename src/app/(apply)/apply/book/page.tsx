import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CalendlyEmbed } from '@/components/apply/CalendlyEmbed'
import { OutcomeViewed } from '@/components/apply/OutcomeViewed'
import { answerSummary, findByPublicId, isCalendlyUrl } from '@/lib/apply-server'
import { pageMetadata } from '@/lib/metadata'
import { configuredStrategistName, getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
  title: 'Book your call · Chateaux Rouge',
  description: 'Pick a time. Your name, email and answers are already on the invite.',
  path: '/apply/book',
  noindex: true,
})

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; override?: string }>
}) {
  const params = await searchParams
  const jar = await cookies()
  const id = params.id || jar.get('cr_application')?.value || ''
  const doc = await findByPublicId(id)
  if (!doc) redirect('/apply')
  if (doc.status === 'booked') redirect(`/apply/confirmed?id=${doc.publicId}`)
  if (doc.status !== 'complete' && doc.status !== 'nurture') redirect(`/apply?id=${doc.publicId}`)
  const allowFitOverride = params.override === '1' && doc.tier === 'not_yet'
  if (doc.tier === 'not_yet' && !allowFitOverride) redirect(`/apply/next-steps?id=${doc.publicId}`)

  const settings = await getSettings()
  const strategist = configuredStrategistName(settings)
  const eventType = doc.tier === 'qualified' && !allowFitOverride ? 'strategy' : 'fit'
  const url = eventType === 'strategy' ? settings.calendlyStrategyUrl : settings.calendlyFitUrl
  const name = [doc.firstName, doc.lastName].filter(Boolean).join(' ')
  const summary = await answerSummary(doc)

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.8fr_1.2fr]">
      <OutcomeViewed tier={typeof doc.tier === 'string' ? doc.tier : ''} page="book" />
      <div>
        <h1 className="font-serif text-4xl tracking-[-0.04em]">
          {eventType === 'strategy'
            ? `${doc.firstName || 'You'}, you are a strong fit. Pick a time for your sales strategy call.`
            : 'Looks promising. Let us confirm a few details on a 15-minute fit call.'}
        </h1>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-muted">
          <li>We look at the funnel and, if you have them, the call recordings.</li>
          <li>We map the team, the numbers and the next 14 days.</li>
          <li>{strategist ? `You meet ${strategist}${settings.closerRole ? `, ${settings.closerRole}` : ''}. No deck.` : 'You meet the person running the call. No deck.'}</li>
        </ul>
        <p className="mt-6 text-sm text-muted">Can&apos;t find a time? Reply to your email and we will fit you in.</p>
      </div>
      <CalendlyEmbed
        url={url}
        eventType={eventType}
        applicationId={String(doc.publicId)}
        preview={!isCalendlyUrl(url)}
        prefill={{
          name,
          email: String(doc.email || ''),
          a1: summary,
          a2: String(doc.phone || ''),
          a3: String(doc.website || ''),
          utm: {
            utmSource: String(doc.utmSource || ''),
            utmMedium: String(doc.utmMedium || ''),
            utmCampaign: String(doc.utmCampaign || ''),
            utmTerm: String(doc.utmTerm || ''),
          },
        }}
      />
    </div>
  )
}
