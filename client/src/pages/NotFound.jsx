import { Link } from 'react-router-dom'
import PageTransition from '@/components/molecules/PageTransition'
import Button from '@/components/atoms/Button'

export default function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8">
        <span className="text-8xl font-heading font-bold text-neutral-200 dark:text-neutral-800 select-none">
          404
        </span>
        <h1 className="text-2xl font-heading mt-4 mb-2">Page not found</h1>
        <p className="text-neutral-500 mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary">Go back home</Button>
        </Link>
      </div>
    </PageTransition>
  )
}
