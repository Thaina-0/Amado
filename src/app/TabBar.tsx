import {
  Compass,
  House,
  MapPin,
  Route as RouteIcon,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { useI18n } from '../i18n/context'
import type { MessageKey } from '../i18n/i18n'
import { PRESS } from '../ui/classes'
import { toHash, type Route, type Tab } from './routes'

const TABS: { tab: Tab; route: Route; label: MessageKey; icon: LucideIcon }[] = [
  { tab: 'home', route: { name: 'home' }, label: 'tab.home', icon: House },
  { tab: 'explore', route: { name: 'explore' }, label: 'tab.explore', icon: Compass },
  { tab: 'nearby', route: { name: 'nearby' }, label: 'tab.nearby', icon: MapPin },
  { tab: 'plan', route: { name: 'plan' }, label: 'tab.plan', icon: RouteIcon },
  { tab: 'emergency', route: { name: 'emergency' }, label: 'tab.emergency', icon: TriangleAlert },
]

export function TabBar({ active }: { active: Tab | null }) {
  const { t } = useI18n()
  return (
    <nav
      aria-label={t('nav.label')}
      className="sticky bottom-0 z-10 border-t border-line-subtle bg-surface pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
    >
      <ul className="mx-auto flex max-w-120">
        {TABS.map(({ tab, route, label, icon: Icon }) => {
          const selected = tab === active
          const emergency = tab === 'emergency'
          return (
            <li key={tab} className="flex-1">
              <a
                href={toHash(route)}
                aria-current={selected ? 'page' : undefined}
                className={`flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-0.5 text-body-sm whitespace-nowrap no-underline max-[359px]:text-xs max-[359px]:leading-tight max-[359px]:whitespace-normal ${PRESS} ${
                  emergency ? 'text-emergency-soft-ink' : 'text-ink'
                } ${selected ? 'font-bold' : ''}`}
              >
                <span
                  className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200 ${selected ? 'bg-subtle' : ''}`}
                >
                  <Icon
                    aria-hidden="true"
                    size={24}
                    className={`transition-transform duration-200 ease-out ${selected ? 'scale-110' : ''}`}
                  />
                </span>
                {t(label)}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
