import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/organisms/AdminSidebar'

export default function AdminLayout() {
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#070b11', color:'#e2e8f0' }}>
      <AdminSidebar />
      <main style={{ flex:1, padding:'2.5rem', overflowY:'auto', maxWidth:'100%' }}>
        <Outlet />
      </main>
    </div>
  )
}
