import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { TextField } from '../TextField'

function Harness({ error, hint }: { error?: string; hint?: string }) {
  const [value, setValue] = useState('')
  return <TextField label="Nome" value={value} onChange={setValue} error={error} hint={hint} />
}

describe('TextField', () => {
  it('labels the input and reports what is typed', async () => {
    render(<Harness />)
    await userEvent.type(screen.getByLabelText('Nome'), 'Ana')
    expect(screen.getByLabelText('Nome')).toHaveValue('Ana')
  })

  it('is valid and has no description when there is no error or hint', () => {
    render(<Harness />)
    const input = screen.getByLabelText('Nome')
    expect(input).toHaveAttribute('aria-invalid', 'false')
    expect(input).not.toHaveAttribute('aria-describedby')
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('announces the error and ties it to the input', () => {
    render(<Harness error="Digite o nome." />)
    const input = screen.getByLabelText('Nome')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Digite o nome.')
    expect(screen.getByRole('alert')).toHaveTextContent('Digite o nome.')
  })

  it('describes the input with the hint first and the error after', () => {
    render(<Harness hint="Só o primeiro nome." error="Digite o nome." />)
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription(
      'Só o primeiro nome. Digite o nome.',
    )
  })
})
