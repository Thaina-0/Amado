import { ArrowLeft } from 'lucide-react'
import { useI18n } from '../i18n/context'
import { IconButton } from './IconButton'

export function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  const { t } = useI18n()
  return (
    <header className="flex items-center gap-3">
      <IconButton label={t('common.back')} onClick={onBack}>
        <ArrowLeft aria-hidden="true" size={24} />
      </IconButton>
      <h1 className="text-h3">{title}</h1>
    </header>
  )
}
