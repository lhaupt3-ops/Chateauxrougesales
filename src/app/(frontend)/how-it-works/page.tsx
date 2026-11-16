import Link from 'next/link'
import { CallOutline } from '@/components/site/CallOutline'
import { Breadcrumbs, FaqList } from '@/components/site/ui'
import { publicCopy } from '@/lib/indexing'
import { pageMetadata } from '@/lib/metadata'
import { isOperatorPlaceholder, getSettings } from '@/lib/settings'

export const metadata = pageMetadata({
  title: 'How it works · Chateaux Rouge',
  description: 'How a managed sales team is installed, and how the closers run a buyer’s call: listen, qualify, then decide.',
  path: '/how-it-works',
})

const INSTALL = [
  ['Read', 'We read the offer and a sample of real calls, including losses, before anyone new speaks to a buyer.'],
  ['Install', 'The call shape, the qualification rules and the follow-up go into the CRM you already own.'],
  ['Staff', 'Setters reply and book. Closers run the conversation. A sales lead reviews the calls and the week.'],
  ['Review', 'Each week you see show rate, close rate and cash collected. One behaviour to improve, not a pile of notes.'],
]

const CALL = [
  ['Open', 'A warm start, then the frame: the point is to see whether this is right. Declining is fine.'],
  ['Discover', 'The buyer talks. What is true now, what it is costing, what they want, and why it matters to them.'],
  ['Qualify', 'Readiness, whether the money is realistic, and who else decides. Skipping any of these creates the objection later.'],
  ['Decide', 'Only the relevant parts of the offer, then the price once, with the full total. Then quiet. Yes, not yet, or no.'],
]

export default async function HowItWorksPage() {
  const settings = await getSettings()
  const timeline = isOperatorPlaceholder(settings.timelineText) ? '' : settings.timelineText
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'How it works', path: '/how-it-works' }]} />
      <h1 className="mt-8 font-serif text-5xl tracking-[-0.04em]">How the work actually runs.</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        First we install a team around your offer. Then that team runs your buyers’ calls to a written standard. {publicCopy(timeline) || 'A start date appears here only after it is confirmed.'}
      </p>
      <h2 className="mt-10 font-serif text-3xl">What we do with you</h2>
      {INSTALL.map(([title, body]) => (
        <section key={title} className="mt-6">
          <h3 className="font-serif text-2xl">{title}</h3>
          <p className="mt-2 leading-7 text-muted">{body}</p>
        </section>
      ))}
      <CallOutline />
      <h2 className="mt-12 font-serif text-3xl">What the closer does with a buyer</h2>
      <p className="mt-3 leading-7 text-muted">
        This is the method on your calls. It is not a script to recite, and it is not a promise of a close rate.
      </p>
      {CALL.map(([title, body]) => (
        <section key={title} className="mt-6">
          <h3 className="font-serif text-2xl">{title}</h3>
          <p className="mt-2 leading-7 text-muted">{body}</p>
        </section>
      ))}
      <p className="mt-8 text-sm leading-6 text-muted">
        If the buyer is not ready, the closer books a specific next conversation or lets them go. Follow-up is a recap and one useful thing, then it stops when asked.
      </p>
      <p className="mt-8 text-sm">
        <Link className="underline" href="/apply">See if we&apos;re a fit</Link>. Or start with the <Link className="underline" href="/services/sales-audit">sales audit</Link>.
      </p>
      <FaqList faqs={[{ question: 'What do I need to send?', answer: 'The offer in one page, recent numbers, and any call recordings you have. The person who can say yes should be on the first call.' }]} />
    </article>
  )
}
