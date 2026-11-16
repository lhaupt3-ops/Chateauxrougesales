import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import { CHARCOAL, IVORY, ROUGE } from '@/lib/brand'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get('title') || 'Chateaux Rouge').slice(0, 140)
  const eyebrow = (searchParams.get('eyebrow') || 'Sales and closing').slice(0, 80)
  const lockup = await readFile(path.join(process.cwd(), 'public/brand/transparent/lockup-horizontal-light.png'))
  const src = `data:image/png;base64,${lockup.toString('base64')}`
  // Satori renders a plain img, not next/image.
  // eslint-disable-next-line @next/next/no-img-element
  const logo = <img src={src} alt="Chateaux Rouge" width={320} height={75} />
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: IVORY,
          color: CHARCOAL,
          padding: 72,
        }}
      >
        {logo}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', color: ROUGE }}>{eyebrow}</div>
          <div style={{ marginTop: 16, fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 980 }}>{title}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
