import { MapPin, Navigation } from 'lucide-react'
import { goBack } from '../../app/navigation'
import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import { localized } from '../../i18n/i18n'
import { BUTTON, BUTTON_PRIMARY, BUTTON_SECONDARY } from '../../ui/classes'
import { Tag } from '../../ui/Tag'
import { TopBar } from '../../ui/TopBar'
import { ReviewForm } from '../reviews/ReviewForm'
import { PhotoCarousel } from './PhotoCarousel'
import type { Place } from './places'
import { ExternalLinkItem } from '../../ui/ExternalLinkItem'
import { Page } from '../../ui/Page'

export function PlaceScreen({ place }: { place: Place }) {
  const { t, language } = useI18n()
  return (
    <Page>
      <TopBar title={t('place.title')} onBack={goBack} />
      <PhotoCarousel place={place} />
      <div className="flex flex-col gap-1">
        <Tag>{t('common.example')}</Tag>
        <h2 className="text-h1">{place.name}</h2>
        <p className="text-ink-secondary">{localized(place.summary, language)}</p>
      </div>
      <div className="flex">
        {place.category === 'esportes' ? (
          <a
            href={toHash({ name: 'sport-spots', id: place.id })}
            className={`${BUTTON} ${BUTTON_PRIMARY}`}
          >
            <MapPin aria-hidden="true" size={24} />
            {t('place.whereToPractise')}
          </a>
        ) : (
          <a
            href={toHash({ name: 'directions', id: place.id })}
            className={`${BUTTON} ${BUTTON_SECONDARY}`}
          >
            <Navigation aria-hidden="true" size={24} />
            {t('place.directions')}
          </a>
        )}
      </div>
      {place.details && (
        <section aria-labelledby="about-title" className="flex flex-col gap-2">
          <h3 id="about-title" className="text-h3">
            {t('place.about')}
          </h3>
          {localized(place.details, language)
            .split('\n\n')
            .map((paragraph) => (
              <p key={paragraph} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          {place.sources && (
            <>
              <p className="text-body-sm text-ink-secondary">{t('place.unconfirmed')}</p>
              <ul className="flex flex-col gap-1 text-body-sm" aria-label={t('place.source')}>
                {place.sources.map((url) => (
                  <ExternalLinkItem key={url} href={url} label={t('place.source')} />
                ))}
              </ul>
            </>
          )}
        </section>
      )}
      <ReviewForm placeId={place.id} />
    </Page>
  )
}
