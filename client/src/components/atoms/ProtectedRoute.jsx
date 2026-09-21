import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import PageLoader from './PageLoader'

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />

  if (!currentUser) {
    return <Navigate to="/spectrum-manage/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
