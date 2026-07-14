import { clsx } from 'clsx'

export function Tabs({ tabs = [], active, onChange, className }) {
  return (
    <div
      role="tablist"
      className={clsx(
        'flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={active === tab.value}
          onClick={() => onChange?.(tab.value)}
          className={clsx(
            'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
            active === tab.value
              ? 'bg-surface text-primary-600 shadow-sm'
              : 'text-neutral-500 hover:text-on-surface'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function TabPanel({ value, active, children }) {
  if (value !== active) return null
  return <div role="tabpanel">{children}</div>
}
