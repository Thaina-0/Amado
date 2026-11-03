import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type AlertTone = 'info' | 'warning' | 'emergency'

const TONE: Record<AlertTone, { frame: string; title: string; icon: string }> = {
  info: {
    frame: 'border-info-line bg-info-soft',
    title: 'text-info-ink',
    icon: 'text-info-mark',
  },
  warning: {
    frame: 'border-warn-line bg-warn-soft',
    title: 'text-warn-ink',
    icon: 'text-warn-mark',
  },
  emergency: {
    frame: 'border-emergency-line bg-emergency-soft',
    title: 'text-emergency-soft-ink',
    icon: 'text-emergency-soft-ink',
  },
}

export function Alert({
  tone,
  icon: Icon,
  title,
  role,
  action,
  children,
}: {
  tone: AlertTone
  icon: LucideIcon
  title: string
  role?: 'alert' | 'status'
  action?: ReactNode
  children: ReactNode
}) {
  const style = TONE[tone]
  return (
    <div className={`flex gap-3 rounded-lg border p-4 ${style.frame}`} role={role}>
      <Icon aria-hidden="true" size={24} className={`mt-1 flex-none ${style.icon}`} />
      <div>
        <p className={`font-semibold ${style.title}`}>{title}</p>
        <p className="text-ink">{children}</p>
        {action}
      </div>
    </div>
  )
}
