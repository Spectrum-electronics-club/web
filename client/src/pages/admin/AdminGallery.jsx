import { useEffect, useRef, useState } from 'react'
import { MdUpload, MdDelete } from 'react-icons/md'
import api from '@/utils/axiosInstance'

const fl = { display:'flex', flexDirection:'column', gap:'0.3rem' }
const lb = { color:'#94a3b8', fontSize:'0.8rem', fontWeight:600 }

export default function AdminGallery() {
  const [images, setImages]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [form, setForm]         = useState({ album:'', caption:'', tags:'' })
  const [del, setDel]           = useState(null)
  const fileRef                 = useRef()

  const load = () => { setLoading(true); api.get('/admin/gallery').then(r => setImages(r.data.data || r.data)).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const upload = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    setUploading(true)
    try {
      const { data } = await api.post('/admin/upload', fd, { headers:{ 'Content-Type':'multipart/form-data' } })
      await api.post('/admin/gallery', {
        imageUrl: data.url, album: form.album, caption: form.caption,
        tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean),
      })
      setForm({ album:'', caption:'', tags:'' })
      load()
    } catch (err) { alert(err.response?.data?.message || 'Upload failed.') }
    finally { setUploading(false); fileRef.current.value = '' }
  }

  const confirmDel = async () => {
    try { await api.delete(`/admin/gallery/${del._id}`); setDel(null); load() }
    catch { alert('Delete failed.') }
  }

  return (
    <div>
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'1.6rem', color:'#f1f5f9', margin:'0 0 0.2rem' }}>Gallery</h1>
        <p style={{ color:'#64748b', fontSize:'0.875rem', margin:0 }}>Upload and manage gallery images</p>
      </div>

      {/* Upload panel */}
      <div className="card-glass" style={{ padding:'1.5rem', marginBottom:'2rem' }}>
        <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", color:'#e2e8f0', marginBottom:'1rem', fontWeight:600, fontSize:'1rem' }}>Upload New Image</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
          <div style={fl}><label style={lb}>Album</label><input className="input-dark" value={form.album} onChange={e=>setForm(f=>({...f,album:e.target.value}))} placeholder="e.g. Spectrum Fest" /></div>
          <div style={fl}><label style={lb}>Caption</label><input className="input-dark" value={form.caption} onChange={e=>setForm(f=>({...f,caption:e.target.value}))} placeholder="Optional caption" /></div>
          <div style={fl}><label style={lb}>Tags <span style={{ color:'#4b5563', fontWeight:400 }}>(comma separated)</span></label><input className="input-dark" value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} placeholder="robotics, event" /></div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} style={{ display:'none' }} id="galleryUpload" />
          <label htmlFor="galleryUpload" className="btn-glow" style={{ cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'0.5rem', fontSize:'0.875rem' }}>
            <MdUpload size={16} /> {uploading ? 'Uploading…' : 'Choose & Upload Image'}
          </label>
          <p style={{ color:'#64748b', fontSize:'0.78rem', margin:0 }}>JPEG, PNG, WebP · max 10 MB</p>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1rem' }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height:'180px', borderRadius:'12px' }} />)}
        </div>
      ) : images.length === 0 ? (
        <p style={{ color:'#64748b', textAlign:'center', padding:'4rem' }}>No images yet. Upload one above.</p>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1rem' }}>
          {images.map(img => (
            <div key={img._id} style={{ position:'relative', borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(0,212,255,0.1)', background:'#0d1117' }}>
              <img src={img.imageUrl} alt={img.caption||''} style={{ width:'100%', height:'160px', objectFit:'cover', display:'block' }} />
              <div style={{ padding:'0.6rem 0.75rem' }}>
                {img.album && <p style={{ color:'#22d3ee', fontSize:'0.72rem', margin:'0 0 0.2rem', fontWeight:600 }}>{img.album}</p>}
                {img.caption && <p style={{ color:'#94a3b8', fontSize:'0.75rem', margin:0 }}>{img.caption}</p>}
              </div>
              <button onClick={() => setDel(img)} aria-label="Delete image"
                style={{ position:'absolute', top:'0.5rem', right:'0.5rem', background:'rgba(239,68,68,0.8)', border:'none', borderRadius:'8px', padding:'0.35rem', cursor:'pointer', color:'white', display:'flex' }}>
                <MdDelete size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {del && (
        <div style={{ position:'fixed', inset:0, zIndex:60, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div className="card-glass" style={{ maxWidth:'360px', width:'100%', padding:'2rem', textAlign:'center' }}>
            <p style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>🗑️</p>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", color:'#e2e8f0', marginBottom:'0.5rem' }}>Delete Image?</h3>
            <p style={{ color:'#64748b', fontSize:'0.875rem', marginBottom:'1.5rem' }}>This will permanently remove the image and its file.</p>
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
