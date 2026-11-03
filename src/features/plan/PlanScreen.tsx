import { goBack } from '../../app/navigation'
import { toHash } from '../../app/routes'
import { useI18n } from '../../i18n/context'
import type { MessageKey } from '../../i18n/i18n'
import { BUTTON, BUTTON_PRIMARY, STAGGER, stagger } from '../../ui/classes'
import { ListRow } from '../../ui/ListRow'
import { Page } from '../../ui/Page'
import { Tag } from '../../ui/Tag'
import { TopBar } from '../../ui/TopBar'
import { canPlan, type Profile } from '../account/profile'
import { useTravelProfile } from '../account/travelProfile'
import { EXAMPLE_PLACES, type PlaceCategory } from '../places/places'
import { buildPlan, type StopReason } from './plan'

const CATEGORY_KEY: Record<PlaceCategory, MessageKey> = {
  gastronomia: 'filter.gastronomia',
  cultura: 'filter.cultura',
  praias: 'filter.praias',
  natureza: 'filter.natureza',
  esportes: 'filter.esportes',
}

const REASON_KEY: Record<NonNullable<Profile['reason']>, MessageKey> = {
  leisure: 'signup.o.reason.leisure',
  culture: 'signup.o.reason.culture',
  food: 'signup.o.reason.food',
  sports: 'signup.o.reason.sports',
  work: 'signup.o.reason.work',
  family: 'signup.o.reason.family',
}

const STAY_KEY: Record<NonNullable<Profile['stay']>, MessageKey> = {
  day: 'signup.o.stay.day',
  short: 'signup.o.stay.short',
  week: 'signup.o.stay.week',
  long: 'signup.o.stay.long',
}

function daysLabel(t: ReturnType<typeof useI18n>['t'], n: number): string {
  return n === 1 ? t('plan.days.one') : t('plan.days.many', { n: String(n) })
}

export function PlanScreen() {
  const { t } = useI18n()
  const profile = useTravelProfile()

  if (!canPlan(profile)) {
    return (
      <Page>
        <TopBar title={t('plan.title')} onBack={goBack} />
        <div className="flex flex-col gap-3 rounded-lg border-2 border-dashed border-line p-4">
          <h2 className="text-title">{t('plan.empty.title')}</h2>
          <p className="text-ink-secondary">{t('plan.empty.text')}</p>
          <div className="flex">
            <a href={toHash({ name: 'travel-profile' })} className={`${BUTTON} ${BUTTON_PRIMARY}`}>
              {t('plan.empty.action')}
            </a>
          </div>
        </div>
      </Page>
    )
  }

  const plan = buildPlan(profile, EXAMPLE_PLACES)
  const reasonText = (reason: StopReason): string => {
    switch (reason.kind) {
      case 'interest':
        return t('plan.why.interest', { category: t(CATEGORY_KEY[reason.category]) })
      case 'reason':
        return t('plan.why.reason', { reason: t(REASON_KEY[reason.reason]) })
      case 'family':
        return t('plan.why.family')
      case 'fill':
        return t('plan.why.fill')
    }
  }
  const interests = (profile.interests ?? []).map((category) => t(CATEGORY_KEY[category]))

  return (
    <Page>
      <TopBar title={t('plan.title')} onBack={goBack} />

      <div className="flex flex-col gap-2">
        <Tag>{t('common.example')}</Tag>
        <p className="text-ink-secondary">{t('plan.lead')}</p>
        <p className="text-label">
          {daysLabel(t, plan.days.length)} · {t('plan.perDay', { n: String(plan.perDay) })}
        </p>
        {plan.days.length < plan.requestedDays && (
          <p className="text-body-sm text-ink-secondary">
            {t('plan.limited', {
              wanted: daysLabel(t, plan.requestedDays),
              days: daysLabel(t, plan.days.length),
            })}
          </p>
        )}
      </div>

      {plan.days.map((day) => (
        <section
          key={day.number}
          aria-labelledby={`day-${day.number}`}
          className="flex flex-col gap-3"
        >
          <h2 id={`day-${day.number}`} className="text-h3">
            {t('plan.day', { n: String(day.number), theme: t(CATEGORY_KEY[day.theme]) })}
          </h2>
          <ol className="flex flex-col gap-3">
            {day.stops.map((stop, index) => (
              <li
                key={stop.place.id}
                className={`${STAGGER} flex flex-col gap-2`}
                style={stagger(index)}
              >
                <ListRow
                  label={`${index + 1}. ${stop.place.name}`}
                  value={t(CATEGORY_KEY[stop.place.category])}
                  href={toHash({ name: 'place', id: stop.place.id })}
                />
                <ul aria-label={t('plan.why.title')} className="flex flex-col gap-1 px-4">
                  {stop.reasons.map((reason) => (
                    <li key={reason.kind} className="text-body-sm text-ink-secondary">
                      {reasonText(reason)}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <p className="text-body-sm text-ink-secondary">{t('place.unconfirmed')}</p>

      <section aria-labelledby="how-title" className="flex flex-col gap-2">
        <h2 id="how-title" className="text-h3">
          {t('plan.how.title')}
        </h2>
        <p className="text-ink-secondary">{t('plan.how.lead')}</p>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-ink-secondary">
          <li>
            {profile.stay
              ? t('plan.how.stay', { value: t(STAY_KEY[profile.stay]) })
              : t('plan.how.stay.none')}
          </li>
          <li>
            {t(profile.party === 'family' ? 'plan.how.pace.family' : 'plan.how.pace', {
              n: String(plan.perDay),
            })}
          </li>
          {interests.length > 0 && (
            <li>{t('plan.how.interests', { list: interests.join(', ') })}</li>
          )}
          {profile.reason && (
            <li>{t('plan.how.reason', { value: t(REASON_KEY[profile.reason]) })}</li>
          )}
          <li>{t('plan.how.unused')}</li>
        </ul>
      </section>

      <ListRow label={t('plan.edit')} value="" href={toHash({ name: 'travel-profile' })} />
    </Page>
  )
}
