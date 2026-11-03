import { Flame, Heart, Plus, Shield, TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useI18n } from '../../i18n/context'
import type { MessageKey } from '../../i18n/i18n'
import { toHash } from '../../app/routes'
import { Alert } from '../../ui/Alert'
import { PRESS } from '../../ui/classes'
import { ListRow } from '../../ui/ListRow'
import { getPosition } from './location'
import { EMERGENCY_NUMBERS, serviceNames, telHref } from './numbers'
import { PlaceRow } from './PlaceRow'
import { ShareLocation } from './ShareLocation'
import {
  formatDistance,
  nearestPlaces,
  orderWithoutPosition,
  type EmergencyPlace,
  type RankedPlace,
} from './places'
import { EMERGENCY_PLACES } from './data'
import { Page } from '../../ui/Page'

const SERVICE_ICON: Record<string, LucideIcon> = {
  police: Shield,
  ambulance: Plus,
  fire: Flame,
  'women-violence': Heart,
  'civil-defense': TriangleAlert,
}

const CATEGORY_KEY: Record<EmergencyPlace['category'], MessageKey> = {
  police: 'cat.police',
  hospital: 'cat.hospital',
  upa: 'cat.upa',
  fire: 'cat.fire',
}

type Lookup =
  { status: 'pending' } | { status: 'ready'; rows: RankedPlace[] } | { status: 'no-position' }

function subscribeOnline(onChange: () => void) {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

function useOnline(): boolean {
  return useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  )
}

// invariant: only the ranked rows are kept; the coordinates die inside this promise chain
function useNearbyLookup(places: readonly EmergencyPlace[]): Lookup {
  const [initialPlaces] = useState(places)
  const [lookup, setLookup] = useState<Lookup>({ status: 'pending' })
  const request = useRef<Promise<Lookup> | null>(null)

  useEffect(() => {
    // why: with nothing to order there is no reason to ask for the position (AD-017)
    if (initialPlaces.length === 0) return
    // why: StrictMode runs this effect twice; sharing one request keeps it to a single position ask
    request.current ??= getPosition().then(
      (position): Lookup => ({ status: 'ready', rows: nearestPlaces(initialPlaces, position) }),
      (): Lookup => ({ status: 'no-position' }),
    )
    let active = true
    void request.current.then((result) => {
      if (active) setLookup(result)
    })
    return () => {
      active = false
    }
  }, [initialPlaces])

  return lookup
}

function EmergencyPlaceRow({ place, meters }: { place: EmergencyPlace; meters?: number }) {
  const { t } = useI18n()
  const detail = [
    t(CATEGORY_KEY[place.category]),
    meters === undefined ? undefined : formatDistance(meters),
    place.hours,
  ]
    .filter(Boolean)
    .join(', ')
  return <PlaceRow name={place.name} detail={detail} phone={place.phone} coordinates={place} />
}

function Nearby({ places, lookup }: { places: readonly EmergencyPlace[]; lookup: Lookup }) {
  const { t } = useI18n()
  if (places.length === 0) {
    return (
      <p className="rounded-lg border-2 border-dashed border-line p-4 text-ink-secondary">
        {t('emergency.empty')}
      </p>
    )
  }
  if (lookup.status === 'pending') {
    return (
      <div className="flex flex-col gap-3" role="status" aria-label={t('emergency.loading')}>
        {[0, 1, 2].map((bar) => (
          <span key={bar} className="block h-28 rounded-lg bg-subtle" aria-hidden="true" />
        ))}
      </div>
    )
  }
  if (lookup.status === 'no-position') {
    return (
      <>
        <p className="mb-3 text-ink-secondary">{t('emergency.noPosition')}</p>
        <ul className="flex flex-col gap-3" aria-label={t('emergency.listLabel')}>
          {orderWithoutPosition(places).map((place) => (
            <EmergencyPlaceRow key={place.id} place={place} />
          ))}
        </ul>
      </>
    )
  }
  return (
    <ul className="flex flex-col gap-3" aria-label={t('emergency.listLabel')}>
      {lookup.rows.map(({ place, meters }) => (
        <EmergencyPlaceRow key={place.id} place={place} meters={meters} />
      ))}
    </ul>
  )
}

export function EmergencyScreen({
  places = EMERGENCY_PLACES,
}: {
  places?: readonly EmergencyPlace[]
}) {
  const { t, language } = useI18n()
  const online = useOnline()
  const lookup = useNearbyLookup(places)

  return (
    <Page bottomInset>
      <header>
        <h1 className="text-h1">{t('emergency.title')}</h1>
        <p className="mt-1 text-ink-secondary">{t('emergency.lead')}</p>
      </header>

      {!online && (
        <Alert
          tone="emergency"
          icon={TriangleAlert}
          title={t('emergency.offline.title')}
          role="alert"
        >
          {t('emergency.offline.text')}
        </Alert>
      )}

      <ul className="flex flex-col gap-3" aria-label={t('emergency.numbersLabel')}>
        {EMERGENCY_NUMBERS.map((item) => {
          const Icon = SERVICE_ICON[item.service] ?? TriangleAlert
          const names = serviceNames(item.service, language)
          return (
            <li key={item.number}>
              <a
                className={`box-border flex min-h-18 items-center gap-3 rounded-lg bg-emergency px-4 py-3 text-on-emergency no-underline hover:bg-emergency-hover active:bg-emergency-pressed ${PRESS}`}
                href={telHref(item.number)}
              >
                <Icon aria-hidden="true" size={32} className="flex-none" />
                <span className="flex flex-1 flex-col">
                  <span className="text-title">{names.title}</span>
                  <span className="text-body-sm">{names.subtitle}</span>
                </span>
                <span className="text-numeric">{item.number}</span>
              </a>
            </li>
          )
        })}
      </ul>

      <ListRow
        label={t('emergency.show')}
        value={t('emergency.show.hint')}
        href={toHash({ name: 'emergency-show' })}
      />

      <ShareLocation />

      <section aria-labelledby="nearby-title">
        <h2 id="nearby-title" className="mt-2 mb-3 text-h3">
          {t('emergency.nearby')}
        </h2>
        <Nearby places={places} lookup={lookup} />
      </section>

      <ListRow label={t('emergency.everyday')} value="" href={toHash({ name: 'everyday' })} />
    </Page>
  )
}
