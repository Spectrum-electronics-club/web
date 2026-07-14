import { clsx } from 'clsx'

export default function Skeleton({ className, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={clsx('skeleton', className)}
      {...props}
    />
  )
}

export function SkeletonCard({ className }) {
  return (
    <div className={clsx('bg-surface border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 space-y-3', className)}>
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={clsx('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}
