import { ChevronRight } from 'lucide-react'
import { navigate } from '../../app/navigation'
import { useI18n } from '../../i18n/context'
import { CHOOSE_LANGUAGE, LANGUAGE_NAME, LANGUAGES, type Language } from '../../i18n/i18n'
import { usePreferences } from '../../preferences/context'
import { BrandMark } from '../../ui/BrandMark'
import { BUTTON, BUTTON_PRIMARY } from '../../ui/classes'
import { EmergencyPill } from '../../ui/EmergencyPill'
import { OptionRow } from '../../ui/OptionRow'

export function LanguageScreen() {
  const { t, language } = useI18n()
  const { preferences, update } = usePreferences()
  const firstOpen = preferences.onboarding === 'pending'

  const choose = (next: Language) => update({ language: next })
  const next = () => navigate(firstOpen ? { name: 'consent' } : { name: 'profile' })

  return (
    <main className="mx-auto flex w-full max-w-120 flex-1 flex-col gap-4 px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
      <header className="flex items-center justify-between">
        <BrandMark />
        {firstOpen && <EmergencyPill />}
      </header>

      <div className="flex flex-col gap-1">
        <h1 className="text-h1">{CHOOSE_LANGUAGE.pt}</h1>
        <p className="flex flex-wrap gap-x-3 text-title text-ink-secondary">
          {LANGUAGES.filter((option) => option !== 'pt').map((option) => (
            <span key={option} lang={option}>
              {CHOOSE_LANGUAGE[option]}
            </span>
          ))}
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label={LANGUAGES.map((option) => CHOOSE_LANGUAGE[option]).join(', ')}
        className="flex flex-col gap-2"
      >
        {LANGUAGES.map((option) => (
          <OptionRow
            key={option}
            label={LANGUAGE_NAME[option]}
            selected={option === language}
            onSelect={() => choose(option)}
          />
        ))}
      </div>

      <p className="text-ink-secondary">{t('lang.hint')}</p>

      <div className="mt-auto flex">
        <button type="button" className={`${BUTTON} ${BUTTON_PRIMARY}`} onClick={next}>
          <ChevronRight aria-hidden="true" size={24} />
          {t('common.continue')}
        </button>
      </div>
    </main>
  )
}
