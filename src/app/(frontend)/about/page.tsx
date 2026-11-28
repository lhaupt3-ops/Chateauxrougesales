import Image from 'next/image'
import Link from 'next/link'
import { JsonLd } from '@/components/site/JsonLd'
import { LoomIntro } from '@/components/site/LoomIntro'
import { Breadcrumbs } from '@/components/site/ui'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'
import { absoluteUrl } from '@/lib/site'

export const metadata = pageMetadata({
  title: SEO.about.title,
  description: SEO.about.description,
  path: '/about',
})

const TESTS = [
  ['Truth', 'Every claim has to be true, typical and checkable. If I cannot show it, I do not say it.'],
  ['Transparency', 'A tactic only stays if it would still be fair once the buyer knew exactly what I was doing.'],
  ['A free no', 'The buyer can decline, take time, and talk to the other people who decide. I do not corner them.'],
  ['Care', 'I do not use distress, hardship or a personal disclosure to push a decision.'],
  ['The recording', 'I should be comfortable if the buyer, the client and a regulator heard the call.'],
]

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Lasse Haupt',
          jobTitle: 'Founder',
          image: absoluteUrl('/images/lasse-portrait.jpg'),
          url: absoluteUrl('/about'),
          sameAs: ['https://www.linkedin.com/in/lassehaupt/'],
          worksFor: {
            '@type': 'Organization',
            name: 'Chateaux Rouge',
            url: absoluteUrl('/'),
          },
        }}
      />
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]} />
      <h1 className="mt-8 font-serif text-5xl">Who I am, and the standard I work to</h1>
      <div className="mt-8 grid items-start gap-8 sm:grid-cols-[13rem_minmax(0,1fr)]">
        <Image
          src="/images/lasse-portrait.jpg"
          alt="Lasse Haupt, founder of Chateaux Rouge"
          width={1024}
          height={1024}
          priority
          sizes="(max-width: 639px) 13rem, 208px"
          className="w-52 rounded-2xl object-cover sm:w-full"
        />
        <div>
          <p className="text-lg leading-8 text-muted">
            I am Lasse Haupt, the founder of Chateaux Rouge. I am an entrepreneur and a designer by trade. I have
            run businesses and teams across countries, and I have stayed with client conversations through to a
            decision.
          </p>
          <p className="mt-4 leading-7 text-muted">
            Today Chateaux Rouge is one person: I install a sales call process for a founder and then take the
            calls myself. If the work grows, I may add people, and I will say so here first.
          </p>
        </div>
      </div>

      <h2 className="mt-12 font-serif text-3xl">A short introduction</h2>
      <LoomIntro />

      <h2 className="mt-12 font-serif text-3xl">Background</h2>
      <p className="mt-3 leading-7 text-muted">
        In 2021 I founded Devicion, a software development house in Indonesia, and ran it as managing director. I
        hired and led the team, and I owned the client relationships from the first conversation through to a
        decision. I also co-founded BukitHub, a co-working space in Indonesia that still operates. I sold my shares
        and stepped back from operations.
      </p>
      <p className="mt-4 leading-7 text-muted">
        I started as an event technician in Germany, setting up and running live events to hard deadlines. I later
        did FIFO rope access and crane rigging on Australian mine sites. Years of 12-hour shifts built real
        resilience and grit: staying calm under pressure, following strict procedure, and communicating clearly in
        a crew.
      </p>
      <p className="mt-4 leading-7 text-muted">
        I have lived in Germany, the Dominican Republic, Indonesia and Australia. I work in German, English and
        Spanish, I use Indonesian professionally, and I also speak conversational Malay and elementary French and
        Portuguese.
      </p>

      <h2 className="mt-10 font-serif text-3xl">With founders</h2>
      <p className="mt-3 leading-7 text-muted">
        You see the commercial shape before you book. The application is short on purpose. The call is for
        clarity, and not a fit is a good outcome. I do not promise a close rate, a revenue number, or a start date
        I have not confirmed.
      </p>
      <h2 className="mt-10 font-serif text-3xl">With your buyers</h2>
      <p className="mt-3 leading-7 text-muted">
        I listen more than I talk. I ask what the problem is costing, why it matters, whether the money is
        realistic, and who else decides. Price comes after that, stated once, with the full total. If it is not
        the moment, I book a specific next step or say so and stop. I do not chase.
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
        <li>
          No “no refunds” line. A change-of-mind policy, once it exists, sits beside legal consumer rights. It does
          not replace them.
        </li>
        <li>No payment before the buyer has seen the agreement.</li>
        <li>No pushing credit, and no use of someone’s hardship to force a yes.</li>
        <li>No borrowed logos, invented team photos, or results we cannot attribute.</li>
        <li>
          Job seekers use{' '}
          <Link href="/careers" className="underline">
            Careers
          </Link>
          . Buyer pages stay about buying.
        </li>
      </ul>
      <p className="mt-6 text-sm leading-6 text-muted">
        This page describes the standard I work to, not a contract.{' '}
        <Link href="/pricing" className="underline">
          Fees are on How I charge
        </Link>
        .
      </p>
      <p className="mt-8 text-sm">
        <Link className="underline" href="/apply">
          See if we&apos;re a fit
        </Link>
        . Or start with the{' '}
        <Link className="underline" href="/services/sales-audit">
          sales audit
        </Link>
        , or see{' '}
        <Link className="underline" href="/pricing">
          how I charge
        </Link>
        .
      </p>
    </article>
  )
}
