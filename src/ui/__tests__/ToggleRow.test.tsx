import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { ToggleRow } from '../ToggleRow'

function Harness({ initial }: { initial: boolean }) {
  const [checked, setChecked] = useState(initial)
  return (
    <ToggleRow label="Rótulo" description="Descrição" checked={checked} onChange={setChecked} />
  )
}

const knobSide = (container: HTMLElement) =>
  container.querySelector('[role="switch"] .rounded-full.border-2')?.className ?? ''

describe('ToggleRow', () => {
  it('draws the knob on the right when on and on the left when off', async () => {
    const { container } = render(<Harness initial={false} />)
    expect(knobSide(container)).toContain('justify-start')
    expect(knobSide(container)).not.toContain('justify-end')
    await userEvent.click(screen.getByRole('switch'))
    expect(knobSide(container)).toContain('justify-end')
    expect(knobSide(container)).not.toContain('justify-start')
    expect(screen.getByRole('switch')).toHaveTextContent('Ligado')
  })
})
