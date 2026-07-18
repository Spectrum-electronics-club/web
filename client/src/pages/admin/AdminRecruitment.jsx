import { useEffect, useState } from 'react'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/atoms/Modal'
import api from '@/utils/axiosInstance'
import Pagination from '@/components/molecules/Pagination'

const STATUS_OPTS = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
]

export default function AdminRecruitment() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const load = (p = page, l = limit, status = statusFilter) => {
    setLoading(true)
    api.get('/admin/recruitment', { params: { page: p, limit: l, status } }).then((r) => {
      setApps(r.data.data || [])
      if (r.data.pagination) {
        setTotal(r.data.pagination.total)
        setTotalPages(r.data.pagination.pages)
      }
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load(1, limit, statusFilter) }, [])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    load(newPage, limit, statusFilter)
  }

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit)
    setPage(1)
    load(1, newLimit, statusFilter)
  }

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus)
    setPage(1)
    load(1, limit, newStatus)
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/admin/recruitment/${id}/status`, { status: newStatus })
      setApps(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a))
      if (viewing && viewing._id === id) setViewing({ ...viewing, status: newStatus })
    } catch (err) {
      alert('Failed to update status.')
    }
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/recruitment/${deleteConfirm._id}`)
      setDeleteConfirm(null)
      load()
    } catch {
      alert('Delete failed.')
    }
  }

  const filteredApps = apps

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-on-surface">Recruitment Applications</h1>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button onClick={() => handleStatusFilterChange('all')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === 'all' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50' : 'bg-transparent text-neutral-500 border border-neutral-700 hover:text-neutral-300'}`}>All</button>
        {STATUS_OPTS.map(opt => (
          <button key={opt.value} onClick={() => handleStatusFilterChange(opt.value)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === opt.value ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50' : 'bg-transparent text-neutral-500 border border-neutral-700 hover:text-neutral-300'}`}>
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <div className="bg-surface rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800 text-left">
              <tr>
                {['Name', 'Dept/Year', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredApps.length === 0 && (
                <tr><td colSpan="5" className="px-4 py-6 text-center text-neutral-500">No applications found.</td></tr>
              )}
              {filteredApps.map((a) => (
                <tr key={a._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-on-surface">{a.fullName}</div>
                    <div className="text-xs text-neutral-500">{a.email}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">{a.department}, Yr {a.year}</td>
                  <td className="px-4 py-3">
                    <select 
                      value={a.status} 
                      onChange={(e) => updateStatus(a._id, e.target.value)}
                      className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-on-surface"
                    >
                      {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{new Date(a.submittedAt || a.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setViewing(a)}>View Details</Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleteConfirm(a)}>Delete</Button>
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

      {/* View Details modal */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Application Details" size="md">
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Applicant</p>
                <p className="text-on-surface font-medium">{viewing.fullName}</p>
                <p className="text-neutral-400 text-sm">{viewing.email}</p>
                <p className="text-neutral-400 text-sm">{viewing.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Academic</p>
                <p className="text-on-surface font-medium">{viewing.department}</p>
                <p className="text-neutral-400 text-sm">Year {viewing.year}</p>
              </div>
            </div>
            
            {viewing.linkedinUrl && (
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">LinkedIn</p>
                <a href={viewing.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline break-all text-sm">
                  {viewing.linkedinUrl}
                </a>
              </div>
            )}
            
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Motivation</p>
              <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg whitespace-pre-wrap text-on-surface text-sm">
                {viewing.motivation}
              </div>
            </div>
            
            <div className="pt-4 flex justify-between items-center border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">Status:</span>
                <select 
                  value={viewing.status} 
                  onChange={(e) => updateStatus(viewing._id, e.target.value)}
                  className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-on-surface"
                >
                  {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <Button onClick={() => setViewing(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Application" size="sm">
        <p className="text-neutral-500 mb-6">
          Are you sure you want to delete the application from <strong>{deleteConfirm?.fullName}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
