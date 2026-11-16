import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chateaux Rouge',
    short_name: 'Chateaux Rouge',
    description: 'Outsourced high-ticket closing for founders.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F3EE',
    theme_color: '#B01430',
    icons: [
      { src: '/brand/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/favicon/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
