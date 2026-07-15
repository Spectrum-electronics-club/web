import { useEffect, useState } from 'react'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/atoms/Modal'
import api from '@/utils/axiosInstance'

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/admin/contacts').then((r) => setContacts(r.data.data || r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openView = async (c) => {
    setViewing(c)
    if (!c.isRead) {
      try {
        await api.patch(`/admin/contacts/${c._id}/read`)
        setContacts(prev => prev.map(p => p._id === c._id ? { ...p, isRead: true } : p))
      } catch (err) {
        console.error('Failed to mark as read', err)
      }
    }
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/contacts/${deleteConfirm._id}`)
      setDeleteConfirm(null)
      load()
    } catch {
      alert('Delete failed.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-on-surface">Contact Queries</h1>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <div className="bg-surface rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800 text-left">
              <tr>
                {['Status', 'Name', 'Email', 'Subject', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {contacts.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-6 text-center text-neutral-500">No contact queries found.</td></tr>
              )}
              {contacts.map((c) => (
                <tr key={c._id} className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${!c.isRead ? 'font-semibold bg-neutral-50/50 dark:bg-neutral-800/30' : ''}`}>
                  <td className="px-4 py-3">
                    {!c.isRead ? <Badge variant="primary">New</Badge> : <Badge variant="default">Read</Badge>}
                  </td>
                  <td className="px-4 py-3 text-on-surface">{c.fullName}</td>
                  <td className="px-4 py-3 text-neutral-500">{c.email}</td>
                  <td className="px-4 py-3 text-on-surface truncate max-w-[200px]">{c.subject}</td>
                  <td className="px-4 py-3 text-neutral-500">{new Date(c.submittedAt || c.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openView(c)}>View</Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleteConfirm(c)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View modal */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Contact Query" size="md">
        {viewing && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">From</p>
              <p className="text-on-surface font-medium">{viewing.fullName} &lt;{viewing.email}&gt;</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Subject</p>
              <p className="text-on-surface font-medium">{viewing.subject}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Message</p>
              <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg whitespace-pre-wrap text-on-surface">
                {viewing.message}
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <Button onClick={() => setViewing(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Query" size="sm">
        <p className="text-neutral-500 mb-6">
          Are you sure you want to delete this query from <strong>{deleteConfirm?.fullName}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
