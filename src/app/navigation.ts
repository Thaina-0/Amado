import { useSyncExternalStore } from 'react'
import { toHash, type Route } from './routes'

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export function useHash(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => '',
  )
}

export function navigate(route: Route, replace = false): void {
  const hash = toHash(route)
  if (replace) {
    window.history.replaceState(null, '', hash)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  } else {
    window.location.hash = hash
  }
}

export function goBack(): void {
  if (window.history.length > 1) window.history.back()
  else navigate({ name: 'home' }, true)
}
