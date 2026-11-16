import { HomePage } from '@/components/home/HomePage'
import { getFaqs } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'
import { getSettings } from '@/lib/settings'

export const metadata = pageMetadata({
  title: 'Chateaux Rouge · Sales team, installed and run',
  description: 'Setters, closers and a sales lead for high-ticket offers. A done-for-you sales team, from first reply to cash collected.',
  path: '/',
})

export default async function Page() {
  const [settings, faqs] = await Promise.all([getSettings(), getFaqs('home')])
  return <HomePage settings={settings} faqs={faqs} />
}
