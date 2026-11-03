import type { CSSProperties } from 'react'

export const PRESS =
  'transition-[background-color,color,border-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.97]'
export const BUTTON =
  'box-border inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full px-6 text-label no-underline ' +
  PRESS
export const BUTTON_PRIMARY =
  'bg-action text-on-action hover:bg-action-hover active:bg-action-pressed'
export const BUTTON_SECONDARY =
  'border-2 border-line bg-action-alt text-ink hover:bg-action-alt-hover active:bg-action-alt-pressed'
export const BUTTON_GHOST = 'text-link underline underline-offset-4'

export const STAGGER = 'animate-rise [animation-delay:calc(var(--i)*45ms)]'
export const MAX_STAGGER = 8

// why: custom properties are not in CSSProperties, so the index is passed through a cast
export const stagger = (index: number): CSSProperties =>
  ({ '--i': Math.min(index, MAX_STAGGER) }) as CSSProperties
