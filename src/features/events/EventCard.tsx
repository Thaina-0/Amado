import { CalendarDays, MapPin } from 'lucide-react'
import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import { localized } from '../../i18n/i18n'
import { PRESS } from '../../ui/classes'
import { Tag } from '../../ui/Tag'
import { formatEventDate, isOver, type CityEvent } from './events'
import { EVENT_CATEGORY_KEY } from './labels'

export function EventCard({ event, today }: { event: CityEvent; today: string }) {
  const { t, language } = useI18n()
  return (
    <a
      href={toHash({ name: 'event', id: event.id })}
      className={`box-border flex flex-col gap-2 rounded-lg border border-line-subtle bg-surface p-4 text-ink no-underline hover:bg-subtle ${PRESS}`}
    >
      <span className="text-body-sm font-semibold text-ink-secondary">
        {t(EVENT_CATEGORY_KEY[event.category])}
      </span>
      <span className="text-title">{event.name}</span>
      <span className="flex items-start gap-2 text-body-sm">
        <CalendarDays aria-hidden="true" size={20} className="mt-0.5 flex-none" />
        {formatEventDate(event, language)}
      </span>
      <span className="flex items-start gap-2 text-body-sm">
        <MapPin aria-hidden="true" size={20} className="mt-0.5 flex-none" />
        {event.venue ?? t('events.venue.none')}
      </span>
      <span className="text-body-sm text-ink-secondary">{localized(event.summary, language)}</span>
      {event.dateStatus === 'expected' && <Tag>{t('events.status.expected')}</Tag>}
      {event.dateStatus === 'open' && <Tag>{t('events.status.open')}</Tag>}
      {isOver(event, today) && <Tag>{t('events.status.past')}</Tag>}
    </a>
  )
}
