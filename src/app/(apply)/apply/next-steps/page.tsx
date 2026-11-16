import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { WaitlistForm } from '@/components/apply/WaitlistForm'
import { findByPublicId } from '@/lib/apply-server'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
  title: 'Not yet · Chateaux Rouge',
  description: 'A full sales team would cost more than it returns right now. Here is what we would do in your place.',
  path: '/apply/next-steps',
  noindex: true,
})

export default async function NextStepsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const params = await searchParams
  const jar = await cookies()
  const id = params.id || jar.get('cr_application')?.value || ''
  const doc = await findByPublicId(id)
  if (!doc) redirect('/apply')

  const advice =
    doc.pricePoint === 'under_1000'
      ? {
          title: 'Raise the ticket, or bundle it',
          body: 'A team that sets and closes cannot live on a sub-$1,000 offer. Raise the price, or package the work so one yes pays for the seat. Then come back.',
        }
      : doc.investment === 'under_3k'
        ? {
            title: 'The minimum is $3,000 a month',
            body: 'A managed sales team starts at $3,000 a month, before commission. Under that, the work costs more than it returns. Come back when a band on the pricing page fits.',
          }
        : doc.monthlyConversations === 'none'
        ? {
            title: 'Build lead flow first',
            body: 'Closing an empty calendar is theatre. Get a steady source of conversations, even a small one, before you pay for closers. Setters can be part of a later team. They cannot invent demand from nothing.',
          }
        : doc.monthlyRevenue === 'pre_revenue'
          ? {
              title: 'Validate the offer',
              body: 'Sell it yourself a few times. You will learn the objections, the price and the delivery load. Those are the notes a team needs. Without them, we would be guessing on your calls.',
            }
          : {
              title: 'A full team would cost more than it returns right now',
              body: 'The score says the economics are not there yet. That is a useful answer. Fix the constraint below, and the application is saved if you want to try again.',
            }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-4xl tracking-[-0.04em]">{advice.title}</h1>
      <p className="mt-4 text-lg leading-8 text-muted">{advice.body}</p>
      <div className="mt-8 grid gap-3">
        <Link className="rounded-2xl border border-stone p-4 hover:border-ink" href="/resources/sales-team-readiness-scorecard">
          Sales Team Readiness Scorecard
        </Link>
        <Link className="rounded-2xl border border-stone p-4 hover:border-ink" href="/resources/show-rate-playbook">
          Show-Rate Playbook
        </Link>
      </div>
      <WaitlistForm id={String(doc.publicId)} reason={advice.title} />
      <p className="mt-8 text-sm text-muted">
        Think we got it wrong?{' '}
        <Link className="underline" href={`/apply/book?id=${doc.publicId}&override=1`}>
          Book a 15-minute fit call
        </Link>
        .
      </p>
    </div>
  )
}
