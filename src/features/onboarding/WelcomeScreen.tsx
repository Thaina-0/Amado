import { LogIn, UserPlus } from 'lucide-react'
import { navigate } from '../../app/navigation'
import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import { BrandMark } from '../../ui/BrandMark'
import {
  BUTTON,
  BUTTON_GHOST,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  STAGGER,
  stagger,
} from '../../ui/classes'
import { EmergencyPill } from '../../ui/EmergencyPill'
import { LanguageMenu } from '../../ui/LanguageMenu'

// why: Google sign-in is announced but not wired yet, so it is shaped like a disabled control (no hover, no press, no action)
// hazard: when it is wired, use Google's official button and branding instead of this "G" placeholder
const GOOGLE_PLACEHOLDER =
  'box-border inline-flex min-h-14 flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-full border-2 border-line bg-subtle px-6 text-label text-ink-secondary'

export function WelcomeScreen() {
  const { t } = useI18n()

  return (
    <main className="mx-auto flex w-full max-w-120 flex-1 flex-col gap-6 px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
      <header className="flex items-center justify-between gap-3">
        <LanguageMenu />
        <EmergencyPill />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <div className={STAGGER} style={stagger(0)}>
          <BrandMark size={96} />
        </div>
        <div className={`flex flex-col gap-2 ${STAGGER}`} style={stagger(1)}>
          <h1 className="text-h1">{t('welcome.title')}</h1>
          <p className="text-title text-ink-secondary">{t('welcome.tagline')}</p>
        </div>
        <p className={`text-ink-secondary ${STAGGER}`} style={stagger(2)}>
          {t('welcome.lead')}
        </p>
      </div>

      <div className={`flex flex-col gap-3 ${STAGGER}`} style={stagger(3)}>
        <div className="flex">
          <a href={toHash({ name: 'login' })} className={`${BUTTON} ${BUTTON_PRIMARY}`}>
            <LogIn aria-hidden="true" size={24} />
            {t('welcome.login')}
          </a>
        </div>
        <div className="flex">
          <a href={toHash({ name: 'signup' })} className={`${BUTTON} ${BUTTON_SECONDARY}`}>
            <UserPlus aria-hidden="true" size={24} />
            {t('welcome.signup')}
          </a>
        </div>
        <div className="flex">
          <button type="button" aria-disabled="true" className={GOOGLE_PLACEHOLDER}>
            <span
              aria-hidden="true"
              className="flex size-6 flex-none items-center justify-center rounded-full border-2 border-line text-body-sm font-semibold"
            >
              G
            </span>
            {t('welcome.google')}
            <span className="rounded-full border border-line px-2 text-body-sm">
              {t('welcome.google.soon')}
            </span>
          </button>
        </div>
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => navigate({ name: 'home' })}
            className={`${BUTTON_GHOST} min-h-12 px-4 text-center`}
          >
            {t('welcome.guest')}
          </button>
          <p className="text-center text-body-sm text-ink-secondary">{t('welcome.guest.hint')}</p>
        </div>
      </div>
    </main>
  )
}
