import { useMemo, type ReactNode } from 'react'
import { I18nContext, type I18n } from './context'
import { translate, type Language } from './i18n'

export function I18nProvider({ language, children }: { language: Language; children: ReactNode }) {
  const value = useMemo<I18n>(
    () => ({ language, t: (key, values) => translate(language, key, values) }),
    [language],
  )
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
