import { useI18n } from '../i18n/context'
import { PRESS } from './classes'

export function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  const { t } = useI18n()
  const track = checked ? 'border-action bg-action' : 'border-line bg-subtle'
  const thumb = checked ? 'bg-on-action' : 'bg-line-strong'
  const side = checked ? 'justify-end' : 'justify-start'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`box-border flex min-h-14 w-full items-center gap-4 rounded-lg border border-line-subtle bg-surface p-4 text-left text-ink ${PRESS}`}
    >
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-label">{label}</span>
        <span className="text-body-sm text-ink-secondary">{description}</span>
      </span>
      <span className="flex flex-none flex-col items-center gap-0.5">
        <span
          className={`flex h-8 w-13 items-center ${side} rounded-full border-2 p-0.5 transition-colors duration-200 ${track}`}
        >
          <span className={`size-5 rounded-full transition-colors duration-200 ${thumb}`} />
        </span>
        <span className="text-body-sm">{checked ? t('switch.on') : t('switch.off')}</span>
      </span>
    </button>
  )
}
