import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/logo-mark.png' },
      { pathname: '/logo-mark.svg' },
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

export default withPayload(nextConfig, { devBundleServerPackages: false })
