'use client'

import { useEffect, useState } from 'react'

export default function ExternalLinkModal() {
  const [href, setHref] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      const link = e.target.closest('a[data-external]')
      if (!link) return
      e.preventDefault()
      setHref(link.getAttribute('href'))
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  if (!href) return null

  return (
    <div
      onClick={() => setHref(null)}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          color: '#111827',
        }}
      >
        <p style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Leaving the site</p>
        <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '32px', lineHeight: '1.7' }}>
          You're being redirected to an external site. Do you want to continue?
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => setHref(null)}
            style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '10px 24px', borderRadius: '6px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setHref(null)}
            style={{ backgroundColor: '#ecaa00', color: '#000000', padding: '10px 24px', borderRadius: '6px', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}
          >
            Continue
          </a>
        </div>
      </div>
    </div>
  )
}