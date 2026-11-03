export const PLACE_CATEGORIES = ['police', 'hospital', 'upa', 'fire'] as const

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number]

export interface Coordinates {
  lat: number
  lng: number
}

// invariant: no field here may rank or promote a place; order comes from distance alone (AD-004)
export interface EmergencyPlace {
  id: string
  category: PlaceCategory
  name: string
  phone: string
  lat: number
  lng: number
  hours?: string
  verifiedAt: string
  source: string
}

export interface RankedPlace {
  place: EmergencyPlace
  meters: number
}

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  police: 'Polícia',
  hospital: 'Hospital',
  upa: 'UPA',
  fire: 'Bombeiros',
}

const EARTH_RADIUS_METERS = 6_371_008.8

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

export function distanceMeters(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.lat - a.lat)
  const dLng = toRadians(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(h)))
}

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

function compareCategoryThenId(a: EmergencyPlace, b: EmergencyPlace): number {
  return (
    PLACE_CATEGORIES.indexOf(a.category) - PLACE_CATEGORIES.indexOf(b.category) ||
    compareIds(a.id, b.id)
  )
}

export function rankPlaces(places: readonly EmergencyPlace[], from: Coordinates): RankedPlace[] {
  return places
    .map((place) => ({ place, meters: distanceMeters(from, place) }))
    .sort((a, b) => a.meters - b.meters || compareCategoryThenId(a.place, b.place))
}

export function nearestPlaces(places: readonly EmergencyPlace[], from: Coordinates): RankedPlace[] {
  const seen = new Set<PlaceCategory>()
  return rankPlaces(places, from).filter(({ place }) => {
    if (seen.has(place.category)) return false
    seen.add(place.category)
    return true
  })
}

export function orderWithoutPosition(places: readonly EmergencyPlace[]): EmergencyPlace[] {
  return [...places].sort(compareCategoryThenId)
}

const WALKING_LIMIT_METERS = 995

export function formatDistance(meters: number): string {
  if (meters < WALKING_LIMIT_METERS) return `${Math.round(meters / 10) * 10} m`
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`
}

export function directionsHref(place: Coordinates): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
}

export interface PlaceValidation {
  ok: boolean
  errors: string[]
}

function isFilled(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

function isCoordinate(value: unknown, limit: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= limit
}

// invariant: the same record rules hold for level 1 places and level 2 providers; only the category list differs
export function validateRecord(value: unknown, categories: readonly string[]): PlaceValidation {
  const errors: string[] = []
  const candidate = (typeof value === 'object' && value !== null ? value : {}) as Record<
    string,
    unknown
  >
  for (const field of ['id', 'name', 'phone', 'verifiedAt', 'source']) {
    if (!isFilled(candidate[field])) errors.push(`${field} is required`)
  }
  if (!categories.includes(candidate.category as string)) {
    errors.push('category is not a known category')
  }
  if (!isCoordinate(candidate.lat, 90)) errors.push('lat must be a number from -90 to 90')
  if (!isCoordinate(candidate.lng, 180)) errors.push('lng must be a number from -180 to 180')
  if (candidate.hours !== undefined && !isFilled(candidate.hours)) {
    errors.push('hours must be a non-empty string when present')
  }
  return { ok: errors.length === 0, errors }
}

export function validatePlace(value: unknown): PlaceValidation {
  return validateRecord(value, PLACE_CATEGORIES)
}
