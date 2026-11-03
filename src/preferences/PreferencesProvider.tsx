import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { detectLanguage, htmlLang } from '../i18n/i18n'
import { I18nProvider } from '../i18n/I18nProvider'
import { PreferencesContext, type PreferencesValue } from './context'
import {
  browserStorage,
  readPreferences,
  writePreferences,
  type KeyValueStorage,
  type Preferences,
} from './preferences'

export function PreferencesProvider({
  children,
  storage = browserStorage(),
}: {
  children: ReactNode
  storage?: KeyValueStorage | null
}) {
  const [preferences, setPreferences] = useState<Preferences>(() =>
    readPreferences(detectLanguage(navigator.language), storage),
  )

  const update = useCallback(
    (patch: Partial<Preferences>) => {
      setPreferences((current) => {
        const next = { ...current, ...patch }
        writePreferences(next, storage)
        return next
      })
    },
    [storage],
  )

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const queries = [
      window.matchMedia('(prefers-color-scheme: dark)'),
      window.matchMedia('(prefers-contrast: more)'),
    ]
    const apply = () => {
      document.documentElement.dataset.auto = queries[1]?.matches
        ? 'contrast'
        : queries[0]?.matches
          ? 'dark'
          : 'light'
    }
    apply()
    for (const query of queries) query.addEventListener('change', apply)
    return () => {
      for (const query of queries) query.removeEventListener('change', apply)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = htmlLang(preferences.language)
    if (preferences.theme === 'auto') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = preferences.theme
  }, [preferences.language, preferences.theme])

  const value = useMemo<PreferencesValue>(() => ({ preferences, update }), [preferences, update])

  return (
    <PreferencesContext.Provider value={value}>
      <I18nProvider language={preferences.language}>{children}</I18nProvider>
    </PreferencesContext.Provider>
  )
}
