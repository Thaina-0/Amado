import { Info, MapPin, Shield, User } from 'lucide-react'
import { askLocationPermission } from '../../app/permission'
import { navigate } from '../../app/navigation'
import { useI18n } from '../../i18n/context'
import { usePreferences } from '../../preferences/context'
import { Alert } from '../../ui/Alert'
import { BUTTON, BUTTON_PRIMARY, BUTTON_SECONDARY } from '../../ui/classes'
import { EmergencyPill } from '../../ui/EmergencyPill'
import { InfoRow } from '../../ui/InfoRow'

export function ConsentScreen() {
  const { t } = useI18n()
  const { update } = usePreferences()

  const allow = async () => {
    const granted = await askLocationPermission()
    update({ onboarding: 'done', countVisit: granted })
    navigate({ name: 'home' })
  }
  const later = () => {
    update({ onboarding: 'done', countVisit: false })
    navigate({ name: 'home' })
  }

  return (
    <main className="mx-auto flex w-full max-w-120 flex-1 flex-col gap-3 px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
      <header className="flex justify-end">
        <EmergencyPill />
      </header>

      <div>
        <h1 className="text-h1">{t('consent.title')}</h1>
        <p className="mt-2 text-ink-secondary">{t('consent.lead')}</p>
      </div>

      <InfoRow icon={MapPin} title={t('consent.fact1.title')} text={t('consent.fact1.text')} />
      <InfoRow icon={Shield} title={t('consent.fact2.title')} text={t('consent.fact2.text')} />
      <InfoRow icon={User} title={t('consent.fact3.title')} text={t('consent.fact3.text')} />

      <Alert tone="info" icon={Info} title={t('consent.choice.title')}>
        {t('consent.choice.text')}
      </Alert>

      <div className="mt-auto flex flex-col gap-2">
        <button
          type="button"
          className={`${BUTTON} ${BUTTON_PRIMARY}`}
          onClick={() => void allow()}
        >
          <MapPin aria-hidden="true" size={24} />
          {t('consent.allow')}
        </button>
        <button type="button" className={`${BUTTON} ${BUTTON_SECONDARY}`} onClick={later}>
          {t('consent.later')}
        </button>
      </div>
    </main>
  )
}
