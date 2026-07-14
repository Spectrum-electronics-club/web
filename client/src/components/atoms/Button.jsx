import { forwardRef } from 'react'
import { clsx } from 'clsx'

const variants = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
  secondary: 'bg-surface border border-neutral-300 dark:border-neutral-600 text-on-surface hover:bg-neutral-100 dark:hover:bg-neutral-800',
  ghost:     'bg-transparent text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950',
  danger:    'bg-error text-white hover:opacity-90 focus-visible:ring-red-500',
  accent:    'bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-500',
}

const sizes = {
  sm:  'px-3 py-1.5 text-sm rounded-sm',
  md:  'px-4 py-2 text-sm rounded',
  lg:  'px-6 py-3 text-base rounded-lg',
  xl:  'px-8 py-4 text-lg rounded-xl',
}

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    loading,
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
})

export default Button
