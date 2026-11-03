import { Fragment, useEffect, useState, type CSSProperties } from 'react'
import { BrandMark } from './BrandMark'

const SHOW_MS = 2400
const GONE_MS = 2850

const NAME_START_MS = 350
const NAME_STEP_MS = 60
const TAGLINE_START_MS = 1000
const TAGLINE_STEP_MS = 90
const TAGLINE = ['Ilhéus', 'contada', 'por', 'quem', 'ama'] as const
const LAST_WORD = TAGLINE.length - 1

type Phase = 'show' | 'fade' | 'gone'

function reducedMotion(): boolean {
  return typeof window.matchMedia !== 'function'
    ? true
    : window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const delayed = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` })

export function Splash() {
  const [skip] = useState(() => reducedMotion())
  const [phase, setPhase] = useState<Phase>(skip ? 'gone' : 'show')

  useEffect(() => {
    if (skip) return
    const fade = window.setTimeout(() => setPhase('fade'), SHOW_MS)
    const gone = window.setTimeout(() => setPhase('gone'), GONE_MS)
    return () => {
      window.clearTimeout(fade)
      window.clearTimeout(gone)
    }
  }, [skip])

  if (phase === 'gone') return null

  const lastWordAt = TAGLINE_START_MS + LAST_WORD * TAGLINE_STEP_MS

  return (
    <div
      data-testid="splash"
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 overflow-hidden bg-[#331e15] transition-opacity duration-[450ms] ease-[ease] ${
        phase === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="absolute size-150 animate-glow-bloom rounded-full bg-[radial-gradient(circle,rgb(228_184_77/0.22)_0%,transparent_65%)]" />
      <div className="relative flex flex-col items-center gap-6 px-6">
        <div className="animate-pod-in">
          <BrandMark size={128} />
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex text-[clamp(3rem,17vw,4.5rem)] leading-none font-bold tracking-tight text-[#fffefb]">
            {Array.from('Amado').map((letter, index) => (
              <span key={index} className="-my-[0.1em] flex overflow-hidden py-[0.1em]">
                <span
                  className="inline-block animate-glyph-rise"
                  style={delayed(NAME_START_MS + index * NAME_STEP_MS)}
                >
                  {letter}
                </span>
              </span>
            ))}
          </div>

          <p className="flex flex-wrap justify-center gap-x-[0.4em] text-[clamp(1.0625rem,4.8vw,1.375rem)] leading-snug tracking-[0.02em] text-[#e8dec9]">
            {TAGLINE.map((word, index) => (
              <Fragment key={word}>
                {index > 0 && ' '}
                <span className="-mx-[0.12em] -my-[0.2em] flex overflow-hidden px-[0.12em] py-[0.2em]">
                  <span
                    className="relative inline-block animate-glyph-rise"
                    style={delayed(TAGLINE_START_MS + index * TAGLINE_STEP_MS)}
                  >
                    {index === LAST_WORD ? (
                      <span
                        className="inline-block animate-ama-pop font-bold text-[#e4b84d]"
                        style={delayed(lastWordAt + 650)}
                      >
                        {word}
                      </span>
                    ) : (
                      word
                    )}
                  </span>
                </span>
              </Fragment>
            ))}
          </p>
        </div>
      </div>

      <div className="relative h-1 w-[min(420px,70vw)] overflow-hidden rounded-full bg-[#5c3a2a]">
        <div className="h-full w-full origin-left animate-[strike-draw_2200ms_var(--ease-brand)_both] rounded-full bg-[#e4b84d]" />
      </div>
    </div>
  )
}
