import { useEffect, useState } from 'react'
import Card from '@/components/atoms/Card'
import Skeleton from '@/components/atoms/Skeleton'
import api from '@/utils/axiosInstance'
import { MdFolderSpecial, MdEvent, MdAssignment, MdMail, MdPeople } from 'react-icons/md'

const widgets = [
  { key: 'totalProjects',    label: 'Projects',              icon: MdFolderSpecial, color: 'text-primary-500' },
  { key: 'upcomingEvents',   label: 'Upcoming Events',       icon: MdEvent,         color: 'text-accent-500'  },
  { key: 'pendingApps',      label: 'Pending Applications',  icon: MdAssignment,    color: 'text-warning'     },
  { key: 'unreadContacts',   label: 'Unread Contacts',       icon: MdMail,          color: 'text-error'       },
  { key: 'totalTeamMembers', label: 'Team Members',          icon: MdPeople,        color: 'text-success'     },
]

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/summary')
      .then((r) => setSummary(r.data))
      .catch(() => setSummary({}))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-on-surface mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {widgets.map(({ key, label, icon: Icon, color }) => (
          <Card key={key} className="p-5">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-7 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <div>
                <Icon size={24} className={color} aria-hidden="true" />
                <div className="text-3xl font-heading font-bold text-on-surface mt-2">
                  {summary?.[key] ?? '—'}
                </div>
                <div className="text-sm text-neutral-500 mt-1">{label}</div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
