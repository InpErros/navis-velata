'use client';

import { useState } from 'react';

export default function SiteBanner({ message }) {
  const [dismissed, setDismissed] = useState(false);

  if (!message || dismissed) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#1e3a5f',
      color: '#ffffff',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      zIndex: 999,
      boxShadow: '0 -2px 12px rgba(0,0,0,0.2)',
    }}>
      <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5', flex: 1, textAlign: 'center' }}>
        {message}
      </p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss banner"
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '20px',
          cursor: 'pointer',
          lineHeight: 1,
          flexShrink: 0,
          padding: '0 4px',
        }}
      >
        ×
      </button>
    </div>
  );
}
