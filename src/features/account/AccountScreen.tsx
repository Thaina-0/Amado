import { LogOut } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { goBack, navigate } from '../../app/navigation'
import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import { BUTTON, BUTTON_PRIMARY, BUTTON_SECONDARY, STAGGER, stagger } from '../../ui/classes'
import { ListRow } from '../../ui/ListRow'
import { TopBar } from '../../ui/TopBar'
import { EXAMPLE_PLACES } from '../places/places'
import { browserStorage, loadReviewBook } from '../reviews/reviews'
import { answeredCount, canPlan, PROFILE_TOTAL } from './profile'
import { signOut, useSession } from './session'
import { useTravelProfile } from './travelProfile'
import { Page } from '../../ui/Page'

export function AccountScreen() {
  const { t } = useI18n()
  const session = useSession()
  const leaving = useRef(false)
  const travel = useTravelProfile()

  useEffect(() => {
    if (!session && !leaving.current) navigate({ name: 'login' }, true)
  }, [session])

  if (!session) return null

  const answered = answeredCount(travel)
  const book = loadReviewBook(browserStorage())
  const reviewed = EXAMPLE_PLACES.filter((place) => book[place.id] !== undefined)

  const leave = () => {
    leaving.current = true
    signOut()
    navigate({ name: 'welcome' })
  }

  return (
    <Page>
      <TopBar title={t('account.hello', { name: session.name })} onBack={goBack} />

      <section aria-labelledby="reviews-title" className="flex flex-col gap-3">
        <h2 id="reviews-title" className="text-title">
          {t('account.reviews')}
        </h2>
        {reviewed.length === 0 ? (
          <div className="flex flex-col gap-3 rounded-lg border-2 border-dashed border-line p-4">
            <p className="text-ink-secondary">{t('account.reviews.empty')}</p>
            <div className="flex">
              <a href={toHash({ name: 'explore' })} className={`${BUTTON} ${BUTTON_PRIMARY}`}>
                {t('account.reviews.explore')}
              </a>
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {reviewed.map((place, index) => (
              <li key={place.id} className={STAGGER} style={stagger(index)}>
                <ListRow
                  label={place.name}
                  value={t('review.value', { n: String(book[place.id]?.rating ?? 0) })}
                  href={toHash({ name: 'place', id: place.id })}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <ListRow
        label={t('account.profile')}
        value={
          answered === 0
            ? t('account.profile.empty')
            : t('account.profile.progress', { n: String(answered), total: String(PROFILE_TOTAL) })
        }
        href={toHash({ name: 'travel-profile' })}
      />

      <ListRow
        label={t('plan.title')}
        value={t(canPlan(travel) ? 'plan.entry.hint' : 'plan.entry.empty')}
        href={toHash({ name: canPlan(travel) ? 'plan' : 'travel-profile' })}
      />

      <div className="flex flex-col gap-2">
        <div className="flex">
          <button type="button" onClick={leave} className={`${BUTTON} ${BUTTON_SECONDARY}`}>
            <LogOut aria-hidden="true" size={24} />
            {t('account.logout')}
          </button>
        </div>
        <p className="text-body-sm text-ink-secondary">{t('account.logout.hint')}</p>
      </div>
    </Page>
  )
}
