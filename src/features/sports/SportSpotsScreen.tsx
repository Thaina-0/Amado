import { ExternalLink, Info, MapPin } from 'lucide-react'
import { goBack } from '../../app/navigation'
import { useI18n } from '../../i18n/context'
import { localized } from '../../i18n/i18n'
import { Alert } from '../../ui/Alert'
import { BUTTON, BUTTON_SECONDARY, STAGGER, stagger } from '../../ui/classes'
import { TopBar } from '../../ui/TopBar'
import { providerMapsUrl } from '../places/maps'
import type { Place } from '../places/places'
import { providersFor, type SportProvider } from './providers'
import { ExternalLinkItem } from '../../ui/ExternalLinkItem'
import { Page } from '../../ui/Page'

function ProviderCard({ provider }: { provider: SportProvider }) {
  const { t, language } = useI18n()
  return (
    <article className="box-border flex flex-col gap-3 rounded-lg border border-line-subtle bg-surface p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-title">{provider.name}</h3>
        <p>{localized(provider.offer, language)}</p>
        <p className="flex items-center gap-1 text-body-sm text-ink-secondary">
          <MapPin aria-hidden="true" size={20} className="flex-none" />
          {provider.address ?? provider.area}
        </p>
        {provider.caveat && (
          <p className="text-body-sm text-ink-secondary">{localized(provider.caveat, language)}</p>
        )}
      </div>
      <div className="flex">
        <a
          href={providerMapsUrl(provider)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${BUTTON} ${BUTTON_SECONDARY}`}
        >
          <ExternalLink aria-hidden="true" size={24} />
          {t('spots.map')}
          <span className="sr-only">: {provider.name}</span>
        </a>
      </div>
      <ul className="flex flex-col text-body-sm" aria-label={t('place.source')}>
        {provider.website && (
          <ExternalLinkItem
            href={provider.website}
            label={t('spots.site')}
            context={provider.name}
          />
        )}
        {provider.sources.map((url) => (
          <ExternalLinkItem
            key={url}
            href={url}
            label={t('place.source')}
            context={provider.name}
          />
        ))}
      </ul>
    </article>
  )
}

export function SportSpotsScreen({ place }: { place: Place }) {
  const { t } = useI18n()
  const providers = providersFor(place.id)
  return (
    <Page>
      <TopBar title={t('spots.title')} onBack={goBack} />
      <h2 className="text-h1">{place.name}</h2>
      <Alert tone="info" icon={Info} title={t('spots.notice.title')}>
        {t('spots.notice.text')}
      </Alert>
      {providers.length === 0 ? (
        <div className="flex flex-col gap-1 rounded-lg border-2 border-dashed border-line p-4">
          <p className="text-label">{t('spots.empty.title')}</p>
          <p className="text-ink-secondary">{t('spots.empty.text')}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3" aria-label={t('spots.list')}>
          {providers.map((provider, index) => (
            <li key={provider.id} className={STAGGER} style={stagger(index)}>
              <ProviderCard provider={provider} />
            </li>
          ))}
        </ul>
      )}
    </Page>
  )
}
