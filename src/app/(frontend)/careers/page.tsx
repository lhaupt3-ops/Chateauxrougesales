import { CareersForm } from '@/components/site/CareersForm'
import { Breadcrumbs } from '@/components/site/ui'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata({
  title: 'Careers · Chateaux Rouge',
  description: 'Closer and setter enquiries. This page keeps job-seeker intent off the pages written for buyers.',
  path: '/careers',
})

export default function CareersPage() {
  return (
    <article className="mx-auto max-w-xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }]} />
      <h1 className="mt-8 font-serif text-5xl">Careers</h1>
      <p className="mt-4 leading-7 text-muted">
        We are not running an open hiring board. If you set or close high-ticket offers and you want to be considered when a seat opens, leave a note. Buyers looking for a team should use the application, not this form.
      </p>
      <CareersForm />
    </article>
  )
}
