import { describe, expect, it } from 'vitest'
import type { Profile } from '../../account/profile'
import { EXAMPLE_PLACES } from '../../places/places'
import { buildPlan } from '../plan'

const categories = (plan: ReturnType<typeof buildPlan>) =>
  plan.days.flatMap((day) => day.stops.map((stop) => stop.place.category))

describe('buildPlan', () => {
  it('puts the categories the visitor picked first and says why', () => {
    const plan = buildPlan(
      { stay: 'day', reason: 'culture', interests: ['cultura'] },
      EXAMPLE_PLACES,
    )
    expect(plan.days).toHaveLength(1)
    expect(categories(plan)).toEqual(['cultura', 'cultura', 'cultura'])
    expect(plan.days[0]?.theme).toBe('cultura')
    for (const stop of plan.days[0]?.stops ?? []) {
      expect(stop.reasons).toEqual([
        { kind: 'interest', category: 'cultura' },
        { kind: 'reason', reason: 'culture' },
      ])
    }
  })

  it('sizes the plan by the stay and never repeats a place', () => {
    const plan = buildPlan({ stay: 'short', interests: ['praias', 'gastronomia'] }, EXAMPLE_PLACES)
    const ids = plan.days.flatMap((day) => day.stops.map((stop) => stop.place.id))
    expect(plan.requestedDays).toBe(3)
    expect(plan.days).toHaveLength(3)
    expect(new Set(ids).size).toBe(ids.length)
    expect(plan.days.map((day) => day.number)).toEqual([1, 2, 3])
  })

  it('goes lighter when the party is a family with children', () => {
    const plan = buildPlan({ stay: 'short', party: 'family' }, EXAMPLE_PLACES)
    expect(plan.perDay).toBe(2)
    expect(plan.days).toHaveLength(3)
    expect(plan.days.every((day) => day.stops.length <= 2)).toBe(true)
    const first = plan.days[0]?.stops[0]
    expect(first?.reasons).toContainEqual({ kind: 'family' })
    expect(['praias', 'cultura']).toContain(first?.place.category)
  })

  it('shows one day, and flags it, when the stay was not answered', () => {
    const plan = buildPlan({ reason: 'food' }, EXAMPLE_PLACES)
    expect(plan.stayKnown).toBe(false)
    expect(plan.requestedDays).toBe(1)
    expect(plan.days).toHaveLength(1)
  })

  it('shortens the plan to the places it has instead of repeating or inventing', () => {
    const few = EXAMPLE_PLACES.slice(0, 10)
    const plan = buildPlan({ stay: 'long' }, few)
    expect(plan.requestedDays).toBe(7)
    expect(plan.days.length).toBeLessThan(plan.requestedDays)
    expect(plan.days.flatMap((day) => day.stops)).toHaveLength(few.length)
  })

  it('falls back to a neutral reason for a place that matches no answer', () => {
    const plan = buildPlan({ stay: 'week', reason: 'culture' }, EXAMPLE_PLACES)
    const beach = plan.days.flatMap((day) => day.stops).find((s) => s.place.category === 'praias')
    expect(beach?.reasons).toEqual([{ kind: 'fill' }])
  })

  it('gives the same plan for the same answers', () => {
    const profile: Profile = { stay: 'week', reason: 'sports', interests: ['esportes'] }
    expect(buildPlan(profile, EXAMPLE_PLACES)).toEqual(buildPlan(profile, EXAMPLE_PLACES))
  })

  it('carries no time, distance or hours', () => {
    const plan = buildPlan({ stay: 'day', interests: ['cultura'] }, EXAMPLE_PLACES)
    expect(Object.keys(plan).sort()).toEqual(['days', 'perDay', 'requestedDays', 'stayKnown'])
    for (const day of plan.days) {
      expect(Object.keys(day).sort()).toEqual(['number', 'stops', 'theme'])
      for (const stop of day.stops) expect(Object.keys(stop).sort()).toEqual(['place', 'reasons'])
    }
  })
})
