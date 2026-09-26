import { useEffect, useState } from 'react'
import PageTransition from '@/components/molecules/PageTransition'
import api from '@/utils/axiosInstance'
import Pagination from '@/components/molecules/Pagination'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    setLoading(true)
    api.get('/announcements', { params: { page, limit } })
      .then(res => {
        setAnnouncements(res.data.data || res.data)
        if (res.data.pagination) {
          setTotal(res.data.pagination.total)
          setTotalPages(res.data.pagination.pages)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [page, limit])

  return (
    <PageTransition>
      <div className="container-main" style={{ paddingTop: '8rem', paddingBottom: '6rem', minHeight: '80vh' }}>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#f1f5f9', marginBottom: '1rem' }}>
          Announcements
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.7 }}>
          Stay updated with the latest news, updates, and important notices from Spectrum.
        </p>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '150px' }} />)}
          </div>
        ) : announcements.length === 0 ? (
          <p style={{ color: '#64748b' }}>No announcements found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            {announcements.map(a => {
              const date = new Date(a.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
              let color = '#06b6d4'
              let badgeColor = 'badge-cyan'
              if (a.type === 'Warning') { color = '#f59e0b'; badgeColor = 'badge-purple' }
              if (a.type === 'Success') { color = '#10b981'; badgeColor = 'badge-green' }
              if (a.type === 'Event') { color = '#8b5cf6'; badgeColor = 'badge-purple' }
              
              return (
                <div key={a._id} className="card-glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span className={badgeColor}>{a.type || 'Info'}</span>
                      {a.isPinned && <span className="badge-green">📌 Pinned</span>}
                      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{date}</span>
                    </div>
                  </div>
                  <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', color: '#e2e8f0', margin: 0 }}>
                    {a.title}
                  </h2>
                  <p style={{ color: '#94a3b8', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                    {a.body}
                  </p>
                  {a.linkUrl && (
                    <div>
                      <a href={a.linkUrl} target="_blank" rel="noopener noreferrer" style={{ color, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        {a.linkText || 'Read More'} →
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        )}
      </div>
    </PageTransition>
  )
}
