import type { ReactNode } from 'react'
import { PRESS } from './classes'

const STYLE =
  'inline-flex size-12 flex-none items-center justify-center rounded-full border-2 border-line bg-action-alt text-ink hover:bg-action-alt-hover active:bg-action-alt-pressed ' +
  PRESS

export function IconButton({
  label,
  onClick,
  href,
  children,
}: {
  label: string
  onClick?: () => void
  href?: string
  children: ReactNode
}) {
  if (href) {
    return (
      <a className={STYLE} href={href} aria-label={label}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={STYLE} aria-label={label} onClick={onClick}>
      {children}
    </button>
  )
}
