import { useEffect, useState } from 'react'
import { MdFolderSpecial, MdEvent, MdAssignment, MdMail, MdPeople } from 'react-icons/md'
import api from '@/utils/axiosInstance'

const WIDGETS = [
  { key:'totalProjects',    label:'Projects',             icon:MdFolderSpecial, color:'#06b6d4',  bg:'rgba(6,182,212,0.08)' },
  { key:'upcomingEvents',   label:'Upcoming Events',      icon:MdEvent,         color:'#a78bfa',  bg:'rgba(167,139,250,0.08)' },
  { key:'pendingApps',      label:'Pending Applications', icon:MdAssignment,    color:'#f59e0b',  bg:'rgba(245,158,11,0.08)' },
  { key:'unreadContacts',   label:'Unread Contacts',      icon:MdMail,          color:'#ef4444',  bg:'rgba(239,68,68,0.08)' },
  { key:'totalTeamMembers', label:'Team Members',         icon:MdPeople,        color:'#10b981',  bg:'rgba(16,185,129,0.08)' },
]

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/summary')
      .then(r => setSummary(r.data))
      .catch(() => setSummary({}))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'1.75rem', color:'#f1f5f9', margin:'0 0 0.35rem' }}>Dashboard</h1>
        <p style={{ color:'#64748b', fontSize:'0.875rem', margin:0 }}>Welcome back — here is a summary of your site.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1rem' }}>
        {WIDGETS.map(({ key, label, icon:Icon, color, bg }) => (
          <div key={key} className="card-glass" style={{ padding:'1.5rem' }}>
            {loading ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                <div className="skeleton" style={{ width:'40px', height:'40px', borderRadius:'10px' }} />
                <div className="skeleton" style={{ width:'60px', height:'32px', borderRadius:'6px' }} />
                <div className="skeleton" style={{ width:'100%', height:'14px' }} />
              </div>
            ) : (
              <>
                <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'2rem', color:'#f1f5f9', lineHeight:1, marginBottom:'0.35rem' }}>
                  {summary?.[key] ?? '—'}
                </div>
                <div style={{ color:'#64748b', fontSize:'0.8rem', fontWeight:500 }}>{label}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
