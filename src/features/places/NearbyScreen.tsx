import { Compass, MapPin, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { toHash } from '../../app/routes'
import { useLocationPermission } from '../../app/permission'
import { useI18n } from '../../i18n/context'
import { Alert } from '../../ui/Alert'
import { BUTTON_GHOST, BUTTON, BUTTON_SECONDARY, STAGGER, stagger } from '../../ui/classes'
import { ProfileLink } from '../../ui/ProfileLink'
import { CategoryChips } from './CategoryChips'
import { filterPlaces, type CategoryFilter, type Place } from './places'
import { PlaceCard } from './PlaceCard'
import { ErrorBlock, LoadingBlocks } from './PlacesStatus'
import { loadPlaces } from './source'
import { usePlaces } from './usePlaces'
import { Page } from '../../ui/Page'

export function NearbyScreen({ load = loadPlaces }: { load?: () => Promise<readonly Place[]> }) {
  const { t, language } = useI18n()
  const permission = useLocationPermission()
  const [state, retry] = usePlaces(load)
  const [category, setCategory] = useState<CategoryFilter>('all')

  const visible =
    state.status === 'ready' ? filterPlaces(state.places, { category, query: '', language }) : []

  return (
    <Page>
      <header className="flex items-start gap-3">
        <div className="flex-1">
          <h1 className="text-h1">{t('nearby.title')}</h1>
          <p className="text-ink-secondary">{t('nearby.subtitle')}</p>
        </div>
        <ProfileLink />
      </header>

      <CategoryChips value={category} onChange={setCategory} />

      {permission !== 'granted' && (
        <div className="flex flex-col gap-2">
          <Alert
            tone="warning"
            icon={TriangleAlert}
            title={t('nearby.nolocation.title')}
            role="status"
          >
            {t('nearby.nolocation.text')}
          </Alert>
          <a
            className={`self-center ${BUTTON_GHOST} inline-flex items-center gap-2`}
            href={toHash({ name: 'privacy' })}
          >
            <MapPin aria-hidden="true" size={20} />
            {t('nearby.nolocation.action')}
          </a>
        </div>
      )}

      {state.status === 'loading' && <LoadingBlocks />}
      {state.status === 'error' && <ErrorBlock onRetry={retry} />}
      {state.status === 'ready' && visible.length === 0 && (
        <div className="flex flex-col gap-2 rounded-lg border-2 border-dashed border-line p-4">
          <p className="text-title">{t('nearby.empty.title')}</p>
          <p className="text-ink-secondary">{t('nearby.empty.text')}</p>
          <button
            type="button"
            className={`${BUTTON} ${BUTTON_SECONDARY} self-start`}
            onClick={() => setCategory('all')}
          >
            <Compass aria-hidden="true" size={24} />
            {t('nearby.empty.action')}
          </button>
        </div>
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
    </Page>
  )
}
