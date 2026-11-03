import type { Profile } from '../account/profile'
import { PLACE_CATEGORIES, type Place, type PlaceCategory } from '../places/places'
import {
  DEFAULT_DAYS,
  FAMILY_WEIGHTS,
  INTEREST_WEIGHT,
  PLACES_PER_DAY,
  PLACES_PER_DAY_WITH_CHILDREN,
  REASON_WEIGHTS,
  STAY_DAYS,
} from './data'

export type StopReason =
  | { kind: 'interest'; category: PlaceCategory }
  | { kind: 'reason'; reason: NonNullable<Profile['reason']> }
  | { kind: 'family' }
  | { kind: 'fill' }

export interface PlanStop {
  place: Place
  reasons: StopReason[]
}

export interface PlanDay {
  number: number
  theme: PlaceCategory
  stops: PlanStop[]
}

// invariant: the plan holds only place ids, categories and the reasons that put them there: no time, distance or opening hour (AD-008)
export interface Plan {
  days: PlanDay[]
  perDay: number
  requestedDays: number
  stayKnown: boolean
}

function categoryScores(profile: Profile): Record<PlaceCategory, number> {
  const scores: Record<PlaceCategory, number> = {
    gastronomia: 0,
    cultura: 0,
    praias: 0,
    natureza: 0,
    esportes: 0,
  }
  for (const category of profile.interests ?? []) scores[category] += INTEREST_WEIGHT
  const byReason = profile.reason ? REASON_WEIGHTS[profile.reason] : {}
  for (const category of PLACE_CATEGORIES) scores[category] += byReason[category] ?? 0
  if (profile.party === 'family') {
    for (const category of PLACE_CATEGORIES) scores[category] += FAMILY_WEIGHTS[category] ?? 0
  }
  return scores
}

function reasonsFor(place: Place, profile: Profile): StopReason[] {
  const reasons: StopReason[] = []
  if (profile.interests?.includes(place.category)) {
    reasons.push({ kind: 'interest', category: place.category })
  }
  if (profile.reason && (REASON_WEIGHTS[profile.reason][place.category] ?? 0) > 0) {
    reasons.push({ kind: 'reason', reason: profile.reason })
  }
  if (profile.party === 'family' && (FAMILY_WEIGHTS[place.category] ?? 0) > 0) {
    reasons.push({ kind: 'family' })
  }
  return reasons.length > 0 ? reasons : [{ kind: 'fill' }]
}

function themeOf(stops: readonly PlanStop[]): PlaceCategory {
  const counts = new Map<PlaceCategory, number>()
  for (const { place } of stops) counts.set(place.category, (counts.get(place.category) ?? 0) + 1)
  let best = stops[0]?.place.category ?? PLACE_CATEGORIES[0]
  for (const [category, count] of counts) {
    if (count > (counts.get(best) ?? 0)) best = category
  }
  return best
}

// why: a stable sort on the score keeps the order of the place list for ties, so the same answers always give the same plan
export function buildPlan(profile: Profile, places: readonly Place[]): Plan {
  const stayKnown = profile.stay !== undefined
  const requestedDays = profile.stay ? STAY_DAYS[profile.stay] : DEFAULT_DAYS
  const perDay = profile.party === 'family' ? PLACES_PER_DAY_WITH_CHILDREN : PLACES_PER_DAY
  const scores = categoryScores(profile)

  const chosen = places
    .map((place, index) => ({ place, index, score: scores[place.category] }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, requestedDays * perDay)
    .sort(
      (a, b) =>
        scores[b.place.category] - scores[a.place.category] ||
        PLACE_CATEGORIES.indexOf(a.place.category) - PLACE_CATEGORIES.indexOf(b.place.category) ||
        a.index - b.index,
    )
    .map(({ place }): PlanStop => ({ place, reasons: reasonsFor(place, profile) }))

  const days: PlanDay[] = []
  for (let start = 0; start < chosen.length; start += perDay) {
    const stops = chosen.slice(start, start + perDay)
    days.push({ number: days.length + 1, theme: themeOf(stops), stops })
  }
  return { days, perDay, requestedDays, stayKnown }
}
