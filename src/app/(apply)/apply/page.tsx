import { headers } from 'next/headers'
import { ApplyWizard } from '@/components/apply/ApplyWizard'
import { pageMetadata } from '@/lib/metadata'
import { dialFromCountry } from '@/lib/options'
import { bandsFromSettings, getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata({
  title: 'Apply for a sales team · Chateaux Rouge',
  description: 'A two-minute application. We score the fit and, if it is there, you book a call without retyping a thing.',
  path: '/apply',
})

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string; id?: string; entry?: string }>
}) {
  const params = await searchParams
  const settings = await getSettings()
  const country = (await headers()).get('x-vercel-ip-country')
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <ApplyWizard
        initialId={params.id || ''}
        initialStep={params.step || '1'}
        entry={params.entry || 'apply_page'}
        bands={bandsFromSettings(settings)}
        defaultDial={dialFromCountry(country)}
      />
    </div>
  )
}
