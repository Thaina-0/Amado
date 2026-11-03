import { MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { goBack } from '../../app/navigation'
import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import { BUTTON, BUTTON_SECONDARY } from '../../ui/classes'
import { Chip } from '../../ui/Chip'
import { ChipRow } from '../../ui/ChipRow'
import { TopBar } from '../../ui/TopBar'
import { getPosition } from '../emergency/location'
import { formatDistance } from '../emergency/places'
import { PlaceRow } from '../emergency/PlaceRow'
import { LoadingBlocks } from '../places/PlacesStatus'
import { EVERYDAY_PROVIDERS } from './data'
import {
  orderWithoutPosition,
  PROVIDER_CATEGORIES,
  rankProviders,
  type EverydayProvider,
  type ProviderCategory,
  type RankedProvider,
} from './providers'
import { Page } from '../../ui/Page'

type Lookup =
  { status: 'pending' } | { status: 'ready'; rows: RankedProvider[] } | { status: 'no-position' }

// invariant: only the ranked rows are kept; the coordinates die inside this promise chain
function useProviderLookup(providers: readonly EverydayProvider[]): Lookup {
  const [initialProviders] = useState(providers)
  const [lookup, setLookup] = useState<Lookup>({ status: 'pending' })
  const request = useRef<Promise<Lookup> | null>(null)

  useEffect(() => {
    // why: with nothing to order there is no reason to ask for the position
    if (initialProviders.length === 0) return
    // why: StrictMode runs this effect twice; sharing one request keeps it to a single position ask
    request.current ??= getPosition().then(
      (position): Lookup => ({ status: 'ready', rows: rankProviders(initialProviders, position) }),
      (): Lookup => ({ status: 'no-position' }),
    )
    let active = true
    void request.current.then((result) => {
      if (active) setLookup(result)
    })
    return () => {
      active = false
    }
  }, [initialProviders])

  return lookup
}

function ProviderRow({ row }: { row: RankedProvider }) {
  const { t } = useI18n()
  const { provider, meters } = row
  const detail = [
    t(`everyday.cat.${provider.category}`),
    meters === undefined ? undefined : formatDistance(meters),
    provider.open24h ? t('everyday.open24h') : undefined,
    provider.hours,
  ]
    .filter(Boolean)
    .join(', ')
  return (
    <PlaceRow name={provider.name} detail={detail} phone={provider.phone} coordinates={provider} />
  )
}

export function EverydayScreen({
  providers = EVERYDAY_PROVIDERS,
}: {
  providers?: readonly EverydayProvider[]
}) {
  const { t } = useI18n()
  const [filter, setFilter] = useState<'all' | ProviderCategory>('all')
  const lookup = useProviderLookup(providers)
  const pending = providers.length > 0 && lookup.status === 'pending'
  const rows = lookup.status === 'ready' ? lookup.rows : orderWithoutPosition(providers)
  const visible = rows.filter((row) => filter === 'all' || row.provider.category === filter)

  return (
    <Page>
      <TopBar title={t('everyday.title')} onBack={goBack} />
      <p className="text-ink-secondary">{t('everyday.lead')}</p>
      <a className={`${BUTTON} ${BUTTON_SECONDARY}`} href={toHash({ name: 'emergency' })}>
        <MapPin aria-hidden="true" size={24} />
        {t('everyday.emergencyLink')}
      </a>

      <ChipRow label={t('everyday.filterLabel')}>
        {(['all', ...PROVIDER_CATEGORIES] as const).map((option) => (
          <Chip
            key={option}
            label={option === 'all' ? t('filter.all') : t(`everyday.cat.${option}`)}
            selected={filter === option}
            onSelect={() => setFilter(option)}
          />
        ))}
      </ChipRow>

      {pending && <LoadingBlocks />}
      {!pending && visible.length === 0 && (
        <div className="flex flex-col gap-2 rounded-lg border-2 border-dashed border-line p-4">
          <p className="text-title">{t('everyday.empty.title')}</p>
          <p className="text-ink-secondary">{t('everyday.empty.text')}</p>
        </div>
      )}
      {!pending && lookup.status === 'no-position' && visible.length > 0 && (
        <p className="text-ink-secondary">{t('emergency.noPosition')}</p>
      )}
      {!pending && visible.length > 0 && (
        <ul className="flex flex-col gap-3" aria-label={t('everyday.listLabel')}>
          {visible.map((row) => (
            <ProviderRow key={row.provider.id} row={row} />
          ))}
        </ul>
      )}
    </Page>
  )
}
