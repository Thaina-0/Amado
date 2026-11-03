// why: the session and the travel profile are both external stores that other tabs can change, so each needs the same subscribe with the `storage` event
export function subscriberFor(listeners: Set<() => void>) {
  return (listener: () => void): (() => void) => {
    listeners.add(listener)
    window.addEventListener('storage', listener)
    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', listener)
    }
  }
}
