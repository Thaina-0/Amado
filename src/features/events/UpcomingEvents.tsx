import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import { STAGGER, stagger } from '../../ui/classes'
import { ListRow } from '../../ui/ListRow'
import { EventCard } from './EventCard'
import { EVENTS } from './data'
import { dayKey, filterEvents, sortEvents } from './events'

const PREVIEW = 3

export function UpcomingEvents({ now }: { now: Date }) {
  const { t, language } = useI18n()
  const today = dayKey(now)
  const next = sortEvents(
    filterEvents(EVENTS, { category: 'all', preset: 'any', picked: '', showPast: false, today }),
    'soonest',
    language,
  ).slice(0, PREVIEW)

  return (
    <section aria-labelledby="home-events-title" className="flex flex-col gap-3">
      <h2 id="home-events-title" className="text-h3">
        {t('events.home.title')}
      </h2>
      {next.length === 0 ? (
        <p className="rounded-lg border-2 border-dashed border-line p-4 text-ink-secondary">
          {t('events.home.empty')}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {next.map((event, index) => (
            <li key={event.id} className={STAGGER} style={stagger(index)}>
              <EventCard event={event} today={today} />
            </li>
          ))}
        </ul>
      )}
      <ListRow label={t('events.home.all')} value="" href={toHash({ name: 'events' })} />
    </section>
  )
}
