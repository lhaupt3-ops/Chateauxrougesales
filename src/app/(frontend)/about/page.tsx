import Link from 'next/link'
import { Breadcrumbs, Placeholder } from '@/components/site/ui'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata({
  title: 'How we sell · Chateaux Rouge',
  description: 'The standard for our own sales calls and for the calls our team runs for clients. No fake urgency, no invented results, no pressure.',
  path: '/about',
})

const TESTS = [
  ['Truth', 'Every claim has to be true, typical and checkable. If we cannot show it, we do not say it.'],
  ['Transparency', 'A tactic only stays if it would still be fair once the buyer knew exactly what we were doing.'],
  ['A free no', 'The buyer can decline, take time, and talk to the other people who decide. We do not corner them.'],
  ['Care', 'We do not use distress, hardship or a personal disclosure to push a decision.'],
  ['The recording', 'We should be comfortable if the buyer, the client and a regulator heard the call.'],
]

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]} />
      <h1 className="mt-8 font-serif text-5xl tracking-[-0.04em]">A standard for how the calls are run.</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        Chateaux Rouge installs and runs a sales team for founders. The same standard governs two conversations: the one we have with you, and the one our closers have with your buyers. A closer’s job is to find what is actually true and help the person decide. Yes, not yet, or no.
      </p>
      <h2 className="mt-10 font-serif text-3xl">With founders</h2>
      <p className="mt-3 leading-7 text-muted">
        You see the commercial shape before you book. The application is short on purpose. The call is for clarity, and not a fit is a good outcome. We do not promise a close rate, a revenue number, or a start date we have not confirmed.
      </p>
      <h2 className="mt-10 font-serif text-3xl">With your buyers</h2>
      <p className="mt-3 leading-7 text-muted">
        The team listens more than it talks. They ask what the problem is costing, why it matters, whether the money is realistic, and who else decides. Price comes after that, stated once, with the full total. If it is not the moment, they book a specific next step or they say so and stop. They do not chase.
      </p>
      <h2 className="mt-10 font-serif text-3xl">Five tests for every tactic</h2>
      <ul className="mt-4 space-y-4">
        {TESTS.map(([title, body]) => (
          <li key={title} className="rounded-2xl border border-stone p-5">
            <h3 className="font-medium">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
          </li>
        ))}
      </ul>
      <h2 className="mt-10 font-serif text-3xl">Lines we do not cross</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-muted">
        <li>No invented scarcity, countdowns, or a price that “disappears when we hang up”.</li>
        <li>No “no refunds” line. A change-of-mind policy, once it exists, sits beside legal consumer rights. It does not replace them. A lawyer should review the wording for each market.</li>
        <li>No payment before the buyer has seen the agreement.</li>
        <li>No pushing credit, and no use of someone’s hardship to force a yes.</li>
        <li>No borrowed logos, invented team photos, or results we cannot attribute.</li>
        <li>Job seekers use <Link href="/careers" className="underline">Careers</Link>. Buyer pages stay about buying.</li>
      </ul>
      <p className="mt-6 text-sm leading-6 text-muted">
        Hiring profiles, KPI targets, the guarantee and the exact fee are to be confirmed. This page describes the standard, not a contract.
      </p>
      <div className="mt-8 grid gap-4">
        <Placeholder title="Founders" body="Names, portraits and a short history go here when you add them. A fabricated founder is not a brand." />
      </div>
    </article>
  )
}
