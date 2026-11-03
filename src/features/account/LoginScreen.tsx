import { Info, LogIn } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { goBack, navigate } from '../../app/navigation'
import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import { Alert } from '../../ui/Alert'
import { BrandMark } from '../../ui/BrandMark'
import { BUTTON, BUTTON_GHOST, BUTTON_PRIMARY } from '../../ui/classes'
import { TextField } from '../../ui/TextField'
import { TopBar } from '../../ui/TopBar'
import { isValidEmail, nameFromEmail, signIn, useSession } from './session'
import { Page } from '../../ui/Page'

export function LoginScreen() {
  const { t } = useI18n()
  const session = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tried, setTried] = useState(false)

  useEffect(() => {
    if (session) navigate({ name: 'account' }, true)
  }, [session])

  const emailError = tried && !isValidEmail(email)
  const passwordError = tried && password === ''

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setTried(true)
    if (!isValidEmail(email) || password === '') return
    signIn(nameFromEmail(email))
    navigate({ name: 'account' })
  }

  return (
    <Page>
      <TopBar title={t('login.title')} onBack={goBack} />
      <div className="flex justify-center py-2">
        <BrandMark size={64} />
      </div>
      <p className="text-ink-secondary">{t('login.lead')}</p>
      <Alert tone="info" icon={Info} title={t('login.demo.title')}>
        {t('login.demo.text')}
      </Alert>
      <form noValidate onSubmit={submit} className="flex flex-col gap-4">
        <TextField
          label={t('login.email')}
          type="email"
          inputMode="email"
          autoComplete="off"
          placeholder="nome@exemplo.com"
          value={email}
          onChange={setEmail}
          error={emailError ? t('login.error.email') : undefined}
        />
        <TextField
          label={t('login.password')}
          type="password"
          autoComplete="off"
          value={password}
          onChange={setPassword}
          error={passwordError ? t('login.error.password') : undefined}
        />
        <div className="flex">
          <button type="submit" className={`${BUTTON} ${BUTTON_PRIMARY}`}>
            <LogIn aria-hidden="true" size={24} />
            {t('login.submit')}
          </button>
        </div>
      </form>
      <div className="flex justify-center">
        <a
          href={toHash({ name: 'signup' })}
          className={`${BUTTON_GHOST} inline-flex min-h-12 items-center text-center`}
        >
          {t('login.signup')}
        </a>
      </div>
    </Page>
  )
}
