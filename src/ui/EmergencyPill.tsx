import { TriangleAlert } from 'lucide-react'
import { useI18n } from '../i18n/context'
import { toHash } from '../app/routes'
import { PRESS } from './classes'

export function EmergencyPill() {
  const { t } = useI18n()
  return (
    <a
      className={`inline-flex min-h-12 items-center gap-2 rounded-full bg-emergency px-4 text-body-sm font-semibold text-on-emergency no-underline hover:bg-emergency-hover active:bg-emergency-pressed ${PRESS}`}
      href={toHash({ name: 'emergency' })}
    >
      <TriangleAlert aria-hidden="true" size={20} />
      {t('tab.emergency')}
    </a>
  )
}
