import { useState } from 'react'
import { PLACE_CATEGORIES, type PlaceCategory } from '../places/places'
import type { Profile, QuestionId } from './profile'

export function useProfileAnswers(initial: Profile) {
  const [answers, setAnswers] = useState<Profile>(initial)

  const setAnswer = (id: QuestionId, value: string | undefined) =>
    setAnswers((current) => {
      const next: Record<string, unknown> = { ...current }
      if (value === undefined) delete next[id]
      else next[id] = value
      return next as Profile
    })

  const toggleInterest = (category: PlaceCategory) =>
    setAnswers((current) => {
      const chosen = current.interests ?? []
      const interests = chosen.includes(category)
        ? chosen.filter((known) => known !== category)
        : PLACE_CATEGORIES.filter((known) => known === category || chosen.includes(known))
      const next: Profile = { ...current }
      if (interests.length > 0) next.interests = interests
      else delete next.interests
      return next
    })

  return { answers, setAnswer, toggleInterest, reset: setAnswers }
}
