import { useId, type InputHTMLAttributes } from 'react'

const FIELD =
  'box-border min-h-14 w-full rounded-lg border-2 border-line bg-surface px-4 text-ink placeholder:text-ink-muted aria-invalid:border-emergency-line'

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'value' | 'onChange' | 'className' | 'aria-invalid' | 'aria-describedby'
>

export function TextField({
  label,
  value,
  onChange,
  error,
  hint,
  ...input
}: InputProps & {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
}) {
  const id = useId()
  const described = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ')
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-label">
        {label}
      </label>
      <input
        {...input}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error !== undefined}
        aria-describedby={described || undefined}
        className={FIELD}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-body-sm text-ink-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-body-sm text-emergency-soft-ink">
          {error}
        </p>
      )}
    </div>
  )
}
