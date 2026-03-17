'use client'

import { useState, useEffect } from 'react'

const EVENT_TYPES = ['Learn to Sail', 'Casual Sail', 'BBQ', 'Maintenance', 'Themed Event', 'Social']

const emptyForm = {
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
  type: 'Learn to Sail',
  registrationLink: '',
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw')
    if (saved) {
      setPassword(saved)
      setAuthed(true)
      fetchEvents(saved)
    }
  }, [])

  const fetchEvents = async (pw) => {
    const res = await fetch('/api/admin/events', {
      headers: { 'x-admin-password': pw }
    })
    const data = await res.json()
    setEvents(data)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const pw = e.target.password.value
    
    const res = await fetch('/api/admin/events', {
      headers: { 'x-admin-password': pw }
    })
    if (res.status === 401) {
      setError('Incorrect password')
    } else {
      sessionStorage.setItem('admin_pw', pw)
      setPassword(pw)
      setAuthed(true)
      fetchEvents(pw)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const pw = sessionStorage.getItem('admin_pw')
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/events/${editingId}` : '/api/events'
    
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': pw,
      },
      body: JSON.stringify(form),
    })

    console.log('response status:', res.status)

    setForm(emptyForm)
    setEditingId(null)
    setSaving(false)
    fetchEvents(pw)
  }

  const handleEdit = (event) => {
    setForm(event)
    setEditingId(event.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    const pw = sessionStorage.getItem('admin_pw')
    await fetch(`/api/events/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': pw },
    })
    fetchEvents(pw)
  }

  const moveEvent = async (index, direction) => {
    const pw = sessionStorage.getItem('admin_pw')
    const newEvents = [...events]
    const swapIndex = index + direction
    if (swapIndex < 0 || swapIndex >= newEvents.length) return
    ;[newEvents[index], newEvents[swapIndex]] = [newEvents[swapIndex], newEvents[index]]
    setEvents(newEvents)
    await fetch('/api/events/reorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': pw,
      },
      body: JSON.stringify({ events: newEvents }),
    })
  }

  if (!authed) {
    return (
      <div style={{ maxWidth: '400px', margin: '120px auto', padding: '0 24px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px', color: '#111827' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Admin Login</h1>
          {error && <p style={{ color: '#dc2626', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="password"
              name='password'
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px' }}
            />
            <button type="submit" style={{ backgroundColor: '#ecaa00', color: '#000', padding: '10px', borderRadius: '6px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}>
              Log In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px', color: '#111827' }}>

        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>Event Manager</h1>

        {/* Form */}
        <form onSubmit={handleSave} style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
            {editingId ? 'Edit Event' : 'Add New Event'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {[
              { key: 'title', placeholder: 'Event title', label: 'Title' },
              { key: 'date', placeholder: 'e.g. April 5, 2026', label: 'Date' },
              { key: 'time', placeholder: 'e.g. 10:00 AM – 1:00 PM', label: 'Time' },
              { key: 'location', placeholder: 'e.g. CSULB Sailing Base', label: 'Location' },
              { key: 'registrationLink', placeholder: 'https://...', label: 'Registration Link' },
            ].map(({ key, placeholder, label }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px' }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Type</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px' }}
              >
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Description</label>
            <textarea
              placeholder="Event description..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={saving} style={{ backgroundColor: '#ecaa00', color: '#000', padding: '10px 24px', borderRadius: '6px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}>
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Event'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null) }} style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '10px 24px', borderRadius: '6px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Event list */}
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
          Current Events ({events.length})
        </h2>

        {events.length === 0 && (
          <p style={{ color: '#6b7280' }}>No events yet. Add one above.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.map((event, index) => (
            <div key={event.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '700', fontSize: '16px', margin: '0 0 4px' }}>{event.title}</p>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{event.date} · {event.time} · {event.location}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                <button onClick={() => moveEvent(index, -1)} disabled={index === 0} style={arrowBtn}>↑</button>
                <button onClick={() => moveEvent(index, 1)} disabled={index === events.length - 1} style={arrowBtn}>↓</button>
                <button onClick={() => handleEdit(event)} style={editBtn}>Edit</button>
                <button onClick={() => handleDelete(event.id)} style={deleteBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

const arrowBtn = { backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }
const editBtn = { backgroundColor: '#006E90', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }
const deleteBtn = { backgroundColor: '#64100F', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }