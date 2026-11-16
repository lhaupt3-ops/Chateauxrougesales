import { getPayloadClient } from '@/lib/payload'
import { passwordPolicyError, samePasswordError } from '@/lib/password-policy'

export async function POST(request: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user?.email || !user.id) return Response.json({ error: 'Sign in first.' }, { status: 401 })
  const body = (await request.json().catch(() => ({}))) as { password?: string }
  const password = String(body.password || '')
  const policy = passwordPolicyError(password)
  if (policy) return Response.json({ error: policy }, { status: 400 })

  let matchesCurrent = false
  try {
    await payload.login({ collection: 'users', data: { email: user.email, password } })
    matchesCurrent = true
  } catch {
    matchesCurrent = false
  }
  const same = samePasswordError(matchesCurrent)
  if (same) return Response.json({ error: same }, { status: 400 })

  await payload.update({
    collection: 'users',
    id: user.id,
    overrideAccess: true,
    user,
    context: { passwordChange: true },
    data: { password, mustChangePassword: false },
  })
  return Response.json({ ok: true })
}
