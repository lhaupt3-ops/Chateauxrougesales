import { ApplyLink } from '@/components/site/ApplyLink'
import { Breadcrumbs, FaqList } from '@/components/site/ui'
import { pricingFaqs } from '@/content/faqs'
import { pageMetadata } from '@/lib/metadata'
import { getFaqs } from '@/lib/content'
import { getSettings } from '@/lib/settings'

export const metadata = pageMetadata({
  title: 'How we charge · Chateaux Rouge',
  description: 'Setup, a monthly management fee, and commission on cash collected. Bands stay marked as placeholders until they are real.',
  path: '/pricing',
})

export default async function PricingPage() {
  const [settings, faqs] = await Promise.all([getSettings(), getFaqs('pricing')])
  const questions = faqs.length ? faqs : pricingFaqs
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }]} />
      <h1 className="mt-8 font-serif text-5xl tracking-[-0.04em]">How we charge.</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        Three parts: a setup fee, a monthly management fee, and a commission on cash collected. You see the model before you book. The exact numbers are confirmed on the call and in the agreement.
      </p>
      {settings.startingFrom ? (
        <p className="mt-6 font-serif text-3xl">From {settings.startingFrom}</p>
      ) : (
        <p className="mt-6 rounded-2xl border border-dashed border-gold p-4 text-sm text-wine">
          Placeholder. A starting figure will appear here only after it is set in Site settings. We will not invent one.
        </p>
      )}
      <h2 className="mt-10 font-serif text-3xl">The bands on the application</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
        <li>{settings.bandLowLabel}</li>
        <li>{settings.bandMidLabel}</li>
        <li>{settings.bandHighLabel}</li>
        <li>Performance only, or not sure yet</li>
      </ul>
      {settings.bandsArePlaceholder && <p className="mt-3 text-sm text-wine">These labels are placeholders. Replace them before you send traffic.</p>}
      <h2 className="mt-10 font-serif text-3xl">What the fee is for</h2>
      <p className="mt-3 leading-7 text-muted">
        Management, call review, and replacement. Commission alone does not pay for a lead who will pull a bad closer. If you want only a freelancer, that is a different product, and we are not it.
      </p>
      <p className="mt-6">
        <ApplyLink location="pricing" className="underline">
          Apply
        </ApplyLink>{' '}
        and the investment question uses these bands.
      </p>
      <FaqList faqs={questions} />
    </article>
  )
}
