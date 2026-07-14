import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Select = forwardRef(function Select(
  { label, id, error, options = [], placeholder, className, required, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-on-surface">
          {label}
          {required && <span className="text-error ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={!!error}
        className={clsx(
          'w-full px-3 py-2 text-sm rounded bg-surface border transition-colors duration-200',
          'text-on-surface cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          error
            ? 'border-error focus:ring-error'
            : 'border-neutral-300 dark:border-neutral-600',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="text-xs text-error mt-0.5">
          {error}
        </p>
      )}
    </div>
  )
})

export default Select
