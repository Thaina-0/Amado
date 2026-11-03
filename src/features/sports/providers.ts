import { SPORT_PROVIDERS } from './data'
import type { Localized } from '../../i18n/i18n'

type Text = Localized

export type SportId =
  'surf' | 'beach-tennis' | 'stand-up-paddle' | 'kitesurf-windsurf' | 'futevolei' | 'academias'

// invariant: a provider lists only what its public source states; no phone, price or hours are shown
// hazard: every entry comes from a public page the team has not verified; the screen says so
export interface SportProvider {
  id: string
  name: string
  sports: readonly SportId[]
  offer: Text
  area: string
  address?: string
  website?: string
  caveat?: Text
  sources: readonly string[]
}

export { SPORT_PROVIDERS }

export function providersFor(sport: string): SportProvider[] {
  return SPORT_PROVIDERS.filter((provider) => provider.sports.some((known) => known === sport))
}
