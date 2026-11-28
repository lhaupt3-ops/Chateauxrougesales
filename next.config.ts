import path from 'path'
import { fileURLToPath } from 'url'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import { scopeClientHintHeaders } from './src/lib/client-hint-headers'

/** Payload adds Accept-CH and Critical-CH on `/:path*`. Chrome then retries the first visit with a same-URL 307. Admin theme still needs the hint. */
function scopeClientHintsToAdmin(config: NextConfig): NextConfig {
  const previous = config.headers
  return {
    ...config,
    async headers() {
      const rules = (await previous?.()) ?? []
      return scopeClientHintHeaders(rules)
    },
  }
}

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/brand/**' },
      { pathname: '/images/**' },
    ],
    remotePatterns: [
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '**.blob.vercel-storage.com' },
    ],
  },
  // Keep metadata in the <head> for AI crawlers that do not run JavaScript.
  htmlLimitedBots: /GPTBot|ChatGPT-User|ClaudeBot|PerplexityBot|Googlebot|Bingbot|Applebot|Twitterbot|Slackbot|LinkedInBot|facebookexternalhit|Discordbot/,
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default scopeClientHintsToAdmin(withPayload(nextConfig, { devBundleServerPackages: false }))
