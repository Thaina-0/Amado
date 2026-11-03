import { MapPin } from 'lucide-react'
import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import { localized } from '../../i18n/i18n'
import { PRESS } from '../../ui/classes'
import { Tag } from '../../ui/Tag'
import type { Place } from './places'
import { PHOTO_SIZES, photoImage } from './photoImage'

export function PlaceCard({ place }: { place: Place }) {
  const { t, language } = useI18n()
  return (
    <a
      className={`box-border flex flex-col gap-2 rounded-lg border border-line-subtle bg-surface p-4 text-ink no-underline hover:bg-subtle ${PRESS}`}
      href={toHash({ name: 'place', id: place.id })}
    >
      {place.photos[0] && (
        <img
          {...photoImage(place.photos[0].src)}
          sizes={PHOTO_SIZES}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-video w-full rounded-md bg-subtle object-cover"
        />
      )}
      <span className="text-title">{place.name}</span>
      <span className="text-body-sm text-ink-secondary">{localized(place.summary, language)}</span>
      <span className="flex flex-wrap items-center gap-3 text-body-sm">
        <span className="flex items-center gap-1">
          <MapPin aria-hidden="true" size={20} />
          {t('common.noDistance')}
        </span>
        <Tag>{t('common.example')}</Tag>
      </span>
    </a>
  )
}
