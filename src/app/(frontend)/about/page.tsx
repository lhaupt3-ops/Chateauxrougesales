import { Breadcrumbs, Placeholder } from '@/components/site/ui'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata({
  title: 'About · Chateaux Rouge',
  description: 'How Chateaux Rouge sells: no fake scarcity, no borrowed proof, and the data stays with the client.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]} />
      <h1 className="mt-8 font-serif text-5xl tracking-[-0.04em]">A quiet standard for a loud industry.</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        Chateaux Rouge installs and runs a high-ticket sales team. Setters, closers and a sales lead. The work is ordinary and serious: reply fast, tell the truth on the call, write the notes down, and show the numbers every week.
      </p>
      <h2 className="mt-10 font-serif text-3xl">How we sell</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-muted">
        <li>No countdown timers and no “3 spots left” unless the number is real and written in Site settings.</li>
        <li>No client logos, testimonials or close rates until the person and the figure can be checked.</li>
        <li>No closer-job content on the pages meant for buyers. Careers is separate.</li>
        <li>You keep the CRM, the data and the recordings.</li>
      </ul>
      <div className="mt-8 grid gap-4">
        <Placeholder title="Founders" body="Names, portraits and a short history go here when you add them. A fabricated founder is not a brand." />
      </div>
    </article>
  )
}
