import { clsx } from 'clsx'

export default function SectionHeader({ label, title, subtitle, center = false, className }) {
  return (
    <div className={clsx('mb-12', center && 'text-center', className)}>
      {label && (
        <span className="text-sm font-semibold uppercase tracking-widest text-primary-500 mb-2 block">
          {label}
        </span>
      )}
      <h2 className="text-on-surface">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-neutral-500 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
