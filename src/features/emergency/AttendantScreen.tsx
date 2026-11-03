import { navigate } from '../../app/navigation'
import { useI18n } from '../../i18n/context'
import { Page } from '../../ui/Page'
import { TopBar } from '../../ui/TopBar'
import { ATTENDANT_PHRASES } from './data'

export function AttendantScreen() {
  const { t, language } = useI18n()
  return (
    <Page bottomInset>
      <TopBar title={t('emergency.show')} onBack={() => navigate({ name: 'emergency' })} />
      <p className="text-ink-secondary">{t('emergency.show.lead')}</p>
      <ul className="flex flex-col gap-3" aria-label={t('emergency.show.listLabel')}>
        {ATTENDANT_PHRASES.map((phrase) => (
          <li
            key={phrase.id}
            className="flex flex-col gap-1 rounded-lg border-2 border-line bg-surface p-4"
          >
            <p lang="pt-BR" className="text-h1">
              {phrase.text.pt}
            </p>
            {language !== 'pt' && <p className="text-ink-secondary">{phrase.text[language]}</p>}
          </li>
        ))}
      </ul>
      <p className="text-body-sm text-ink-secondary">{t('emergency.show.review')}</p>
    </Page>
  )
}
