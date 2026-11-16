import { CareersForm } from '@/components/site/CareersForm'
import { Breadcrumbs } from '@/components/site/ui'
import { careersIsIndexable } from '@/lib/indexing'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'
import { getSettings } from '@/lib/settings'

export async function generateMetadata() {
  const settings = await getSettings()
  return pageMetadata({
    title: SEO.careers.title,
    description: SEO.careers.description,
    path: '/careers',
    noindex: !careersIsIndexable(settings),
  })
}

export default function CareersPage() {
  return (
    <article className="mx-auto max-w-xl px-4 py-12">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }]} />
      <h1 className="mt-8 font-serif text-5xl">Careers</h1>
      <p className="mt-4 leading-7 text-muted">
        This page is only for people who set or close. It is not an open hiring board. Pay, seats and the profile we look for are not confirmed, so none of that is listed here. Leave a note if you want to be considered when a seat exists.
      </p>
      <p className="mt-3 leading-7 text-muted">
        Founders looking for a team should use the application. Mixing the two crowds the wrong conversation.
      </p>
      <CareersForm />
    </article>
  )
}
