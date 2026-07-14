import { clsx } from 'clsx'

export default function Section({ id, className, alt = false, children }) {
  return (
    <section
      id={id}
      className={clsx(
        'section-padding',
        alt ? 'bg-surface-2' : 'bg-surface',
        className
      )}
    >
      {children}
    </section>
  )
}
