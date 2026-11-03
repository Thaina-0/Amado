import type { EverydayProvider, ProviderCategory } from '../features/urgencias/providers'
import { metersNorth, USER } from './geolocation'

export function provider(
  id: string,
  category: ProviderCategory,
  meters: number,
  extra: Partial<EverydayProvider> = {},
): EverydayProvider {
  const { lat, lng } = metersNorth(USER, meters)
  return {
    id,
    category,
    name: `Fixture ${id}`,
    phone: '(73) 0000-1111',
    lat,
    lng,
    verifiedAt: '2026-01-01',
    source: 'fixture',
    ...extra,
  }
}
