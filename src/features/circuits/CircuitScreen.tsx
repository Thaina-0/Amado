import { Navigation } from 'lucide-react'
import { goBack } from '../../app/navigation'
import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import { localized } from '../../i18n/i18n'
import { BUTTON, BUTTON_PRIMARY, STAGGER, stagger } from '../../ui/classes'
import { ListRow } from '../../ui/ListRow'
import { Tag } from '../../ui/Tag'
import { TopBar } from '../../ui/TopBar'
import { findPlace } from '../places/places'
import type { Circuit } from './circuits'
import { Page } from '../../ui/Page'

export function CircuitScreen({ circuit }: { circuit: Circuit }) {
  const { t, language } = useI18n()
  const stops = circuit.stops.flatMap((id) => findPlace(id) ?? [])
  const first = stops[0]
  return (
    <Page>
      <TopBar title={t('circuit.title')} onBack={goBack} />
      <div className="flex flex-col gap-1">
        <Tag>{t('common.example')}</Tag>
        <h2 className="text-h1">{localized(circuit.title, language)}</h2>
        <p className="text-ink-secondary">{localized(circuit.summary, language)}</p>
      </div>
      <section aria-labelledby="stops-title">
        <h2 id="stops-title" className="mb-3 text-h3">
          {t('circuit.stops')}
        </h2>
        <ol className="flex flex-col gap-3">
          {stops.map((place, index) => (
            <li key={place.id} className={STAGGER} style={stagger(index)}>
              <ListRow
                label={`${index + 1}. ${place.name}`}
                value=""
                href={toHash({ name: 'place', id: place.id })}
              />
            </li>
          ))}
        </ol>
      </section>
      {first && (
        <a className={`${BUTTON} ${BUTTON_PRIMARY}`} href={toHash({ name: 'place', id: first.id })}>
          <Navigation aria-hidden="true" size={24} />
          {t('circuit.start')}
        </a>
      )}
    </Page>
  )
}
