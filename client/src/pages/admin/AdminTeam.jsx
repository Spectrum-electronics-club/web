import { useEffect, useState } from 'react'
import api from '@/utils/axiosInstance'
import Pagination from '@/components/molecules/Pagination'

const EMPTY = { fullName:'', role:'', category:'Core Team', photo:'', linkedinUrl:'', githubUrl:'', email:'', skills:'', researchInterests:'', isActive:true, order:0 }

const CATEGORIES = [
  'Faculty',
  'Leadership',
  'Heads',
  'Deputy Heads',
  'Technical Team',
  'Presentation Team',
  'On-Ground Team',
  'Graphics Designing Team',
  'Audio Video Team',
  'Logistics Team',
  'Core Team' // fallback
]

const fl = { display:'flex', flexDirection:'column', gap:'0.3rem' }
const lb = { color:'#94a3b8', fontSize:'0.8rem', fontWeight:600 }

export default function AdminTeam() {
  const [members, setMembers]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [fields, setFields]     = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [del, setDel]           = useState(null)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const load = (p = page, l = limit) => {
    setLoading(true)
    api.get('/admin/team', { params: { page: p, limit: l } }).then((r) => {
      setMembers(r.data.data || [])
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
  const openEdit   = m  => { setEditing(m); setFields({ ...EMPTY, ...m, skills: m.skills?.join(', ')||'', researchInterests: m.researchInterests?.join(', ')||'' }); setFormOpen(true) }
  const ch = k => e => setFields(f => ({ ...f, [k]: e.target.type==='checkbox' ? e.target.checked : e.target.value }))

  const save = async e => {
    e.preventDefault(); setSaving(true)
    const payload = { ...fields, skills: fields.skills.split(',').map(s=>s.trim()).filter(Boolean), researchInterests: fields.researchInterests.split(',').map(s=>s.trim()).filter(Boolean), order: Number(fields.order) }
    try {
      if (editing) await api.put(`/admin/team/${editing._id}`, payload)
      else await api.post('/admin/team', payload)
      setFormOpen(false); load()
    } catch (err) { alert(err.response?.data?.message || 'Save failed.') }
    finally { setSaving(false) }
  }

  const confirmDel = async () => {
    try { await api.delete(`/admin/team/${del._id}`); setDel(null); load() }
    catch { alert('Delete failed.') }
  }

  const cardStyle = { background:'#0d1117', border:'1px solid rgba(0,212,255,0.1)', borderRadius:'12px', overflow:'hidden' }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.75rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'1.6rem', color:'#f1f5f9', margin:'0 0 0.2rem' }}>Team Members</h1>
          <p style={{ color:'#64748b', fontSize:'0.875rem', margin:0 }}>Manage club team members</p>
        </div>
        <button className="btn-glow" onClick={openCreate} style={{ fontSize:'0.875rem' }}>+ Add Member</button>
      </div>

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1rem' }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height:'180px', borderRadius:'12px' }} />)}
        </div>
      ) : (
        <div style={cardStyle}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(0,212,255,0.08)' }}>
                {['Name','Role','Category','Status','Order','Actions'].map(h => (
                  <th key={h} style={{ padding:'0.875rem 1rem', textAlign:'left', color:'#64748b', fontWeight:600, fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m._id} style={{ borderBottom:'1px solid rgba(0,212,255,0.05)' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(0,212,255,0.02)'}
                  onMouseLeave={e=>e.currentTarget.style.background=''}>
                  <td style={{ padding:'0.875rem 1rem', color:'#e2e8f0', fontWeight:500 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                      {m.photo && <img src={m.photo} alt="" style={{ width:'32px', height:'32px', borderRadius:'50%', objectFit:'cover' }} />}
                      {m.fullName}
                    </div>
                  </td>
                  <td style={{ padding:'0.875rem 1rem', color:'#22d3ee', fontSize:'0.8rem' }}>{m.role}</td>
                  <td style={{ padding:'0.875rem 1rem', color:'#94a3b8', fontSize:'0.8rem' }}>{m.category || 'Core Team'}</td>
                  <td style={{ padding:'0.875rem 1rem' }}>
                    <span style={{ padding:'0.2rem 0.6rem', borderRadius:'999px', fontSize:'0.72rem', fontWeight:600,
                      background: m.isActive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
                      color: m.isActive ? '#34d399' : '#f87171', border:`1px solid ${m.isActive?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.2)'}` }}>
                      {m.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding:'0.875rem 1rem', color:'#64748b' }}>{m.order}</td>
                  <td style={{ padding:'0.875rem 1rem' }}>
                    <div style={{ display:'flex', gap:'0.4rem' }}>
                      <button onClick={() => openEdit(m)} className="btn-outline" style={{ fontSize:'0.75rem', padding:'0.3rem 0.75rem' }}>Edit</button>
                      <button onClick={() => setDel(m)} style={{ fontSize:'0.75rem', padding:'0.3rem 0.75rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:'8px', color:'#f87171', cursor:'pointer' }}>Delete</button>
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

      {/* Form modal */}
      {formOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:60, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div className="card-glass" style={{ width:'100%', maxWidth:'540px', maxHeight:'90vh', overflowY:'auto', padding:'2rem' }}>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:'#e2e8f0', marginBottom:'1.5rem' }}>{editing ? 'Edit Member' : 'Add Member'}</h2>
            <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div style={fl}><label style={lb}>Full Name *</label><input className="input-dark" required value={fields.fullName} onChange={ch('fullName')} /></div>
                <div style={fl}><label style={lb}>Role *</label><input className="input-dark" required value={fields.role} onChange={ch('role')} /></div>
              </div>
              <div style={fl}>
                <label style={lb}>Category *</label>
                <select className="input-dark" required value={fields.category} onChange={ch('category')}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={fl}>
                <label style={lb}>Photo Upload</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {fields.photo && <img src={fields.photo} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={async (e) => {
                      const file = e.target.files[0]
                      if (!file) return
                      const formData = new FormData()
                      formData.append('image', file)
                      try {
                        const res = await api.post('/admin/upload', formData, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        })
                        setFields(f => ({ ...f, photo: res.data.url }))
                      } catch (err) {
                        alert('Image upload failed.')
                      }
                    }} 
                    style={{ color: '#94a3b8', fontSize: '0.85rem' }} 
                  />
                </div>
                <input className="input-dark" type="url" value={fields.photo} onChange={ch('photo')} placeholder="Or paste a URL..." style={{ marginTop: '0.3rem' }} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div style={fl}><label style={lb}>LinkedIn URL</label><input className="input-dark" type="url" value={fields.linkedinUrl} onChange={ch('linkedinUrl')} /></div>
                <div style={fl}><label style={lb}>GitHub URL</label><input className="input-dark" type="url" value={fields.githubUrl} onChange={ch('githubUrl')} /></div>
              </div>
              <div style={fl}><label style={lb}>Email</label><input className="input-dark" type="email" value={fields.email} onChange={ch('email')} /></div>
              <div style={fl}><label style={lb}>Skills <span style={{ color:'#4b5563', fontWeight:400 }}>(comma separated)</span></label><input className="input-dark" value={fields.skills} onChange={ch('skills')} /></div>
              <div style={fl}><label style={lb}>Research Interests <span style={{ color:'#4b5563', fontWeight:400 }}>(comma separated)</span></label><input className="input-dark" value={fields.researchInterests} onChange={ch('researchInterests')} /></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div style={fl}><label style={lb}>Display Order</label><input className="input-dark" type="number" value={fields.order} onChange={ch('order')} /></div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', paddingTop:'1.5rem' }}>
                  <input type="checkbox" id="isActive" checked={fields.isActive} onChange={ch('isActive')} style={{ width:'16px', height:'16px', accentColor:'#06b6d4' }} />
                  <label htmlFor="isActive" style={{ color:'#94a3b8', fontSize:'0.875rem', cursor:'pointer' }}>Active (visible on site)</label>
                </div>
              </div>
              <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', paddingTop:'0.5rem' }}>
                <button type="button" className="btn-outline" onClick={() => setFormOpen(false)}>Cancel</button>
                <button type="submit" className="btn-glow" disabled={saving}>{saving ? 'Saving…' : 'Save Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {del && (
        <div style={{ position:'fixed', inset:0, zIndex:60, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div className="card-glass" style={{ maxWidth:'380px', width:'100%', padding:'2rem', textAlign:'center' }}>
            <p style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>⚠️</p>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", color:'#e2e8f0', marginBottom:'0.5rem' }}>Delete Member?</h3>
            <p style={{ color:'#64748b', fontSize:'0.875rem', marginBottom:'1.5rem' }}>Remove <strong style={{ color:'#e2e8f0' }}>{del.fullName}</strong>? This cannot be undone.</p>
            <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center' }}>
              <button className="btn-outline" onClick={() => setDel(null)}>Cancel</button>
              <button onClick={confirmDel} style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', padding:'0.6rem 1.5rem', color:'#f87171', fontWeight:600, cursor:'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
