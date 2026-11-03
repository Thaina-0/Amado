import { TriangleAlert } from 'lucide-react'
import { useI18n } from '../../i18n/context'
import { Alert } from '../../ui/Alert'
import { BUTTON_GHOST } from '../../ui/classes'

export function LoadingBlocks() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-3" role="status" aria-label={t('nearby.loading')}>
      {[0, 1, 2].map((card) => (
        <span
          key={card}
          className="flex flex-col gap-3 rounded-lg border border-line-subtle bg-surface p-4"
          aria-hidden="true"
        >
          <span className="block h-4 w-1/2 rounded-sm bg-subtle" />
          <span className="block h-3 w-1/3 rounded-sm bg-subtle" />
          <span className="block h-3 w-5/6 rounded-sm bg-subtle" />
        </span>
      ))}
    </div>
  )
}

export function ErrorBlock({ onRetry }: { onRetry: () => void }) {
  const { t } = useI18n()
  return (
    <Alert
      tone="emergency"
      icon={TriangleAlert}
      title={t('nearby.error.title')}
      action={
        <button type="button" className={`mt-2 ${BUTTON_GHOST}`} onClick={onRetry}>
          {t('common.tryAgain')}
        </button>
      }
    >
      {t('nearby.error.text')}
    </Alert>
  )
}
