import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CalendlyEmbed } from '@/components/apply/CalendlyEmbed'
import { CallOutline } from '@/components/site/CallOutline'
import { OutcomeViewed } from '@/components/apply/OutcomeViewed'
import { answerSummary, findByPublicId, isCalendlyUrl } from '@/lib/apply-server'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'
import { getFunnel } from '@/lib/funnel-copy'
import { getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
  title: SEO.book.title,
  description: SEO.book.description,
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
  const [settings, funnel] = await Promise.all([getSettings(), getFunnel()])
  const allowFitOverride = params.override === '1' && doc.tier === 'not_yet'
  if (doc.tier === 'not_yet' && !allowFitOverride) redirect(`/apply/next-steps?id=${doc.publicId}`)
  if (doc.tier === 'review' && !settings.discoveryCallEnabled && !allowFitOverride) {
    redirect(`/apply/next-steps?id=${doc.publicId}&path=guide`)
  }
  const eventType = doc.tier === 'qualified' && !allowFitOverride ? 'strategy' : 'fit'
  const url = eventType === 'strategy' ? settings.calendlyStrategyUrl : settings.calendlyFitUrl
  const name = [doc.firstName, doc.lastName].filter(Boolean).join(' ')
  const summary = await answerSummary(doc)

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.8fr_1.2fr]">
      <OutcomeViewed tier={typeof doc.tier === 'string' ? doc.tier : ''} page="book" />
      <div>
        <h1 className="font-serif text-4xl">
          {eventType === 'strategy'
            ? `${doc.firstName || 'You'}, ${funnel.bookingQualified}`
            : funnel.bookingNotQualified}
        </h1>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-muted">
          <li>The point of the call is clarity. Not a fit is a perfectly good outcome.</li>
          <li>Bring the person who can say yes. If someone else decides with you, they should be there.</li>
          <li>{eventType === 'strategy' ? 'Plan on 30 minutes.' : 'Plan on about 15 minutes.'} We will look at the offer and, if you have them, the recordings.</li>
          <li>You talk with Lasse, the founder, who would be the one taking your calls. No deck.</li>
        </ul>
        {typeof doc.decisionMakers === 'string' && doc.decisionMakers !== 'just_me' && (
          <p className="mt-4 text-muted">Bring the other person who would decide. The call is more useful if they can hear it.</p>
        )}
        {eventType === 'strategy' && <CallOutline />}
        <p className="mt-6 text-sm text-muted">The commercial shape is already on the pricing page. The agreement is the price. Can&apos;t find a time? Reply to your email.</p>
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
