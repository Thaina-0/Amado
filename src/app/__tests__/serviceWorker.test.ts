import { describe, expect, it, vi } from 'vitest'
import { reloadOnNewVersion } from '../serviceWorker'

function fakeContainer(controller: ServiceWorker | null) {
  const target = new EventTarget()
  return {
    container: {
      controller,
      addEventListener: target.addEventListener.bind(target),
    },
    swap: () => target.dispatchEvent(new Event('controllerchange')),
  }
}

describe('reloadOnNewVersion', () => {
  it('reloads once when a new worker takes over a page that already had one', () => {
    const reload = vi.fn()
    const { container, swap } = fakeContainer({} as ServiceWorker)
    reloadOnNewVersion(container, reload)

    swap()
    swap()

    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('does not reload on the first install, when the page had no worker', () => {
    const reload = vi.fn()
    const { container, swap } = fakeContainer(null)
    reloadOnNewVersion(container, reload)

    swap()

    expect(reload).not.toHaveBeenCalled()
  })

  it('does not reload until a worker takes over', () => {
    const reload = vi.fn()
    const { container } = fakeContainer({} as ServiceWorker)
    reloadOnNewVersion(container, reload)

    expect(reload).not.toHaveBeenCalled()
  })
})
