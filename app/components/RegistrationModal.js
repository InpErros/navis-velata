'use client';

import { useState } from 'react';

// ─── Update registration links here ──────────────────────────────────────────
const GOOGLE_FORM_URL   = 'https://docs.google.com/forms/d/e/1FAIpQLSd8Q-eq43asuP8dyQhquOTLeZ6-beN5OgTNveyFOTD7eaBvPA/viewform?usp=sharing&ouid=114493447945086633847';   // course schedule / signup form
const CASHNET_URL       = 'https://commerce.cashnet.com/csulbclubsports?itemcode=LBCS-SAILASN';
const DO_SPORTS_EASY_URL = 'https://csulb.dserec.com/online/clubsports';         // Do Sports Easy registration

const steps = [
  {
    number: 1,
    title: 'Find an available course',
    description:
      'Open the course schedule form and identify an available session that works for you. Note the date, time, and course level before continuing.',
    action: { label: 'Open Course Schedule', href: GOOGLE_FORM_URL },
  },
  {
    number: 2,
    title: 'Pay via Cashnet',
    description:
      'Navigate to Cashnet and complete payment for your selected course. Save or screenshot your payment receipt — you\'ll need to attach it in the next step.',
    action: { label: 'Go to Cashnet', href: CASHNET_URL },
  },
  {
    number: 3,
    title: 'Submit the registration form',
    description:
      'Return to the Google Form, attach your Cashnet payment receipt, and submit the form to secure your spot in the course.',
    action: { label: 'Open Registration Form', href: GOOGLE_FORM_URL },
  },
  {
    number: 4,
    title: 'Register on Do Sports Easy',
    description:
      'Complete your registration on Do Sports Easy. This step is required to participate in any club activities on the water.',
    action: { label: 'Go to Do Sports Easy', href: DO_SPORTS_EASY_URL },
  },
];

export default function RegistrationModal() {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState({});

  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  const completedCount = Object.values(checked).filter(Boolean).length;
  const allDone = completedCount === steps.length;

  const handleOpen = () => {
    setChecked({});
    setOpen(true);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        style={{
          backgroundColor: '#0ea5e9',
          color: '#ffffff',
          padding: '14px 32px',
          borderRadius: '6px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'inline-block',
        }}
      >
        How to Register
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
          }}
        >
          {/* Modal panel */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '560px',
              width: '100%',
              color: '#111827',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Registration Guide</h2>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#6b7280', lineHeight: 1, padding: '0 0 0 16px' }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>
              Follow all four steps to complete your course registration. Check each step off as you go.
            </p>

            {/* Progress bar */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                <span>Progress</span>
                <span>{completedCount} / {steps.length} completed</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(completedCount / steps.length) * 100}%`,
                  backgroundColor: allDone ? '#16a34a' : '#0ea5e9',
                  borderRadius: '999px',
                  transition: 'width 0.3s ease, background-color 0.3s ease',
                }} />
              </div>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    border: `1px solid ${checked[i] ? '#bbf7d0' : '#e5e7eb'}`,
                    borderRadius: '10px',
                    padding: '20px',
                    backgroundColor: checked[i] ? '#f0fdf4' : '#f9fafb',
                    transition: 'background-color 0.2s, border-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    {/* Checkbox */}
                    <button
                      onClick={() => toggle(i)}
                      aria-label={checked[i] ? `Unmark step ${step.number}` : `Mark step ${step.number} complete`}
                      style={{
                        flexShrink: 0,
                        width: '24px', height: '24px',
                        borderRadius: '6px',
                        border: `2px solid ${checked[i] ? '#16a34a' : '#d1d5db'}`,
                        backgroundColor: checked[i] ? '#16a34a' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginTop: '2px',
                        transition: 'background-color 0.2s, border-color 0.2s',
                      }}
                    >
                      {checked[i] && (
                        <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                          <path d="M1 5l3.5 3.5L12 1" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>

                    <div style={{ flex: 1 }}>
                      {/* Step label + title */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{
                          backgroundColor: '#1e3a5f', color: '#ffffff',
                          fontSize: '11px', fontWeight: '700',
                          padding: '2px 8px', borderRadius: '999px',
                        }}>
                          Step {step.number}
                        </span>
                        <p style={{
                          fontWeight: '700', fontSize: '15px', margin: 0,
                          color: checked[i] ? '#16a34a' : '#111827',
                          textDecoration: checked[i] ? 'line-through' : 'none',
                          transition: 'color 0.2s',
                        }}>
                          {step.title}
                        </p>
                      </div>

                      <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 12px' }}>
                        {step.description}
                      </p>

                      <a
                        href={step.action.href}
                        data-external
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          fontSize: '13px', fontWeight: '600',
                          color: '#0ea5e9', textDecoration: 'none',
                        }}
                      >
                        {step.action.label} →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {allDone ? (
              <div style={{
                backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: '10px', padding: '16px 20px',
                textAlign: 'center', fontSize: '15px', fontWeight: '600', color: '#16a34a',
              }}>
                All steps complete — you're registered!
              </div>
            ) : (
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: '100%', padding: '12px',
                  backgroundColor: '#f3f4f6', color: '#374151',
                  border: 'none', borderRadius: '8px',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
