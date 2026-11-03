import { ExternalLink, Info } from 'lucide-react'
import { navigate, goBack } from '../../app/navigation'
import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import { localized } from '../../i18n/i18n'
import { Alert } from '../../ui/Alert'
import { BUTTON, BUTTON_PRIMARY, BUTTON_SECONDARY } from '../../ui/classes'
import { TopBar } from '../../ui/TopBar'
import { mapsUrl } from './maps'
import type { Place } from './places'
import { Page } from '../../ui/Page'

export function DirectionsScreen({ place }: { place: Place }) {
  const { t, language } = useI18n()
  return (
    <Page>
      <TopBar title={t('directions.title')} onBack={goBack} />
      <div className="flex flex-col gap-1">
        <h2 className="text-h1">{place.name}</h2>
        <p className="text-ink-secondary">{localized(place.summary, language)}</p>
      </div>
      <Alert tone="info" icon={Info} title={t('directions.notice.title')}>
        {t('directions.notice.text')}
      </Alert>
      <div className="flex flex-col gap-3">
        <div className="flex">
          <a
            href={mapsUrl(place)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BUTTON} ${BUTTON_PRIMARY}`}
          >
            <ExternalLink aria-hidden="true" size={24} />
            {t('directions.open')}
          </a>
        </div>
        <p className="text-body-sm text-ink-secondary">{t('directions.needsInternet')}</p>
        <div className="flex">
          <a
            href={toHash({ name: 'place', id: place.id })}
            onClick={(event) => {
              event.preventDefault()
              navigate({ name: 'place', id: place.id })
            }}
            className={`${BUTTON} ${BUTTON_SECONDARY}`}
          >
            {t('directions.back')}
          </a>
        </div>
      </div>
    </Page>
  )
}
