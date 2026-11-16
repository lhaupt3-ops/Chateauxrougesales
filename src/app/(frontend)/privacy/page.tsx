import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata({
  title: 'Privacy · Chateaux Rouge',
  description: 'What Chateaux Rouge collects on this site, why, and who receives it.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <article className="rich mx-auto max-w-3xl px-4 py-12">
      <h1>Privacy</h1>
      <p>Last updated 16 November 2026. Have counsel review this before launch. It describes the site as built.</p>
      <h2>What we collect</h2>
      <p>If you apply, we store your email, your answers, your name, phone and website, and the page and campaign that brought you. Bookings sync from Calendly when that connection is turned on. Analytics run only after you allow them, through PostHog. Emails go through Resend when that key is set.</p>
      <h2>Why</h2>
      <p>To decide whether a sales team is a fit, to book a call, to remind you about that call, and to see which pages lead to booked calls. Marketing email is optional and off unless you tick it.</p>
      <h2>How long</h2>
      <p>Application records stay in the back office until an admin deletes them. You can ask for a copy or deletion by emailing the address in Site settings.</p>
      <h2>Who else sees it</h2>
      <p>The people who run Chateaux Rouge, the host (Vercel), the database (Postgres), the email provider, the calendar provider, and the analytics provider if you consented. We do not sell the list.</p>
    </article>
  )
}
