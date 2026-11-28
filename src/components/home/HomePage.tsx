import Link from 'next/link'
import { ApplyLink } from '@/components/site/ApplyLink'
import { EmailCapture } from '@/components/site/EmailCapture'
import { FaqList, SectionHeading } from '@/components/site/ui'
import type { Faq } from '@/content/faqs'
import type { ProofStudy } from '@/lib/content'
import { publicCopy } from '@/lib/indexing'
import type { FunnelCopy } from '@/lib/funnel-copy'
import { FUNNEL_DEFAULTS } from '@/lib/funnel-copy'
import { isOperatorPlaceholder, type SiteSettings } from '@/lib/settings'

const PAINS = [
  {
    title: 'You are the bottleneck',
    body: 'Delivery waits because you are the only person who takes the sales call.',
  },
  {
    title: 'A new closer needs a process first',
    body: 'Hiring someone into a sales process that lives in your head usually ends in a restart. The call shape, the qualifying rules and the follow-up need to be written down before anyone else takes a call.',
  },
  {
    title: 'Leads go quiet while you deliver',
    body: 'Published research links a reply inside the first hour with a much higher chance of qualifying a lead. That is a capacity problem, and it is their finding, not a result of mine.',
  },
]

const STAGES = [
  ['01 Read', 'I read the offer and a set of real calls, including the losses, before I speak to a single buyer.'],
  ['02 Install', 'The call shape, the qualifying rules and the follow-up go into the CRM you already own.'],
  ['03 Run', 'I take your booked calls. You get the recording and a short note after each one.'],
  ['04 Review', 'Each week: calls held, close rate, cash collected, and the calls themselves.'],
]

export function HomePage({ settings, faqs, proof = [], funnel }: { settings: SiteSettings; faqs: Faq[]; proof?: ProofStudy[]; funnel?: FunnelCopy }) {
  const copy = funnel || { ...FUNNEL_DEFAULTS, questions: [] }
  const quotes = proof.filter((study) => study.quote)
  const results = proof.flatMap((study) => study.results.map((result) => ({ ...result, slug: study.slug, illustrative: study.illustrative })))
  const guarantee = settings.guaranteeIsPlaceholder || isOperatorPlaceholder(settings.guaranteeText) ? '' : publicCopy(settings.guaranteeText)
  const notice = settings.noticeIsPlaceholder || isOperatorPlaceholder(settings.noticeText) ? '' : publicCopy(settings.noticeText)
  const termsAreDraft = settings.guaranteeIsPlaceholder || settings.noticeIsPlaceholder
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
        <div>
          <p className="kicker">{copy.eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.08] md:text-6xl md:leading-[1.05]">
            {copy.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
            {copy.subhead}
          </p>
          <div className="mt-8 max-w-xl">
            <EmailCapture location="hero" entry="hero_inline" button={copy.cta} />
            <p className="mt-3 text-sm text-muted">A short application. A clear no is a useful answer.</p>
          </div>
        </div>
        <figure className="rounded-3xl border border-stone bg-white p-5 shadow-[0_8px_24px_rgba(28,28,28,0.06)]">
          <figcaption className="flex items-center justify-between gap-3">
            <span className="kicker text-muted">The weekly report</span>
            <span className="kicker">Blank until there are real calls</span>
          </figcaption>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ['Calls held', '–', false],
              ['Closed', '–', true],
              ['Collected', '–', false],
            ].map(([label, value, accent]) => (
              <div key={String(label)} className="rounded-2xl bg-ivory px-3 py-3">
                <p className="kicker text-muted">{label}</p>
                <p className={`mt-2 font-mono text-2xl tabular-nums leading-none ${accent ? 'text-rouge' : 'text-ink'}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {[
              ['Call booked: prep from your notes', 'before the call'],
              ['No-show: one rebook, then stop', 'after the call'],
              ['Maybe: a dated follow-up', 'after the call'],
            ].map(([row, when]) => (
              <div key={row} className="flex items-center gap-3 rounded-xl border border-stone px-3 py-3 text-sm">
                <span className="h-2 w-2 shrink-0 rounded-xl bg-rouge" />
                <span className="flex-1">{row}</span>
                <span className="font-mono text-xs text-muted">{when}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted">What you would see each week. There are no figures here because there are no client results to show yet.</p>
        </figure>
      </section>

      {quotes.length > 0 && (
        <section className="border-y border-stone bg-white/50">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="grid gap-4 md:grid-cols-3">
              {quotes.map((study) => (
                <Link key={study.slug} href={`/results/${study.slug}`} className="rounded-2xl border border-stone bg-white/80 p-5">
                  {study.illustrative && <p className="kicker">Illustrative example</p>}
                  <blockquote className={`${study.illustrative ? 'mt-2 ' : ''}font-serif text-2xl leading-snug`}>“{study.quote}”</blockquote>
                  {study.person && <p className="mt-4 text-sm text-muted">{study.person}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow={copy.painsEyebrow} title={copy.painsTitle} />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PAINS.map((pain) => (
            <article key={pain.title} className="rounded-2xl border border-stone bg-white/70 p-6">
              <h3 className="font-serif text-2xl">{pain.title}</h3>
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
            eyebrow={copy.systemEyebrow}
            title={copy.systemTitle}
            body={publicCopy(settings.timelineText)}
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
        <SectionHeading
          eyebrow="Two different conversations"
          title="How I talk to you, and how I talk to your buyers."
          body="Same standard. Different calls."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-stone bg-white/70 p-6">
            <h3 className="font-serif text-2xl">With you, the founder</h3>
            <p className="mt-3 leading-7 text-muted">
              A short application, then a call whose job is clarity. We look at the offer, the calls you already have, and whether I can help. Not a fit is a fine outcome. The commercial shape is on the pricing page before you book.
            </p>
          </article>
          <article className="rounded-2xl border border-stone bg-white/70 p-6">
            <h3 className="font-serif text-2xl">With your buyers</h3>
            <p className="mt-3 leading-7 text-muted">
              On a buyer call I listen first and ask what the problem is costing them. Then I help them reach a decision they are comfortable with: yes, not yet, or no. I qualify before I mention price, and I do not invent urgency.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <SectionHeading title="What you get. What you keep." />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-stone">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/70">
              <tr>
                <th className="p-4 font-medium"> </th>
                <th className="p-4 font-medium">You keep</th>
                <th className="bg-wine p-4 font-medium text-ivory">I take on</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['The company', 'Offer, delivery, client relationship', 'The booked sales call and the follow-up after it'],
                ['The system', 'CRM, accounts, data, recordings', 'Call shape, qualifying rules, call notes, the weekly report'],
                ['The standard', 'The right to stop, on the notice in the agreement', 'Calls held to a written standard, with the recordings shared'],
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
        {results.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {results.map((result) => (
              <Link
                key={`${result.slug}-${result.metric}-${result.after}`}
                href={`/results/${result.slug}`}
                className="rounded-2xl border border-stone bg-white/70 p-5"
              >
                {result.illustrative && <p className="kicker">Illustrative example</p>}
                <p className={`${result.illustrative ? 'mt-2 ' : ''}kicker text-muted`}>{result.metric}</p>
                <p className="mt-2 font-serif text-2xl">{result.before ? `${result.before} → ${result.after}` : result.after}</p>
                {result.timeframe && <p className="mt-2 text-sm text-muted">{result.timeframe}</p>}
              </Link>
            ))}
          </div>
        )}
        <Link href="/results" className="mt-6 inline-block text-sm underline">
          See the results page
        </Link>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2">
        <div className="rounded-2xl border border-stone bg-white/70 p-6">
          <h2 className="font-serif text-3xl">Built for</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
            <li>You have already sold the offer, and you know what it is and who it is for.</li>
            <li>It sells for roughly $2,000 to $15,000, and the sale happens on a call.</li>
            <li>Booked calls already arrive from ads, referrals, content or your own outreach.</li>
            <li>You can deliver if more people say yes, and you will share the recordings.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-stone p-6">
          <h2 className="font-serif text-3xl">Not for</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
            <li>An offer that has never sold, or a price too small to pay for the work.</li>
            <li>Lead generation or cold outreach done for you. That is not part of what I offer today.</li>
            <li>A promised close rate, a fake countdown, or pressure you would not want on your buyers.</li>
            <li>
              Job seekers. <Link href="/careers" className="underline">Careers</Link> is the right door.
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <SectionHeading title="In house, a freelance closer, or founder-led." />
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone">
                <th className="p-4"> </th>
                <th className="p-4">In house</th>
                <th className="p-4">Freelancer</th>
                <th className="bg-wine p-4 text-ivory">Chateaux Rouge, today</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Who manages', 'You', 'You', 'Me, with a weekly review with you'],
                ['Who owns the data', 'You', 'Often unclear', 'You'],
                ['How you pay', 'Salary and commission', 'Mostly commission', 'Setup fee, then commission'],
                ['Capacity', 'As many as you hire', 'One person', 'One person. A handful of clients at a time'],
                ['Best when', 'Sales is the company', 'You can coach', 'Calls are booked and you want the process built and the calls taken'],
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

      <section className={`mx-auto grid max-w-6xl gap-8 px-4 pb-16 ${guarantee || notice || termsAreDraft ? 'md:grid-cols-2' : ''}`}>
        <div>
          <SectionHeading title={copy.chargeTitle} body={copy.chargeBody} />
          <ol className="mt-6 space-y-3 text-sm leading-6 text-muted">
            <li>
              <span className="font-medium text-ink">Sales audit.</span> A paid read of your offer, calls and follow-up. Optional, and a fair place to start.
            </li>
            <li>
              <span className="font-medium text-ink">Pilot.</span> I install the process and take your booked calls. A setup fee, then commission on cash collected.
            </li>
            <li>
              <span className="font-medium text-ink">A team, later.</span> Not available yet. I will say here when it is.
            </li>
          </ol>
          <Link href="/pricing" className="mt-4 inline-block text-sm underline">
            Read the pricing page
          </Link>
          <ApplyLink location="pricing" className="mt-4 ml-4 inline-block text-sm underline">
            See if we&apos;re a fit
          </ApplyLink>
        </div>
        {termsAreDraft && (
          <div className="rounded-2xl border border-stone bg-white/70 p-6">
            <p className="kicker">Not yet</p>
            <h2 className="mt-2 font-serif text-3xl">{copy.draftGuaranteeTitle}</h2>
            <p className="mt-4 leading-7 text-muted">{copy.draftGuaranteeBody}</p>
          </div>
        )}
        {!termsAreDraft && (guarantee || notice) && (
        <div className="rounded-2xl bg-wine p-6 text-ivory">
          <h2 className="font-serif text-3xl">{copy.guaranteeHeading}</h2>
          {guarantee && <p className="mt-4 leading-7 text-ivory/85">{guarantee}</p>}
          {notice && <p className="mt-4 text-sm text-ivory/70">{notice}</p>}
        </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl bg-ink px-8 py-10 text-ivory md:px-12">
          <p className="kicker text-gold">Free guide</p>
          <h2 className="mt-3 max-w-2xl font-serif text-4xl">Are you actually ready for closers?</h2>
          <p className="mt-4 max-w-2xl leading-7 text-ivory/80">
            A self-audit for founders of coaching, consulting, course and high-ticket offers. Two conversations, setter versus closer, a call shape, working KPI targets, and the red flags that show up when a hire is early.
          </p>
          <Link href="/resources/are-you-ready-for-closers" className="mt-6 inline-block rounded-xl bg-ivory px-5 py-3 text-sm font-medium text-ink">
            Read the guide
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <SectionHeading title="Who you would be working with." />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-stone bg-white/70 p-6">
            <h3 className="font-serif text-2xl">Lasse Haupt, founder</h3>
            <p className="mt-3 leading-7 text-muted">
              I have run businesses and teams, and I have owned the conversations with clients. Chateaux Rouge is me for now. I set up how your calls run and take them myself. If there is enough work to justify more people, I will add them and say so here.
            </p>
          </article>
          <article className="rounded-2xl border border-stone bg-white/70 p-6">
            <h3 className="font-serif text-2xl">How I sell</h3>
            <p className="mt-3 leading-7 text-muted">
              I listen first, qualify before I mention price, and say the price once. A no is a fine answer. No invented urgency, no scarcity, no close rate promised. The standards page says the same thing at more length.
            </p>
          </article>
        </div>
        <Link href="/about" className="mt-4 inline-block text-sm underline">
          About me and the standard
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <FaqList faqs={faqs} />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl border border-stone bg-white/80 p-8 md:p-12">
          <h2 className="font-serif text-4xl">See if we&apos;re a fit</h2>
          <p className="mt-3 max-w-xl text-muted">Same two minutes as the top of the page. If you would rather read first, the free guide is open on the site. The one-page scorecard is the piece I email.</p>
          <div className="mt-6 max-w-xl">
            <EmailCapture location="footer" entry="footer_inline" />
          </div>
          <Link href="/resources/are-you-ready-for-closers" className="mt-4 inline-block text-sm underline">
            Prefer to read first? Are you actually ready for closers?
          </Link>
        </div>
      </section>
    </>
  )
}
