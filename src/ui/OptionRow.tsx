import { Check } from 'lucide-react'
import { PRESS } from './classes'

export function OptionRow({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string
  description?: string
  selected: boolean
  onSelect: () => void
}) {
  const frame = selected ? 'border-2 border-line-strong bg-subtle' : 'border border-line bg-surface'
  const mark = selected ? 'border-action bg-action text-on-action' : 'border-line-strong'
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`box-border flex min-h-14 w-full items-center gap-4 rounded-lg p-4 text-left text-ink ${PRESS} ${frame}`}
    >
      <span
        className={`flex size-6 flex-none items-center justify-center rounded-full border-2 ${mark}`}
      >
        {selected && <Check aria-hidden="true" size={16} />}
      </span>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-label">{label}</span>
        {description && <span className="text-body-sm text-ink-secondary">{description}</span>}
      </span>
    </button>
  )
}
