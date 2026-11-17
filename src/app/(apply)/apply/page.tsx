import Link from 'next/link'
import { ApplyWizard } from '@/components/apply/ApplyWizard'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'

export const metadata = pageMetadata({
  title: SEO.apply.title,
  description: SEO.apply.description,
  path: '/apply',
})

export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <ApplyWizard />
      <p className="mt-8 text-sm text-muted">
        Not ready to apply?{' '}
        <Link href="/resources/are-you-ready-for-closers" className="underline">
          Read the free guide first
        </Link>
        .
      </p>
    </div>
  )
}
