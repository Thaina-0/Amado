import type { MessageKey } from '../../i18n/i18n'
import type { EventCategory } from './events'

export const EVENT_CATEGORY_KEY: Record<EventCategory, MessageKey> = {
  festas: 'events.cat.festas',
  musica: 'events.cat.musica',
  cultura: 'events.cat.cultura',
  esportes: 'events.cat.esportes',
  gastronomia: 'events.cat.gastronomia',
}
