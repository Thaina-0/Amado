import { Route as RouteIcon, ShieldCheck, TriangleAlert } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { goBack, navigate } from '../../app/navigation'
import { useI18n } from '../../i18n/context'
import { Alert } from '../../ui/Alert'
import { BUTTON, BUTTON_PRIMARY, BUTTON_SECONDARY } from '../../ui/classes'
import { Page } from '../../ui/Page'
import { TopBar } from '../../ui/TopBar'
import { InterestChips, Question } from './ProfileFields'
import { answeredCount, canPlan, EXTRA_QUESTIONS, PLAN_QUESTIONS, PROFILE_TOTAL } from './profile'
import { saveTravelProfile, useTravelProfile } from './travelProfile'
import { useProfileAnswers } from './useProfileAnswers'

export function TravelProfileScreen() {
  const { t } = useI18n()
  const stored = useTravelProfile()
  const { answers, setAnswer, toggleInterest, reset } = useProfileAnswers(stored)
  const [tried, setTried] = useState(false)
  const answered = answeredCount(answers)
  const missing = tried && !canPlan(answers)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setTried(true)
    if (!canPlan(answers)) return
    saveTravelProfile(answers)
    navigate({ name: 'plan' })
  }

  const clear = () => {
    saveTravelProfile({})
    reset({})
    setTried(false)
  }

  return (
    <Page>
      <TopBar title={t('trip.title')} onBack={goBack} />
      <p className="text-ink-secondary">{t('trip.lead')}</p>
      <Alert tone="info" icon={ShieldCheck} title={t('trip.privacy.title')}>
        {t('trip.privacy.text')}
      </Alert>
      <p className="text-label" aria-live="polite">
        {t('account.profile.progress', { n: String(answered), total: String(PROFILE_TOTAL) })}
      </p>
      <form noValidate onSubmit={submit} className="flex flex-col gap-5">
        <section aria-labelledby="trip-plan-title" className="flex flex-col gap-4">
          <h2 id="trip-plan-title" className="text-title">
            {t('trip.section.plan')}
          </h2>
          {PLAN_QUESTIONS.map((id) => (
            <Question key={id} id={id} value={answers[id]} onChange={(v) => setAnswer(id, v)} />
          ))}
          <InterestChips value={answers.interests} onToggle={toggleInterest} />
        </section>

        <section aria-labelledby="trip-extra-title" className="flex flex-col gap-4">
          <h2 id="trip-extra-title" className="text-title">
            {t('trip.section.extra')}
          </h2>
          <p className="text-body-sm text-ink-secondary">{t('trip.section.extra.hint')}</p>
          {EXTRA_QUESTIONS.map((id) => (
            <Question key={id} id={id} value={answers[id]} onChange={(v) => setAnswer(id, v)} />
          ))}
        </section>

        {missing && (
          <Alert tone="warning" icon={TriangleAlert} title={t('trip.error')} role="alert">
            {t('trip.error.hint')}
          </Alert>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex">
            <button type="submit" className={`${BUTTON} ${BUTTON_PRIMARY}`}>
              <RouteIcon aria-hidden="true" size={24} />
              {t('trip.save')}
            </button>
          </div>
          {answered > 0 && (
            <div className="flex">
              <button type="button" onClick={clear} className={`${BUTTON} ${BUTTON_SECONDARY}`}>
                {t('trip.clear')}
              </button>
            </div>
          )}
        </div>
      </form>
    </Page>
  )
}
