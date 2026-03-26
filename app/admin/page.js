'use client'

import { useState, useEffect } from 'react'

const EVENT_TYPES = ['Learn to Sail', 'Casual Sail', 'BBQ', 'Maintenance', 'Themed Event', 'Social']
const COURSE_TYPES = ['Sailing A', 'Sailing B', 'Sailing C', 'Level 1 Keelboat', 'Other']
const PROGRAM_TYPES = ['student', 'community']
const COURSE_DAY_COUNT = { 'Sailing A': 2, 'Sailing B': 2, 'Sailing C': 3, 'Level 1 Keelboat': 2, 'Other': 1 }

const emptyForm = {
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
  type: 'Learn to Sail',
  registrationLink: '',
}

const emptySessionForm = {
  courseType: 'Sailing A',
  programType: 'student',
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
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('')
  const [registrationsLoading, setRegistrationsLoading] = useState(false)

  // Users state
  const [users, setUsers] = useState([])
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [userError, setUserError] = useState('')
  const [userSaving, setUserSaving] = useState(false)

  // Audit log state
  const [auditLog, setAuditLog] = useState([])

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

  const fetchAuditLog = async () => {
    const res = await fetch('/api/admin/audit', { headers: authHeaders() })
    const data = await res.json()
    setAuditLog(data)
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

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'courses') fetchCourses()
    if (tab === 'users') fetchUsers()
    if (tab === 'audit') fetchAuditLog()
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
            <img src="/logo-borderless.png" alt="CSULB Sailing" style={{ width: '56px', height: '56px', objectFit: 'contain', marginBottom: '16px' }} />
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
    { id: 'events', label: 'Add Events' },
    { id: 'courses', label: 'Add Courses' },
    { id: 'audit', label: 'Audit Log' },
    ...(isSuperAdmin ? [{ id: 'users', label: 'Manage Users' }] : []),
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
                  <label style={fieldLabel}>Program</label>
                  <select value={courseForm.programType} onChange={e => setCourseForm({ ...courseForm, programType: e.target.value })} style={inputStyle}>
                    <option value="student">Student</option>
                    <option value="community">Community</option>
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

            {/* ── Session list ── */}
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
              Sessions ({courses.length})
            </h2>
            {courses.length === 0 && <p style={{ color: '#6b7280' }}>No sessions yet. Add one above.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}>
              {[...courses]
                .sort((a, b) => {
                  if (a.courseType !== b.courseType) return a.courseType.localeCompare(b.courseType)
                  return (a.dayNumber || 0) - (b.dayNumber || 0)
                })
                .map(session => (
                  <div key={session.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '999px', fontWeight: '700', backgroundColor: '#1e3a5f', color: '#fff' }}>
                          {session.courseType}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                          Day {session.dayNumber}
                        </span>
                        <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '999px', fontWeight: '600',
                          backgroundColor: session.isOpen ? '#dcfce7' : '#f3f4f6',
                          color: session.isOpen ? '#16a34a' : '#6b7280' }}>
                          {session.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 2px' }}>
                        {session.date}{session.startTime ? ` · ${session.startTime}${session.endTime ? `–${session.endTime}` : ''}` : ''}
                      </p>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                        {session.programType === 'student' ? 'Student' : 'Community'} · {session.enrolled || 0}/{session.spots} enrolled
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleCourseToggleOpen(session)}
                        style={{ ...secondaryBtn, padding: '8px 14px', fontSize: '13px' }}>
                        {session.isOpen ? 'Close' : 'Open'}
                      </button>
                      <button onClick={() => handleCourseEdit(session)} style={editBtn}>Edit</button>
                      <button onClick={() => handleCourseDelete(session.id)} style={deleteBtn}>Delete</button>
                    </div>
                  </div>
                ))}
            </div>

            {/* ── Registrations roster ── */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Registrations</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select value={selectedCourseFilter} onChange={e => setSelectedCourseFilter(e.target.value)} style={{ ...inputStyle, fontSize: '14px' }}>
                    <option value="">All course types</option>
                    {COURSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button onClick={fetchRegistrations} disabled={registrationsLoading} style={secondaryBtn}>
                    {registrationsLoading ? 'Loading...' : 'Load'}
                  </button>
                </div>
              </div>

              {registrations.length === 0 && (
                <p style={{ color: '#6b7280' }}>Click &quot;Load&quot; to fetch registrations from Google Sheets.</p>
              )}

              {registrations.length > 0 && (() => {
                const filtered = selectedCourseFilter
                  ? registrations.filter(r => r.row[1] === selectedCourseFilter)
                  : registrations
                return filtered.length === 0
                  ? <p style={{ color: '#6b7280' }}>No registrations for this course type yet.</p>
                  : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f3f4f6' }}>
                            {['Course Type', 'Name', 'Email', 'Discord', 'Sessions', 'Receipt', 'Submitted', ''].map(h => (
                              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map(({ row, sheetRowIndex }) => (
                            <tr key={sheetRowIndex} style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '10px 14px', color: '#374151' }}>{row[1]}</td>
                              <td style={{ padding: '10px 14px', color: '#374151' }}>{row[3]}</td>
                              <td style={{ padding: '10px 14px', color: '#374151' }}>{row[4]}</td>
                              <td style={{ padding: '10px 14px', color: '#374151' }}>{row[5]}</td>
                              <td style={{ padding: '10px 14px', color: '#374151', fontSize: '13px' }}>{row[6] || '—'}</td>
                              <td style={{ padding: '10px 14px' }}>
                                {row[7] ? <a href={row[7]} target="_blank" rel="noreferrer" style={{ color: '#006E90' }}>View</a> : '—'}
                              </td>
                              <td style={{ padding: '10px 14px', color: '#9ca3af', fontSize: '13px' }}>
                                {row[0] ? new Date(row[0]).toLocaleString() : '—'}
                              </td>
                              <td style={{ padding: '10px 14px' }}>
                                <button
                                  onClick={async () => {
                                    if (!confirm(`Remove registration for ${row[3]}?`)) return
                                    await fetch('/api/admin/registrations', {
                                      method: 'DELETE',
                                      headers: { 'Content-Type': 'application/json', ...authHeaders() },
                                      body: JSON.stringify({ sheetRowIndex, sessionIds: row[2]?.split(',').filter(Boolean) || [], studentName: row[3] }),
                                    })
                                    fetchRegistrations()
                                    fetchCourses()
                                  }}
                                  style={deleteBtn}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
              })()}
            </div>
          </>
        )}

        {/* ── Audit Log tab ── */}
        {activeTab === 'audit' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Audit Log</h2>
              <button onClick={fetchAuditLog} style={secondaryBtn}>Refresh</button>
            </div>

            {auditLog.length === 0 && <p style={{ color: '#6b7280' }}>No activity recorded yet.</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {auditLog.map((entry, i) => (
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
          </>
        )}

        {/* ── Manage Users tab (superadmin only) ── */}
        {activeTab === 'users' && isSuperAdmin && (
          <>
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

const inputStyle = { padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px' }
const fieldLabel = { fontSize: '13px', fontWeight: '600', color: '#6b7280' }
const primaryBtn = { backgroundColor: '#ecaa00', color: '#000', padding: '10px 24px', borderRadius: '6px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }
const secondaryBtn = { backgroundColor: '#f3f4f6', color: '#374151', padding: '10px 24px', borderRadius: '6px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer' }
const arrowBtn = { backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }
const editBtn = { backgroundColor: '#006E90', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }
const deleteBtn = { backgroundColor: '#64100F', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }
