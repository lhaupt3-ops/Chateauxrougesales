import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata({
  title: 'Terms · Chateaux Rouge',
  description: 'Terms for using the Chateaux Rouge website. Commercial terms live in a separate agreement.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <article className="rich mx-auto max-w-3xl px-4 py-12">
      <h1>Terms</h1>
      <p>Last updated 16 November 2026. Have counsel review this before launch.</p>
      <h2>The site</h2>
      <p>The pages describe a service. They are not an offer to enter a contract, and they are not a promise of revenue, close rate or a start date. Placeholders are marked. A real engagement is a written agreement.</p>
      <h2>Applications</h2>
      <p>Sending an application does not reserve a seat. We may decline, waitlist or suggest a different first step. You confirm that what you submit is yours to share.</p>
      <h2>Liability</h2>
      <p>The site is provided as available. We are not liable for decisions you make from the essays or the score. The limit of any claim about the website itself is the amount you paid to use it, which is nothing.</p>
    </article>
  )
}
