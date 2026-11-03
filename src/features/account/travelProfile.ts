import { useSyncExternalStore } from 'react'
import { subscriberFor } from './storeSubscription'
import { parseProfile, type Profile } from './profile'

export const TRAVEL_PROFILE_KEY = 'amado.travel-profile.v1'

// invariant: the travel profile holds only coarse buckets and place categories, and it never leaves the device; it works without an account
const listeners = new Set<() => void>()
const NONE: Profile = {}
let memory: string | null = null
let cachedRaw: string | null | undefined
let cached: Profile = NONE

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(TRAVEL_PROFILE_KEY) ?? memory
  } catch {
    return memory
  }
}

function parseRaw(raw: string | null): Profile {
  if (raw === null) return NONE
  try {
    return parseProfile(JSON.parse(raw))
  } catch {
    return NONE
  }
}

export function getTravelProfile(): Profile {
  const raw = readRaw()
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cached = parseRaw(raw)
  }
  return cached
}

function notify(): void {
  for (const listener of listeners) listener()
}

export function saveTravelProfile(profile: Profile): void {
  const clean = parseProfile(profile)
  const empty = Object.keys(clean).length === 0
  memory = empty ? null : JSON.stringify(clean)
  try {
    if (empty) window.localStorage.removeItem(TRAVEL_PROFILE_KEY)
    else window.localStorage.setItem(TRAVEL_PROFILE_KEY, memory ?? '')
  } catch {
    // why: when storage is refused the answers last until the page closes, which still lets the plan work
  }
  notify()
}

const subscribe = subscriberFor(listeners)

export function useTravelProfile(): Profile {
  return useSyncExternalStore(subscribe, getTravelProfile, () => NONE)
}
