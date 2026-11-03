import { useI18n } from '../../i18n/context'
import { Chip } from '../../ui/Chip'
import { ChipRow } from '../../ui/ChipRow'
import { PLACE_CATEGORIES, type CategoryFilter } from './places'

export function CategoryChips({
  value,
  onChange,
}: {
  value: CategoryFilter
  onChange: (value: CategoryFilter) => void
}) {
  const { t } = useI18n()
  const options: CategoryFilter[] = ['all', ...PLACE_CATEGORIES]
  return (
    <ChipRow label={t('filter.label')}>
      {options.map((option) => (
        <Chip
          key={option}
          label={t(option === 'all' ? 'filter.all' : `filter.${option}`)}
          selected={value === option}
          onSelect={() => onChange(option)}
        />
      ))}
    </ChipRow>
  )
}
