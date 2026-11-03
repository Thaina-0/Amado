import { Copy, MapPin, Share2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n/context'
import { BUTTON, BUTTON_PRIMARY, BUTTON_SECONDARY } from '../../ui/classes'
import { getPosition } from './location'
import { shareMessage } from './share'

// invariant: the message holds the position only while this panel is open; closing it or leaving the screen drops it
type State =
  | { status: 'idle' }
  | { status: 'locating' }
  | { status: 'error' }
  | { status: 'ready'; text: string; copied: boolean }

export function ShareLocation() {
  const { t } = useI18n()
  const [state, setState] = useState<State>({ status: 'idle' })
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const locate = () => {
    setState({ status: 'locating' })
    getPosition().then(
      (position) => {
        if (mounted.current) {
          setState({
            status: 'ready',
            text: shareMessage(t('emergency.share.message'), position),
            copied: false,
          })
        }
      },
      () => {
        if (mounted.current) setState({ status: 'error' })
      },
    )
  }

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      if (mounted.current) setState({ status: 'ready', text, copied: true })
    } catch {
      // why: without clipboard access the message stays on screen as selectable text, which is enough to copy by hand
    }
  }

  const share = async (text: string) => {
    try {
      await navigator.share({ text })
    } catch {
      // why: closing the share sheet rejects the promise; the message stays on screen to try again or copy
    }
  }

  if (state.status === 'ready') {
    const { text, copied } = state
    return (
      <section
        aria-labelledby="share-title"
        className="flex flex-col gap-3 rounded-lg border-2 border-line bg-surface p-4"
      >
        <h2 id="share-title" className="text-label">
          {t('emergency.share.preview')}
        </h2>
        <p className="break-words select-all">{text}</p>
        <div className="flex gap-3">
          {typeof navigator.share === 'function' && (
            <button
              type="button"
              onClick={() => void share(text)}
              className={`${BUTTON} ${BUTTON_PRIMARY}`}
            >
              <Share2 aria-hidden="true" size={24} />
              {t('emergency.share.send')}
            </button>
          )}
          <button
            type="button"
            onClick={() => void copy(text)}
            className={`${BUTTON} ${BUTTON_SECONDARY}`}
          >
            <Copy aria-hidden="true" size={24} />
            {t('emergency.share.copy')}
          </button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p role="status" className="text-body-sm text-ink-secondary">
            {copied ? t('emergency.share.copied') : ''}
          </p>
          <button
            type="button"
            onClick={() => setState({ status: 'idle' })}
            className="inline-flex min-h-12 items-center gap-2 px-2 text-label text-link underline underline-offset-4"
          >
            <X aria-hidden="true" size={20} />
            {t('emergency.share.close')}
          </button>
        </div>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex">
        <button
          type="button"
          onClick={locate}
          disabled={state.status === 'locating'}
          className={`${BUTTON} ${BUTTON_SECONDARY}`}
        >
          <MapPin aria-hidden="true" size={24} />
          {t('emergency.share')}
        </button>
      </div>
      {state.status === 'locating' && (
        <p role="status" className="text-body-sm text-ink-secondary">
          {t('emergency.share.locating')}
        </p>
      )}
      {state.status === 'error' && (
        <p role="alert" className="text-body-sm text-emergency-soft-ink">
          {t('emergency.share.error')}
        </p>
      )}
      <p className="text-body-sm text-ink-secondary">{t('emergency.share.hint')}</p>
    </div>
  )
}
