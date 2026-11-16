import { getPayloadClient } from '@/lib/payload'

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') || ''
  if (!token) return new Response('Missing unsubscribe token.', { status: 400 })
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'applications',
    where: { unsubscribeToken: { equals: token } },
    limit: 20,
    overrideAccess: true,
    depth: 0,
  })
  if (!found.docs.length) return new Response('This unsubscribe link is not recognised.', { status: 404 })
  const email = found.docs[0]?.email
  if (email) {
    const same = await payload.find({
      collection: 'applications',
      where: { email: { equals: email } },
      limit: 50,
      overrideAccess: true,
      depth: 0,
    })
    for (const doc of same.docs) {
      await payload.update({
        collection: 'applications',
        id: doc.id,
        overrideAccess: true,
        data: { emailUnsubscribed: true },
      })
    }
  }
  return new Response(
    '<!doctype html><title>Unsubscribed</title><body style="font-family:Inter,Arial,sans-serif;background:#F6F3EE;color:#1C1C1C;padding:48px"><img src="https://chateauxrouge.com/brand/transparent/lockup-horizontal-light.png" width="240" height="56" alt="Chateaux Rouge"><h1>You are unsubscribed.</h1><p>We will not send the nurture or follow-up sequence to this address.</p></body>',
    { headers: { 'content-type': 'text/html; charset=utf-8' } },
  )
}

export async function POST(request: Request) {
  return GET(request)
}
