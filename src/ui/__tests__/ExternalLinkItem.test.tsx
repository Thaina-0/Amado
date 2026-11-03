import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ExternalLinkItem } from '../ExternalLinkItem'

const renderItem = (href: string, context?: string) =>
  render(
    <ul>
      <ExternalLinkItem href={href} label="Fonte" context={context} />
    </ul>,
  )

describe('ExternalLinkItem', () => {
  it('opens in a new tab without leaking the opener and shows the host without www', () => {
    renderItem('https://www.exemplo.com.br/pagina')
    const link = screen.getByRole('link', { name: 'Fonte: exemplo.com.br' })
    expect(link).toHaveAttribute('href', 'https://www.exemplo.com.br/pagina')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('adds the context for screen readers only', () => {
    renderItem('https://exemplo.com', 'CTM10')
    expect(
      screen.getByRole('link', { name: /^Fonte: exemplo\.com\s*\(CTM10\)$/ }),
    ).toBeInTheDocument()
  })

  it('falls back to the raw text when the address is not a URL', () => {
    renderItem('not a url')
    expect(screen.getByRole('link', { name: 'Fonte: not a url' })).toBeInTheDocument()
  })
})
