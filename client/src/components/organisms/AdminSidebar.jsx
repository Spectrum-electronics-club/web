import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { 
  FiHome, FiBriefcase, FiCalendar, FiImage, FiUsers, 
  FiFileText, FiBell, FiUserPlus, FiMessageSquare, FiSettings, FiLogOut 
} from 'react-icons/fi'

const navItems = [
  { to: '/admin/dashboard',     icon: FiHome,          label: 'Dashboard' },
  { to: '/admin/projects',      icon: FiBriefcase,     label: 'Projects' },
  { to: '/admin/events',        icon: FiCalendar,      label: 'Events' },
  { to: '/admin/gallery',       icon: FiImage,         label: 'Gallery' },
  { to: '/admin/team',          icon: FiUsers,         label: 'Team' },
  { to: '/admin/publications',  icon: FiFileText,      label: 'Publications' },
  { to: '/admin/announcements', icon: FiBell,          label: 'Announcements' },
  { to: '/admin/recruitment',   icon: FiUserPlus,      label: 'Recruitment' },
  { to: '/admin/contacts',      icon: FiMessageSquare, label: 'Messages' },
  { to: '/admin/settings',      icon: FiSettings,      label: 'Settings' },
]

export default function AdminSidebar() {
  const { logout } = useAuth()
  const navigate   = useNavigate()

  return (
    <aside style={{
      width:'240px', minHeight:'100vh', flexShrink:0,
      background:'#030712',
      borderRight:'1px solid rgba(0,212,255,0.08)',
      display:'flex', flexDirection:'column',
    }}>
      {/* Logo */}
      <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid rgba(0,212,255,0.08)', display:'flex', alignItems:'center', gap:'0.6rem' }}>
        <img src="/logo.png" alt="Spectrum" style={{ width:'32px', height:'32px', borderRadius:'9px', objectFit:'contain' }} />
        <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '0.05em' }}>
          SPECTRUM Admin
        </h2>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'0.75rem 0.625rem', overflowY:'auto' }} aria-label="Admin navigation">
        <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'2px' }}>
          {navItems.map(({ to, icon:Icon, label }) => (
            <li key={to}>
              <NavLink to={to} style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:'0.625rem',
                padding:'0.6rem 0.75rem', borderRadius:'10px',
                fontSize:'0.875rem', fontWeight:500, textDecoration:'none',
                transition:'all 0.15s',
                background: isActive ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: isActive ? '#22d3ee' : '#64748b',
              })}
                onMouseEnter={e => { if (!e.currentTarget.dataset.active) { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#e2e8f0' } }}
                onMouseLeave={e => { if (!e.currentTarget.dataset.active) { e.currentTarget.style.background=''; e.currentTarget.style.color='' } }}
              >
                <Icon size={17} aria-hidden="true" /> {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div style={{ padding:'0.625rem', borderTop:'1px solid rgba(0,212,255,0.08)' }}>
        <button onClick={() => { logout(); navigate('/admin/login') }} style={{
          width:'100%', display:'flex', alignItems:'center', gap:'0.625rem',
          padding:'0.6rem 0.75rem', borderRadius:'10px', border:'none',
          fontSize:'0.875rem', fontWeight:500, cursor:'pointer',
          background:'transparent', color:'#ef4444', transition:'all 0.15s',
        }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.08)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
        >
          <FiLogOut size={17} /> Log out
        </button>
      </div>
    </aside>
  )
}
