import { Search } from 'lucide-react'
import { useId, useState } from 'react'
import { formatToday } from '../../i18n/i18n'
import { STAGGER, stagger } from '../../ui/classes'
import { useI18n } from '../../i18n/context'
import { ProfileLink } from '../../ui/ProfileLink'
import { CircuitCard } from '../circuits/CircuitCard'
import { CIRCUITS } from '../circuits/circuits'
import { CategoryChips } from './CategoryChips'
import { filterPlaces, type CategoryFilter, type Place } from './places'
import { PlaceCard } from './PlaceCard'
import { ErrorBlock, LoadingBlocks } from './PlacesStatus'
import { loadPlaces } from './source'
import { usePlaces } from './usePlaces'
import { Page } from '../../ui/Page'
import { UpcomingEvents } from '../events/UpcomingEvents'

export function HomeScreen({
  load = loadPlaces,
  now = new Date(),
}: {
  load?: () => Promise<readonly Place[]>
  now?: Date
}) {
  const { t, language } = useI18n()
  const searchId = useId()
  const [state, retry] = usePlaces(load)
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [query, setQuery] = useState('')

  const showCircuits = category === 'all' && query.trim() === ''
  const visible =
    state.status === 'ready' ? filterPlaces(state.places, { category, query, language }) : []

  return (
    <Page>
      <header className="flex items-start gap-3">
        <div className="flex-1">
          <h1 className="text-h1">{t('home.title')}</h1>
          <p className="text-ink-secondary">{formatToday(now, language)}</p>
        </div>
        <ProfileLink />
      </header>

      <div className="flex flex-col gap-2">
        <label htmlFor={searchId} className="text-label">
          {t('home.search.label')}
        </label>
        <div className="flex min-h-14 items-center gap-3 rounded-full border-2 border-line bg-surface px-4 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-solid focus-within:outline-focus">
          <Search aria-hidden="true" size={24} className="flex-none" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('home.search.placeholder')}
            className="min-w-0 flex-1 bg-transparent text-ink placeholder:text-ink-muted outline-none"
          />
        </div>
      </div>

      <CategoryChips value={category} onChange={setCategory} />

      {showCircuits && <UpcomingEvents now={now} />}

      <section aria-labelledby="today-title">
        <h2 id="today-title" className="mb-3 text-h3">
          {t('home.section')}
        </h2>
        {showCircuits && (
          <ul className="mb-3 flex flex-col gap-3">
            {CIRCUITS.map((circuit, index) => (
              <li key={circuit.id} className={STAGGER} style={stagger(index)}>
                <CircuitCard circuit={circuit} />
              </li>
            ))}
          </ul>
        )}
        {state.status === 'loading' && <LoadingBlocks />}
        {state.status === 'error' && <ErrorBlock onRetry={retry} />}
        {state.status === 'ready' && visible.length === 0 && (
          <p className="rounded-lg border-2 border-dashed border-line p-4 text-ink-secondary">
            {t('home.empty')}
          </p>
        )}
        {visible.length > 0 && (
          <ul className="flex flex-col gap-3">
            {visible.map((place, index) => (
              <li key={place.id} className={STAGGER} style={stagger(index)}>
                <PlaceCard place={place} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </Page>
  )
}
