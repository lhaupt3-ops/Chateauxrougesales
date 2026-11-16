import { pageMetadata } from '@/lib/metadata'
import { getSettings } from '@/lib/settings'

export const metadata = pageMetadata({
  title: 'Terms · Chateaux Rouge',
  description: 'Terms for using the Chateaux Rouge website. Commercial terms are still a draft pending review.',
  path: '/terms',
})

export default async function TermsPage() {
  const settings = await getSettings()
  const commercialDraft = settings.guaranteeIsPlaceholder || settings.noticeIsPlaceholder
  return (
    <article className="rich mx-auto max-w-3xl px-4 py-12">
      <h1>Terms</h1>
      <p>Last updated 16 November 2026. Counsel still needs to review this before it is treated as final.</p>
      {commercialDraft && (
        <p>
          <strong>Draft.</strong> The guarantee, the initial term and the notice period are not confirmed. Lawyer review is pending. Do not rely on any commercial promise you may have seen elsewhere on the site. A real engagement is a written agreement.
        </p>
      )}
      <h2>The site</h2>
      <p>The pages describe a service. They are not an offer to enter a contract, and they are not a promise of revenue, close rate or a start date. A real engagement is a written agreement.</p>
      <h2>Applications</h2>
      <p>Sending an application does not reserve a seat. We may decline, suggest a later step, or say it is not a fit. You confirm that what you submit is yours to share.</p>
      <h2>Your rights</h2>
      <p>Nothing here limits rights you have under consumer law. We do not say that refunds are unavailable. Any change-of-mind policy, once one exists, will sit beside those rights and will be in the agreement.</p>
      <h2>Liability</h2>
      <p>The site is provided as available. We are not liable for decisions you make from the essays or the score. The limit of any claim about the website itself is the amount you paid to use it, which is nothing.</p>
    </article>
  )
}
