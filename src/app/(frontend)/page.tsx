import { HomePage } from '@/components/home/HomePage'
import { getFaqs, getPublishedProof } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'
import { getSettings } from '@/lib/settings'

export const metadata = pageMetadata({
  title: 'Chateaux Rouge · Sales team, installed and run',
  description: 'A managed high-ticket sales team: setters, closers and a sales lead. The calls look for the truth. A no is an acceptable answer.',
  path: '/',
})

export default async function Page() {
  const [settings, faqs, proof] = await Promise.all([getSettings(), getFaqs('home'), getPublishedProof()])
  return <HomePage settings={settings} faqs={faqs} proof={proof} />
}
