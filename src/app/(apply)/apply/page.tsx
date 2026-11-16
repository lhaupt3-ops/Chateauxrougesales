import { headers } from 'next/headers'
import Link from 'next/link'
import { ApplyWizard } from '@/components/apply/ApplyWizard'
import { pageMetadata } from '@/lib/metadata'
import { dialFromCountry } from '@/lib/options'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
  title: 'See if we are a fit · Chateaux Rouge',
  description: 'A short application. We look for an honest fit. A no is a useful answer, and you can book only if the fit is there.',
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
