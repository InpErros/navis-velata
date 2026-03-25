'use client';

import { useState } from 'react';

// ─── Update board members here ───────────────────────────────────────────────
const boardMembers = [
  { role: 'President', name: 'Gabe Auge' },
  { role: 'Vice President',        name: 'James Flores' },
  { role: 'Secretary',             name: 'Rosalie Ahern' },
  { role: 'Treasurer',             name: 'Alison Curd' },
  { role: 'Event Chair',           name: 'Carter Jepsen' },
];

// ─── Update coaches here ──────────────────────────────────────────────────────
const coaches = [
  { role: 'Head Coach',                name: 'Kyle Henneberque' },
  { role: 'Small Boat Sailing Coach',  name: 'Mike Burke' },
  { role: 'Small Boat Sailing Coach',  name: 'Camille Hambly' },
  { role: 'Small Boat Sailing Coach',  name: 'Keith Cares' },
  { role: 'Small Boat Sailing Coach',  name: 'Lucas Demchik' },
  { role: 'Keelboat Coach',            name: 'Mossy Kennedy' },
  { role: 'Boatwright',                name: 'Dennis Trombley' },
];

// ─── Update boat fleet info here ──────────────────────────────────────────────
const boats = [
  {
    name: 'RS Quest',
    count: 5,
    description:
      'The RS Quest is a beginner-friendly dinghy used as the primary teaching boat for our beginner sailing courses. Fast, sleek, and fun to sail, these boats are an amazing sail.',
    photos: [null, null],
  },
  {
    name: 'Laser',
    count: 13,
    description:
      'The Laser is a single-handed, high-performance dinghy and one of the most popular racing classes in the world. We use Lasers for events and races where our sailors can sail solo.',
    photos: [null, null],
  },
  {
    name: 'Hobie Catamaran',
    count: 3,
    description:
      'Our Hobie Catamarans are twin-hulled boats known for their speed and stability. These boats come with us on our yearly trip to Mission Bay.',
    photos: [null, null],
  },
  {
    name: 'Shields',
    count: 4,
    description:
      'The Shields are a beautiful classic one-design keelboat raced competitively across the country. Our classic fleet gives members the opportunity to learn keelboat sailing and appreciate boating history.',
    photos: [null, null],
  },
];

const goals = [
  {
    title: 'Teaching Students to Sail',
    description: 'We offer structured sailing instruction at low cost to CSULB students through our various sailing courses.',
    icon: '🎓',
  },
  {
    title: 'Running Events',
    description: 'From casual sails to themed events, our board plans exciting events to ensure our members have a chance to sail outside of class.',
    icon: '📅',
  },
  {
    title: 'Maintaining the Fleet',
    description: 'Supported by our boatwright, the club maintains its own fleet over 30 boat to make sure sailing is accessible to every student.',
    icon: '⚓',
  },
  {
    title: 'Summer Shields Program',
    description: 'Each summer we sponsor a community sailing program open to the general public, offering beginner keelboat instruction aboard our classic Shields fleet.',
    icon: '☀️',
  },
];

// ─── Reusable components ──────────────────────────────────────────────────────

function PhotoPlaceholder({ label }) {
  return (
    <div style={{
      backgroundColor: '#e5e7eb',
      borderRadius: '8px',
      height: '180px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
      fontSize: '13px',
      fontStyle: 'italic',
    }}>
      {label}
    </div>
  );
}

function BoatButton({ boat }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ width: '100%' }}>
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          backgroundColor: open ? '#1e3a5f' : '#ffffff',
          border: `1px solid ${open ? '#1e3a5f' : '#e5e7eb'}`,
          borderRadius: open ? '8px 8px 0 0' : '8px',
          padding: '12px 20px',
          fontSize: '15px',
          fontWeight: '600',
          color: open ? '#ffffff' : '#374151',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          textAlign: 'left',
          transition: 'background-color 0.2s, color 0.2s',
        }}
      >
        <span>{boat.name}</span>
        <span style={{ fontSize: '18px', lineHeight: 1 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          border: '1px solid #1e3a5f',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          padding: '20px',
          backgroundColor: '#f9fafb',
        }}>
          <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.7', marginBottom: '8px' }}>
            {boat.description}
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
            <strong>Fleet size:</strong> {boat.count} boats
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {boat.photos.map((src, i) =>
              src ? (
                <img key={i} src={src} alt={`${boat.name} photo ${i + 1}`}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
              ) : (
                <PhotoPlaceholder key={i} label={`${boat.name} photo ${i + 1}`} />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ExpandableSection({ title, subtitle, accentColor = '#1e3a5f', children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: '16px' }}>
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          backgroundColor: open ? accentColor : '#ffffff',
          border: `2px solid ${open ? accentColor : '#e5e7eb'}`,
          borderRadius: open ? '12px 12px 0 0' : '12px',
          padding: '20px 28px',
          width: '100%',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background-color 0.2s, color 0.2s',
        }}
      >
        <div>
          <p style={{ fontWeight: '700', fontSize: '20px', margin: 0, color: open ? '#ffffff' : '#111827' }}>
            {title}
          </p>
          {subtitle && (
            <p style={{ fontSize: '13px', margin: '4px 0 0', color: open ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>
              {subtitle}
            </p>
          )}
        </div>
        <span style={{ fontSize: '20px', lineHeight: 1, color: open ? '#ffffff' : '#6b7280' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div style={{
          border: `2px solid ${accentColor}`,
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          padding: '28px',
          backgroundColor: '#f9fafb',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <div className="page-card" style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        color: '#111827',
      }}>

        {/* Hero banner */}
        <div style={{
          position: 'relative',
          height: '320px',
          backgroundColor: '#1e3a5f',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
        }}>
          {/* Replace src below with a real photo, e.g. '/about/fleet-on-water.jpg' */}
          {/* <img src="/about/fleet-on-water.jpg" alt="CSULB fleet on the water"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} /> */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.15)', fontSize: '14px', fontStyle: 'italic',
          }}>
            [ photo of fleet on the water goes here ]
          </div>
          <div style={{ position: 'relative', padding: '32px 40px' }}>
            <h1 style={{ fontSize: '40px', fontWeight: '700', color: '#ffffff', margin: '0 0 8px' }}>
              Meet the Club
            </h1>
          </div>
        </div>

        <div style={{ padding: '48px' }}>

          {/* Our Story */}
          <div style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>Our Story</h2>
            <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: '1.8', marginBottom: '16px' }}>
              The CSULB Sailing Association is one of the oldest recreational clubs on campus...
            </p>
            <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: '1.8' }}>
              The club has always been student-run and student-driven. Each semester a new board
              takes the helm, carrying on the tradition of making sailing accessible and affordable
              for the university community, and for the broader Long Beach area through our
              summer program.
            </p>
          </div>

          {/* What We Do */}
          <div style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '28px' }}>What We Do</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {goals.map((goal, i) => (
                <div key={i} style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: '28px', lineHeight: 1, flexShrink: 0 }}>{goal.icon}</span>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '16px', margin: '0 0 8px', color: '#111827' }}>
                      {goal.title}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.7', margin: 0 }}>
                      {goal.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fleet */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>Our Fleet</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {boats.map(boat => (
                <BoatButton key={boat.name} boat={boat} />
              ))}
            </div>
          </div>

          {/* Meet our Board */}
          <ExpandableSection
            title="Meet our Board"
            accentColor="#1e3a5f"
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {boardMembers.map((member, index) => (
                <div key={index} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    backgroundColor: '#e5e7eb', flexShrink: 0,
                  }} />
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '15px', margin: '0 0 3px', color: '#111827' }}>
                      {member.name}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </ExpandableSection>

          {/* Meet our Coaches */}
          <ExpandableSection
            title="Meet our Coaches"
            accentColor="#0c4a6e"
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {coaches.map((coach, index) => (
                <div key={index} style={{
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    backgroundColor: '#bae6fd', flexShrink: 0,
                  }} />
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '15px', margin: '0 0 3px', color: '#111827' }}>
                      {coach.name}
                    </p>
                    <p style={{ fontSize: '13px', color: '#0ea5e9', margin: 0 }}>{coach.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </ExpandableSection>

        </div>
      </div>
    </div>
  );
}
