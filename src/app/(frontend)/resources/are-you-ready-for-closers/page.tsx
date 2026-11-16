import Link from 'next/link'
import { ResourceGate } from '@/components/site/ResourceGate'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata({
  title: 'Are you actually ready for closers? · Chateaux Rouge',
  description: 'A free self-audit for founders who want setters and closers. Two conversations, a call shape, working targets, and the red flags that mean you should wait.',
  path: '/resources/are-you-ready-for-closers',
})

const QUESTIONS = [
  ['The offer has a price you have already collected.', 'A slide that says “from” is not a price. If the last ten sales did not cluster around one number, the closer has nothing to hold.'],
  ['You can explain who it is not for.', 'A closer who cannot refuse the wrong buyer will fill the calendar with people who cannot pay or cannot be served.'],
  ['Someone other than you can describe the offer without performing you.', 'If the sale only works when you are in the room, a team will sell a thinner version. Write the version they are allowed to say.'],
  ['Conversations already start without a closer.', 'A closer does not invent demand. If the week has no booked conversations, the missing role is usually a setter, or the offer is not being put in front of anyone.'],
  ['You know where a maybe goes.', 'A maybe without a date and an owner is not a pipeline. Name the place those notes live before you hire.'],
  ['You can listen to a call you would let a new hire copy.', 'If you would not play one recording to a stranger, the process is still in your head. Hiring freezes that confusion into someone else’s week.'],
  ['Delivery can absorb more yeses.', 'A full calendar that you cannot fulfil is a worse problem than a quiet one. Count the seats, the calls, or the client hours you can actually take.'],
  ['A one-off setup fee is possible.', 'Commission on future cash does not pay for the weeks spent building the call, the handoff and the review. If the only acceptable model is “pay us when we close”, wait.'],
]

export default function ReadyForClosersPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.16em] text-wine">Free guide</p>
      <h1 className="mt-3 font-serif text-5xl tracking-[-0.04em]">Are you actually ready for closers?</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        For founders of coaching, consulting, course and other high-ticket offers who are thinking about a sales team. This is a self-audit. It does not predict your revenue, and it does not use anyone else’s results as yours.
      </p>
      <ResourceGate slug="are-you-ready-for-closers" scorecard={false} title="Are you actually ready for closers?">
        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-3xl">Start with two conversations</h2>
            <p className="mt-3 leading-7 text-muted">
              Most “sales calls” are two conversations forced into one hour. The first earns the right to talk: what is going on, whether this person is even a buyer, and whether a longer conversation is worth both calendars. The second is the decision: the offer, the price, the objections, and a yes, a no, or a dated maybe.
            </p>
            <p className="mt-3 leading-7 text-muted">
              When one person does both, the first conversation gets rushed and the second one gets vague. Setters own the first. Closers own the second. If you only have a gap in one of them, hire for that gap.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-3xl">Score the process you have</h2>
            <p className="mt-3 leading-7 text-muted">Answer yes or no. Two or more nos means a closer will not fix the week. Fix the nos first.</p>
            <ol className="mt-4 space-y-3">
              {QUESTIONS.map(([title, body], index) => (
                <li key={title} className="rounded-2xl border border-stone bg-white p-4">
                  <p className="font-medium">{index + 1}. {title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h2 className="font-serif text-3xl">Setter, closer, or neither</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone p-4">
                <h3 className="font-medium">Setter</h3>
                <p className="mt-2 text-sm leading-6 text-muted">Starts conversations, checks the offer is even relevant, and books a decision call with the right person. Does not discount. Does not “just hop on and close it”.</p>
              </div>
              <div className="rounded-2xl border border-stone p-4">
                <h3 className="font-medium">Closer</h3>
                <p className="mt-2 text-sm leading-6 text-muted">Runs the decision conversation and owns the follow-up on maybes. Does not also have to invent the pipeline. If they do both, neither job is finished.</p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="font-serif text-3xl">A decision call in four moves</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 leading-7 text-muted">
              <li>Open with the decision they came to make. If they cannot name it, you are still in the first conversation.</li>
              <li>Restate the problem in their words, including the constraint they actually have. Time, cash, and delivery are different constraints.</li>
              <li>Walk the offer against that problem. Cut anything that does not touch it.</li>
              <li>Ask for a decision. A clean no is a finished call. A maybe needs a date and an owner before you hang up.</li>
            </ol>
          </section>
          <section>
            <h2 className="font-serif text-3xl">Numbers worth writing down</h2>
            <p className="mt-3 leading-7 text-muted">
              These are working targets for your own tracking, not results we are claiming and not a benchmark you must hit. Change them when your offer teaches you something more honest.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
              <li>Conversations started per week, split by source.</li>
              <li>Show rate on booked decision calls. Investigate the source before you blame the closer.</li>
              <li>Share of calls that end in a yes, a no, or a dated maybe. Undated maybes are a process failure.</li>
              <li>Cash collected, not proposals sent.</li>
              <li>Time from first conversation to a decision. A number with no owner is not a target.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-3xl">Red flags when you hire</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
              <li>They want commission only, and nobody is paying for the script, the review, or the weeks before the first cash.</li>
              <li>They will not role-play your offer. A story about another niche is not a test.</li>
              <li>They ask to “own the leads” or to take the CRM with them if they leave.</li>
              <li>The pitch is a close rate. A rate without the offer, the lead source and the definition of a call is not a number you can check.</li>
              <li>You cannot name who reviews the calls. A hire without a reviewer becomes your second job.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-3xl">If the score says wait</h2>
            <p className="mt-3 leading-7 text-muted">
              Sell the offer yourself until the price, the objections and the delivery load are written down. Then look at a setter if the gap is conversations, or a closer if the gap is the decision. A managed team is the later step, when both conversations exist and a setup fee is possible.
            </p>
            <p className="mt-4 text-sm">
              <Link href="/apply" className="underline">Reapply when that is true</Link>
              <span className="text-muted">. The setup amount and the commission percentage are still to be confirmed in writing. Nothing in this guide is a quote.</span>
            </p>
          </section>
        </div>
      </ResourceGate>
    </article>
  )
}
