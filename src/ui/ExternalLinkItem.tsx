import { ExternalLink } from 'lucide-react'

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// invariant: an external link always opens in a new tab with `noopener noreferrer`
export function ExternalLinkItem({
  href,
  label,
  context,
}: {
  href: string
  label: string
  context?: string
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center gap-2 text-link underline underline-offset-4"
      >
        <ExternalLink aria-hidden="true" size={16} />
        {label}: {hostOf(href)}
        {context && <span className="sr-only"> ({context})</span>}
      </a>
    </li>
  )
}
