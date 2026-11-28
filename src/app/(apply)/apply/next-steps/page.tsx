import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { OutcomeViewed } from '@/components/apply/OutcomeViewed'
import { WaitlistForm } from '@/components/apply/WaitlistForm'
import { findByPublicId } from '@/lib/apply-server'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'
import { getFunnel } from '@/lib/funnel-copy'
import { getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
  title: SEO.next.title,
  description: SEO.next.description,
  path: '/apply/next-steps',
  noindex: true,
})

export default async function NextStepsPage({ searchParams }: { searchParams: Promise<{ id?: string; path?: string }> }) {
  const params = await searchParams
  const jar = await cookies()
  const id = params.id || jar.get('cr_application')?.value || ''
  const doc = await findByPublicId(id)
  if (!doc) redirect('/apply')
  const [settings, funnel] = await Promise.all([getSettings(), getFunnel()])
  const reviewWithoutCall = doc.tier === 'review' && !settings.discoveryCallEnabled

  const advice = reviewWithoutCall
    ? {
        title: 'Not a strategy call yet',
        body: 'The answers are close, and they are not a clear yes. The 15-minute discovery call is switched off, so the next step is the free guide. Work through it, then reapply. A strategy call opens once the result is qualified.',
      }
    : doc.pricePoint === 'under_1000'
      ? {
          title: 'The price is too small for outsourced closing',
          body: 'A sub-$1,000 offer does not pay for a closer’s time. Raise the price, or bundle the work so one yes can pay for it. Then come back. This threshold is a working rule, not a published promise.',
        }
      : doc.investment === 'under_3k'
        ? {
            title: 'That older budget answer does not fit the current model',
            body: 'This application was scored against a monthly budget. There is no monthly retainer and no setup fee now. I am paid 10% of the cash I help collect. Reapply and we will look at the offer and the conversations.',
          }
        : doc.monthlyConversations === 'none'
            ? {
                title: 'There is nothing to close yet',
                body: 'A closer cannot invent demand. Get a small, steady set of conversations first. I do not offer lead generation or setting today, and either would still need a real offer to talk about.',
              }
            : doc.monthlyRevenue === 'pre_revenue'
              ? {
                  title: 'Sell it yourself a few times first',
                  body: 'You will learn the objections, the price and the delivery load. Those notes are what a closer needs. Without them, anyone taking your calls would be guessing.',
                }
              : {
                  title: funnel.resultTitle,
                  body: funnel.resultBody,
                }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <OutcomeViewed tier={typeof doc.tier === 'string' ? doc.tier : ''} page="next-steps" />
      <h1 className="font-serif text-4xl">{advice.title}</h1>
      <p className="mt-4 text-lg leading-8 text-muted">{advice.body}</p>
      <div className="mt-8 grid gap-3">
        <Link className="rounded-2xl border border-stone p-4 hover:border-ink" href="/resources/are-you-ready-for-closers">
          <span className="block font-medium">{funnel.resultCta}</span>
          <span className="mt-1 block text-sm text-muted">{funnel.resultGuideBody}</span>
        </Link>
      </div>
      <WaitlistForm id={String(doc.publicId)} reason={advice.title} />
      <p className="mt-8 text-sm text-muted">
        <Link className="underline" href={`/apply?id=${doc.publicId}`}>
          {funnel.reapplyLabel}
        </Link>
        .
        {settings.discoveryCallEnabled && doc.tier === 'not_yet' && (
          <>
            {' '}
            Think we got it wrong?{' '}
            <Link className="underline" href={`/apply/book?id=${doc.publicId}&override=1`}>
              {funnel.fitCallLabel}
            </Link>
            .
          </>
        )}
      </p>
    </div>
  )
}
