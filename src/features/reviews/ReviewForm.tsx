import { Check, Star } from 'lucide-react'
import { useId, useState, type KeyboardEvent } from 'react'
import { useI18n } from '../../i18n/context'
import { usePreferences } from '../../preferences/context'
import { BUTTON, BUTTON_PRIMARY, BUTTON_SECONDARY } from '../../ui/classes'
import {
  browserStorage,
  loadReview,
  MAX_COMMENT,
  saveReview,
  STARS,
  type Rating,
  type Review,
} from './reviews'

function Stars({
  value,
  onChange,
  label,
}: {
  value: Rating | null
  onChange: (next: Rating) => void
  label: string
}) {
  const { t } = useI18n()
  const move = (event: KeyboardEvent, from: Rating, step: number) => {
    event.preventDefault()
    const next = Math.min(STARS.length, Math.max(1, from + step)) as Rating
    onChange(next)
    const radios = event.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role=radio]')
    radios?.[next - 1]?.focus()
  }
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1">
      {STARS.map((star) => {
        const filled = value !== null && star <= value
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={t('review.star', { n: String(star) })}
            tabIndex={value === star || (value === null && star === 1) ? 0 : -1}
            onClick={() => onChange(star)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowUp') move(event, star, 1)
              if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') move(event, star, -1)
            }}
            className="flex size-12 items-center justify-center rounded-full transition-transform duration-150 ease-out active:scale-90"
          >
            <Star
              aria-hidden="true"
              size={36}
              strokeWidth={2}
              className={`transition-[color,fill,transform] duration-150 ease-out ${
                filled ? 'fill-warn-mark text-warn-mark' : 'fill-transparent text-ink'
              } ${value === star ? 'scale-110' : 'scale-100'}`}
            />
          </button>
        )
      })}
    </div>
  )
}

export function ReviewForm({ placeId }: { placeId: string }) {
  const { t } = useI18n()
  const { preferences } = usePreferences()
  const commentId = useId()
  const titleId = useId()
  const [saved, setSaved] = useState<Review | null>(() => loadReview(browserStorage(), placeId))
  const [editing, setEditing] = useState(saved === null)
  const [rating, setRating] = useState<Rating | null>(saved?.rating ?? null)
  const [comment, setComment] = useState(saved?.comment ?? '')

  const submit = () => {
    if (rating === null) return
    const review: Review = { rating, comment: comment.trim(), counted: preferences.countVisit }
    saveReview(browserStorage(), placeId, review)
    setSaved(review)
    setEditing(false)
  }

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <h3 id={titleId} className="text-h3">
        {t('review.title')}
      </h3>
      {saved && !editing ? (
        <div className="flex animate-screen-in flex-col gap-3 rounded-lg border border-success-line bg-success-soft p-4">
          <p className="flex items-center gap-2 font-semibold text-success-text">
            <Check aria-hidden="true" size={20} />
            {t('review.saved.title')}
          </p>
          <p className="text-label">
            {t('review.yours')}: {t('review.value', { n: String(saved.rating) })}
          </p>
          {saved.comment && <p className="text-ink">{saved.comment}</p>}
          <p className="text-body-sm text-ink-secondary">{t('review.saved.text')}</p>
          <button
            type="button"
            className={`${BUTTON} ${BUTTON_SECONDARY}`}
            onClick={() => setEditing(true)}
          >
            {t('review.edit')}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Stars value={rating} onChange={setRating} label={t('review.stars')} />
          <p aria-live="polite" className="text-label">
            {rating === null ? t('review.none') : t('review.value', { n: String(rating) })}
          </p>
          <div className="flex flex-col gap-2">
            <label htmlFor={commentId} className="text-label">
              {t('review.comment.label')}
            </label>
            <textarea
              id={commentId}
              value={comment}
              maxLength={MAX_COMMENT}
              rows={4}
              onChange={(event) => setComment(event.target.value)}
              placeholder={t('review.comment.placeholder')}
              className="box-border w-full resize-none rounded-lg border-2 border-line bg-surface p-4 text-ink placeholder:text-ink-muted"
            />
            <p className="text-right text-body-sm text-ink-secondary">
              {t('review.comment.count', { n: String(comment.length) })}
            </p>
          </div>
          <p className="text-body-sm text-ink-secondary">{t('review.privacy')}</p>
          <div className="flex">
            <button
              type="button"
              disabled={rating === null}
              onClick={submit}
              className={`${BUTTON} ${BUTTON_PRIMARY} disabled:bg-action-disabled disabled:text-ink-muted`}
            >
              {t('review.save')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
