import type { PlaceCategory } from '../places/places'
import type { PROFILE_QUESTIONS } from '../account/data'

type Reason = (typeof PROFILE_QUESTIONS.reason)[number]
type Stay = (typeof PROFILE_QUESTIONS.stay)[number]

// why: each weight says how much a trip reason lifts a category; the plan screen explains the same table to the visitor
export const REASON_WEIGHTS: Record<Reason, Partial<Record<PlaceCategory, number>>> = {
  leisure: { praias: 2 },
  culture: { cultura: 2 },
  food: { gastronomia: 2 },
  sports: { esportes: 2 },
  work: { gastronomia: 1, cultura: 1 },
  family: { praias: 1, gastronomia: 1 },
}

export const INTEREST_WEIGHT = 3

export const FAMILY_WEIGHTS: Partial<Record<PlaceCategory, number>> = { praias: 1, cultura: 1 }

// invariant: the stay answer is a coarse bucket, so each bucket maps to one fixed number of days (the middle of "4 to 7" is 5)
export const STAY_DAYS: Record<Stay, number> = { day: 1, short: 3, week: 5, long: 7 }

export const DEFAULT_DAYS = 1

export const PLACES_PER_DAY = 3

export const PLACES_PER_DAY_WITH_CHILDREN = 2
