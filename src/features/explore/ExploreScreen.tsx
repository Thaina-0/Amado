import { EXPLORE_CATEGORIES, toHash } from '../../app/routes'
import { STAGGER, stagger } from '../../ui/classes'
import { useI18n } from '../../i18n/context'
import { ListRow } from '../../ui/ListRow'
import { ProfileLink } from '../../ui/ProfileLink'
import { CATEGORY_DESCRIPTION, CATEGORY_LABEL } from './categoryLabels'
import { Page } from '../../ui/Page'

export function ExploreScreen() {
  const { t } = useI18n()
  return (
    <Page>
      <header className="flex items-start gap-3">
        <div className="flex-1">
          <h1 className="text-h1">{t('explore.title')}</h1>
          <p className="text-ink-secondary">{t('explore.subtitle')}</p>
        </div>
        <ProfileLink />
      </header>
      <ul className="flex flex-col gap-3" aria-label={t('explore.categories')}>
        {EXPLORE_CATEGORIES.map((id, index) => (
          <li key={id} className={STAGGER} style={stagger(index)}>
            <ListRow
              label={t(CATEGORY_LABEL[id])}
              value={t(CATEGORY_DESCRIPTION[id])}
              href={toHash({ name: 'explore-category', id })}
            />
          </li>
        ))}
      </ul>
      <ListRow
        label={t('events.title')}
        value={t('events.explore.hint')}
        href={toHash({ name: 'events' })}
      />
    </Page>
  )
}
