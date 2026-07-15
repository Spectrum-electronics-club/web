import { useEffect, useState } from 'react'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/atoms/Modal'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import api from '@/utils/axiosInstance'

const EMPTY = { title: '', authors: '', abstract: '', publishedDate: '', pdfUrl: '', externalUrl: '', tags: '' }

export default function AdminPublications() {
  const [pubs, setPubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editing, setEditing] = useState(null)
  const [fields, setFields] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/admin/publications').then((r) => setPubs(r.data.data || r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setFields(EMPTY); setFormOpen(true) }
  const openEdit = (p) => {
    setEditing(p)
    setFields({ 
      title: p.title || '',
      authors: p.authors?.join(', ') || '',
      abstract: p.abstract || '',
      publishedDate: p.publishedDate ? new Date(p.publishedDate).toISOString().split('T')[0] : '',
      pdfUrl: p.pdfUrl || '',
      externalUrl: p.externalUrl || '',
      tags: p.tags?.join(', ') || ''
    })
    setFormOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...fields,
      authors: fields.authors.split(',').map(a => a.trim()).filter(Boolean),
      tags: fields.tags.split(',').map(t => t.trim()).filter(Boolean),
      publishedDate: fields.publishedDate ? new Date(fields.publishedDate).toISOString() : null
    }
    try {
      if (editing) await api.put(`/admin/publications/${editing._id}`, payload)
      else await api.post('/admin/publications', payload)
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
      await api.delete(`/admin/publications/${deleteConfirm._id}`)
      setDeleteConfirm(null)
      load()
    } catch {
      alert('Delete failed.')
    }
  }

  const ch = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-on-surface">Publications</h1>
        <Button onClick={openCreate}>+ New Publication</Button>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <div className="bg-surface rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800 text-left">
              <tr>
                {['Title', 'Authors', 'Date', 'Tags', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {pubs.length === 0 && (
                <tr><td colSpan="5" className="px-4 py-6 text-center text-neutral-500">No publications found.</td></tr>
              )}
              {pubs.map((p) => (
                <tr key={p._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3 font-medium text-on-surface max-w-[200px] truncate">{p.title}</td>
                  <td className="px-4 py-3 text-neutral-500 truncate max-w-[150px]">{p.authors?.join(', ')}</td>
                  <td className="px-4 py-3 text-neutral-500">{p.publishedDate ? new Date(p.publishedDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.tags?.slice(0, 2).map(t => <Badge key={t} variant="primary">{t}</Badge>)}
                      {p.tags?.length > 2 && <span className="text-xs text-neutral-500">+{p.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(p)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleteConfirm(p)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Publication' : 'New Publication'} size="lg">
        <form onSubmit={save} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <Input label="Title" required value={fields.title} onChange={ch('title')} />
          <Input label="Authors" required hint="Comma separated list" value={fields.authors} onChange={ch('authors')} />
          <Textarea label="Abstract" rows={3} value={fields.abstract} onChange={ch('abstract')} />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Published Date" type="date" value={fields.publishedDate} onChange={ch('publishedDate')} />
            <Input label="Tags" hint="Comma separated" value={fields.tags} onChange={ch('tags')} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="PDF URL" type="url" value={fields.pdfUrl} onChange={ch('pdfUrl')} />
            <Input label="External URL" type="url" value={fields.externalUrl} onChange={ch('externalUrl')} />
          </div>
          
          <div className="flex gap-3 justify-end pt-4 sticky bottom-0 bg-surface/90 backdrop-blur pb-2">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Publication" size="sm">
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
