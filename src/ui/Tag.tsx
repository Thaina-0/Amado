import { Info } from 'lucide-react'
import type { ReactNode } from 'react'

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 self-start rounded-full border border-info-line bg-info-soft px-3 py-1 text-body-sm font-semibold text-info-ink">
      <Info aria-hidden="true" size={16} />
      {children}
    </span>
  )
}
