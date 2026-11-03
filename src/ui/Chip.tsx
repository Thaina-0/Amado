import { Check } from 'lucide-react'
import { PRESS } from './classes'

export function Chip({
  label,
  selected,
  onSelect,
}: {
  label: string
  selected: boolean
  onSelect: () => void
}) {
  const style = selected
    ? 'border-line-strong bg-ink text-canvas'
    : 'border-line bg-transparent text-ink'
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`box-border inline-flex min-h-12 flex-none items-center gap-2 rounded-full border-2 px-4 text-label ${PRESS} ${style}`}
    >
      {selected && <Check aria-hidden="true" size={20} />}
      {label}
    </button>
  )
}
