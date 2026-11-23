import { IBM_Plex_Sans, Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  variable: '--font-inter',
})

export const display = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['500', '600'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  variable: '--font-display',
})

export const fontVariables = `${inter.variable} ${display.variable}`
