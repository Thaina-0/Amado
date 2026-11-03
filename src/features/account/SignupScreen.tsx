import { ShieldCheck, UserPlus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { goBack, navigate } from '../../app/navigation'
import { useI18n } from '../../i18n/context'
import { usePreferences } from '../../preferences/context'
import { Alert } from '../../ui/Alert'
import { BUTTON, BUTTON_PRIMARY } from '../../ui/classes'
import { TextField } from '../../ui/TextField'
import { ToggleRow } from '../../ui/ToggleRow'
import { TopBar } from '../../ui/TopBar'
import { InterestChips, Question } from './ProfileFields'
import { QUESTION_IDS } from './profile'
import { signIn, useSession } from './session'
import { saveTravelProfile, useTravelProfile } from './travelProfile'
import { useProfileAnswers } from './useProfileAnswers'
import { Page } from '../../ui/Page'

export function SignupScreen() {
  const { t } = useI18n()
  const session = useSession()
  const { preferences, update } = usePreferences()
  const editing = session !== null
  const [name, setName] = useState(session?.name ?? '')
  const stored = useTravelProfile()
  const { answers, setAnswer, toggleInterest } = useProfileAnswers(
    Object.keys(stored).length > 0 ? stored : (session?.profile ?? {}),
  )
  const [count, setCount] = useState(preferences.countVisit)
  const [tried, setTried] = useState(false)

  const nameError = tried && name.trim() === ''

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setTried(true)
    if (name.trim() === '') return
    signIn(name.trim().slice(0, 40), answers)
    saveTravelProfile(answers)
    if (count !== preferences.countVisit) update({ countVisit: count })
    navigate({ name: 'account' })
  }

  return (
    <Page>
      <TopBar title={t(editing ? 'signup.edit.title' : 'signup.title')} onBack={goBack} />
      <p className="text-ink-secondary">{t('signup.lead')}</p>
      <Alert tone="info" icon={ShieldCheck} title={t('signup.why.title')}>
        {t('signup.why.text')}
      </Alert>
      <form noValidate onSubmit={submit} className="flex flex-col gap-5">
        <TextField
          label={t('signup.name')}
          hint={t('signup.name.hint')}
          type="text"
          autoComplete="off"
          maxLength={40}
          value={name}
          onChange={setName}
          error={nameError ? t('signup.error.name') : undefined}
        />
        {QUESTION_IDS.map((id) => (
          <Question key={id} id={id} value={answers[id]} onChange={(v) => setAnswer(id, v)} />
        ))}
        <InterestChips value={answers.interests} onToggle={toggleInterest} />
        <ToggleRow
          label={t('signup.consent.label')}
          description={t('signup.consent.text')}
          checked={count}
          onChange={setCount}
        />
        <div className="flex">
          <button type="submit" className={`${BUTTON} ${BUTTON_PRIMARY}`}>
            <UserPlus aria-hidden="true" size={24} />
            {t(editing ? 'signup.save' : 'signup.submit')}
          </button>
        </div>
      </form>
    </Page>
  )
}
