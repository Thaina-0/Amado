import { navigate } from '../../app/navigation'
import type { ExploreCategory } from '../../app/routes'
import { STAGGER, stagger } from '../../ui/classes'
import { useI18n } from '../../i18n/context'
import { TopBar } from '../../ui/TopBar'
import { CircuitCard } from '../circuits/CircuitCard'
import { CIRCUITS } from '../circuits/circuits'
import { filterPlaces, type Place } from '../places/places'
import { PlaceCard } from '../places/PlaceCard'
import { ErrorBlock, LoadingBlocks } from '../places/PlacesStatus'
import { loadPlaces } from '../places/source'
import { usePlaces } from '../places/usePlaces'
import { CATEGORY_LABEL } from './categoryLabels'
import { Page } from '../../ui/Page'

function Places({
  category,
  load,
}: {
  category: Exclude<ExploreCategory, 'circuitos'>
  load: () => Promise<readonly Place[]>
}) {
  const { t, language } = useI18n()
  const [state, retry] = usePlaces(load)
  if (state.status === 'loading') return <LoadingBlocks />
  if (state.status === 'error') return <ErrorBlock onRetry={retry} />
  const places = filterPlaces(state.places, { category, query: '', language })
  if (places.length === 0) {
    return (
      <p className="rounded-lg border-2 border-dashed border-line p-4 text-ink-secondary">
        {t('nearby.empty.title')}
      </p>
    )
  }
  return (
    <ul className="flex flex-col gap-3">
      {places.map((place, index) => (
        <li key={place.id} className={STAGGER} style={stagger(index)}>
          <PlaceCard place={place} />
        </li>
      ))}
    </ul>
  )
}

export function ExploreCategoryScreen({
  category,
  load = loadPlaces,
}: {
  category: ExploreCategory
  load?: () => Promise<readonly Place[]>
}) {
  const { t } = useI18n()
  return (
    <Page>
      <TopBar title={t(CATEGORY_LABEL[category])} onBack={() => navigate({ name: 'explore' })} />
      {category === 'circuitos' ? (
        <ul className="flex flex-col gap-3">
          {CIRCUITS.map((circuit, index) => (
            <li key={circuit.id} className={STAGGER} style={stagger(index)}>
              <CircuitCard circuit={circuit} />
            </li>
          ))}
        </ul>
      ) : (
        <Places category={category} load={load} />
      )}
    </Page>
  )
}
