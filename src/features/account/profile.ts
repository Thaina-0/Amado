import { PLACE_CATEGORIES, type PlaceCategory } from '../places/places'
import { PROFILE_QUESTIONS } from './data'

export { PROFILE_QUESTIONS }

export type QuestionId = keyof typeof PROFILE_QUESTIONS

export const QUESTION_IDS = Object.keys(PROFILE_QUESTIONS) as QuestionId[]

export type Profile = { [Q in QuestionId]?: (typeof PROFILE_QUESTIONS)[Q][number] } & {
  interests?: PlaceCategory[]
}

export const PROFILE_TOTAL = QUESTION_IDS.length + 1

function oneOf<T extends string>(options: readonly T[], value: unknown): T | undefined {
  return options.find((option) => option === value)
}

export function parseProfile(value: unknown): Profile {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  const stored = value as Record<string, unknown>
  const profile: Record<string, unknown> = {}
  for (const id of QUESTION_IDS) {
    const answer = oneOf(PROFILE_QUESTIONS[id], stored[id])
    if (answer !== undefined) profile[id] = answer
  }
  const chosen: unknown = stored.interests
  if (Array.isArray(chosen)) {
    const interests = PLACE_CATEGORIES.filter((category) => chosen.includes(category))
    if (interests.length > 0) profile.interests = interests
  }
  return profile as Profile
}

export function answeredCount(profile: Profile | undefined): number {
  if (!profile) return 0
  return QUESTION_IDS.filter((id) => profile[id] !== undefined).length + (profile.interests ? 1 : 0)
}

// why: only these answers shape the plan; the rest is for the group reports and is asked apart so people know what each part is for
export const PLAN_QUESTIONS = ['stay', 'reason', 'party'] as const satisfies readonly QuestionId[]

export const EXTRA_QUESTIONS = QUESTION_IDS.filter(
  (id) => !PLAN_QUESTIONS.some((known) => known === id),
)

export function canPlan(profile: Profile | undefined): boolean {
  if (!profile) return false
  return PLAN_QUESTIONS.some((id) => profile[id] !== undefined) || profile.interests !== undefined
}
