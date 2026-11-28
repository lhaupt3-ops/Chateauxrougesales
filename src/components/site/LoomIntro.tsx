'use client'

import Image from 'next/image'
import { useState } from 'react'

const EMBED_URL = 'https://www.loom.com/embed/5c314da3dcf34157907decfa07b27e72?autoplay=1'
const SHARE_URL = 'https://www.loom.com/share/5c314da3dcf34157907decfa07b27e72'
const POSTER_SRC = '/images/loom-poster.jpg'

export function LoomIntro() {
  const [playing, setPlaying] = useState(false)

  return (
    <figure className="mt-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-stone bg-ink">
        {playing ? (
          <iframe
            src={EMBED_URL}
            title="Lasse Haupt, a 58-second introduction"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 block h-full w-full text-left"
            aria-label="Play 58-second introduction video"
          >
            <Image
              src={POSTER_SRC}
              alt="Lasse Haupt speaking in his introduction video"
              fill
              sizes="(max-width: 768px) 100vw, 48rem"
              className="object-cover transition duration-300 group-hover:scale-[1.01]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
            />
            <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rouge text-ivory transition duration-200 group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true">
                  <path d="M8 5.14v13.72L19.5 12 8 5.14z" />
                </svg>
              </span>
            </span>
            <span className="absolute bottom-3 left-3 z-10 text-sm font-medium text-ivory">58 seconds</span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-sm leading-6 text-muted">
        A short introduction, if you would rather hear me before we talk.{' '}
        <a href={SHARE_URL} target="_blank" rel="noopener noreferrer" className="underline">
          Open on Loom
        </a>
        .
      </figcaption>
    </figure>
  )
}
