import { User } from 'lucide-react'
import { toHash } from '../app/routes'
import { useI18n } from '../i18n/context'
import { IconButton } from './IconButton'

export function ProfileLink() {
  const { t } = useI18n()
  return (
    <IconButton label={t('common.openProfile')} href={toHash({ name: 'profile' })}>
      <User aria-hidden="true" size={24} />
    </IconButton>
  )
}
