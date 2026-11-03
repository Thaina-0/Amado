import { render, type RenderResult } from '@testing-library/react'
import type { ReactNode } from 'react'
import { vi } from 'vitest'
import { App } from '../App'
import { PreferencesProvider } from '../preferences/PreferencesProvider'
import { STORAGE_KEY, type KeyValueStorage, type Preferences } from '../preferences/preferences'

export function resetBrowser(browserLanguage = 'pt-BR'): void {
  Object.defineProperty(navigator, 'language', { value: browserLanguage, configurable: true })
  window.localStorage.clear()
  window.history.replaceState(null, '', window.location.pathname)
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.lang = ''
}

export function seedPreferences(patch: Partial<Preferences> = {}): void {
  const base: Preferences = { language: 'pt', theme: 'auto', onboarding: 'done', countVisit: false }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...base, ...patch }))
}

export function storedPreferences(): Preferences | null {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  return raw ? (JSON.parse(raw) as Preferences) : null
}

export function renderApp(hash = ''): RenderResult {
  window.history.replaceState(null, '', hash || window.location.pathname)
  return render(<App />)
}

export function memoryStorage(): KeyValueStorage & { data: Map<string, string> } {
  const data = new Map<string, string>()
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
  }
}

export function renderWithPreferences(
  ui: ReactNode,
  storage = memoryStorage(),
): RenderResult & { storage: ReturnType<typeof memoryStorage> } {
  return { storage, ...render(<PreferencesProvider storage={storage}>{ui}</PreferencesProvider>) }
}

export function mockPermission(state: PermissionState | undefined): void {
  Object.defineProperty(navigator, 'permissions', {
    value:
      state === undefined
        ? undefined
        : {
            query: vi.fn().mockResolvedValue({
              state,
              addEventListener: () => undefined,
              removeEventListener: () => undefined,
            }),
          },
    configurable: true,
  })
}
