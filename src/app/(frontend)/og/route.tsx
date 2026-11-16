import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get('title') || 'Chateaux Rouge').slice(0, 140)
  const eyebrow = (searchParams.get('eyebrow') || 'Sales team as a service').slice(0, 80)
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f7f3ee',
          color: '#111114',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#b3122e', fontSize: 28 }}>
          <div style={{ width: 36, height: 28, background: '#b3122e', borderRadius: 6 }} />
          Chateaux Rouge
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', color: '#5e0b1a' }}>{eyebrow}</div>
          <div style={{ marginTop: 16, fontSize: 68, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 980 }}>{title}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
