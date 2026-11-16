import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ConfirmationActions } from '@/components/apply/ConfirmationActions'
import { OutcomeViewed } from '@/components/apply/OutcomeViewed'
import { findByPublicId } from '@/lib/apply-server'
import { pageMetadata } from '@/lib/metadata'
import { calendarConfirmationCopy, getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
  title: 'You are booked · Chateaux Rouge',
  description: 'You are booked. Add the call, and come ready to decide whether this is a fit.',
  path: '/apply/confirmed',
  noindex: true,
})

const CARDS = [
  ['What the call is for', 'Clarity. We look at the offer, the calls and the numbers. You leave with a yes, a no, or a smaller first step. Not a fit is a fine result.'],
  ['Who should be there', 'The person who can say yes. If someone else decides with you, ask them to join. We will not ask you to go around them.'],
  ['How we charge', 'Setup, a monthly management fee, and commission on cash collected. You see the terms in writing before anything starts. The bands on the site are a working draft.'],
  ['What to bring', 'The offer in one page, recent numbers, and one or two recordings if you have them.'],
  ['After the call', 'If we work together, the next step is an agreement you can read before you pay. If we do not, you leave with a plain recommendation.'],
  ['A client story', 'A named story will sit here only after a client has approved the numbers and their name. Until then, this card stays empty of proof.'],
]

export default async function ConfirmedPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const params = await searchParams
  const jar = await cookies()
  const id = params.id || jar.get('cr_application')?.value || ''
  const doc = await findByPublicId(id)
  if (!doc) redirect('/apply')
  if (doc.status !== 'booked') redirect(`/apply/book?id=${doc.publicId}`)
  const settings = await getSettings()
  const when = doc.meetingStartAt ? new Date(String(doc.meetingStartAt)) : null
  const validWhen = when && !Number.isNaN(when.getTime()) ? when : null
  const end = doc.meetingEndAt ? new Date(String(doc.meetingEndAt)) : null
  const validEnd = end && !Number.isNaN(end.getTime()) ? end : null
  const hasVideo = Boolean(settings.introVideoUrl)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <OutcomeViewed tier={typeof doc.tier === 'string' ? doc.tier : ''} page="confirmed" />
      <p className="text-xs uppercase tracking-[0.16em] text-wine">Tentatively scheduled</p>
      <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] md:text-5xl">
        You are booked, {String(doc.firstName || 'there')}. {hasVideo ? 'Two quick steps to lock it in.' : 'One quick step to lock it in.'}
      </h1>
      {validWhen && <p className="mt-4 text-lg text-muted">{validWhen.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>}
      <ol className="mt-8 space-y-4">
        <li className="rounded-2xl border border-stone bg-white p-5">
          <h2 className="font-serif text-2xl">{hasVideo ? '1. Add it to your calendar' : 'Add it to your calendar'}</h2>
          <p className="mt-2 text-muted">{calendarConfirmationCopy(settings)}</p>
          <ConfirmationActions
            applicationId={String(doc.publicId)}
            start={validWhen ? validWhen.toISOString() : ''}
            end={validEnd ? validEnd.toISOString() : ''}
          />
        </li>
        {hasVideo && (
          <li className="rounded-2xl border border-stone bg-white p-5">
            <h2 className="font-serif text-2xl">2. Watch the 90-second intro</h2>
            <p className="mt-2 text-muted">Who you will meet, what happens on the call, and one thing we will not pretend.</p>
            <ConfirmationActions applicationId={String(doc.publicId)} videoUrl={settings.introVideoUrl} videoOnly />
          </li>
        )}
      </ol>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {CARDS.map(([title, body]) => (
          <article key={title} className="rounded-2xl border border-stone p-5">
            <h2 className="font-medium">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">
        Need a different time? <Link className="underline" href={`/apply/book?id=${doc.publicId}`}>Reschedule</Link>. A moved call is better than a missed one.
      </p>
    </div>
  )
}
