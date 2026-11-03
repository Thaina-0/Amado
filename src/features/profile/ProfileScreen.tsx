import { goBack } from '../../app/navigation'
import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import { LANGUAGE_NAME } from '../../i18n/i18n'
import type { MessageKey } from '../../i18n/i18n'
import { usePreferences } from '../../preferences/context'
import { THEMES, type Theme } from '../../preferences/preferences'
import { useSession } from '../account/session'
import { ListRow } from '../../ui/ListRow'
import { OptionRow } from '../../ui/OptionRow'
import { TopBar } from '../../ui/TopBar'
import { Page } from '../../ui/Page'

const THEME_KEY: Record<Theme, [MessageKey, MessageKey]> = {
  auto: ['theme.auto', 'theme.auto.hint'],
  light: ['theme.light', 'theme.light.hint'],
  dark: ['theme.dark', 'theme.dark.hint'],
  contrast: ['theme.contrast', 'theme.contrast.hint'],
}

export function ProfileScreen() {
  const { t, language } = useI18n()
  const { preferences, update } = usePreferences()
  const session = useSession()

  return (
    <Page>
      <TopBar title={t('profile.title')} onBack={goBack} />

      {session ? (
        <ListRow
          label={t('account.open')}
          value={session.name}
          href={toHash({ name: 'account' })}
        />
      ) : (
        <ListRow
          label={t('account.login')}
          value={t('account.login.hint')}
          href={toHash({ name: 'login' })}
        />
      )}

      <ListRow
        label={t('profile.language')}
        value={LANGUAGE_NAME[language]}
        href={toHash({ name: 'language' })}
      />

      <section aria-labelledby="appearance-title" className="flex flex-col gap-2">
        <h2 id="appearance-title" className="text-title">
          {t('profile.appearance')}
        </h2>
        <div role="radiogroup" aria-labelledby="appearance-title" className="flex flex-col gap-2">
          {THEMES.map((theme) => (
            <OptionRow
              key={theme}
              label={t(THEME_KEY[theme][0])}
              description={t(THEME_KEY[theme][1])}
              selected={preferences.theme === theme}
              onSelect={() => update({ theme })}
            />
          ))}
        </div>
      </section>

      <ListRow
        label={t('profile.privacy')}
        value={t('profile.privacy.hint')}
        href={toHash({ name: 'privacy' })}
      />
    </Page>
  )
}
