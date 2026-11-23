import { ScorecardGate } from '@/components/site/ScorecardGate'
import { getFunnel } from '@/lib/funnel-copy'
import { Breadcrumbs } from '@/components/site/ui'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'

export const metadata = pageMetadata({
  title: SEO.scorecard.title,
  description: SEO.scorecard.description,
  path: '/resources/closer-readiness-scorecard',
  noindex: true,
})

export default async function ScorecardPage() {
  const funnel = await getFunnel()
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' },
          { name: 'Closer readiness scorecard', path: '/resources/closer-readiness-scorecard' },
        ]}
      />
      <p className="mt-8 kicker">Scorecard</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Closer readiness scorecard</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        The same eight checks as the free guide. Leave an email and you can score them on this page, print the page, or download the PDF. It does not predict revenue.
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{var q=new URLSearchParams(location.search).get('id');var s=localStorage.getItem('cr_application_id');if((q&&q.trim())||(s&&s.trim()))document.documentElement.dataset.scorecard='checking';}catch(e){}})();",
        }}
      />
      <ScorecardGate
        questions={funnel.questions}
        labels={{
          yes: funnel.yesLabel,
          no: funnel.noLabel,
          scoreHeading: funnel.scoreHeading,
          progressHint: funnel.progressHint,
          passHeading: funnel.passHeading,
          passBody: funnel.passBody,
          failHeading: funnel.failHeading,
          failBody: funnel.failBody,
          passMaxNos: funnel.passMaxNos,
        }}
      />
    </article>
  )
}
