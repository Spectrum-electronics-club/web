import { clsx } from 'clsx'

export default function Container({ className, narrow = false, children }) {
  return (
    <div
      className={clsx(
        'container-main',
        narrow && 'max-w-4xl',
        className
      )}
    >
      {children}
    </div>
  )
}
