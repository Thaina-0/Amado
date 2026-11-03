import { Check, ChevronDown, Globe } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useI18n } from '../i18n/context'
import { CHOOSE_LANGUAGE, LANGUAGE_NAME, LANGUAGES } from '../i18n/i18n'
import { usePreferences } from '../preferences/context'
import { PRESS } from './classes'

export function LanguageMenu() {
  const { language } = useI18n()
  const { update } = usePreferences()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      trigger.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const choose = (next: (typeof LANGUAGES)[number]) => {
    update({ language: next })
    setOpen(false)
    trigger.current?.focus()
  }

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${CHOOSE_LANGUAGE[language]}: ${LANGUAGE_NAME[language]}`}
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-line bg-action-alt px-4 text-body-sm font-semibold text-ink hover:bg-action-alt-hover ${PRESS}`}
      >
        <Globe aria-hidden="true" size={20} />
        {LANGUAGE_NAME[language]}
        <ChevronDown aria-hidden="true" size={16} className={open ? 'rotate-180' : ''} />
      </button>
      {open && (
        <div
          id={panelId}
          role="radiogroup"
          aria-label={CHOOSE_LANGUAGE[language]}
          className="absolute top-full left-0 z-10 mt-2 flex w-56 flex-col gap-1 rounded-lg border border-line bg-surface p-2 shadow-lg"
        >
          {LANGUAGES.map((option) => {
            const selected = option === language
            return (
              <button
                key={option}
                type="button"
                role="radio"
                lang={option}
                aria-checked={selected}
                onClick={() => choose(option)}
                className={`box-border flex min-h-12 w-full items-center justify-between gap-3 rounded-md px-3 text-left text-label ${PRESS} ${
                  selected ? 'bg-subtle' : 'hover:bg-subtle'
                }`}
              >
                {LANGUAGE_NAME[option]}
                {selected && <Check aria-hidden="true" size={20} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
