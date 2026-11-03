import { useSyncExternalStore } from 'react'
import { subscriberFor } from './storeSubscription'
import { parseProfile, type Profile } from './profile'

export const SESSION_KEY = 'amado.session.v1'

// invariant: the demo session holds a first name and the optional coarse travel answers; the e-mail and the password are read from the form and dropped
export interface Session {
  name: string
  profile?: Profile
}

const EMAIL = /^[^\s@]*\p{L}[^\s@]*@[^\s@]+\.[^\s@]+$/u

export function isValidEmail(email: string): boolean {
  return EMAIL.test(email.trim())
}

export function nameFromEmail(email: string): string {
  const word =
    email
      .trim()
      .split('@')[0]
      ?.match(/\p{L}+/u)?.[0] ?? ''
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

function storage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

const listeners = new Set<() => void>()
let cachedRaw: string | null | undefined
let cached: Session | null = null

function parse(raw: string | null): Session | null {
  if (raw === null) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (typeof value !== 'object' || value === null) return null
    const { name, profile } = value as Record<string, unknown>
    if (typeof name !== 'string' || name.trim() === '') return null
    const answers = parseProfile(profile)
    return Object.keys(answers).length > 0
      ? { name: name.slice(0, 40), profile: answers }
      : { name: name.slice(0, 40) }
  } catch {
    return null
  }
}

function readRaw(): string | null {
  try {
    return storage()?.getItem(SESSION_KEY) ?? null
  } catch {
    return null
  }
}

export function getSession(): Session | null {
  const raw = readRaw()
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cached = parse(raw)
  }
  return cached
}

function notify(): void {
  for (const listener of listeners) listener()
}

export function signIn(name: string, profile: Profile = {}): void {
  const answers = parseProfile(profile)
  const session: Session = Object.keys(answers).length > 0 ? { name, profile: answers } : { name }
  const raw = JSON.stringify(session)
  try {
    storage()?.setItem(SESSION_KEY, raw)
  } catch {
    // why: when storage is refused the demo session lasts only until the page closes, which is fine for a mock
    cachedRaw = raw
    cached = session
  }
  notify()
}

export function signOut(): void {
  try {
    storage()?.removeItem(SESSION_KEY)
  } catch {
    // why: nothing else to clear; the in-memory copy below is what the screens read
  }
  cachedRaw = null
  cached = null
  notify()
}

const subscribe = subscriberFor(listeners)

export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, getSession, () => null)
}
