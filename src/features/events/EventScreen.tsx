import { CalendarDays, ExternalLink, MapPin, Users } from 'lucide-react'
import { goBack } from '../../app/navigation'
import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import { localized, type MessageKey } from '../../i18n/i18n'
import { ExternalLinkItem } from '../../ui/ExternalLinkItem'
import { ListRow } from '../../ui/ListRow'
import { Page } from '../../ui/Page'
import { Tag } from '../../ui/Tag'
import { TopBar } from '../../ui/TopBar'
import { mapsSearchUrl } from '../places/maps'
import { findPlace } from '../places/places'
import { EventPosterImage } from './EventPosterImage'
import { EventTicketsSection } from './EventTicketsSection'
import { EVENT_CATEGORY_KEY } from './labels'
import { dayKey, formatEventDate, isOver, type Admission, type CityEvent } from './events'

const ADMISSION_KEY: Record<Admission, MessageKey> = {
  free: 'events.admission.free',
  paid: 'events.admission.paid',
  registration: 'events.admission.registration',
}

export function EventScreen({ event, now = new Date() }: { event: CityEvent; now?: Date }) {
  const { t, language } = useI18n()
  const place = event.placeId ? findPlace(event.placeId) : undefined
  const text = localized(event.details ?? event.summary, language)
  // why: the address in the data already carries its own city, so the map is asked for exactly that and no other city is added
  const mapQuery = event.venue
    ? [event.venue, event.address ?? 'Ilhéus, BA'].join(', ')
    : event.address

  return (
    <Page>
      <TopBar title={t('events.detail.title')} onBack={goBack} />
      {event.poster && <EventPosterImage poster={event.poster} name={event.name} />}
      <div className="flex flex-col gap-2">
        <p className="text-body-sm font-semibold text-ink-secondary">
          {t(EVENT_CATEGORY_KEY[event.category])}
        </p>
        <h2 className="text-h1">{event.name}</h2>
        {event.dateStatus === 'expected' && <Tag>{t('events.status.expected')}</Tag>}
        {event.dateStatus === 'open' && <Tag>{t('events.status.open')}</Tag>}
        {isOver(event, dayKey(now)) && <Tag>{t('events.status.past')}</Tag>}
        {event.admission && <Tag>{t(ADMISSION_KEY[event.admission])}</Tag>}
      </div>

      <dl className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <CalendarDays aria-hidden="true" size={24} className="mt-0.5 flex-none" />
          <div>
            <dt className="text-body-sm text-ink-secondary">{t('events.detail.when')}</dt>
            <dd className="text-label">{formatEventDate(event, language)}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin aria-hidden="true" size={24} className="mt-0.5 flex-none" />
          <div>
            <dt className="text-body-sm text-ink-secondary">{t('events.detail.where')}</dt>
            <dd className="text-label">{event.venue ?? t('events.venue.none')}</dd>
            {event.address && <dd className="text-body-sm text-ink-secondary">{event.address}</dd>}
            {mapQuery && (
              <dd>
                <a
                  href={mapsSearchUrl(mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 text-link underline underline-offset-4"
                >
                  <ExternalLink aria-hidden="true" size={16} />
                  {t('events.detail.map')}
                </a>
              </dd>
            )}
          </div>
        </div>
        {event.organizer && (
          <div className="flex items-start gap-3">
            <Users aria-hidden="true" size={24} className="mt-0.5 flex-none" />
            <div>
              <dt className="text-body-sm text-ink-secondary">{t('events.detail.organizer')}</dt>
              <dd className="text-label">{event.organizer}</dd>
            </div>
          </div>
        )}
      </dl>

      <EventTicketsSection event={event} />

      {event.instagram && (
        <ul className="flex flex-col text-body-sm">
          <ExternalLinkItem href={event.instagram} label={t('events.instagram')} />
        </ul>
      )}

      <section aria-labelledby="event-about" className="flex flex-col gap-2">
        <h3 id="event-about" className="text-h3">
          {t('events.detail.about')}
        </h3>
        {text.split('\n\n').map((paragraph) => (
          <p key={paragraph} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </section>

      {place && (
        <ListRow
          label={t('events.detail.place')}
          value={place.name}
          href={toHash({ name: 'place', id: place.id })}
        />
      )}

      <p className="text-body-sm text-ink-secondary">{t('events.notice')}</p>
      <ul className="flex flex-col gap-1 text-body-sm" aria-label={t('place.source')}>
        {event.sources.map((url) => (
          <ExternalLinkItem key={url} href={url} label={t('place.source')} />
        ))}
      </ul>
    </Page>
  )
}
