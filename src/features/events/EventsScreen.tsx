import { useId, useState } from 'react'
import { goBack } from '../../app/navigation'
import { useI18n } from '../../i18n/context'
import type { MessageKey } from '../../i18n/i18n'
import { BUTTON, BUTTON_SECONDARY, STAGGER, stagger } from '../../ui/classes'
import { Chip } from '../../ui/Chip'
import { ChipRow } from '../../ui/ChipRow'
import { Page } from '../../ui/Page'
import { ToggleRow } from '../../ui/ToggleRow'
import { TopBar } from '../../ui/TopBar'
import { EventCard } from './EventCard'
import { EVENT_CATEGORY_KEY } from './labels'
import { EVENTS } from './data'
import {
  DATE_PRESETS,
  dayKey,
  EVENT_CATEGORIES,
  filterEvents,
  SORT_ORDERS,
  sortEvents,
  type DatePreset,
  type EventCategoryFilter,
  type SortOrder,
} from './events'

const DATE_KEY: Record<DatePreset, MessageKey> = {
  any: 'events.date.any',
  today: 'events.date.today',
  week: 'events.date.week',
  month: 'events.date.month',
  pick: 'events.date.pick',
}

const SORT_KEY: Record<SortOrder, MessageKey> = {
  soonest: 'events.sort.soonest',
  latest: 'events.sort.latest',
  name: 'events.sort.name',
  category: 'events.sort.category',
}

const FIELD = 'box-border min-h-14 w-full rounded-lg border-2 border-line bg-surface px-4 text-ink'

export function EventsScreen({ now = new Date() }: { now?: Date }) {
  const { t, language } = useI18n()
  const dayId = useId()
  const sortId = useId()
  const [category, setCategory] = useState<EventCategoryFilter>('all')
  const [preset, setPreset] = useState<DatePreset>('any')
  const [picked, setPicked] = useState('')
  const [order, setOrder] = useState<SortOrder>('soonest')
  const [showPast, setShowPast] = useState(false)
  const today = dayKey(now)

  const visible = sortEvents(
    filterEvents(EVENTS, { category, preset, picked, showPast, today }),
    order,
    language,
  )
  const filtered = category !== 'all' || preset !== 'any' || showPast

  const clear = () => {
    setCategory('all')
    setPreset('any')
    setPicked('')
    setShowPast(false)
  }

  return (
    <Page>
      <TopBar title={t('events.title')} onBack={goBack} />
      <p className="text-ink-secondary">{t('events.lead')}</p>

      <ChipRow label={t('events.categories.label')}>
        {(['all', ...EVENT_CATEGORIES] as const).map((option) => (
          <Chip
            key={option}
            label={t(option === 'all' ? 'events.cat.all' : EVENT_CATEGORY_KEY[option])}
            selected={category === option}
            onSelect={() => setCategory(option)}
          />
        ))}
      </ChipRow>

      <ChipRow label={t('events.date.label')}>
        {DATE_PRESETS.map((option) => (
          <Chip
            key={option}
            label={t(DATE_KEY[option])}
            selected={preset === option}
            onSelect={() => setPreset(option)}
          />
        ))}
      </ChipRow>

      {preset === 'pick' && (
        <div className="flex flex-col gap-2">
          <label htmlFor={dayId} className="text-label">
            {t('events.date.input')}
          </label>
          <input
            id={dayId}
            type="date"
            value={picked}
            onChange={(event) => setPicked(event.target.value)}
            className={FIELD}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor={sortId} className="text-label">
          {t('events.sort.label')}
        </label>
        <select
          id={sortId}
          value={order}
          onChange={(event) => setOrder(event.target.value as SortOrder)}
          className={FIELD}
        >
          {SORT_ORDERS.map((option) => (
            <option key={option} value={option}>
              {t(SORT_KEY[option])}
            </option>
          ))}
        </select>
      </div>

      <ToggleRow
        label={t('events.past.label')}
        description={t('events.past.text')}
        checked={showPast}
        onChange={setShowPast}
      />

      <p className="text-label" aria-live="polite">
        {t(visible.length === 1 ? 'events.count.one' : 'events.count.many', {
          n: String(visible.length),
        })}
      </p>

      {visible.length === 0 ? (
        <div className="flex flex-col gap-3 rounded-lg border-2 border-dashed border-line p-4">
          <h2 className="text-title">{t('events.empty.title')}</h2>
          <p className="text-ink-secondary">{t('events.empty.text')}</p>
          {filtered && (
            <div className="flex">
              <button type="button" onClick={clear} className={`${BUTTON} ${BUTTON_SECONDARY}`}>
                {t('events.empty.action')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((event, index) => (
            <li key={event.id} className={STAGGER} style={stagger(index)}>
              <EventCard event={event} today={today} />
            </li>
          ))}
        </ul>
      )}

      <p className="text-body-sm text-ink-secondary">{t('events.notice')}</p>
    </Page>
  )
}
