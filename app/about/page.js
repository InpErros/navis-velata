'use client';

import { useState } from 'react';
import PageHero from '../components/PageHero';

// ─── Update board members here ───────────────────────────────────────────────
// photo: path relative to /public, e.g. '/profiles/gabe-auge.jpg'
// focalPoint: CSS object-position to control crop, e.g. 'center 30%'
const boardMembers = [
  { role: 'President',      name: 'Gabe Auge',     photo: '/gabe-auge.jpg', focalPoint: 'center 30%' },
  { role: 'Vice President', name: 'James Flores',  photo: null },
  { role: 'Secretary',      name: 'Rosalie Ahern', photo: null },
  { role: 'Treasurer',      name: 'Alison Curd',   photo: null },
  { role: 'Event Chair',    name: 'Carter Jepsen', photo: null },
];

// ─── Update coaches here ──────────────────────────────────────────────────────
// photo: path relative to /public, e.g. '/profiles/kyle-henneberque.jpg'
// focalPoint: CSS object-position to control crop, e.g. 'center 30%'
const coaches = [
  { role: '', name: 'Kyle Henneberque', photo: '/kyle-h.jpg', focalPoint: 'center' },
  { role: '', name: 'Mike Burke',       photo: null, focalPoint: 'center' },
  { role: '', name: 'Camille Hambly',   photo: '/camille-h.jpg', focalPoint: 'center' },
  { role: '', name: 'Keith Cares',      photo: null, focalPoint: 'center' },
  { role: '', name: 'Lucas Demchik',    photo: null, focalPoint: 'center' },
  { role: '', name: 'Mossy Kennedy',    photo: null, focalPoint: 'center' },
  { role: '', name: 'Dennis Trombley',  photo: 'dennis.jpg', focalPoint: 'center' },
];

// ─── Update boat fleet info here ──────────────────────────────────────────────
const boats = [
  {
    name: 'RS Quest',
    count: 5,
    description:
      'The RS Quest is a beginner-friendly dinghy used as the primary teaching boat for our beginner sailing courses. Fast, sleek, and fun to sail, these boats are an amazing sail.',
    photos: ['quest1.avif', 'quest2.avif'],
  },
  {
    name: 'Laser',
    count: 13,
    description:
      'The Laser is a single-handed, high-performance dinghy and one of the most popular racing classes in the world. We use Lasers for events and races where our sailors can sail solo.',
    photos: ['laser1.avif', 'laser2.avif'],
  },
  {
    name: 'Hobie Catamaran',
    count: 3,
    description:
      'Our Hobie Catamarans are twin-hulled boats known for their speed and stability. These boats come with us on our yearly trip to Mission Bay.',
    photos: ['hobie1.jpg', 'hobie2.jpg'],
  },
  {
    name: 'Shields',
    count: 4,
    description:
      'The Shields are a beautiful classic one-design keelboat raced competitively across the country. Our classic fleet gives members the opportunity to learn keelboat sailing and appreciate boating history.',
    photos: ['shields1.avif', 'shields2.avif'],
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

function Silhouette({ bg = '#e5e7eb', fg = '#9ca3af' }) {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" fill={bg} />
      {/* head */}
      <circle cx="24" cy="18" r="9" fill={fg} />
      {/* shoulders */}
      <path d="M4 46 Q4 32 24 32 Q44 32 44 46Z" fill={fg} />
    </svg>
  );
}

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
        className="dropdown-btn"
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
        <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginLeft: '8px' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="expandable-body" style={{
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
        className="dropdown-btn"
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
        <span style={{ fontSize: '20px', lineHeight: 1, color: open ? '#ffffff' : '#6b7280', flexShrink: 0, marginLeft: '8px' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div className="expandable-body" style={{
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

        <PageHero title="Meet the Club" imageSrc='hero-about.avif'/>

        <div className="page-content">

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
            <div className="grid-2col" style={{ gap: '16px' }}>
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
                  padding: '24px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    flexShrink: 0, overflow: 'hidden',
                  }}>
                    {member.photo
                      ? <img src={member.photo} alt={member.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover',
                            objectPosition: member.focalPoint || 'center' }} />
                      : <Silhouette bg="#e5e7eb" fg="#9ca3af" />
                    }
                  </div>
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
                  padding: '24px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    flexShrink: 0, overflow: 'hidden',
                  }}>
                    {coach.photo
                      ? <img src={coach.photo} alt={coach.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover',
                            objectPosition: coach.focalPoint || 'center' }} />
                      : <Silhouette bg="#bae6fd" fg="#7dd3fc" />
                    }
                  </div>
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
