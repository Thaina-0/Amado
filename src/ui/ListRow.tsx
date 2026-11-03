import { ChevronRight } from 'lucide-react'
import { PRESS } from './classes'

const STYLE =
  'box-border flex min-h-14 items-center gap-4 rounded-lg border border-line-subtle bg-surface p-4 text-ink no-underline'
const LINK_STYLE = `${STYLE} hover:bg-subtle ${PRESS}`

export function ListRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-label">{label}</span>
        <span className="text-body-sm text-ink-secondary">{value}</span>
      </span>
      {href && <ChevronRight aria-hidden="true" size={24} className="flex-none" />}
    </>
  )
  return href ? (
    <a className={LINK_STYLE} href={href}>
      {content}
    </a>
  ) : (
    <div className={STYLE}>{content}</div>
  )
}
