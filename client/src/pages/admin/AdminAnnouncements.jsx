import { useEffect, useState } from 'react'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/atoms/Modal'
import api from '@/utils/axiosInstance'

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editing, setEditing] = useState(null)
  const [fields, setFields] = useState({ title: '', body: '', isPinned: false, expiresAt: '' })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/admin/announcements').then((r) => setAnnouncements(r.data.data || r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setFields({ title: '', body: '', isPinned: false, expiresAt: '' }); setFormOpen(true) }
  const openEdit = (a) => {
    setEditing(a)
    setFields({
      title: a.title || '',
      body: a.body || '',
      isPinned: !!a.isPinned,
      expiresAt: a.expiresAt ? new Date(a.expiresAt).toISOString().split('T')[0] : ''
    })
    setFormOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...fields, expiresAt: fields.expiresAt ? new Date(fields.expiresAt).toISOString() : null }
    try {
      if (editing) await api.put(`/admin/announcements/${editing._id}`, payload)
      else await api.post('/admin/announcements', payload)
      setFormOpen(false)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/announcements/${deleteConfirm._id}`)
      setDeleteConfirm(null)
      load()
    } catch {
      alert('Delete failed.')
    }
  }

  const ch = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  
  // Custom Input and Textarea rendering since atomic components don't support checkbox easily
  // Or I can just use basic HTML inputs combined with Tailwind classes.
  // Actually, I'll use the atoms where appropriate.

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-on-surface">Announcements</h1>
        <Button onClick={openCreate}>+ New Announcement</Button>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <div className="bg-surface rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800 text-left">
              <tr>
                {['Title', 'Pinned', 'Expires At', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {announcements.length === 0 && (
                <tr><td colSpan="4" className="px-4 py-6 text-center text-neutral-500">No announcements found.</td></tr>
              )}
              {announcements.map((a) => (
                <tr key={a._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3 font-medium text-on-surface">{a.title}</td>
                  <td className="px-4 py-3">{a.isPinned ? <Badge variant="primary">Pinned</Badge> : <Badge variant="default">Normal</Badge>}</td>
                  <td className="px-4 py-3 text-neutral-500">{a.expiresAt ? new Date(a.expiresAt).toLocaleDateString() : 'Never'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(a)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleteConfirm(a)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Announcement' : 'New Announcement'} size="md">
        <form onSubmit={save} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-neutral-500">Title</label>
            <input required value={fields.title} onChange={ch('title')} className="input-dark" placeholder="Announcement title" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-neutral-500">Body</label>
            <textarea required rows={4} value={fields.body} onChange={ch('body')} className="input-dark" placeholder="Announcement body..." />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="isPinned" checked={fields.isPinned} onChange={ch('isPinned')} className="w-4 h-4 rounded border-neutral-300" />
            <label htmlFor="isPinned" className="text-sm font-medium text-on-surface cursor-pointer">Pin this announcement to top</label>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-neutral-500">Expires At (Optional)</label>
            <input type="date" value={fields.expiresAt} onChange={ch('expiresAt')} className="input-dark" />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Announcement" size="sm">
        <p className="text-neutral-500 mb-6">
          Are you sure you want to delete <strong>{deleteConfirm?.title}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
