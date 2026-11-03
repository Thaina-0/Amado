import {
  distanceMeters,
  validateRecord,
  type Coordinates,
  type PlaceValidation,
} from '../emergency/places'

export const PROVIDER_CATEGORIES = [
  'chaveiro',
  'mecanico',
  'guincho',
  'borracheiro',
  'farmacia-de-plantao',
  'eletricista',
  'encanador',
] as const

export type ProviderCategory = (typeof PROVIDER_CATEGORIES)[number]

// invariant: no field here may rank or promote a provider; order comes from distance alone, and a provider is never an EmergencyPlace (door 3, AD-004)
export interface EverydayProvider {
  id: string
  category: ProviderCategory
  name: string
  phone: string
  lat: number
  lng: number
  open24h?: true
  hours?: string
  verifiedAt: string
  source: string
}

export interface RankedProvider {
  provider: EverydayProvider
  meters?: number
}

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

function compareCategoryThenId(a: EverydayProvider, b: EverydayProvider): number {
  return (
    PROVIDER_CATEGORIES.indexOf(a.category) - PROVIDER_CATEGORIES.indexOf(b.category) ||
    compareIds(a.id, b.id)
  )
}

export function rankProviders(
  providers: readonly EverydayProvider[],
  from: Coordinates,
): RankedProvider[] {
  return providers
    .map((provider) => ({ provider, meters: distanceMeters(from, provider) }))
    .sort((a, b) => a.meters - b.meters || compareCategoryThenId(a.provider, b.provider))
}

export function orderWithoutPosition(providers: readonly EverydayProvider[]): RankedProvider[] {
  return [...providers].sort(compareCategoryThenId).map((provider) => ({ provider }))
}

export function validateProvider(value: unknown): PlaceValidation {
  return validateRecord(value, PROVIDER_CATEGORIES)
}
