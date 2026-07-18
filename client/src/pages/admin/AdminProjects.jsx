import { useEffect, useState } from 'react'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/atoms/Modal'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Textarea from '@/components/atoms/Textarea'
import api from '@/utils/axiosInstance'
import Pagination from '@/components/molecules/Pagination'

const STATUS_OPTS = [
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

const EMPTY = { title: '', description: '', techStack: '', status: 'ongoing', githubUrl: '', demoUrl: '', featured: false }

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editing, setEditing] = useState(null)
  const [fields, setFields] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const load = (p = page, l = limit) => {
    setLoading(true)
    api.get('/admin/projects', { params: { page: p, limit: l } }).then((r) => {
      setProjects(r.data.data || [])
      if (r.data.pagination) {
        setTotal(r.data.pagination.total)
        setTotalPages(r.data.pagination.pages)
      }
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load(1, limit) }, [])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    load(newPage, limit)
  }

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit)
    setPage(1)
    load(1, newLimit)
  }

  const openCreate = () => { setEditing(null); setFields(EMPTY); setFormOpen(true) }
  const openEdit = (p) => {
    setEditing(p)
    setFields({ ...EMPTY, ...p, techStack: p.techStack?.join(', ') || '', featured: !!p.featured })
    setFormOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...fields, techStack: fields.techStack.split(',').map((t) => t.trim()).filter(Boolean) }
    try {
      if (editing) await api.put(`/admin/projects/${editing._id}`, payload)
      else await api.post('/admin/projects', payload)
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
      await api.delete(`/admin/projects/${deleteConfirm._id}`)
      setDeleteConfirm(null)
      load()
    } catch {
      alert('Delete failed.')
    }
  }

  const ch = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-on-surface">Projects</h1>
        <Button onClick={openCreate}>+ New Project</Button>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <div className="bg-surface rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800 text-left">
              <tr>
                {['Title', 'Status', 'Tech Stack', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {projects.map((p) => (
                <tr key={p._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3 font-medium text-on-surface">{p.title}</td>
                  <td className="px-4 py-3"><Badge variant={p.status}>{p.status}</Badge></td>
                  <td className="px-4 py-3 text-neutral-500">{p.techStack?.slice(0, 3).join(', ')}</td>
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
          <Pagination
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Project' : 'New Project'} size="lg">
        <form onSubmit={save} className="space-y-4">
          <Input label="Title" required value={fields.title} onChange={ch('title')} />
          <Textarea label="Description" required rows={3} value={fields.description} onChange={ch('description')} />
          <Input label="Tech Stack" hint="Comma separated" value={fields.techStack} onChange={ch('techStack')} />
          <Select label="Status" required options={STATUS_OPTS} value={fields.status} onChange={ch('status')} />
          <Input label="GitHub URL" type="url" value={fields.githubUrl} onChange={ch('githubUrl')} />
          <Input label="Demo URL" type="url" value={fields.demoUrl} onChange={ch('demoUrl')} />
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="featured" checked={fields.featured} onChange={ch('featured')} className="w-4 h-4 rounded border-neutral-300" />
            <label htmlFor="featured" className="text-sm font-medium text-on-surface cursor-pointer">Feature this project on the Home page</label>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Project" size="sm">
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
