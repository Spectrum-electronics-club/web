import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/organisms/AdminSidebar'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-surface-2 text-on-surface">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
