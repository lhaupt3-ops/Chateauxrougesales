import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ConfirmationActions } from '@/components/apply/ConfirmationActions'
import { OutcomeViewed } from '@/components/apply/OutcomeViewed'
import { findByPublicId } from '@/lib/apply-server'
import { pageMetadata } from '@/lib/metadata'
import { getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
  title: 'You are booked · Chateaux Rouge',
  description: 'Two steps to lock in the call: add it to your calendar, and watch the short intro.',
  path: '/apply/confirmed',
  noindex: true,
})

const CARDS = [
  ['How the call runs', 'Thirty to forty-five minutes. We look at the offer, the calls and the numbers. You leave with a yes, a no, or a smaller first step.'],
  ['The timeline', 'If we work together, the working target is the timeline in your agreement. The site only shows a number operations has confirmed.'],
  ['How we charge', 'Setup, a monthly management fee, and commission on cash collected. You will see it in writing before anything starts.'],
  ['Who it is for', 'Offers of $3,000 or more that have already sold. Not for pre-revenue ideas or sub-$1,000 products.'],
  ['What to bring', 'The offer in one page, recent numbers, one or two call recordings, and the person who can say yes.'],
  ['A client story', 'A named story will sit in this card once a client has agreed. Until then, we will not borrow one.'],
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <OutcomeViewed tier={typeof doc.tier === 'string' ? doc.tier : ''} page="confirmed" />
      <p className="text-xs uppercase tracking-[0.16em] text-wine">Tentatively scheduled</p>
      <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] md:text-5xl">
        You are booked, {String(doc.firstName || 'there')}. Two quick steps to lock it in.
      </h1>
      {when && <p className="mt-4 text-lg text-muted">{when.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>}
      <ol className="mt-8 space-y-4">
        <li className="rounded-2xl border border-stone bg-white p-5">
          <h2 className="font-serif text-2xl">1. Add it, and reply YES</h2>
          <p className="mt-2 text-muted">Add the hold to your calendar. Reply YES to the text from {settings.closerName} so we know the number is right.</p>
          <ConfirmationActions applicationId={String(doc.publicId)} start={when ? when.toISOString() : ''} />
        </li>
        <li className="rounded-2xl border border-stone bg-white p-5">
          <h2 className="font-serif text-2xl">2. Watch the 90-second intro</h2>
          <p className="mt-2 text-muted">Who you will meet, what happens on the call, and one thing we will not pretend.</p>
          <ConfirmationActions applicationId={String(doc.publicId)} videoUrl={settings.introVideoUrl} videoOnly />
        </li>
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
