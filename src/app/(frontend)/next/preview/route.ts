import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (!process.env.PREVIEW_SECRET || searchParams.get('secret') !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid preview secret', { status: 401 })
  }
  const path = searchParams.get('path') || '/blog'
  const draft = await draftMode()
  draft.enable()
  redirect(path.startsWith('/') ? path : '/blog')
}
