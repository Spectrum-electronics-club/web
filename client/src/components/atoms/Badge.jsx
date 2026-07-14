import { clsx } from 'clsx'

const variants = {
  default:  'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
  primary:  'bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300',
  accent:   'bg-accent-100 dark:bg-accent-700/20 text-accent-700 dark:text-accent-300',
  success:  'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  warning:  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  error:    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  ongoing:  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  archived: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500',
}

export default function Badge({ variant = 'default', className, children }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  )
}
