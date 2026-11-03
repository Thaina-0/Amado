import type { LucideIcon } from 'lucide-react'

export function InfoRow({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon
  title: string
  text: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon aria-hidden="true" size={24} className="mt-0.5 flex-none" />
      <div className="flex flex-col gap-0.5">
        <p className="text-label">{title}</p>
        <p className="text-ink-secondary">{text}</p>
      </div>
    </div>
  )
}
