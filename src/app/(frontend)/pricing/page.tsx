import { ApplyLink } from '@/components/site/ApplyLink'
import { Breadcrumbs, FaqList } from '@/components/site/ui'
import { pricingFaqs } from '@/content/faqs'
import { auditCreditSentence, auditFeeLabel, pilotLengthLabel } from '@/content/offer'
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

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone bg-white p-5">
      <dt className="kicker">{label}</dt>
      <dd className="mt-2 font-serif text-3xl tabular-nums">{value}</dd>
    </div>
  )
}

export default async function PricingPage() {
  const [settings, faqs] = await Promise.all([getSettings(), getFaqs('pricing')])
  const questions = faqs.length ? faqs : pricingFaqs
  const setup = confirmedOrPending(settings.setupFeeLabel, settings.setupFeeIsPlaceholder)
  const commission = confirmedOrPending(settings.commissionLabel, settings.commissionIsPlaceholder)
  const credit = auditCreditSentence()
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }]} />
      <h1 className="mt-8 font-serif text-5xl">How I charge</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        Two steps, and you can stop after the first. A paid sales audit if you want a diagnosis. Then a pilot: a one-off setup fee and commission on cash collected. There is no monthly retainer. You see the shape here, and the numbers are confirmed in writing before you pay.
      </p>

      <h2 className="mt-10 font-serif text-3xl">1. Sales audit</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <Figure label="Audit fee, one-off" value={auditFeeLabel()} />
      </dl>
      <p className="mt-4 leading-7 text-muted">
        I read your offer, at least five real calls (losses included) and your follow-up. You get a short written brief and a call to talk it through. The brief says what is working, what is costing you deals, and whether a pilot would pay for itself. If the honest answer is “not yet”, it says that. {credit}
      </p>

      <h2 className="mt-10 font-serif text-3xl">2. Pilot</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        <Figure label="Setup fee, one-off" value={setup} />
        <Figure label="Then commission" value={commission} />
        <Figure label="Pilot length" value={pilotLengthLabel()} />
      </dl>
      <p className="mt-4 text-sm text-muted">No figure here is a quote while it reads “To be confirmed”.</p>
      <p className="mt-4 leading-7 text-muted">
        The setup fee covers the first weeks: reading the offer and the calls, writing the call shape and qualifying rules, and setting up the follow-up in your CRM. Commission alone would pay me nothing for that work. After that I take your booked calls, and commission is a percentage of cash you have actually collected from the buyers I close. Payment plans pay commission as the money arrives. How refunds are handled is written in the agreement before we start.
      </p>

      <h2 className="mt-10 font-serif text-3xl">What is not included</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-muted">
        <li>Lead generation, cold outreach and appointment setting. If your calendar is empty, I will tell you that a closer is not the next step.</li>
        <li>Ads, software and CRM costs. The CRM stays yours.</li>
        <li>A promised close rate or revenue number. I do not make one.</li>
      </ul>

      <h2 className="mt-10 font-serif text-3xl">Later: a team</h2>
      <p className="mt-3 leading-7 text-muted">
        I am the only person on the calls today. If the work grows, I may add closers or setters. That would change who is on your calls, so it would be a conversation with you first.
      </p>

      <p className="mt-8">
        <ApplyLink location="pricing" className="underline">
          See if we&apos;re a fit
        </ApplyLink>
        <span className="text-muted"> · </span>
        <Link href="/services/sales-audit" className="underline">
          About the audit
        </Link>
        <span className="text-muted"> · </span>
        <Link href="/resources/are-you-ready-for-closers" className="underline">
          Read the free guide
        </Link>
      </p>
      <FaqList faqs={questions} />
    </article>
  )
}
