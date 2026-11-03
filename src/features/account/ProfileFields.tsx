import { useId } from 'react'
import { useI18n } from '../../i18n/context'
import type { MessageKey } from '../../i18n/i18n'
import { Chip } from '../../ui/Chip'
import { ChipRow } from '../../ui/ChipRow'
import { OptionRow } from '../../ui/OptionRow'
import { PLACE_CATEGORIES, type PlaceCategory } from '../places/places'
import { PROFILE_QUESTIONS, type QuestionId } from './profile'

// why: the keys are built from the question and option ids, and a test checks every one exists in every language
const key = (...parts: string[]) => parts.join('.') as MessageKey

export function Question({
  id,
  value,
  onChange,
}: {
  id: QuestionId
  value: string | undefined
  onChange: (value: string | undefined) => void
}) {
  const { t } = useI18n()
  const titleId = useId()
  return (
    <section className="flex flex-col gap-2">
      <h3 id={titleId} className="text-label">
        {t(key('signup', 'q', id))}
      </h3>
      <div role="radiogroup" aria-labelledby={titleId} className="flex flex-col gap-2">
        {PROFILE_QUESTIONS[id].map((option) => (
          <OptionRow
            key={option}
            label={t(key('signup', 'o', id, option))}
            description=""
            selected={value === option}
            onSelect={() => onChange(value === option ? undefined : option)}
          />
        ))}
      </div>
    </section>
  )
}

export function InterestChips({
  value,
  onToggle,
}: {
  value: readonly PlaceCategory[] | undefined
  onToggle: (category: PlaceCategory) => void
}) {
  const { t } = useI18n()
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-label">{t('signup.interests')}</h3>
      <ChipRow label={t('signup.interests')}>
        {PLACE_CATEGORIES.map((category) => (
          <Chip
            key={category}
            label={t(key('filter', category))}
            selected={value?.includes(category) ?? false}
            onSelect={() => onToggle(category)}
          />
        ))}
      </ChipRow>
    </section>
  )
}
