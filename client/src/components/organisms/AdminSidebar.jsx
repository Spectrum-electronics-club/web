import { NavLink, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { useAuth } from '@/context/AuthContext'
import {
  MdDashboard, MdFolderSpecial, MdEvent, MdPhoto,
  MdPeople, MdArticle, MdCampaign, MdAssignment,
  MdMail, MdLogout,
} from 'react-icons/md'

const navItems = [
  { to: '/admin/dashboard',     icon: MdDashboard,      label: 'Dashboard' },
  { to: '/admin/projects',      icon: MdFolderSpecial,  label: 'Projects' },
  { to: '/admin/events',        icon: MdEvent,          label: 'Events' },
  { to: '/admin/gallery',       icon: MdPhoto,          label: 'Gallery' },
  { to: '/admin/team',          icon: MdPeople,         label: 'Team' },
  { to: '/admin/publications',  icon: MdArticle,        label: 'Publications' },
  { to: '/admin/announcements', icon: MdCampaign,       label: 'Announcements' },
  { to: '/admin/recruitment',   icon: MdAssignment,     label: 'Recruitment' },
  { to: '/admin/contacts',      icon: MdMail,           label: 'Contacts' },
]

export default function AdminSidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-neutral-900 text-neutral-400 flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-neutral-800">
        <span className="font-heading font-bold text-lg text-white">NGND Admin</span>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 py-4">
        <ul className="space-y-1 px-3" role="list">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'hover:bg-neutral-800 hover:text-white'
                  )
                }
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors"
        >
          <MdLogout size={18} aria-hidden="true" />
          Log out
        </button>
      </div>
    </aside>
  )
}
