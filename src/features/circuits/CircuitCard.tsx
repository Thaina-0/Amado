import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import { localized } from '../../i18n/i18n'
import { PRESS } from '../../ui/classes'
import { Tag } from '../../ui/Tag'
import type { Circuit } from './circuits'

export function CircuitCard({ circuit }: { circuit: Circuit }) {
  const { t, language } = useI18n()
  return (
    <a
      className={`box-border flex flex-col gap-2 rounded-lg border border-line-subtle bg-surface p-4 text-ink no-underline hover:bg-subtle ${PRESS}`}
      href={toHash({ name: 'circuit', id: circuit.id })}
    >
      <span className="text-title">{localized(circuit.title, language)}</span>
      <span className="text-body-sm text-ink-secondary">
        {localized(circuit.summary, language)}
      </span>
      <Tag>{t('common.example')}</Tag>
    </a>
  )
}
