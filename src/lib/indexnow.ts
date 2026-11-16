import { absoluteUrl, getSiteUrl } from './site'

export const INDEXNOW_KEY = 'a7c3e9b14f2d8e6c0b5a91d4f7e2c8b6'

export function indexNowKeyLocation(): string {
  return absoluteUrl(`/${INDEXNOW_KEY}.txt`)
}

export async function pingIndexNow(paths: string[]): Promise<void> {
  if (process.env.VERCEL_ENV !== 'production' && process.env.INDEXNOW_PING !== 'true') return
  const urlList = [...new Set(paths.filter(Boolean).map((path) => absoluteUrl(path)))]
  if (!urlList.length) return
  const host = new URL(getSiteUrl()).host
  try {
    const response = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: indexNowKeyLocation(),
        urlList,
      }),
    })
    if (!response.ok) console.error('[indexnow]', response.status)
  } catch (error) {
    console.error('[indexnow]', error)
  }
}
