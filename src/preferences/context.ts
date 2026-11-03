import { createContext, useContext } from 'react'
import { defaultPreferences, type Preferences } from './preferences'

export interface PreferencesValue {
  preferences: Preferences
  update: (patch: Partial<Preferences>) => void
}

export const PreferencesContext = createContext<PreferencesValue>({
  preferences: defaultPreferences('pt'),
  update: () => undefined,
})

export function usePreferences(): PreferencesValue {
  return useContext(PreferencesContext)
}
