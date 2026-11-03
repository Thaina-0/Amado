import { ChevronLeft, ChevronRight, Image, Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useI18n } from '../../i18n/context'
import { PHOTO_SIZES, photoImage } from './photoImage'
import type { Place } from './places'

const AUTOPLAY_MS = 5000
const SETTLE_MS = 90

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
}

const ARROW =
  'absolute top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-line bg-surface text-ink transition-[background-color,transform] duration-150 ease-(--ease-out) hover:bg-subtle active:scale-95'

export function PhotoCarousel({ place }: { place: Place }) {
  const { t } = useI18n()
  const photos = place.photos
  const count = photos.length
  const trackRef = useRef<HTMLDivElement>(null)
  const settleRef = useRef<number | undefined>(undefined)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const [held, setHeld] = useState(false)

  const goTo = useCallback(
    (next: number) => {
      const target = (next + count) % count
      setIndex(target)
      const track = trackRef.current
      track?.scrollTo?.({
        left: target * track.clientWidth,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    },
    [count],
  )

  useEffect(() => {
    if (!playing || held || count < 2) return
    const timer = window.setInterval(() => {
      if (!document.hidden) goTo(index + 1)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [playing, held, count, index, goTo])

  useEffect(() => () => window.clearTimeout(settleRef.current), [])

  if (count === 0) {
    return (
      <div
        role="img"
        aria-label={t('photos.none')}
        className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg bg-subtle p-4 text-center text-ink-secondary"
      >
        <Image aria-hidden="true" size={32} />
        <span>{t('photos.none')}</span>
      </div>
    )
  }

  const current = photos[index] ?? photos[0]!

  const step = (direction: number) => {
    setPlaying(false)
    goTo(index + direction)
  }

  const settle = () => {
    window.clearTimeout(settleRef.current)
    settleRef.current = window.setTimeout(() => {
      const track = trackRef.current
      if (!track || track.clientWidth === 0) return
      setIndex(Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth))))
    }, SETTLE_MS)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') step(-1)
    if (event.key === 'ArrowRight') step(1)
  }

  return (
    <div className="flex flex-col gap-2">
      <section
        aria-roledescription="carousel"
        aria-label={t('photos.label', { name: place.name })}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
        className="relative overflow-hidden rounded-lg bg-subtle"
      >
        <div
          ref={trackRef}
          onScroll={settle}
          onPointerDown={() => setPlaying(false)}
          aria-live={playing && !held ? 'off' : 'polite'}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo, position) => (
            <div
              key={photo.src}
              role="group"
              aria-roledescription="slide"
              aria-label={t('photos.slide', { n: String(position + 1), total: String(count) })}
              aria-hidden={position === index ? undefined : true}
              className="w-full flex-none snap-center"
            >
              <img
                {...photoImage(photo.src)}
                sizes={PHOTO_SIZES}
                alt={t('photos.alt', { name: place.name })}
                loading={position === 0 ? 'eager' : 'lazy'}
                fetchPriority={position === 0 ? 'high' : 'auto'}
                decoding="async"
                draggable={false}
                className="aspect-16/10 w-full object-cover"
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label={t('photos.prev')}
              onClick={() => step(-1)}
              className={`${ARROW} left-2`}
            >
              <ChevronLeft aria-hidden="true" size={24} />
            </button>
            <button
              type="button"
              aria-label={t('photos.next')}
              onClick={() => step(1)}
              className={`${ARROW} right-2`}
            >
              <ChevronRight aria-hidden="true" size={24} />
            </button>
            <button
              type="button"
              aria-label={playing ? t('photos.pause') : t('photos.play')}
              aria-pressed={!playing}
              onClick={() => setPlaying((value) => !value)}
              className="absolute top-2 right-2 flex size-12 items-center justify-center rounded-full border-2 border-line bg-surface text-ink transition-[background-color,transform] duration-150 ease-(--ease-out) hover:bg-subtle active:scale-95"
            >
              {playing ? (
                <Pause aria-hidden="true" size={20} />
              ) : (
                <Play aria-hidden="true" size={20} />
              )}
            </button>
            <div
              aria-hidden="true"
              className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-surface/90 px-3 py-2"
            >
              {photos.map((photo, position) => (
                <span
                  key={photo.src}
                  className={`size-2 rounded-full bg-ink transition-opacity duration-200 ${
                    position === index ? 'opacity-100' : 'opacity-30'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <p className="text-body-sm text-ink-secondary">
        {current.illustrative && <span>{t('photos.illustrative')} · </span>}
        <a
          href={current.page}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link underline underline-offset-4"
        >
          {t('photos.credit', { author: current.author, license: current.license })}
        </a>
      </p>
    </div>
  )
}
