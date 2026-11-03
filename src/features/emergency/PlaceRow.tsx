import { BadgeCheck, Navigation } from 'lucide-react'
import { useI18n } from '../../i18n/context'
import { BUTTON, BUTTON_PRIMARY, BUTTON_SECONDARY } from '../../ui/classes'
import { telHref } from './numbers'
import { directionsHref, type Coordinates } from './places'

export function PlaceRow({
  name,
  detail,
  phone,
  coordinates,
}: {
  name: string
  detail: string
  phone: string
  coordinates: Coordinates
}) {
  const { t } = useI18n()
  return (
    <li className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-4">
      <h3 className="text-title">{name}</h3>
      <p className="text-body-sm text-ink-secondary">{detail}</p>
      <p className="flex items-center gap-1 text-body-sm text-ink-secondary">
        <BadgeCheck aria-hidden="true" size={20} className="text-success" />
        {t('emergency.verified')}
      </p>
      <div className="mt-3 flex gap-2">
        <a
          className={`${BUTTON} ${BUTTON_SECONDARY}`}
          href={directionsHref(coordinates)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('emergency.routeTo', { name })}
        >
          <Navigation aria-hidden="true" size={24} />
          {t('emergency.route')}
        </a>
        <a
          className={`${BUTTON} ${BUTTON_PRIMARY}`}
          href={telHref(phone)}
          aria-label={t('emergency.callTo', { name })}
        >
          {t('emergency.call')}
        </a>
      </div>
    </li>
  )
}
