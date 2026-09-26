import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/organisms/AdminSidebar'
import { FiMenu } from 'react-icons/fi'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#070b11', color:'#e2e8f0' }} className="flex-col md:flex-row">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main style={{ flex:1, padding:'1.5rem', overflowY:'auto', maxWidth:'100%' }} className="md:p-10">
        <div className="md:hidden flex items-center mb-6">
          <button 
            onClick={() => setSidebarOpen(true)} 
            style={{
              background: '#0d1117', border: '1px solid rgba(0,212,255,0.1)',
              color: '#e2e8f0', padding: '0.5rem', borderRadius: '8px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <FiMenu size={20} /> <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Menu</span>
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
