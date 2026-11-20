import { HomePage } from '@/components/home/HomePage'
import { getFaqs, getPublishedProof } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'
import { SEO } from '@/lib/seo-titles'
import { getFunnel } from '@/lib/funnel-copy'
import { getSettings } from '@/lib/settings'

export const metadata = pageMetadata({
  title: SEO.home.title,
  description: SEO.home.description,
  path: '/',
})

export default async function Page() {
  const [settings, faqs, proof, funnel] = await Promise.all([getSettings(), getFaqs('home'), getPublishedProof(), getFunnel()])
  return <HomePage settings={settings} faqs={faqs} proof={proof} funnel={funnel} />
}
