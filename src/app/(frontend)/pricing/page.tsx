import { ApplyLink } from '@/components/site/ApplyLink'
import { Breadcrumbs, FaqList } from '@/components/site/ui'
import { pricingFaqs } from '@/content/faqs'
import { pricingIsIndexable } from '@/lib/indexing'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'
import { getFaqs } from '@/lib/content'
import { confirmedOrPending, getSettings } from '@/lib/settings'
import Link from 'next/link'

export async function generateMetadata() {
  const settings = await getSettings()
  return pageMetadata({
    title: SEO.pricing.title,
    description: SEO.pricing.description,
    path: '/pricing',
    noindex: !pricingIsIndexable(settings),
  })
}

export default async function PricingPage() {
  const [settings, faqs] = await Promise.all([getSettings(), getFaqs('pricing')])
  const questions = faqs.length ? faqs : pricingFaqs
  const setup = confirmedOrPending(settings.setupFeeLabel, settings.setupFeeIsPlaceholder)
  const commission = confirmedOrPending(settings.commissionLabel, settings.commissionIsPlaceholder)
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }]} />
      <h1 className="mt-8 font-serif text-5xl">How we charge</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        A one-off setup fee, then commission on cash collected. There is no monthly retainer. You see the shape before you book. The numbers are confirmed in writing before you pay.
      </p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-stone bg-white p-5">
          <dt className="kicker">Setup fee</dt>
          <dd className="mt-2 font-serif text-3xl tabular-nums">{setup}</dd>
        </div>
        <div className="rounded-2xl border border-stone bg-white p-5">
          <dt className="kicker">Then commission</dt>
          <dd className="mt-2 font-serif text-3xl tabular-nums">{commission}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-muted">Neither figure is a quote while it reads “to be confirmed”.</p>
      <h2 className="mt-10 font-serif text-3xl">What the setup fee is for</h2>
      <p className="mt-3 leading-7 text-muted">
        Standing up the process: the offer notes, the call shape, the handoff between setter and closer, and the review of early calls. Commission alone does not pay for someone who will pull a closer that does not fit. A guarantee, if we offer one, will be written so it can be kept. We do not promise revenue.
      </p>
      <p className="mt-6">
        <ApplyLink location="pricing" className="underline">
          See if we&apos;re a fit
        </ApplyLink>
        <span className="text-muted"> · </span>
        <Link href="/resources/are-you-ready-for-closers" className="underline">
          Read the free guide
        </Link>
      </p>
      <FaqList faqs={questions} />
    </article>
  )
}
