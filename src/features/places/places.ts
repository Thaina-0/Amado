import { localized, type Language, type Localized } from '../../i18n/i18n'
import { BASE_PLACES, PHOTOS } from './data'

export const PLACE_CATEGORIES = [
  'gastronomia',
  'cultura',
  'praias',
  'natureza',
  'esportes',
] as const

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number]

export type CategoryFilter = 'all' | PlaceCategory

type Text = Localized

export interface Photo {
  src: string
  author: string
  license: string
  page: string
  illustrative?: true
}

// invariant: a Place has no phone, address, coordinate, opening hours or rank (door 4 and AD-008)
// hazard: `details` and `sources` come from public pages the team has not verified; show them as such
export interface Place {
  id: string
  category: PlaceCategory
  name: string
  summary: Text
  details?: Text
  sources?: readonly string[]
  photos: readonly Photo[]
  example: true
}

export const EXAMPLE_PLACES: readonly Place[] = BASE_PLACES.map((place) => ({
  ...place,
  photos: PHOTOS[place.id] ?? [],
}))

export function findPlace(id: string): Place | undefined {
  return EXAMPLE_PLACES.find((place) => place.id === id)
}

export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
}

export function filterPlaces(
  places: readonly Place[],
  filter: { category: CategoryFilter; query: string; language: Language },
): Place[] {
  const query = normalizeText(filter.query)
  return places.filter((place) => {
    if (filter.category !== 'all' && place.category !== filter.category) return false
    if (query === '') return true
    return (
      normalizeText(place.name).includes(query) ||
      normalizeText(localized(place.summary, filter.language)).includes(query)
    )
  })
}
