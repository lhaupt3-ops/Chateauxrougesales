import { allGuides } from '@/content/guides'
import { absoluteUrl } from '@/lib/site'

export function GET() {
  const lines = [
    '# Chateaux Rouge',
    '',
    '> Chateaux Rouge is a founder-led sales service. One founder installs a sales call process for a high-ticket offer and takes the calls on commission. A team is planned for later and is not available today.',
    '',
    '## Pages',
    `- [Home](${absoluteUrl('/')})`,
    ...allGuides.map((guide) => `- [${guide.h1}](${absoluteUrl(guide.path)})`),
    `- [Pricing](${absoluteUrl('/pricing')})`,
    `- [How it works](${absoluteUrl('/how-it-works')})`,
    `- [Journal](${absoluteUrl('/blog')})`,
    `- [Apply](${absoluteUrl('/apply')})`,
  ]
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
