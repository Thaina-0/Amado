import { ExternalLink, Ticket } from 'lucide-react'
import { useI18n } from '../../i18n/context'
import { localized } from '../../i18n/i18n'
import { BUTTON, BUTTON_PRIMARY } from '../../ui/classes'
import type { CityEvent } from './events'

export function EventTicketsSection({ event }: { event: CityEvent }) {
  const { t, language } = useI18n()
  const { admission, tickets } = event
  if (!admission && !tickets) return null

  const registering = admission === 'registration'
  const online = tickets?.online

  return (
    <section aria-labelledby="event-tickets" className="flex flex-col gap-3">
      <h3 id="event-tickets" className="text-h3">
        {t(registering ? 'events.tickets.titleRegistration' : 'events.tickets.title')}
      </h3>

      {admission === 'free' ? (
        <p>{t('events.tickets.free')}</p>
      ) : (
        <>
          {online && (
            <div className="flex">
              <a
                href={online.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BUTTON} ${BUTTON_PRIMARY}`}
              >
                <Ticket aria-hidden="true" size={24} />
                {t(registering ? 'events.tickets.registerOn' : 'events.tickets.buyOn', {
                  platform: online.platform,
                })}
                <ExternalLink aria-hidden="true" size={20} />
              </a>
            </div>
          )}

          {tickets?.prices && (
            <div className="flex flex-col gap-1">
              <h4 className="text-label">{t('events.tickets.prices')}</h4>
              <ul className="flex flex-col gap-1">
                {tickets.prices.map((item) => (
                  <li
                    key={item.price + localized(item.label, 'pt')}
                    className="flex justify-between gap-3"
                  >
                    <span>{localized(item.label, language)}</span>
                    <span className="text-label">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <h4 className="text-label">{t('events.tickets.physical')}</h4>
            <p>
              {tickets?.physical
                ? localized(tickets.physical, language)
                : t('events.tickets.physical.none')}
            </p>
          </div>

          <p className="text-body-sm text-ink-secondary">{t('events.tickets.confirm')}</p>
        </>
      )}
    </section>
  )
}
