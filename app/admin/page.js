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

  const handleTabChange = (tab) => {
    setActiveTab(tab)
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
      <div style={{ maxWidth: '400px', margin: '120px auto', padding: '0 24px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px', color: '#111827' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Admin Login</h1>
          {error && <p style={{ color: '#dc2626', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="username"
              style={inputStyle}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              style={inputStyle}
            />
            <button type="submit" style={primaryBtn}>Log In</button>
          </form>
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
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
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
            {showChangePw && !isSuperAdmin && (
              <form onSubmit={handleChangePw} style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                {changePwError && <p style={{ color: '#dc2626', fontSize: '13px', margin: 0 }}>{changePwError}</p>}
                {changePwSuccess && <p style={{ color: '#16a34a', fontSize: '13px', margin: 0 }}>Password updated!</p>}
                <input type="password" placeholder="New password" value={newPw} onChange={e => setNewPw(e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                <input type="password" placeholder="Confirm password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                <button type="submit" style={{ ...primaryBtn, fontSize: '13px', padding: '8px 16px' }}>Update</button>
              </form>
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
                  { key: 'location', placeholder: 'e.g. CSULB Sailing Base', label: 'Location' },
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
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#6b7280' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px', color: '#374151' }}>Coming Soon</p>
            <p style={{ fontSize: '15px', margin: 0 }}>Course management is not yet implemented.</p>
          </div>
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
