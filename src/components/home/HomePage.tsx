import Link from 'next/link'
import { EmailCapture } from '@/components/site/EmailCapture'
import { FaqList, Placeholder, SectionHeading } from '@/components/site/ui'
import type { Faq } from '@/content/faqs'
import type { ProofStudy } from '@/lib/content'
import { isOperatorPlaceholder, type SiteSettings } from '@/lib/settings'

const PAINS = [
  {
    title: 'You are the bottleneck',
    body: 'The calendar is the ceiling. Delivery waits because you are the only person who can take the call.',
  },
  {
    title: 'Hiring closers is a lottery',
    body: 'A freelance seat still needs a manager. If that manager is you, you bought a new job.',
  },
  {
    title: 'Leads go cold while you deliver',
    body: 'A public study found firms that replied to online leads within an hour were far more likely to qualify them. Speed is a staffing problem.',
  },
]

const STAGES = [
  ['01 Audit', 'We read the offer and a set of real calls before anyone new gets on the phone.'],
  ['02 Install', 'Scripts, calendar routing and follow-up, inside the CRM you already own.'],
  ['03 Staff', 'Setters, closers and a sales lead. Not a pile of freelancers for you to herd.'],
  ['04 Run', 'Call review and a weekly set of numbers: show rate, close rate, cash collected.'],
]

export function HomePage({ settings, faqs, proof = [] }: { settings: SiteSettings; faqs: Faq[]; proof?: ProofStudy[] }) {
  const quotes = proof.filter((study) => study.quote)
  const results = proof.flatMap((study) => study.results.map((result) => ({ ...result, slug: study.slug, illustrative: study.illustrative })))
  const guarantee = isOperatorPlaceholder(settings.guaranteeText) ? '' : settings.guaranteeText
  const notice = isOperatorPlaceholder(settings.noticeText) ? '' : settings.noticeText
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-wine">Sales and closing, as a service</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-[-0.045em] md:text-6xl">
            Your high-ticket sales team, installed and run.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
            Setters, closers and a sales lead who own your pipeline, from the first reply to cash collected. Built for coaches, info-product and B2B offers of $3k and up.
          </p>
          <div className="mt-8 max-w-xl">
            <EmailCapture location="hero" entry="hero_inline" />
            <p className="mt-3 text-sm text-muted">2-minute application. No pitch deck. You keep the recordings.</p>
          </div>
        </div>
        <div className="rounded-3xl border border-stone bg-white/80 p-5 shadow-sm" aria-hidden="true">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-muted">
            <span>This week</span>
            <span className="text-wine">Illustrative layout</span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              ['Show rate', '—'],
              ['Close rate', '—'],
              ['Collected', '—'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-ivory p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted">{label}</p>
                <p className="mt-2 font-serif text-2xl">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {['New conversation', 'No-show, rescheduled', 'Proposal, waiting'].map((row, index) => (
              <div key={row} className="flex items-center gap-3 rounded-2xl border border-stone px-3 py-3 text-sm">
                <span className="h-2 w-2 rounded-full bg-rouge" />
                <span className="flex-1">{row}</span>
                <span className="text-muted">{index === 0 ? 'setter' : 'closer'}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted">
            A picture of the board, not a claim. Your numbers go here when they are yours.
          </p>
        </div>
      </section>

      <section className="border-y border-stone bg-white/50">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 md:grid-cols-3">
          {quotes.length === 0 ? (
            <>
              <Placeholder
                title="Founder track record"
                body="Add only figures you can attribute. This block stays empty until Site settings or a real case study has them."
              />
              <Placeholder title="Client marks" body="No logos until a client has agreed to be named. We will not borrow recognition." />
              <Placeholder title="Named results" body="Cash collected, close rate before and after, and the time window. Not an average we cannot show." />
            </>
          ) : (
            quotes.map((study) => (
              <Link key={study.slug} href={`/results/${study.slug}`} className="rounded-2xl border border-stone bg-white/80 p-5">
                {study.illustrative && <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-wine">Illustrative example</p>}
                <blockquote className={`${study.illustrative ? 'mt-2 ' : ''}font-serif text-2xl leading-snug tracking-[-0.03em]`}>“{study.quote}”</blockquote>
                {study.person && <p className="mt-4 text-sm text-muted">{study.person}</p>}
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="The cost of waiting" title="The work piles up in three places." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PAINS.map((pain) => (
            <article key={pain.title} className="rounded-2xl border border-stone bg-white/70 p-6">
              <h3 className="font-serif text-2xl tracking-[-0.03em]">{pain.title}</h3>
              <p className="mt-3 leading-7 text-muted">{pain.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          The speed point is from{' '}
          <a className="underline" href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads">
            Harvard Business Review
          </a>
          . It is their finding, not a Chateaux Rouge result.
        </p>
      </section>

      <section className="bg-ink text-ivory">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            eyebrow="The system"
            title="Four stages. Then it is a weekly habit."
            body={settings.timelineText}
            tone="light"
          />
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {STAGES.map(([title, body]) => (
              <li key={title} className="rounded-2xl border border-white/10 p-5">
                <h3 className="font-serif text-2xl text-gold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ivory/75">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading title="What you get. What you keep." />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-stone">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/70">
              <tr>
                <th className="p-4 font-medium"> </th>
                <th className="p-4 font-medium">You keep</th>
                <th className="bg-wine p-4 font-medium text-ivory">We take on</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['The company', 'Offer, delivery, client relationship', 'First reply, booking, the call, follow-up'],
                ['The system', 'CRM, accounts, data, recordings', 'Scripts, routing, call review, the weekly report'],
                ['The risk', 'The right to leave on the written notice', 'Replacing a closer who is not a fit'],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-stone">
                  {row.map((cell) => (
                    <td key={cell} className="p-4 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <SectionHeading title="Results will be named, or they will not be here." body="The card format is ready. The stories are not invented." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {results.length === 0
            ? ['Offer type', 'Cash collected', 'Close rate, before and after'].map((label) => (
                <Placeholder key={label} title={label} body="This card links to a case study once a client has approved the numbers and their name." />
              ))
            : results.map((result) => (
                <Link
                  key={`${result.slug}-${result.metric}-${result.after}`}
                  href={`/results/${result.slug}`}
                  className="rounded-2xl border border-stone bg-white/70 p-5"
                >
                  {result.illustrative && <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-wine">Illustrative example</p>}
                  <p className={`${result.illustrative ? 'mt-2 ' : ''}text-[11px] uppercase tracking-wider text-muted`}>{result.metric}</p>
                  <p className="mt-2 font-serif text-2xl">{result.before ? `${result.before} → ${result.after}` : result.after}</p>
                  {result.timeframe && <p className="mt-2 text-sm text-muted">{result.timeframe}</p>}
                </Link>
              ))}
        </div>
        <Link href="/results" className="mt-6 inline-block text-sm underline">
          See the results page
        </Link>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2">
        <div className="rounded-2xl border border-stone bg-white/70 p-6">
          <h2 className="font-serif text-3xl">Built for</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
            <li>Offers priced at $3,000 or more.</li>
            <li>You have already sold it yourself.</li>
            <li>Calls or leads already exist, or you want setters in the same team.</li>
            <li>You can deliver if more people say yes.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-stone p-6">
          <h2 className="font-serif text-3xl">Not for</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
            <li>Offers under $1,000.</li>
            <li>Pre-revenue, with no conversations yet.</li>
            <li>A promised close rate, or a fake countdown.</li>
            <li>
              Job seekers. <Link href="/careers" className="underline">Careers</Link> is the right door.
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <SectionHeading title="In house, freelance, or a managed team." />
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone">
                <th className="p-4"> </th>
                <th className="p-4">In house</th>
                <th className="p-4">Freelancer</th>
                <th className="bg-wine p-4 text-ivory">Chateaux Rouge</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Who manages', 'You', 'You', 'A sales lead'],
                ['Who owns the data', 'You', 'Often unclear', 'You'],
                ['How you pay', 'Salary and commission', 'Mostly commission', 'Setup, management, commission'],
                ['Best when', 'Sales is the company', 'You can coach', 'You want the function run'],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-stone">
                  {row.map((cell, index) => (
                    <td key={cell} className={`p-4 ${index === 3 ? 'bg-wine/5' : ''}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/compare/outsourced-vs-in-house-sales-team" className="mt-4 inline-block text-sm underline">
          Read the full comparison
        </Link>
      </section>

      <section className={`mx-auto grid max-w-6xl gap-8 px-4 pb-16 ${guarantee || notice ? 'md:grid-cols-2' : ''}`}>
        <div>
          <SectionHeading title="How we charge" body="A setup fee, a monthly management fee starting at $3,000, and a commission on cash collected. You see the shape before you book." />
          <Link href="/pricing" className="mt-4 inline-block text-sm underline">
            Read the pricing page
          </Link>
        </div>
        {(guarantee || notice) && (
        <div className="rounded-2xl bg-wine p-6 text-ivory">
          <h2 className="font-serif text-3xl">The guarantee, in words we can keep</h2>
          {guarantee && <p className="mt-4 leading-7 text-ivory/85">{guarantee}</p>}
          {notice && <p className="mt-4 text-sm text-ivory/70">{notice}</p>}
        </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <SectionHeading title="The people, when we can show them." />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Placeholder title="Founder" body="Portrait, name and a short bio go here. We will not invent a face or a résumé." />
          <Placeholder title="How we sell" body="No fake scarcity, no borrowed logos, no close rate we cannot show. The standards page says the same thing at more length." />
        </div>
        <Link href="/about" className="mt-4 inline-block text-sm underline">
          About the standard
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <FaqList faqs={faqs} />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl border border-stone bg-white/80 p-8 md:p-12">
          <h2 className="font-serif text-4xl tracking-[-0.03em]">See if we are a fit.</h2>
          <p className="mt-3 max-w-xl text-muted">Same two minutes as the top of the page. If you would rather read first, take the scorecard. It asks the same questions.</p>
          <div className="mt-6 max-w-xl">
            <EmailCapture location="footer" entry="footer_inline" />
          </div>
          <Link href="/resources/sales-team-readiness-scorecard" className="mt-4 inline-block text-sm underline">
            Prefer to read first? Get the Sales Team Readiness Scorecard
          </Link>
        </div>
      </section>
    </>
  )
}
