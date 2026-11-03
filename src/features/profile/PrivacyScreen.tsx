import { MapPin, Shield, User } from 'lucide-react'
import { goBack } from '../../app/navigation'
import { useLocationPermission, type LocationPermission } from '../../app/permission'
import { useI18n } from '../../i18n/context'
import type { MessageKey } from '../../i18n/i18n'
import { usePreferences } from '../../preferences/context'
import { InfoRow } from '../../ui/InfoRow'
import { ListRow } from '../../ui/ListRow'
import { ToggleRow } from '../../ui/ToggleRow'
import { TopBar } from '../../ui/TopBar'
import { Page } from '../../ui/Page'

const PERMISSION_KEY: Record<LocationPermission, MessageKey> = {
  granted: 'permission.granted',
  denied: 'permission.denied',
  prompt: 'permission.prompt',
  unknown: 'permission.prompt',
}

export function PrivacyScreen() {
  const { t } = useI18n()
  const { preferences, update } = usePreferences()
  const permission = useLocationPermission()

  return (
    <Page>
      <TopBar title={t('privacy.title')} onBack={goBack} />
      <p className="text-ink-secondary">{t('privacy.intro')}</p>

      <InfoRow icon={MapPin} title={t('consent.fact1.title')} text={t('consent.fact1.text')} />
      <InfoRow icon={Shield} title={t('consent.fact2.title')} text={t('consent.fact2.text')} />
      <InfoRow icon={User} title={t('consent.fact3.title')} text={t('consent.fact3.text')} />

      <ToggleRow
        label={t('privacy.count.label')}
        description={t('privacy.count.text')}
        checked={preferences.countVisit}
        onChange={(countVisit) => update({ countVisit })}
      />
      <ListRow label={t('privacy.location.label')} value={t(PERMISSION_KEY[permission])} />
      <p className="text-body-sm text-ink-secondary">{t('privacy.location.hint')}</p>
    </Page>
  )
}
