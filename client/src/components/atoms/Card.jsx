import { clsx } from 'clsx'

export default function Card({ className, hover = false, children, ...props }) {
  return (
    <div
      className={clsx(
        'bg-surface rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm',
        hover && 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
