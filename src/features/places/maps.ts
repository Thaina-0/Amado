import type { Place } from './places'

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

// invariant: the Place has no coordinate (door 4), so the map is asked for the name and the city, never for a made-up point
export function mapsUrl(place: Place): string {
  return mapsSearchUrl(`${place.name}, Ilhéus, BA`)
}

// why: a provider's address comes from its public source, so the map gets the address when there is one and the name otherwise
export function providerMapsUrl(provider: { name: string; address?: string }): string {
  const parts = [provider.name, provider.address, 'Ilhéus, BA']
  return mapsSearchUrl(parts.filter(Boolean).join(', '))
}
