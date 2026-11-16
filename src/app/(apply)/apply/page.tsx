import { headers } from 'next/headers'
import Link from 'next/link'
import { ApplyWizard } from '@/components/apply/ApplyWizard'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'
import { dialFromCountry } from '@/lib/options'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
  title: SEO.apply.title,
  description: SEO.apply.description,
  path: '/apply',
})

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string; id?: string; entry?: string }>
}) {
  const params = await searchParams
  const country = (await headers()).get('x-vercel-ip-country')
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <ApplyWizard
        initialId={params.id || ''}
        initialStep={params.step || '1'}
        entry={params.entry || 'apply_page'}
        defaultDial={dialFromCountry(country)}
      />
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
