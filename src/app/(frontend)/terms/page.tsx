import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'
import { confirmedOrPending, getSettings } from '@/lib/settings'

export const metadata = pageMetadata({
  title: SEO.terms.title,
  description: SEO.terms.description,
  path: '/terms',
})

export default async function TermsPage() {
  const settings = await getSettings()
  const name = settings.legalName || 'Lasse Haupt'
  const email = settings.legalEmail || 'lhaupt3@gmail.com'
  const country = settings.legalCountry || 'Australia'
  const setup = confirmedOrPending(settings.setupFeeLabel, settings.setupFeeIsPlaceholder)
  const commission = confirmedOrPending(settings.commissionLabel, settings.commissionIsPlaceholder)
  const law = settings.governingLawIsPlaceholder || !settings.governingLaw.trim()
    ? 'The governing law is still to be confirmed. Until a written agreement names it, do not treat this page as choosing a court.'
    : `The governing law named for the website terms is ${settings.governingLaw}.`
  return (
    <article className="rich mx-auto max-w-3xl px-4 py-12">
      <h1>Terms</h1>
      <p>Last updated 16 November 2026.</p>
      <p>
        These terms cover use of this website, operated by {name}, an individual and the sole operator, in {country}. Contact {email}. There is no shopfront address. A paid engagement is a separate written agreement. If that agreement conflicts with this page, the agreement wins for that engagement.
      </p>
      <h2>Using the site</h2>
      <p>
        You may read the pages, apply, and book a call that the application offers. You may not scrape the site in a way that degrades it, misrepresent an application, or upload anything you do not have the right to share. We may refuse, pause or close an application.
      </p>
      <h2>No guarantee of results</h2>
      <p>
        The essays, the guide and the application result are information. They are not a promise of revenue, a close rate, a show rate, or a start date. Examples stay unpublished until they are real, and a draft label means the sentence is not a term.
      </p>
      <h2>Commercial terms</h2>
      <p>
        The model described on the site is a one-off setup fee, then commission on cash collected. There is no monthly retainer. The setup fee is currently {setup}. The commission is currently {commission}. Where either line says “to be confirmed”, it is a placeholder, not a price. The figures you can rely on are the ones in your written agreement.
      </p>
      <p>
        <strong>Draft, pending lawyer review.</strong> Any guarantee, initial term or notice period you may have seen is not in force. Nothing on the site is a guarantee until a lawyer has reviewed it and the written agreement includes it.
      </p>
      <h2>Intellectual property</h2>
      <p>
        The site, the guide, the mark and the copy belong to {name} unless a page says otherwise. You may share a link. You may not republish the guide or present it as your own sales training.
      </p>
      <h2>Liability</h2>
      <p>
        Nothing on this page excludes, restricts or modifies any right or remedy you have under the Australian Consumer Law that cannot legally be excluded. Where the law allows a limit, and the site itself is the only thing you used, liability for that use is limited to supplying the site again or paying the cost of doing so, which is nothing because the site is free. Liability for a paid engagement is dealt with in the written agreement, and that clause also cannot limit rights the Australian Consumer Law does not allow to be limited.
      </p>
      <h2>Governing law</h2>
      <p>{law} The operator is in {country}. This page does not name a state or a court.</p>
    </article>
  )
}
