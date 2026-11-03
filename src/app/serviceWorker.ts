type WorkerContainer = Pick<ServiceWorkerContainer, 'controller' | 'addEventListener'>

// invariant: only a swap of an existing controller reloads; the first install has no controller before it and keeps the page as it is
export function reloadOnNewVersion(container: WorkerContainer, reload: () => void): void {
  const hadController = container.controller !== null
  let reloading = false

  container.addEventListener('controllerchange', () => {
    // hazard: some browsers fire controllerchange more than once; a second reload would loop
    if (!hadController || reloading) return
    reloading = true
    reload()
  })
}

// why: generateSW with autoUpdate already skips waiting and claims clients, so a plain register after load is enough and keeps the worker off the first paint
export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return

  reloadOnNewVersion(navigator.serviceWorker, () => window.location.reload())
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js')
  })
}
