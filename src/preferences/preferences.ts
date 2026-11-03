import { LANGUAGES, type Language } from '../i18n/i18n'

export const STORAGE_KEY = 'amado.preferences.v1'

export const THEMES = ['auto', 'light', 'dark', 'contrast'] as const
export type Theme = (typeof THEMES)[number]

export const ONBOARDING_STATES = ['pending', 'done'] as const
export type Onboarding = (typeof ONBOARDING_STATES)[number]

// invariant: these four fields are everything the app keeps on the device (door 2)
export interface Preferences {
  language: Language
  theme: Theme
  onboarding: Onboarding
  countVisit: boolean
}

export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function defaultPreferences(language: Language): Preferences {
  return { language, theme: 'auto', onboarding: 'pending', countVisit: false }
}

function oneOf<T extends string>(options: readonly T[], value: unknown, fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback
}

export function parsePreferences(raw: string | null, fallbackLanguage: Language): Preferences {
  const defaults = defaultPreferences(fallbackLanguage)
  if (raw === null) return defaults
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return defaults
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return defaults
  const stored = parsed as Record<string, unknown>
  return {
    language: oneOf(LANGUAGES, stored.language, defaults.language),
    theme: oneOf(THEMES, stored.theme, defaults.theme),
    onboarding: oneOf(ONBOARDING_STATES, stored.onboarding, defaults.onboarding),
    countVisit: typeof stored.countVisit === 'boolean' ? stored.countVisit : defaults.countVisit,
  }
}

export function browserStorage(): KeyValueStorage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readPreferences(
  fallbackLanguage: Language,
  storage: KeyValueStorage | null = browserStorage(),
): Preferences {
  let raw: string | null
  try {
    raw = storage ? storage.getItem(STORAGE_KEY) : null
  } catch {
    raw = null
  }
  return parsePreferences(raw, fallbackLanguage)
}

export function writePreferences(
  preferences: Preferences,
  storage: KeyValueStorage | null = browserStorage(),
): void {
  const { language, theme, onboarding, countVisit } = preferences
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify({ language, theme, onboarding, countVisit }))
  } catch {
    // why: a blocked or full storage must not break the app; the session keeps the values in memory
  }
}
