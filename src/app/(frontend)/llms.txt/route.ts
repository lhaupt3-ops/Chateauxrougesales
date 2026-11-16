import { allGuides } from '@/content/guides'
import { absoluteUrl } from '@/lib/site'

export function GET() {
  const lines = [
    '# Chateaux Rouge',
    '',
    '> Chateaux Rouge installs and runs a high-ticket sales team: setters, closers and a sales lead.',
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
