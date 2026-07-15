import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiUploadCloud, FiImage, FiPhone, FiInfo } from 'react-icons/fi'
import api from '@/utils/axiosInstance'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('logos') // 'logos', 'contact', 'about'
  
  // State
  const [fields, setFields] = useState({
    logo1Url: '',
    logo2Url: '',
    contactEmail: '',
    contactLocation: '',
    contactSocial: '',
    socialInstagram: '',
    socialLinkedin: '',
    socialYoutube: '',
    socialGithub: '',
    aboutDescription: '',
    aboutStory: '',
    aboutMission: '',
    aboutVision: ''
  })
  
  const [loading, setLoading] = useState(false)
  const fileInput1Ref = useRef(null)
  const fileInput2Ref = useRef(null)

  useEffect(() => {
    api.get('/settings').then(res => {
      if (res.data?.data) {
        setFields(prev => ({ ...prev, ...res.data.data }))
      }
    }).catch(console.error)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.put('/settings', fields)
      alert('Settings saved successfully!')
    } catch (err) {
      alert('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (file, fieldName) => {
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data?.url) {
        setFields(prev => ({ ...prev, [fieldName]: res.data.url }))
      }
    } catch (err) {
      alert('Upload failed')
    }
  }

  const tabStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.75rem 1.25rem', borderRadius: '8px', cursor: 'pointer',
    background: isActive ? 'rgba(0,212,255,0.1)' : 'transparent',
    color: isActive ? '#22d3ee' : '#94a3b8',
    border: isActive ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
    fontWeight: isActive ? 600 : 500, transition: 'all 0.2s'
  })

  const labelStyle = { display: 'block', color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.75rem', color: '#f1f5f9', margin: '0 0 0.35rem' }}>
            Site Settings
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Manage global website configurations.</p>
        </div>
        <button onClick={handleSave} disabled={loading} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#06b6d4', color: '#fff',
          padding: '0.65rem 1.25rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
        }}>
          <FiSave size={18} /> {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <button onClick={() => setActiveTab('logos')} style={tabStyle(activeTab === 'logos')}>
          <FiImage size={16} /> Logos
        </button>
        <button onClick={() => setActiveTab('contact')} style={tabStyle(activeTab === 'contact')}>
          <FiPhone size={16} /> Contact Info
        </button>
        <button onClick={() => setActiveTab('about')} style={tabStyle(activeTab === 'about')}>
          <FiInfo size={16} /> About Page
        </button>
      </div>

      <div className="card-glass" style={{ padding: '2rem', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* LOGOS TAB */}
        {activeTab === 'logos' && (
          <>
            <div>
              <label style={labelStyle}>Logo 1</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {fields.logo1Url ? <img src={fields.logo1Url} alt="Logo 1" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ color: '#64748b', fontSize: '0.8rem' }}>None</span>}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input type="file" accept="image/*" ref={fileInput1Ref} style={{ display: 'none' }} onChange={e => handleUpload(e.target.files[0], 'logo1Url')} />
                  <button onClick={() => fileInput1Ref.current?.click()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', width: 'fit-content' }}>
                    <FiUploadCloud size={16} /> Upload Logo 1
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Logo 2</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {fields.logo2Url ? <img src={fields.logo2Url} alt="Logo 2" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ color: '#64748b', fontSize: '0.8rem' }}>None</span>}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input type="file" accept="image/*" ref={fileInput2Ref} style={{ display: 'none' }} onChange={e => handleUpload(e.target.files[0], 'logo2Url')} />
                  <button onClick={() => fileInput2Ref.current?.click()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', width: 'fit-content' }}>
                    <FiUploadCloud size={16} /> Upload Logo 2
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CONTACT INFO TAB */}
        {activeTab === 'contact' && (
          <>
            <div>
              <label style={labelStyle}>Contact Email</label>
              <input name="contactEmail" value={fields.contactEmail} onChange={handleChange} className="input-dark" placeholder="e.g. ngnd@club.edu" />
            </div>
            <div>
              <label style={labelStyle}>Club Location</label>
              <input name="contactLocation" value={fields.contactLocation} onChange={handleChange} className="input-dark" placeholder="e.g. Engineering Department, Lab-7" />
            </div>
            <div>
              <label style={labelStyle}>Social Handle Display (e.g. @ngnd_club)</label>
              <input name="contactSocial" value={fields.contactSocial} onChange={handleChange} className="input-dark" placeholder="e.g. @ngnd_club" />
            </div>
            
            {/* Social Links */}
            <h3 style={{ color: '#f1f5f9', fontSize: '1rem', marginTop: '1rem', marginBottom: '0' }}>Social Media Links</h3>
            <div>
              <label style={labelStyle}>Instagram URL</label>
              <input name="socialInstagram" value={fields.socialInstagram} onChange={handleChange} className="input-dark" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn URL</label>
              <input name="socialLinkedin" value={fields.socialLinkedin} onChange={handleChange} className="input-dark" placeholder="https://linkedin.com/..." />
            </div>
            <div>
              <label style={labelStyle}>YouTube URL</label>
              <input name="socialYoutube" value={fields.socialYoutube} onChange={handleChange} className="input-dark" placeholder="https://youtube.com/..." />
            </div>
            <div>
              <label style={labelStyle}>GitHub URL</label>
              <input name="socialGithub" value={fields.socialGithub} onChange={handleChange} className="input-dark" placeholder="https://github.com/..." />
            </div>
          </>
        )}

        {/* ABOUT PAGE TAB */}
        {activeTab === 'about' && (
          <>
            <div>
              <label style={labelStyle}>Hero Description</label>
              <textarea name="aboutDescription" value={fields.aboutDescription} onChange={handleChange} className="input-dark" rows={4} style={{ resize: 'vertical' }} placeholder="Short introductory paragraph..." />
            </div>
            <div>
              <label style={labelStyle}>Our Story</label>
              <textarea name="aboutStory" value={fields.aboutStory} onChange={handleChange} className="input-dark" rows={4} style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>Our Mission</label>
              <textarea name="aboutMission" value={fields.aboutMission} onChange={handleChange} className="input-dark" rows={4} style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>Our Vision</label>
              <textarea name="aboutVision" value={fields.aboutVision} onChange={handleChange} className="input-dark" rows={4} style={{ resize: 'vertical' }} />
            </div>
          </>
        )}

      </div>
    </motion.div>
  )
}
