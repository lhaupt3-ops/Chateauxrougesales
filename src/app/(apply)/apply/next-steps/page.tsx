import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { OutcomeViewed } from '@/components/apply/OutcomeViewed'
import { WaitlistForm } from '@/components/apply/WaitlistForm'
import { findByPublicId } from '@/lib/apply-server'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
  title: 'Not yet · Chateaux Rouge',
  description: 'Not the moment for a managed team. A plain next step, and a waitlist if you want one.',
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
          title: 'The price is too small for this team',
          body: 'The working rule is that a sub-$1,000 offer does not carry setters and closers. Raise the price, or bundle the work so one yes can pay for the seat. Then come back. This threshold is a draft until it is confirmed.',
        }
      : doc.investment === 'under_3k'
        ? {
            title: 'The working floor is $3,000 a month',
            body: 'Below that, a managed team costs more than it returns. The bands on the pricing page are a draft. Come back when an honest range sits inside them.',
          }
        : doc.monthlyConversations === 'none'
        ? {
            title: 'There is nothing to close yet',
            body: 'A closer cannot invent demand. Get a small, steady set of conversations first. Setters can join a later team. They still need a real offer to talk about.',
          }
        : doc.monthlyRevenue === 'pre_revenue'
          ? {
              title: 'Sell it yourself a few times first',
              body: 'You will learn the objections, the price and the delivery load. Those notes are what a team needs. Without them, we would be guessing on your calls.',
            }
          : {
              title: 'Not the moment for a full team',
              body: 'The answers say a managed team would cost more than it returns right now. That is a useful result, not a brush-off. The application is saved if you want to try again.',
            }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <OutcomeViewed tier={typeof doc.tier === 'string' ? doc.tier : ''} page="next-steps" />
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
