'use client'

import { useState } from 'react'
import { track } from '@/components/analytics/track'

export function ConfirmationActions({
  applicationId,
  start = '',
  videoUrl = '',
  videoOnly = false,
}: {
  applicationId: string
  start?: string
  videoUrl?: string
  videoOnly?: boolean
}) {
  const [playing, setPlaying] = useState(false)

  if (videoOnly) {
    return (
      <div className="mt-4">
        {!playing && (
          <button
            type="button"
            className="h-12 rounded-full bg-ink px-5 text-sm text-ivory"
            onClick={() => {
              setPlaying(true)
              track('confirmation_video_played', { video_id: 'intro', percent: 0 })
            }}
          >
            Play the intro
          </button>
        )}
        {playing && videoUrl && <Video url={videoUrl} />}
        {playing && !videoUrl && (
          <p className="mt-3 rounded-2xl border border-dashed border-gold p-4 text-sm text-muted">
            Placeholder. Add the intro video URL in Site settings. The play event is already wired.
          </p>
        )}
      </div>
    )
  }

  const google = start
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Chateaux Rouge sales call')}&dates=${toGoogle(start)}/${toGoogle(addMinutes(start, 30))}`
    : ''
  const outlook = start
    ? `https://outlook.live.com/calendar/0/action/compose?subject=${encodeURIComponent('Chateaux Rouge sales call')}&startdt=${encodeURIComponent(start)}`
    : ''

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {google && (
        <a className="rounded-full border border-stone px-4 py-2 text-sm" href={google} onClick={() => track('calendar_added', { provider: 'google' })}>
          Google
        </a>
      )}
      {outlook && (
        <a className="rounded-full border border-stone px-4 py-2 text-sm" href={outlook} onClick={() => track('calendar_added', { provider: 'outlook' })}>
          Outlook
        </a>
      )}
      <a className="rounded-full border border-stone px-4 py-2 text-sm" href={`/api/apply/ics?id=${applicationId}`} onClick={() => track('calendar_added', { provider: 'ics' })}>
        .ics file
      </a>
    </div>
  )
}

function Video({ url }: { url: string }) {
  const youtube = url.includes('youtube.com') || url.includes('youtu.be')
  if (youtube) {
    const id = url.includes('youtu.be/') ? url.split('youtu.be/')[1]?.split('?')[0] : new URL(url).searchParams.get('v')
    return (
      <iframe
        className="mt-4 aspect-video w-full rounded-2xl"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title="Intro from your strategist"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    )
  }
  return (
    <video
      className="mt-4 w-full rounded-2xl"
      controls
      src={url}
      onEnded={() => track('confirmation_video_completed', { video_id: 'intro', percent: 100 })}
    />
  )
}

function toGoogle(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60 * 1000).toISOString()
}
