import type { ReactNode } from 'react'

// why: Tailwind only keeps class names it can read whole in the source, so each variant is a full string
const STANDARD =
  'mx-auto flex max-w-120 flex-col gap-4 px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-8'
const WITH_BOTTOM_INSET =
  'mx-auto flex max-w-120 flex-col gap-4 px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)]'

export function Page({
  children,
  bottomInset = false,
}: {
  children: ReactNode
  bottomInset?: boolean
}) {
  return <main className={bottomInset ? WITH_BOTTOM_INSET : STANDARD}>{children}</main>
}
