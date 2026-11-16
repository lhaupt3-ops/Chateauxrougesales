import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'
import { getSettings } from '@/lib/settings'

export const metadata = pageMetadata({
  title: SEO.privacy.title,
  description: SEO.privacy.description,
  path: '/privacy',
})

export default async function PrivacyPage() {
  const settings = await getSettings()
  const name = settings.legalName || 'Lasse Haupt'
  const email = settings.legalEmail || 'lhaupt3@gmail.com'
  const country = settings.legalCountry || 'Australia'
  return (
    <article className="rich mx-auto max-w-3xl px-4 py-12">
      <h1>Privacy</h1>
      <p>Last updated 16 November 2026.</p>
      <p>
        This site is operated by {name}, an individual and the sole operator, in {country}. There is no separate company and no shopfront address. Contact {email}. This notice is written for the Australian Privacy Principles in the Privacy Act 1988 (Cth). A short note for people outside Australia is at the end.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Application answers: email, name, phone, website, offer, price, revenue band, conversation volume, timeline, and whether you can pay a setup fee. Older applications may still show a monthly budget band.</li>
        <li>Booking details if you schedule through Calendly, including the time of the call.</li>
        <li>Emails we send you through Resend, and whether you unsubscribe.</li>
        <li>Analytics, only after you allow them: pages, clicks and funnel steps in PostHog, hosted in the United States.</li>
        <li>The usual technical data a host sees: IP address in server logs, and files you never upload unless you are an admin using the back office.</li>
      </ul>
      <h2>Why</h2>
      <p>
        To decide whether a sales team is a fit, to book and remind you about a call, to send the guide you asked for, and to run the follow-up sequences you can leave. Analytics, when you allow them, show which pages lead to an application. We do not sell personal information. Marketing email is sent only if you apply, join the waitlist, or tick the box on a guide. You can unsubscribe in one click, which is also how we meet the Spam Act 2003 (Cth).
      </p>
      <h2>Who else sees it</h2>
      <p>These providers process information for us. Several of them store it in the United States:</p>
      <ul>
        <li>Vercel, for hosting the site.</li>
        <li>Neon, for the Postgres database.</li>
        <li>Vercel Blob, for files uploaded in the back office.</li>
        <li>Resend, for email.</li>
        <li>Calendly, when you book.</li>
        <li>PostHog in the United States, only if you consent to analytics.</li>
      </ul>
      <p>
        Sending information overseas is allowed where we reasonably believe the recipient is subject to a law or scheme that is substantially similar to the Australian Privacy Principles, or where you consent. Using the application form, booking a call, or ticking the guide box is that consent for the providers who have to receive the information to do the thing you asked for. Analytics stay off until the consent cookie is set.
      </p>
      <h2>Cookies</h2>
      <p>
        A necessary cookie remembers an application you started. Analytics cookies and local storage are set only after you choose to allow them. You can refuse analytics and still apply, book, and read a guide.
      </p>
      <h2>How long</h2>
      <p>
        Application and email records stay until you ask us to delete them or until we no longer need them to answer a fit question, a booking, or a complaint. Server logs follow the host’s ordinary retention. Unsubscribed addresses are kept only so we do not email them again.
      </p>
      <h2>Access and correction</h2>
      <p>Email {email} to see what we hold, to correct it, or to ask for deletion. We will respond within 30 days. We may refuse a request where the Privacy Act allows it, and we will say why.</p>
      <h2>Complaints</h2>
      <p>
        Write to {email} first. If you are not satisfied, you can complain to the Office of the Australian Information Commissioner at oaic.gov.au.
      </p>
      <h2>People outside Australia</h2>
      <p>
        If you are in the UK, the EEA or another country with its own privacy law, the same practices apply: we collect the information above for the purposes above, we use the processors listed above, and you can ask for access, correction or deletion at {email}. This notice is not a claim that {name} is established in the EU.
      </p>
    </article>
  )
}
