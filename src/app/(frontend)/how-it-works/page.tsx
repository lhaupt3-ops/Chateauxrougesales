import Link from 'next/link'
import { Breadcrumbs, FaqList } from '@/components/site/ui'
import { pageMetadata } from '@/lib/metadata'
import { getSettings } from '@/lib/settings'

export const metadata = pageMetadata({
  title: 'How it works · Chateaux Rouge',
  description: 'Audit, install, staff, then a weekly report. How a Chateaux Rouge sales team actually starts.',
  path: '/how-it-works',
})

export default async function HowItWorksPage() {
  const settings = await getSettings()
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'How it works', path: '/how-it-works' }]} />
      <h1 className="mt-8 font-serif text-5xl tracking-[-0.04em]">How a sales team gets installed.</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        We audit the offer and the calls, install the system in your CRM, staff the seats, and then run a weekly review. {settings.timelineText}
      </p>
      {[
        ['Audit', 'We read the offer and a sample of real calls, including losses. You get a written read before anyone new dials.'],
        ['Install', 'Scripts, routing and follow-up go into the CRM you already own. We do not hide the pipeline in a tool you cannot export.'],
        ['Staff', 'Setters, closers and a sales lead. You meet the people. If a closer is wrong, replacement is our work.'],
        ['Run', 'Each week you see show rate, close rate and cash collected. Call review is not optional.'],
      ].map(([title, body]) => (
        <section key={title} className="mt-8">
          <h2 className="font-serif text-3xl">{title}</h2>
          <p className="mt-2 leading-7 text-muted">{body}</p>
        </section>
      ))}
      <p className="mt-8 text-sm">
        <Link className="underline" href="/apply">Apply</Link> if the timeline fits. Or start with the <Link className="underline" href="/services/sales-audit">sales audit</Link>.
      </p>
      <FaqList faqs={[{ question: 'What do I need to send?', answer: 'The offer in one page, recent numbers, and any call recordings you have. The decision maker should be on the first call.' }]} />
    </article>
  )
}
