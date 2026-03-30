'use client'

import { useState } from 'react'

export default function ShieldsRegistrationModal({ session, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/shields/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        if (data.emailError) console.warn('Email failed:', data.emailError)
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', zIndex: 1000,
      }}
    >
      <div style={{
        backgroundColor: '#fff', borderRadius: '16px', padding: '40px',
        width: '100%', maxWidth: '500px', position: 'relative',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '20px', lineHeight: 1 }}
          aria-label="Close"
        >
          ✕
        </button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#111827' }}>You&apos;re registered!</h2>
            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7', marginBottom: '16px' }}>
              We received your registration for <strong>{session.name}</strong>.
            </p>
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', textAlign: 'left' }}>
              <p style={{ fontSize: '14px', color: '#15803d', margin: '0 0 4px', fontWeight: '600' }}>
                Day 1: {session.day1Date}{session.day1StartTime ? ` · ${session.day1StartTime}${session.day1EndTime ? `–${session.day1EndTime}` : ''}` : ''}
              </p>
              <p style={{ fontSize: '14px', color: '#15803d', margin: 0, fontWeight: '600' }}>
                Day 2: {session.day2Date}{session.day2StartTime ? ` · ${session.day2StartTime}${session.day2EndTime ? `–${session.day2EndTime}` : ''}` : ''}
              </p>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>
              A confirmation email has been sent. An officer will reach out with payment details.
            </p>
            <button onClick={onClose} style={primaryBtn}>Close</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                backgroundColor: '#16a34a', color: '#fff',
                fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                borderRadius: '999px', display: 'inline-block', marginBottom: '10px',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {session.courseType || 'Community Program'}
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>{session.name}</h2>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                <p style={{ margin: '0 0 2px' }}>Day 1: {session.day1Date}{session.day1StartTime ? ` · ${session.day1StartTime}${session.day1EndTime ? `–${session.day1EndTime}` : ''}` : ''}</p>
                <p style={{ margin: 0 }}>Day 2: {session.day2Date}{session.day2StartTime ? ` · ${session.day2StartTime}${session.day2EndTime ? `–${session.day2EndTime}` : ''}` : ''}</p>
              </div>
            </div>

            {/* Payment notice */}
            <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px 16px', marginBottom: '24px' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 10px', lineHeight: '1.6' }}>
                Payment will be collected separately. An officer will contact you with payment instructions after you register.
              </p>
              <button
                disabled
                style={{ backgroundColor: '#e5e7eb', color: '#9ca3af', border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: '700', fontSize: '13px', cursor: 'not-allowed' }}
              >
                Payment Portal — Coming Soon
              </button>
            </div>

            {status === 'error' && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#dc2626' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={fieldWrap}>
                <label style={fieldLabel}>Full Name</label>
                <input type="text" required placeholder="Jane Smith"
                  value={form.name} onChange={set('name')} style={inputStyle} />
              </div>
              <div style={fieldWrap}>
                <label style={fieldLabel}>Email</label>
                <input type="email" required placeholder="jane@example.com"
                  value={form.email} onChange={set('email')} style={inputStyle} />
              </div>
              <div style={fieldWrap}>
                <label style={fieldLabel}>Phone Number</label>
                <input type="tel" required placeholder="(555) 555-5555"
                  value={form.phone} onChange={set('phone')} style={inputStyle} />
              </div>
              <div style={fieldWrap}>
                <label style={fieldLabel}>Registration Password</label>
                <input type="password" required placeholder="Enter the registration password"
                  value={form.password} onChange={set('password')} style={inputStyle} />
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0' }}>
                  Provided by your instructor or club officer.
                </p>
              </div>
              <button type="submit" disabled={status === 'submitting'} style={{ ...primaryBtn, width: '100%', marginTop: '8px' }}>
                {status === 'submitting' ? 'Submitting...' : 'Submit Registration'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

const fieldWrap = { display: 'flex', flexDirection: 'column', gap: '6px' }
const fieldLabel = { fontSize: '13px', fontWeight: '600', color: '#6b7280' }
const inputStyle = { padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px' }
const primaryBtn = { backgroundColor: '#16a34a', color: '#fff', padding: '12px 24px', borderRadius: '6px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }
