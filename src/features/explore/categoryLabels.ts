import type { ExploreCategory } from '../../app/routes'
import type { MessageKey } from '../../i18n/i18n'

export const CATEGORY_LABEL: Record<ExploreCategory, MessageKey> = {
  gastronomia: 'filter.gastronomia',
  cultura: 'filter.cultura',
  praias: 'filter.praias',
  natureza: 'filter.natureza',
  esportes: 'filter.esportes',
  circuitos: 'explore.circuits',
}

export const CATEGORY_DESCRIPTION: Record<ExploreCategory, MessageKey> = {
  gastronomia: 'explore.desc.gastronomia',
  cultura: 'explore.desc.cultura',
  praias: 'explore.desc.praias',
  natureza: 'explore.desc.natureza',
  esportes: 'explore.desc.esportes',
  circuitos: 'explore.desc.circuitos',
}
