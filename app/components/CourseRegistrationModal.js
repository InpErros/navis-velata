'use client'

import { useState } from 'react'

export default function CourseRegistrationModal({ course, onClose }) {
  const days = course.days || []

  // selectedDays: { [dayIndex]: optionIndex }
  const [selectedDays, setSelectedDays] = useState(() =>
    Object.fromEntries(days.map((_, i) => [i, 0]))
  )
  const [form, setForm] = useState({ name: '', email: '', discord: '' })
  const [receipt, setReceipt] = useState(null)
  const [receiptError, setReceiptError] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowed.includes(file.type)) {
      setReceiptError('File must be a JPG, PNG, or PDF.')
      setReceipt(null)
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setReceiptError('File must be under 10 MB.')
      setReceipt(null)
      return
    }
    setReceiptError('')
    setReceipt(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!receipt) {
      setReceiptError('Please attach your payment receipt.')
      return
    }

    // Build a human-readable summary of selected sessions
    const sessionSummary = days.map((day, di) => {
      const opt = day.options[selectedDays[di]]
      if (!opt) return null
      const time = opt.startTime ? ` (${opt.startTime}${opt.endTime ? `–${opt.endTime}` : ''})` : ''
      return `${day.label}: ${opt.date}${time}`
    }).filter(Boolean).join(', ')

    setStatus('submitting')
    const fd = new FormData()
    fd.append('courseId', course.id)
    fd.append('name', form.name)
    fd.append('email', form.email)
    fd.append('discord', form.discord)
    fd.append('sessionSummary', sessionSummary)
    fd.append('receipt', receipt)

    try {
      const res = await fetch('/api/register', { method: 'POST', body: fd })
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

  // Build success summary for display
  const successSummary = days.map((day, di) => {
    const opt = day.options[selectedDays[di]]
    if (!opt?.date) return null
    return `${day.label}: ${opt.date}${opt.startTime ? ` · ${opt.startTime}${opt.endTime ? `–${opt.endTime}` : ''}` : ''}`
  }).filter(Boolean)

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
        {/* Close button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '20px', lineHeight: 1 }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Success state */}
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#111827' }}>You&apos;re registered!</h2>
            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7', marginBottom: '16px' }}>
              We received your registration for <strong>{course.name}</strong>.
            </p>
            {successSummary.length > 0 && (
              <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', textAlign: 'left' }}>
                {successSummary.map((s, i) => (
                  <p key={i} style={{ fontSize: '14px', color: '#0369a1', margin: i === 0 ? 0 : '4px 0 0', fontWeight: '600' }}>{s}</p>
                ))}
              </div>
            )}
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>
              An officer will follow up with you on Discord to confirm your spot.
            </p>
            <button onClick={onClose} style={primaryBtn}>Close</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                backgroundColor: '#0ea5e9', color: '#fff',
                fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                borderRadius: '999px', display: 'inline-block', marginBottom: '10px',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {course.courseType}
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>{course.name}</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                {course.capacity - course.enrolled} spot{course.capacity - course.enrolled !== 1 ? 's' : ''} remaining
              </p>
            </div>

            {/* Payment note */}
            <div style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: '#92400e', lineHeight: '1.6' }}>
              <strong>Before registering:</strong> Complete your payment via CashNet, then upload your receipt below.
              <div style={{ marginTop: '10px' }}>
                <a
                  href="https://commerce.cashnet.com/csulbclubsports?itemcode=LBCS-SAILASN"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', backgroundColor: '#ecaa00', color: '#000', padding: '8px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}
                >
                  Pay on CashNet →
                </a>
              </div>
            </div>

            {/* Error banner */}
            {status === 'error' && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#dc2626' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Day selectors */}
              {days.map((day, di) => (
                <div key={di} style={fieldWrap}>
                  <label style={fieldLabel}>{day.label} — choose a date</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {day.options.map((opt, oi) => {
                      const selected = selectedDays[di] === oi
                      const label = [opt.date, opt.startTime && `${opt.startTime}${opt.endTime ? `–${opt.endTime}` : ''}`].filter(Boolean).join(' · ')
                      return (
                        <label key={oi} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
                          border: `2px solid ${selected ? '#ecaa00' : '#e5e7eb'}`,
                          backgroundColor: selected ? '#fffbeb' : '#fff',
                          fontSize: '14px', color: '#111827', fontWeight: selected ? '600' : '400',
                        }}>
                          <input
                            type="radio"
                            name={`day-${di}`}
                            checked={selected}
                            onChange={() => setSelectedDays(s => ({ ...s, [di]: oi }))}
                            style={{ accentColor: '#ecaa00' }}
                          />
                          {label || `Option ${oi + 1}`}
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}

              <div style={fieldWrap}>
                <label style={fieldLabel}>Full Name</label>
                <input type="text" required placeholder="Jane Smith"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle} />
              </div>

              <div style={fieldWrap}>
                <label style={fieldLabel}>Email</label>
                <input type="email" required placeholder="jane@csulb.edu"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle} />
              </div>

              <div style={fieldWrap}>
                <label style={fieldLabel}>Discord Username</label>
                <input type="text" required placeholder="e.g. sailorjane"
                  value={form.discord} onChange={e => setForm({ ...form, discord: e.target.value })}
                  style={inputStyle} />
              </div>

              <div style={fieldWrap}>
                <label style={fieldLabel}>Payment Receipt (JPG, PNG, or PDF)</label>
                <input type="file" accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  style={{ fontSize: '14px', color: '#374151' }} />
                {receiptError && <p style={{ color: '#dc2626', fontSize: '13px', margin: '4px 0 0' }}>{receiptError}</p>}
                {receipt && !receiptError && <p style={{ color: '#16a34a', fontSize: '13px', margin: '4px 0 0' }}>{receipt.name}</p>}
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
const primaryBtn = { backgroundColor: '#ecaa00', color: '#000', padding: '12px 24px', borderRadius: '6px', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }
