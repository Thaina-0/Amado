import { useState } from 'react'
import { useI18n } from '../../i18n/context'
import type { EventPoster } from './events'

// why: the poster is loaded from the page that sells the event; if it fails to load (offline, removed) the screen simply goes on without it
export function EventPosterImage({ poster, name }: { poster: EventPoster; name: string }) {
  const { t } = useI18n()
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <figure className="flex flex-col items-center gap-2">
      <img
        src={poster.src}
        alt={t('events.poster.alt', { name })}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-auto max-h-112 w-auto max-w-full rounded-lg object-contain"
      />
      <figcaption className="text-center text-body-sm text-ink-secondary">
        <a
          href={poster.page}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link underline underline-offset-4"
        >
          {t('events.poster.credit', { credit: poster.credit })}
        </a>
      </figcaption>
    </figure>
  )
}
