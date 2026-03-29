'use client'

import { useState, useEffect } from 'react'

const EVENT_TYPES = ['Learn to Sail', 'Casual Sail', 'BBQ', 'Maintenance', 'Themed Event', 'Social']
const COURSE_TYPES = ['Sailing A', 'Sailing B', 'Sailing C']
const SHIELDS_COURSE_TYPES = ['Keelboat 1', 'Keelboat 2', 'Keelboat 3']
const COURSE_DAY_COUNT = { 'Sailing A': 2, 'Sailing B': 2, 'Sailing C': 3 }

const emptyForm = {
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
  type: 'Learn to Sail',
  registrationLink: '',
}

const emptyShieldsForm = {
  courseType: 'Keelboat 1',
  name: '',
  day1Date: '',
  day1StartTime: '',
  day1EndTime: '',
  day2Date: '',
  day2StartTime: '',
  day2EndTime: '',
  spots: '',
  isOpen: false,
}

const emptySessionForm = {
  courseType: 'Sailing A',
  dayNumber: 1,
  date: '',
  startTime: '',
  endTime: '',
  spots: '',
  isOpen: false,
}

export default function Admin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('events')

  // Events state
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  // Courses state
  const [courses, setCourses] = useState([])
  const [courseForm, setCourseForm] = useState(emptySessionForm)
  const [editingCourseId, setEditingCourseId] = useState(null)
  const [courseSaving, setCourseSaving] = useState(false)
  const [courseError, setCourseError] = useState('')

  // Registrations state
  const [registrations, setRegistrations] = useState([])
  const [registrationsLoading, setRegistrationsLoading] = useState(false)

  // Waitlist state
  const [waitlist, setWaitlist] = useState([])
  const [waitlistLoading, setWaitlistLoading] = useState(false)

  // Shields state
  const [shieldsSessions, setShieldsSessions] = useState([])
  const [shieldsForm, setShieldsForm] = useState(emptyShieldsForm)
  const [editingShieldsId, setEditingShieldsId] = useState(null)
  const [shieldsSaving, setShieldsSaving] = useState(false)
  const [shieldsError, setShieldsError] = useState('')
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(null) // null | 'courses' | 'shields'

  // Users state
  const [users, setUsers] = useState([])
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [userError, setUserError] = useState('')
  const [userSaving, setUserSaving] = useState(false)

  // Archived state
  const [archived, setArchived] = useState({ sessions: [], shields: [], events: [] })
  const [archivedLoading, setArchivedLoading] = useState(false)

  // Audit log state
  const [auditLog, setAuditLog] = useState([])
  const [auditPage, setAuditPage] = useState(1)
  const AUDIT_PAGE_SIZE = 25

  // Change password state
  const [showChangePw, setShowChangePw] = useState(false)
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [changePwError, setChangePwError] = useState('')
  const [changePwSuccess, setChangePwSuccess] = useState(false)

  const [error, setError] = useState('')

  useEffect(() => {
    const savedUser = sessionStorage.getItem('admin_username')
    const savedPw = sessionStorage.getItem('admin_pw')
    const savedSuper = sessionStorage.getItem('admin_is_super') === 'true'
    if (savedUser && savedPw) {
      setUsername(savedUser)
      setPassword(savedPw)
      setIsSuperAdmin(savedSuper)
      setAuthed(true)
      fetchEvents(savedUser, savedPw)
    }
  }, [])

  const authHeaders = (u, pw) => ({
    'x-admin-username': u || username,
    'x-admin-password': pw || password,
  })

  const fetchEvents = async (u, pw) => {
    const res = await fetch('/api/admin/events', { headers: authHeaders(u, pw) })
    const data = await res.json()
    setEvents(data)
  }

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users', { headers: authHeaders() })
    const data = await res.json()
    setUsers(data)
  }

  const fetchArchived = async () => {
    setArchivedLoading(true)
    const res = await fetch('/api/admin/archived', { headers: authHeaders() })
    const data = await res.json()
    setArchived(data)
    setArchivedLoading(false)
  }

  const handleArchiveCourse = async (id) => {
    await fetch(`/api/courses/${id}`, { method: 'PATCH', headers: authHeaders() })
    fetchCourses()
    fetchRegistrations()
  }

  const handleArchiveShields = async (id) => {
    await fetch(`/api/shields/${id}`, { method: 'PATCH', headers: authHeaders() })
    fetchShields()
  }

  const handleArchiveEvent = async (id) => {
    await fetch(`/api/events/${id}`, { method: 'PATCH', headers: authHeaders() })
    fetchEvents()
  }

  const handleRestore = async (type, id) => {
    await fetch('/api/admin/archived', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ type, id }),
    })
    fetchArchived()
  }

  const fetchAuditLog = async () => {
    const res = await fetch('/api/admin/audit', { headers: authHeaders() })
    const data = await res.json()
    setAuditLog(data)
    setAuditPage(1)
  }

  const fetchCourses = async (u, pw) => {
    const res = await fetch('/api/admin/courses', { headers: authHeaders(u, pw) })
    const data = await res.json()
    setCourses(data)
  }

  const fetchRegistrations = async () => {
    setRegistrationsLoading(true)
    const res = await fetch('/api/admin/registrations', { headers: authHeaders() })
    const data = await res.json()
    setRegistrations(data)
    setRegistrationsLoading(false)
  }

  const fetchWaitlist = async () => {
    setWaitlistLoading(true)
    const res = await fetch('/api/admin/waitlist', { headers: authHeaders() })
    const data = await res.json()
    setWaitlist(data)
    setWaitlistLoading(false)
  }

  const removeFromWaitlist = async (id, name) => {
    if (!confirm(`Remove ${name} from the waitlist?`)) return
    await fetch('/api/admin/waitlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ id, name }),
    })
    fetchWaitlist()
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'events') fetchEvents()
    if (tab === 'courses') { fetchCourses(); fetchRegistrations() }
    if (tab === 'shields') fetchShields()
    if (tab === 'registrations') { fetchRegistrations(); fetchWaitlist() }
    if (tab === 'archived') fetchArchived()
    if (tab === 'audit') fetchAuditLog()
    if (tab === 'superadmin') fetchUsers()
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const u = e.target.username.value
    const pw = e.target.password.value

    const res = await fetch('/api/admin/events', {
      headers: { 'x-admin-username': u, 'x-admin-password': pw },
    })
    if (res.status === 401) {
      setError('Incorrect username or password')
      return
    }

    // Probe superadmin status
    const usersRes = await fetch('/api/admin/users', {
      headers: { 'x-admin-username': u, 'x-admin-password': pw },
    })
    const isSuper = usersRes.status !== 401

    sessionStorage.setItem('admin_username', u)
    sessionStorage.setItem('admin_pw', pw)
    sessionStorage.setItem('admin_is_super', String(isSuper))
    setUsername(u)
    setPassword(pw)
    setIsSuperAdmin(isSuper)
    setAuthed(true)
    fetchEvents(u, pw)
  }

  // ── Shields ───────────────────────────────────────────────────────────────────

  const fetchShields = async () => {
    const res = await fetch('/api/admin/shields', { headers: authHeaders() })
    const data = await res.json()
    setShieldsSessions(data)
  }

  const handleShieldsSave = async (e) => {
    e.preventDefault()
    setShieldsError('')
    setShieldsSaving(true)
    const method = editingShieldsId ? 'PUT' : 'POST'
    const url = editingShieldsId ? `/api/shields/${editingShieldsId}` : '/api/shields'
    const payload = { ...shieldsForm, spots: parseInt(shieldsForm.spots) || 0 }
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = await res.json()
      setShieldsError(data.error || 'Failed to save session')
    } else {
      setShieldsForm(emptyShieldsForm)
      setEditingShieldsId(null)
      fetchShields()
    }
    setShieldsSaving(false)
  }

  const handleShieldsEdit = (session) => {
    setShieldsForm({ ...session, spots: String(session.spots ?? '') })
    setEditingShieldsId(session.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleShieldsDelete = async (id) => {
    if (!confirm('Delete this session?')) return
    await fetch(`/api/shields/${id}`, { method: 'DELETE', headers: authHeaders() })
    fetchShields()
  }

  const handleDeleteAllCourses = async () => {
    await fetch('/api/admin/courses', { method: 'DELETE', headers: authHeaders() })
    setConfirmDeleteAll(null)
    fetchCourses()
  }

  const handleDeleteAllShields = async () => {
    await fetch('/api/admin/shields', { method: 'DELETE', headers: authHeaders() })
    setConfirmDeleteAll(null)
    fetchShields()
  }

  const handleShieldsToggleOpen = async (session) => {
    await fetch(`/api/shields/${session.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ ...session, isOpen: !session.isOpen }),
    })
    fetchShields()
  }

  // ── Sessions ─────────────────────────────────────────────────────────────────

  const handleCourseSave = async (e) => {
    e.preventDefault()
    setCourseError('')
    setCourseSaving(true)
    const method = editingCourseId ? 'PUT' : 'POST'
    const url = editingCourseId ? `/api/courses/${editingCourseId}` : '/api/courses'
    const payload = {
      ...courseForm,
      dayNumber: parseInt(courseForm.dayNumber) || 1,
      spots: parseInt(courseForm.spots) || 0,
    }
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = await res.json()
      setCourseError(data.error || 'Failed to save session')
    } else {
      setCourseForm(emptySessionForm)
      setEditingCourseId(null)
      fetchCourses()
    }
    setCourseSaving(false)
  }

  const handleCourseEdit = (session) => {
    setCourseForm({
      ...session,
      spots: String(session.spots ?? ''),
    })
    setEditingCourseId(session.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCourseDelete = async (id) => {
    if (!confirm('Delete this session?')) return
    await fetch(`/api/courses/${id}`, { method: 'DELETE', headers: authHeaders() })
    fetchCourses()
  }

  const handleCourseToggleOpen = async (session) => {
    await fetch(`/api/courses/${session.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ ...session, isOpen: !session.isOpen }),
    })
    fetchCourses()
  }

  // ── Events ──────────────────────────────────────────────────────────────────

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/events/${editingId}` : '/api/events'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(form),
    })

    setForm(emptyForm)
    setEditingId(null)
    setSaving(false)
    fetchEvents()
  }

  const handleEdit = (event) => {
    setForm(event)
    setEditingId(event.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    await fetch(`/api/events/${id}`, { method: 'DELETE', headers: authHeaders() })
    fetchEvents()
  }

  const moveEvent = async (index, direction) => {
    const newEvents = [...events]
    const swapIndex = index + direction
    if (swapIndex < 0 || swapIndex >= newEvents.length) return
    ;[newEvents[index], newEvents[swapIndex]] = [newEvents[swapIndex], newEvents[index]]
    setEvents(newEvents)
    await fetch('/api/events/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ events: newEvents }),
    })
  }

  // ── Users ────────────────────────────────────────────────────────────────────

  const handleAddUser = async (e) => {
    e.preventDefault()
    setUserError('')
    setUserSaving(true)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ username: newUsername, password: newPassword }),
    })
    const data = await res.json()
    if (!res.ok) {
      setUserError(data.error)
    } else {
      setNewUsername('')
      setNewPassword('')
      fetchUsers()
    }
    setUserSaving(false)
  }

  const handleDeleteUser = async (u) => {
    if (!confirm(`Remove admin access for "${u}"?`)) return
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ username: u }),
    })
    fetchUsers()
  }

  // ── Change password ───────────────────────────────────────────────────────────

  const handleChangePw = async (e) => {
    e.preventDefault()
    setChangePwError('')
    setChangePwSuccess(false)
    if (newPw !== confirmPw) {
      setChangePwError('Passwords do not match')
      return
    }
    const res = await fetch('/api/admin/users/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ newPassword: newPw }),
    })
    const data = await res.json()
    if (!res.ok) {
      setChangePwError(data.error)
    } else {
      // Update stored password so future requests still work
      sessionStorage.setItem('admin_pw', newPw)
      setPassword(newPw)
      setNewPw('')
      setConfirmPw('')
      setChangePwSuccess(true)
    }
  }

  // ── Login screen ─────────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', marginTop: '-64px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Logo + title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/logo-borderless.svg" alt="CSULB Sailing" style={{ width: '56px', height: '56px', objectFit: 'contain', marginBottom: '16px' }} />
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>CSULB Sailing Association</h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Admin Portal</p>
          </div>

          {/* Card */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            {error && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span style={{ fontSize: '14px', color: '#dc2626' }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={fieldLabel}>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  autoComplete="username"
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={fieldLabel}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={inputStyle}
                />
              </div>
              <button type="submit" style={{ ...primaryBtn, width: '100%', marginTop: '8px', padding: '12px' }}>
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // ── Admin panel ──────────────────────────────────────────────────────────────

  const tabs = [
    { id: 'events', label: 'Events' },
    { id: 'courses', label: 'Sessions' },
    { id: 'shields', label: 'Shields' },
    { id: 'registrations', label: 'Registrations' },
    { id: 'archived', label: 'Archived' },
    { id: 'audit', label: 'Audit Log' },
    ...(isSuperAdmin ? [{ id: 'superadmin', label: 'Super Admin' }] : []),
  ]

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px', color: '#111827' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>Admin Panel</h1>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Signed in as <strong style={{ color: '#111827' }}>{username}</strong>
              {isSuperAdmin && <span style={{ marginLeft: '8px', backgroundColor: '#ecaa00', color: '#000', fontSize: '12px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px' }}>SUPER ADMIN</span>}
            </div>

            {!isSuperAdmin && (
              <button onClick={() => { setShowChangePw(v => !v); setChangePwError(''); setChangePwSuccess(false) }} style={{ fontSize: '13px', color: '#006E90', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {showChangePw ? 'Cancel' : 'Change password'}
              </button>
            )}
            {isSuperAdmin && (
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>Change password via Vercel env vars</span>
            )}

            <button
              onClick={() => { sessionStorage.clear(); setAuthed(false); setUsername(''); setPassword(''); setIsSuperAdmin(false) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>

            {showChangePw && !isSuperAdmin && (
              <div style={{ marginTop: '4px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px', width: '220px' }}>
                <form onSubmit={handleChangePw} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {changePwError && <p style={{ color: '#dc2626', fontSize: '12px', margin: 0 }}>{changePwError}</p>}
                  {changePwSuccess && <p style={{ color: '#16a34a', fontSize: '12px', margin: 0 }}>Password updated!</p>}
                  <input type="password" placeholder="New password" value={newPw} onChange={e => setNewPw(e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                  <input type="password" placeholder="Confirm password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                  <button type="submit" style={{ ...primaryBtn, fontSize: '13px', padding: '9px', width: '100%' }}>Update password</button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', borderBottom: '2px solid #e5e7eb' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                padding: '10px 24px',
                fontSize: '15px',
                fontWeight: '600',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #ecaa00' : '2px solid transparent',
                marginBottom: '-2px',
                backgroundColor: 'transparent',
                color: activeTab === tab.id ? '#111827' : '#6b7280',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Events tab ── */}
        {activeTab === 'events' && (
          <>
            <form onSubmit={handleSave} style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
                {editingId ? 'Edit Event' : 'Add New Event'}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {[
                  { key: 'title', placeholder: 'Event title', label: 'Title' },
                  { key: 'date', placeholder: 'e.g. April 5, 2026', label: 'Date' },
                  { key: 'time', placeholder: 'e.g. 10:00 AM – 1:00 PM', label: 'Time' },
                  { key: 'location', placeholder: 'e.g. Leeway', label: 'Location' },
                  { key: 'registrationLink', placeholder: 'https://...', label: 'Registration Link' },
                ].map(({ key, placeholder, label }) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={fieldLabel}>{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabel}>Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    style={inputStyle}
                  >
                    {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                <label style={fieldLabel}>Description</label>
                <textarea
                  placeholder="Event description..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={saving} style={primaryBtn}>
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Event'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null) }} style={secondaryBtn}>
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
              Current Events ({events.length})
            </h2>

            {events.length === 0 && <p style={{ color: '#6b7280' }}>No events yet. Add one above.</p>}

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
                    <button onClick={() => handleArchiveEvent(event.id)} style={{ ...secondaryBtn, padding: '7px 12px', fontSize: '13px' }}>Archive</button>
                    <button onClick={() => handleDelete(event.id)} style={deleteBtn}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Courses tab ── */}
        {activeTab === 'courses' && (
          <>
            {/* ── Add / Edit Session form ── */}
            <form onSubmit={handleCourseSave} style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
                {editingCourseId ? 'Edit Session' : 'Add New Session'}
              </h2>
              {courseError && <p style={{ color: '#dc2626', marginBottom: '16px', fontSize: '14px' }}>{courseError}</p>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabel}>Course Type</label>
                  <select value={courseForm.courseType} onChange={e => setCourseForm({ ...courseForm, courseType: e.target.value })} style={inputStyle}>
                    {COURSE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabel}>Day Number</label>
                  <select value={courseForm.dayNumber} onChange={e => setCourseForm({ ...courseForm, dayNumber: parseInt(e.target.value) })} style={inputStyle}>
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>Day {n}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabel}>Spots</label>
                  <input type="number" min="1" placeholder="12" value={courseForm.spots}
                    onChange={e => setCourseForm({ ...courseForm, spots: e.target.value })} style={inputStyle} required />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                  <label style={fieldLabel}>Date</label>
                  <input type="text" placeholder="e.g. April 5, 2026" value={courseForm.date}
                    onChange={e => setCourseForm({ ...courseForm, date: e.target.value })} style={inputStyle} required />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabel}>Start Time</label>
                  <input type="text" placeholder="e.g. 8:00 AM" value={courseForm.startTime}
                    onChange={e => setCourseForm({ ...courseForm, startTime: e.target.value })} style={inputStyle} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabel}>End Time</label>
                  <input type="text" placeholder="e.g. 4:00 PM" value={courseForm.endTime}
                    onChange={e => setCourseForm({ ...courseForm, endTime: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button type="submit" disabled={courseSaving} style={primaryBtn}>
                  {courseSaving ? 'Saving...' : editingCourseId ? 'Save Changes' : 'Add Session'}
                </button>
                {editingCourseId && (
                  <button type="button" onClick={() => { setCourseForm(emptySessionForm); setEditingCourseId(null) }} style={secondaryBtn}>
                    Cancel
                  </button>
                )}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151', marginLeft: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={courseForm.isOpen}
                    onChange={e => setCourseForm({ ...courseForm, isOpen: e.target.checked })} />
                  Open for registration
                </label>
              </div>
            </form>

            {/* ── Session list grouped by course type ── */}
            {courses.length === 0 && <p style={{ color: '#6b7280' }}>No sessions yet. Add one above.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '48px' }}>
              {COURSE_TYPES.map(ct => {
                const ctSessions = [...courses]
                  .filter(s => s.courseType === ct)
                  .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0))
                if (ctSessions.length === 0) return null
                return (
                  <div key={ct}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: '#1e3a5f' }}>
                        {ct} <span style={{ fontSize: '13px', fontWeight: '400', color: '#6b7280' }}>({ctSessions.length} session{ctSessions.length !== 1 ? 's' : ''})</span>
                      </h3>
                      {confirmDeleteAll === ct ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: '600' }}>Delete all {ctSessions.length}?</span>
                          <button onClick={handleDeleteAllCourses} style={{ ...deleteBtn, padding: '6px 12px', fontSize: '13px' }}>Yes</button>
                          <button onClick={() => setConfirmDeleteAll(null)} style={{ ...secondaryBtn, padding: '6px 12px', fontSize: '13px' }}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDeleteAll(ct)} style={{ ...deleteBtn, padding: '6px 12px', fontSize: '13px' }}>Delete All</button>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {ctSessions.map(session => {
                        const sessionRegs = registrations.filter(r => (r.row[6] || '').split(',').includes(session.id))
                        return (
                          <div key={session.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#374151' }}>Day {session.dayNumber}</span>
                                  <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '999px', fontWeight: '600',
                                    backgroundColor: session.isOpen ? '#dcfce7' : '#f3f4f6',
                                    color: session.isOpen ? '#16a34a' : '#6b7280' }}>
                                    {session.isOpen ? 'Open' : 'Closed'}
                                  </span>
                                  <span style={{ fontSize: '13px', color: session.enrolled >= session.spots ? '#dc2626' : '#6b7280' }}>
                                    {session.enrolled || 0}/{session.spots} enrolled
                                  </span>
                                </div>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                                  {session.date}{session.startTime ? ` · ${session.startTime}${session.endTime ? `–${session.endTime}` : ''}` : ''}
                                </p>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                <button onClick={() => handleCourseToggleOpen(session)} style={{ ...secondaryBtn, padding: '7px 12px', fontSize: '13px' }}>
                                  {session.isOpen ? 'Close' : 'Open'}
                                </button>
                                <button onClick={() => handleCourseEdit(session)} style={editBtn}>Edit</button>
                                <button onClick={() => handleArchiveCourse(session.id)} style={{ ...secondaryBtn, padding: '7px 12px', fontSize: '13px' }}>Archive</button>
                                <button onClick={() => handleCourseDelete(session.id)} style={deleteBtn}>Delete</button>
                              </div>
                            </div>
                            {sessionRegs.length > 0 && (
                              <div style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#fff', padding: '12px 20px' }}>
                                <p style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>
                                  Registered ({sessionRegs.length})
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  {sessionRegs.map(({ row }, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#374151' }}>
                                      <span style={{ fontWeight: '600', minWidth: '140px' }}>{row[2]}</span>
                                      <span style={{ color: '#6b7280' }}>{row[4]}</span>
                                      <span style={{ color: '#6b7280' }}>@{row[5]}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

          </>
        )}

        {/* ── Shields tab ── */}
        {activeTab === 'shields' && (
          <>
            <form onSubmit={handleShieldsSave} style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
                {editingShieldsId ? 'Edit Session' : 'Add New Shields Session'}
              </h2>
              {shieldsError && <p style={{ color: '#dc2626', marginBottom: '16px', fontSize: '14px' }}>{shieldsError}</p>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabel}>Course Type</label>
                  <select value={shieldsForm.courseType} onChange={e => setShieldsForm({ ...shieldsForm, courseType: e.target.value })} style={inputStyle}>
                    {SHIELDS_COURSE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabel}>Session Name</label>
                  <input type="text" required placeholder="e.g. Spring Session 1" value={shieldsForm.name}
                    onChange={e => setShieldsForm({ ...shieldsForm, name: e.target.value })} style={inputStyle} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabel}>Spots</label>
                  <input type="number" min="1" required placeholder="12" value={shieldsForm.spots}
                    onChange={e => setShieldsForm({ ...shieldsForm, spots: e.target.value })} style={inputStyle} />
                </div>

                {/* Day 1 */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#374151', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Day 1</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={fieldLabel}>Date</label>
                      <input type="text" required placeholder="April 5, 2026" value={shieldsForm.day1Date}
                        onChange={e => setShieldsForm({ ...shieldsForm, day1Date: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={fieldLabel}>Start Time</label>
                      <input type="text" placeholder="9:00 AM" value={shieldsForm.day1StartTime}
                        onChange={e => setShieldsForm({ ...shieldsForm, day1StartTime: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={fieldLabel}>End Time</label>
                      <input type="text" placeholder="3:00 PM" value={shieldsForm.day1EndTime}
                        onChange={e => setShieldsForm({ ...shieldsForm, day1EndTime: e.target.value })} style={inputStyle} />
                    </div>
                  </div>
                </div>

                {/* Day 2 */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#374151', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Day 2</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={fieldLabel}>Date</label>
                      <input type="text" required placeholder="April 12, 2026" value={shieldsForm.day2Date}
                        onChange={e => setShieldsForm({ ...shieldsForm, day2Date: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={fieldLabel}>Start Time</label>
                      <input type="text" placeholder="9:00 AM" value={shieldsForm.day2StartTime}
                        onChange={e => setShieldsForm({ ...shieldsForm, day2StartTime: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={fieldLabel}>End Time</label>
                      <input type="text" placeholder="3:00 PM" value={shieldsForm.day2EndTime}
                        onChange={e => setShieldsForm({ ...shieldsForm, day2EndTime: e.target.value })} style={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button type="submit" disabled={shieldsSaving} style={primaryBtn}>
                  {shieldsSaving ? 'Saving...' : editingShieldsId ? 'Save Changes' : 'Add Session'}
                </button>
                {editingShieldsId && (
                  <button type="button" onClick={() => { setShieldsForm(emptyShieldsForm); setEditingShieldsId(null) }} style={secondaryBtn}>
                    Cancel
                  </button>
                )}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151', marginLeft: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={shieldsForm.isOpen}
                    onChange={e => setShieldsForm({ ...shieldsForm, isOpen: e.target.checked })} />
                  Open for registration
                </label>
              </div>
            </form>

            <ShieldsBulkImport authHeaders={authHeaders} onImported={fetchShields} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Shields Sessions ({shieldsSessions.length})</h2>
              {shieldsSessions.length > 0 && confirmDeleteAll !== 'shields' && (
                <button onClick={() => setConfirmDeleteAll('shields')} style={deleteBtn}>Delete All</button>
              )}
              {confirmDeleteAll === 'shields' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', color: '#dc2626', fontWeight: '600' }}>Delete all {shieldsSessions.length} sessions?</span>
                  <button onClick={handleDeleteAllShields} style={deleteBtn}>Yes, delete all</button>
                  <button onClick={() => setConfirmDeleteAll(null)} style={secondaryBtn}>Cancel</button>
                </div>
              )}
            </div>
            {shieldsSessions.length === 0 && <p style={{ color: '#6b7280' }}>No sessions yet. Add one above.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {SHIELDS_COURSE_TYPES.map(ct => {
                const ctSessions = shieldsSessions.filter(s => s.courseType === ct)
                if (ctSessions.length === 0) return null
                return (
                  <div key={ct}>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 12px', color: '#1e3a5f' }}>
                      {ct} <span style={{ fontSize: '13px', fontWeight: '400', color: '#6b7280' }}>({ctSessions.length} session{ctSessions.length !== 1 ? 's' : ''})</span>
                    </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {ctSessions.map(session => (
                          <div key={session.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <p style={{ fontWeight: '700', fontSize: '16px', margin: 0 }}>{session.name}</p>
                                <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '999px', fontWeight: '600',
                                  backgroundColor: session.isOpen ? '#dcfce7' : '#f3f4f6',
                                  color: session.isOpen ? '#16a34a' : '#6b7280' }}>
                                  {session.isOpen ? 'Open' : 'Closed'}
                                </span>
                              </div>
                              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 2px' }}>
                                Day 1: {session.day1Date}{session.day1StartTime ? ` · ${session.day1StartTime}${session.day1EndTime ? `–${session.day1EndTime}` : ''}` : ''}
                              </p>
                              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px' }}>
                                Day 2: {session.day2Date}{session.day2StartTime ? ` · ${session.day2StartTime}${session.day2EndTime ? `–${session.day2EndTime}` : ''}` : ''}
                              </p>
                              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                                {session.enrolled || 0}/{session.spots} enrolled
                              </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              <button onClick={() => handleShieldsToggleOpen(session)} style={{ ...secondaryBtn, padding: '8px 14px', fontSize: '13px' }}>
                                {session.isOpen ? 'Close' : 'Open'}
                              </button>
                              <button onClick={() => handleShieldsEdit(session)} style={editBtn}>Edit</button>
                              <button onClick={() => handleArchiveShields(session.id)} style={{ ...secondaryBtn, padding: '7px 12px', fontSize: '13px' }}>Archive</button>
                              <button onClick={() => handleShieldsDelete(session.id)} style={deleteBtn}>Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
            </div>
          </>
        )}

        {/* ── Registrations & Waitlist tab ── */}
        {activeTab === 'registrations' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Registrations &amp; Waitlist</h2>
              <button onClick={() => { fetchRegistrations(); fetchWaitlist() }} disabled={registrationsLoading || waitlistLoading} style={secondaryBtn}>
                {registrationsLoading || waitlistLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            {COURSE_TYPES.map(ct => {
              const ctRegs = registrations.filter(r => r.row[1] === ct)
              const ctWaitlist = waitlist.filter(e => e.courseType === ct)
              if (ctRegs.length === 0 && ctWaitlist.length === 0) return null
              return (
                <div key={ct} style={{ marginBottom: '48px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>{ct}</h3>

                  {/* Registrations */}
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>
                    Registrations ({ctRegs.length})
                  </p>
                  {ctRegs.length === 0
                    ? <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '20px' }}>No registrations yet.</p>
                    : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        {ctRegs.map(({ row, sheetRowIndex }, i) => (
                          <div key={i} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontWeight: '700', fontSize: '15px', margin: '0 0 2px', color: '#111827' }}>{row[2]}</p>
                              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 2px' }}>{row[4]} · @{row[5]}</p>
                              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{row[3]}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                              {row[7] && (
                                <a href={row[7]} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#006E90', textDecoration: 'none', fontWeight: '600' }}>Receipt</a>
                              )}
                              <button
                                onClick={async () => {
                                  if (!confirm(`Delete registration for ${row[2]}?`)) return
                                  await fetch('/api/admin/registrations', {
                                    method: 'DELETE',
                                    headers: { 'Content-Type': 'application/json', ...authHeaders() },
                                    body: JSON.stringify({ sheetRowIndex, sessionIds: (row[6] || '').split(',').filter(Boolean), studentName: row[2] }),
                                  })
                                  fetchRegistrations()
                                }}
                                style={deleteBtn}
                              >Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  }

                  {/* Waitlist */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                      Waitlist ({ctWaitlist.length})
                    </p>
                    {ctWaitlist.length > 0 && (
                      <button
                        onClick={async () => {
                          const res = await fetch('/api/admin/waitlist/notify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', ...authHeaders() },
                            body: JSON.stringify({ courseType: ct }),
                          })
                          const data = await res.json()
                          alert(`Sent ${data.sent} of ${data.total} notifications for ${ct}.`)
                        }}
                        style={{ ...secondaryBtn, padding: '6px 14px', fontSize: '13px' }}
                      >
                        Notify Waitlist
                      </button>
                    )}
                  </div>
                  {ctWaitlist.length === 0
                    ? <p style={{ fontSize: '14px', color: '#9ca3af' }}>No one on the waitlist.</p>
                    : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {ctWaitlist.map(entry => (
                          <div key={entry.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                            <div>
                              <p style={{ fontWeight: '700', fontSize: '15px', margin: '0 0 2px', color: '#111827' }}>{entry.name}</p>
                              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{entry.email} · @{entry.discord}</p>
                            </div>
                            <button onClick={() => removeFromWaitlist(entry.id, entry.name)} style={deleteBtn}>Remove</button>
                          </div>
                        ))}
                      </div>
                    )
                  }
                </div>
              )
            })}
            {registrations.length === 0 && waitlist.length === 0 && !registrationsLoading && !waitlistLoading && (
              <p style={{ color: '#6b7280' }}>No registrations or waitlist entries yet.</p>
            )}
          </>
        )}

        {/* ── Archived tab ── */}
        {activeTab === 'archived' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Archived</h2>
              <button onClick={fetchArchived} disabled={archivedLoading} style={secondaryBtn}>
                {archivedLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {/* Archived Sessions */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e3a5f', marginBottom: '12px' }}>
                Sessions ({archived.sessions.length})
              </h3>
              {archived.sessions.length === 0
                ? <p style={{ color: '#6b7280', fontSize: '14px' }}>No archived sessions.</p>
                : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[...archived.sessions].sort((a, b) => a.courseType.localeCompare(b.courseType) || (a.dayNumber || 0) - (b.dayNumber || 0)).map(s => (
                      <div key={s.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: '700', backgroundColor: '#1e3a5f', color: '#fff', padding: '2px 8px', borderRadius: '999px', marginRight: '8px' }}>{s.courseType}</span>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Day {s.dayNumber} · {s.date}</span>
                          <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '10px' }}>Archived {new Date(s.archivedAt).toLocaleDateString()}</span>
                        </div>
                        <button onClick={() => handleRestore('sessions', s.id)} style={{ ...secondaryBtn, padding: '6px 12px', fontSize: '13px' }}>Restore</button>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>

            {/* Archived Events */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e3a5f', marginBottom: '12px' }}>
                Events ({archived.events.length})
              </h3>
              {archived.events.length === 0
                ? <p style={{ color: '#6b7280', fontSize: '14px' }}>No archived events.</p>
                : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {archived.events.map(e => (
                      <div key={e.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                        <div>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{e.title}</span>
                          <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '10px' }}>{e.date}</span>
                          <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '10px' }}>Archived {new Date(e.archivedAt).toLocaleDateString()}</span>
                        </div>
                        <button onClick={() => handleRestore('events', e.id)} style={{ ...secondaryBtn, padding: '6px 12px', fontSize: '13px' }}>Restore</button>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>

            {/* Archived Shields */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e3a5f', marginBottom: '12px' }}>
                Shields Sessions ({archived.shields.length})
              </h3>
              {archived.shields.length === 0
                ? <p style={{ color: '#6b7280', fontSize: '14px' }}>No archived Shields sessions.</p>
                : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {archived.shields.map(s => (
                      <div key={s.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                        <div>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{s.name}</span>
                          <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '10px' }}>{s.day1Date} · {s.day2Date}</span>
                          <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '10px' }}>Archived {new Date(s.archivedAt).toLocaleDateString()}</span>
                        </div>
                        <button onClick={() => handleRestore('shields', s.id)} style={{ ...secondaryBtn, padding: '6px 12px', fontSize: '13px' }}>Restore</button>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>

            {/* Archived Registrations */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e3a5f', marginBottom: '12px' }}>
                Registrations ({(archived.registrations || []).length})
              </h3>
              {(archived.registrations || []).length === 0
                ? <p style={{ color: '#6b7280', fontSize: '14px' }}>No archived registrations.</p>
                : COURSE_TYPES.map(ct => {
                    const ctRegs = (archived.registrations || []).filter(r => r.courseType === ct)
                    if (ctRegs.length === 0) return null
                    return (
                      <div key={ct} style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>{ct} ({ctRegs.length})</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {ctRegs.map(r => (
                            <div key={r.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                              <div>
                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{r.row[2]}</span>
                                <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '10px' }}>{r.row[4]} · @{r.row[5]}</span>
                                <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '10px' }}>Archived {new Date(r.archivedAt).toLocaleDateString()}</span>
                              </div>
                              {r.row[7] && (
                                <a href={r.row[7]} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#006E90', textDecoration: 'none', fontWeight: '600', flexShrink: 0 }}>Receipt</a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })
              }
            </div>

            {/* Archived Waitlist */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e3a5f', marginBottom: '12px' }}>
                Waitlist ({(archived.waitlist || []).length})
              </h3>
              {(archived.waitlist || []).length === 0
                ? <p style={{ color: '#6b7280', fontSize: '14px' }}>No archived waitlist entries.</p>
                : COURSE_TYPES.map(ct => {
                    const ctEntries = (archived.waitlist || []).filter(e => e.courseType === ct)
                    if (ctEntries.length === 0) return null
                    return (
                      <div key={ct} style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>{ct} ({ctEntries.length})</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {ctEntries.map(entry => (
                            <div key={entry.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 16px' }}>
                              <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{entry.name}</span>
                              <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '10px' }}>{entry.email} · @{entry.discord}</span>
                              <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '10px' }}>Removed {new Date(entry.archivedAt).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })
              }
            </div>
          </>
        )}

        {/* ── Audit Log tab ── */}
        {activeTab === 'audit' && (() => {
          const totalPages = Math.max(1, Math.ceil(auditLog.length / AUDIT_PAGE_SIZE))
          const page = Math.min(auditPage, totalPages)
          const pageEntries = auditLog.slice((page - 1) * AUDIT_PAGE_SIZE, page * AUDIT_PAGE_SIZE)
          return (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
                  Audit Log {auditLog.length > 0 && <span style={{ fontSize: '14px', fontWeight: '400', color: '#6b7280' }}>({auditLog.length} entries)</span>}
                </h2>
                <button onClick={fetchAuditLog} style={secondaryBtn}>Refresh</button>
              </div>

              {auditLog.length === 0 && <p style={{ color: '#6b7280' }}>No activity recorded yet.</p>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {pageEntries.map((entry, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 160px', gap: '16px', alignItems: 'center', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 16px', fontSize: '14px' }}>
                    <span style={{ fontWeight: '700', color: '#111827' }}>{entry.username}</span>
                    <span style={{ color: '#374151' }}>
                      <span style={{ color: '#6b7280', marginRight: '6px' }}>{entry.action}</span>
                      {entry.detail && <strong>{entry.detail}</strong>}
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'right' }}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => setAuditPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ ...arrowBtn, opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
                  <span style={{ fontSize: '14px', color: '#374151' }}>Page {page} of {totalPages}</span>
                  <button onClick={() => setAuditPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ ...arrowBtn, opacity: page === totalPages ? 0.4 : 1 }}>Next →</button>
                </div>
              )}
            </>
          )
        })()}

        {/* ── Super Admin tab ── */}
        {activeTab === 'superadmin' && isSuperAdmin && (
          <>
            {/* Test Emails */}
            <div style={{ marginBottom: '56px' }}>
              <TestEmailPanel authHeaders={authHeaders} />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '48px' }} />

            {/* Manage Users */}
            <form onSubmit={handleAddUser} style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Add Admin User</h2>
              {userError && <p style={{ color: '#dc2626', marginBottom: '16px', fontSize: '14px' }}>{userError}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabel}>Username</label>
                  <input
                    type="text"
                    placeholder="e.g. sarah"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabel}>Password</label>
                  <input
                    type="password"
                    placeholder="Temporary password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
              <button type="submit" disabled={userSaving} style={primaryBtn}>
                {userSaving ? 'Adding...' : 'Add User'}
              </button>
            </form>

            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
              Current Admins ({users.length})
            </h2>

            {users.length === 0 && <p style={{ color: '#6b7280' }}>No additional admin users yet.</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {users.map(u => (
                <div key={u.username} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', fontSize: '15px' }}>{u.username}</span>
                  <button onClick={() => handleDeleteUser(u.username)} style={deleteBtn}>Remove</button>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}

function ShieldsBulkImport({ authHeaders, onImported }) {
  const [open, setOpen] = useState(false)
  const [raw, setRaw] = useState('')
  const [preview, setPreview] = useState(null)
  const [parseError, setParseError] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState('')

  const EXAMPLE = JSON.stringify([
    { name: 'Spring Session 1', day1Date: 'April 5, 2026', day1StartTime: '9:00 AM', day1EndTime: '3:00 PM', day2Date: 'April 12, 2026', day2StartTime: '9:00 AM', day2EndTime: '3:00 PM', spots: 12, isOpen: false },
    { name: 'Spring Session 2', day1Date: 'April 19, 2026', day1StartTime: '9:00 AM', day1EndTime: '3:00 PM', day2Date: 'April 26, 2026', day2StartTime: '9:00 AM', day2EndTime: '3:00 PM', spots: 12, isOpen: false },
  ], null, 2)

  const handleParse = () => {
    setParseError('')
    setPreview(null)
    setImportResult('')
    try {
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) throw new Error('JSON must be an array [ ... ]')
      if (parsed.length === 0) throw new Error('Array is empty.')
      for (const s of parsed) {
        if (!s.name || !s.day1Date || !s.day2Date) throw new Error(`Each session needs at least "name", "day1Date", and "day2Date".`)
      }
      setPreview(parsed)
    } catch (err) {
      setParseError(err.message)
    }
  }

  const handleFileLoad = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setRaw(ev.target.result); setPreview(null); setParseError(''); setImportResult('') }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleImport = async () => {
    if (!preview) return
    setImporting(true)
    setImportResult('')
    const res = await fetch('/api/admin/shields', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(preview),
    })
    const data = await res.json()
    if (!res.ok) {
      setImportResult(`Error: ${data.error}`)
    } else {
      setImportResult(`✓ Imported ${data.imported} session${data.imported !== 1 ? 's' : ''} successfully.`)
      setRaw('')
      setPreview(null)
      onImported()
    }
    setImporting(false)
  }

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', marginBottom: '40px', overflow: 'hidden' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#f9fafb', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontWeight: '700', fontSize: '15px', color: '#111827' }}>Bulk Import via JSON</span>
        <span style={{ color: '#6b7280', fontSize: '16px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▾</span>
      </button>

      {open && (
        <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
            Paste a JSON array of sessions or upload a <code>.json</code> file. Required fields per session: <code>name</code>, <code>day1Date</code>, <code>day2Date</code>.
          </p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
            <label style={{ ...secondaryBtn, padding: '8px 14px', fontSize: '13px', cursor: 'pointer', display: 'inline-block' }}>
              Upload .json file
              <input type="file" accept=".json" onChange={handleFileLoad} style={{ display: 'none' }} />
            </label>
            <button type="button" onClick={() => { setRaw(EXAMPLE); setPreview(null); setParseError(''); setImportResult('') }}
              style={{ background: 'none', border: 'none', color: '#006E90', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
              Load example
            </button>
          </div>

          <textarea
            value={raw}
            onChange={e => { setRaw(e.target.value); setPreview(null); setParseError(''); setImportResult('') }}
            placeholder={'[\n  { "name": "...", "day1Date": "...", "day2Date": "...", "spots": 12 },\n  ...\n]'}
            rows={8}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }}
          />

          {parseError && <p style={{ color: '#dc2626', fontSize: '13px', margin: '8px 0 0' }}>{parseError}</p>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px', alignItems: 'center' }}>
            <button type="button" onClick={handleParse} disabled={!raw.trim()}
              style={{ ...secondaryBtn, padding: '8px 16px', fontSize: '13px' }}>
              Validate JSON
            </button>
            {preview && (
              <button type="button" onClick={handleImport} disabled={importing}
                style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                {importing ? 'Importing...' : `Import ${preview.length} session${preview.length !== 1 ? 's' : ''}`}
              </button>
            )}
            {importResult && <span style={{ fontSize: '13px', color: importResult.startsWith('✓') ? '#16a34a' : '#dc2626', fontWeight: '600' }}>{importResult}</span>}
          </div>

          {preview && (
            <div style={{ marginTop: '16px', overflowX: 'auto' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Preview — {preview.length} session{preview.length !== 1 ? 's' : ''}:</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    {['Name', 'Day 1', 'Day 2', 'Spots'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '8px 12px', color: '#111827', fontWeight: '600' }}>{s.name}</td>
                      <td style={{ padding: '8px 12px', color: '#374151' }}>{s.day1Date}{s.day1StartTime ? ` · ${s.day1StartTime}` : ''}</td>
                      <td style={{ padding: '8px 12px', color: '#374151' }}>{s.day2Date}{s.day2StartTime ? ` · ${s.day2StartTime}` : ''}</td>
                      <td style={{ padding: '8px 12px', color: '#374151' }}>{s.spots ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TestEmailPanel({ authHeaders }) {
  const EMAIL_TYPES = [
    { id: 'registration', label: 'Registration Confirmation', desc: 'Sent to students after they register for a course.' },
    { id: 'waitlist-confirm', label: 'Waitlist Confirmation', desc: 'Sent when a student joins the waitlist.' },
    { id: 'waitlist-notify', label: 'Waitlist Notification', desc: 'Sent to waitlist members when sessions open.' },
  ]
  const [to, setTo] = useState('')
  const [sending, setSending] = useState(null)
  const [results, setResults] = useState({})

  const send = async (type) => {
    if (!to.trim()) return
    setSending(type)
    setResults(r => ({ ...r, [type]: null }))
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ type, to: to.trim() }),
      })
      const data = await res.json()
      setResults(r => ({ ...r, [type]: res.ok ? 'Sent!' : (data.error || 'Failed.') }))
    } catch {
      setResults(r => ({ ...r, [type]: 'Network error.' }))
    } finally {
      setSending(null)
    }
  }

  return (
    <>
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Test Emails</h2>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
        Send a preview of each email template to any address.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '28px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Send to</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={to}
          onChange={e => setTo(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px', maxWidth: '360px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {EMAIL_TYPES.map(({ id, label, desc }) => (
          <div key={id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontWeight: '600', fontSize: '15px', margin: '0 0 2px' }}>{label}</p>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{desc}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              {results[id] && (
                <span style={{ fontSize: '13px', color: results[id] === 'Sent!' ? '#16a34a' : '#dc2626', fontWeight: '600' }}>
                  {results[id]}
                </span>
              )}
              <button
                onClick={() => send(id)}
                disabled={!to.trim() || sending === id}
                style={{ backgroundColor: '#ecaa00', color: '#000', border: 'none', borderRadius: '6px', padding: '8px 18px', fontWeight: '700', fontSize: '14px', cursor: (!to.trim() || sending === id) ? 'default' : 'pointer', opacity: (!to.trim() || sending === id) ? 0.6 : 1 }}
              >
                {sending === id ? 'Sending...' : 'Send Test'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const inputStyle = { padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px' }
const fieldLabel = { fontSize: '13px', fontWeight: '600', color: '#6b7280' }
const primaryBtn = { backgroundColor: '#ecaa00', color: '#000', padding: '10px 24px', borderRadius: '6px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }
const secondaryBtn = { backgroundColor: '#f3f4f6', color: '#374151', padding: '10px 24px', borderRadius: '6px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer' }
const arrowBtn = { backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }
const editBtn = { backgroundColor: '#006E90', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }
const deleteBtn = { backgroundColor: '#64100F', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }
