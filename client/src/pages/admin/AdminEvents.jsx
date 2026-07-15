import { useEffect, useState } from 'react'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/atoms/Modal'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import api from '@/utils/axiosInstance'

const EMPTY = { title: '', description: '', registrationUrl: '', isUpcoming: false, schedule: [], speakers: [] }

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editing, setEditing] = useState(null)
  const [fields, setFields] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/admin/events').then((r) => setEvents(r.data.data || r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setFields({ ...EMPTY, schedule: [], speakers: [] }); setFormOpen(true) }
  const openEdit = (ev) => {
    setEditing(ev)
    setFields({
      title: ev.title || '',
      description: ev.description || '',
      registrationUrl: ev.registrationUrl || '',
      isUpcoming: !!ev.isUpcoming,
      schedule: ev.schedule?.length ? JSON.parse(JSON.stringify(ev.schedule)) : [],
      speakers: ev.speakers?.length ? JSON.parse(JSON.stringify(ev.speakers)) : []
    })
    setFormOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) await api.put(`/admin/events/${editing._id}`, fields)
      else await api.post('/admin/events', fields)
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
      await api.delete(`/admin/events/${deleteConfirm._id}`)
      setDeleteConfirm(null)
      load()
    } catch {
      alert('Delete failed.')
    }
  }

  const ch = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...fields.schedule];
    newSchedule[index][field] = value;
    setFields({ ...fields, schedule: newSchedule });
  }

  const addSchedule = () => setFields({ ...fields, schedule: [...fields.schedule, { date: '', time: '', activity: '' }] })
  const removeSchedule = (index) => setFields({ ...fields, schedule: fields.schedule.filter((_, i) => i !== index) })

  const handleSpeakerChange = (index, field, value) => {
    const newSpeakers = [...fields.speakers];
    newSpeakers[index][field] = value;
    setFields({ ...fields, speakers: newSpeakers });
  }

  const addSpeaker = () => setFields({ ...fields, speakers: [...fields.speakers, { name: '', bio: '', photo: '' }] })
  const removeSpeaker = (index) => setFields({ ...fields, speakers: fields.speakers.filter((_, i) => i !== index) })


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-on-surface">Events</h1>
          <p className="text-neutral-500 text-sm">Manage club events and competitions</p>
        </div>
        <Button onClick={openCreate}>+ New Event</Button>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <div className="bg-surface rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800 text-left">
              <tr>
                {['Title', 'Status', 'Registration', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {events.length === 0 && (
                <tr><td colSpan="4" className="px-4 py-6 text-center text-neutral-500">No events found.</td></tr>
              )}
              {events.map((ev) => (
                <tr key={ev._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3 font-medium text-on-surface">{ev.title}</td>
                  <td className="px-4 py-3">
                    {ev.isUpcoming ? <Badge variant="success">Upcoming</Badge> : <Badge variant="default">Past</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    {ev.registrationUrl ? (
                      <a href={ev.registrationUrl} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Link ↗</a>
                    ) : (
                      <span className="text-neutral-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(ev)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleteConfirm(ev)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Event' : 'New Event'} size="lg">
        <form onSubmit={save} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">Basic Info</h3>
            <Input label="Title" required value={fields.title} onChange={ch('title')} />
            <Textarea label="Description" rows={3} value={fields.description} onChange={ch('description')} />
            <Input label="Registration URL" type="url" value={fields.registrationUrl} onChange={ch('registrationUrl')} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isUpcoming" checked={fields.isUpcoming} onChange={ch('isUpcoming')} className="w-4 h-4 rounded border-neutral-300" />
              <label htmlFor="isUpcoming" className="text-sm font-medium text-on-surface cursor-pointer">Mark as upcoming event</label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Schedule</h3>
              <Button type="button" size="sm" variant="secondary" onClick={addSchedule}>+ Add Entry</Button>
            </div>
            {fields.schedule.map((entry, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-start bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <div className="col-span-3">
                  <Input placeholder="Date (e.g. Day 1)" value={entry.date} onChange={(e) => handleScheduleChange(index, 'date', e.target.value)} />
                </div>
                <div className="col-span-3">
                  <Input placeholder="Time (e.g. 10:00 AM)" value={entry.time} onChange={(e) => handleScheduleChange(index, 'time', e.target.value)} />
                </div>
                <div className="col-span-5">
                  <Input placeholder="Activity" value={entry.activity} onChange={(e) => handleScheduleChange(index, 'activity', e.target.value)} />
                </div>
                <div className="col-span-1 pt-1 text-right">
                  <Button type="button" size="sm" variant="danger" onClick={() => removeSchedule(index)} title="Remove">×</Button>
                </div>
              </div>
            ))}
            {fields.schedule.length === 0 && <p className="text-sm text-neutral-500 italic">No schedule entries.</p>}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Speakers</h3>
              <Button type="button" size="sm" variant="secondary" onClick={addSpeaker}>+ Add Speaker</Button>
            </div>
            {fields.speakers.map((speaker, index) => (
              <div key={index} className="space-y-3 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 relative">
                <div className="absolute top-3 right-3">
                  <Button type="button" size="sm" variant="danger" onClick={() => removeSpeaker(index)} title="Remove">×</Button>
                </div>
                <div className="grid grid-cols-2 gap-3 pr-10">
                  <Input placeholder="Name" value={speaker.name} onChange={(e) => handleSpeakerChange(index, 'name', e.target.value)} />
                  <Input placeholder="Photo URL" value={speaker.photo} onChange={(e) => handleSpeakerChange(index, 'photo', e.target.value)} />
                </div>
                <Textarea placeholder="Bio" rows={2} value={speaker.bio} onChange={(e) => handleSpeakerChange(index, 'bio', e.target.value)} />
              </div>
            ))}
            {fields.speakers.length === 0 && <p className="text-sm text-neutral-500 italic">No speakers.</p>}
          </div>

          <div className="flex gap-3 justify-end pt-4 sticky bottom-0 bg-surface/90 backdrop-blur pb-2">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Event" size="sm">
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
