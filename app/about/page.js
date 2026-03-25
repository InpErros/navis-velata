'use client';

import { useState } from 'react';

// ─── Update board members here ───────────────────────────────────────────────
const boardMembers = [
  { role: 'Commodore / President', name: 'Gabe Auge' },
  { role: 'Vice President',        name: 'James Flores' },
  { role: 'Secretary',             name: 'Rosalie Ahern' },
  { role: 'Treasurer',             name: 'Alison Curd' },
  { role: 'Event Chair',           name: 'Carter Jepsen' },
];

// ─── Update coaches here ──────────────────────────────────────────────────────
const coaches = [
  { role: 'Head Coach',                name: 'Kyle Henneberque' },
  { role: 'Small Boat Sailing Coach',  name: 'Mike Burke' },
  { role: 'Small Boat Sailing Coach',  name: 'Camille Hambly ' },
  { role: 'Small Boat Sailing Coach',  name: 'Keith Cares' },
  { role: 'Small Boat Sailing Coach',  name: 'Lucas Demchik' },
  { role: 'Shields / Keelboat Coach',  name: 'Mossy Kennedy' },
  { role: 'Boatwright',                name: 'Dennis Trombley' },
];

// ─── Update boat fleet info here ──────────────────────────────────────────────
const boats = [
  {
    name: 'RS Quest',
    count: 12,
    description:
      'The RS Quest is a stable, beginner-friendly dinghy used as the primary teaching boat for our Learn to Sail program. Its forgiving design lets new sailors focus on fundamentals without worrying about capsizing.',
    photos: [
      // Replace with real paths, e.g. '/boats/rs-quest-1.jpg'
      null,
      null,
    ],
  },
  {
    name: 'Laser',
    count: 10,
    description:
      'The Laser is a single-handed, high-performance dinghy and one of the most popular racing classes in the world. We use Lasers to develop intermediate and advanced sailors who want a more athletic, responsive sailing experience.',
    photos: [null, null],
  },
  {
    name: 'Hobie Catamaran',
    count: 4,
    description:
      'Our Hobie Catamarans are twin-hulled boats known for their speed and stability. They are a great way to experience multi-hull sailing and are especially fun in stronger winds.',
    photos: [null, null],
  },
  {
    name: 'Shields',
    count: 6,
    description:
      'The Shields is a classic one-design keelboat raced competitively across the country. Our fleet gives members the opportunity to learn keelboat racing tactics and experience crewed team sailing.',
    photos: [null, null],
  },
];

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
                <img
                  key={i}
                  src={src}
                  alt={`${boat.name} photo ${i + 1}`}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
                />
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

export default function About() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <div className="page-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '48px',
          color: '#111827',
        }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>About Us</h1>
          <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
            The CSULB Sailing Association is one of the oldest recreational clubs on campus.
            The club maintains its own fleet of boats in order to make sailing accessible and
            affordable for the university community.
          </p>
        </div>

        {/* Mission */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>Our Mission</h2>
          <p style={{ fontSize: '17px', color: '#6b7280', lineHeight: '1.8', marginBottom: '16px' }}>
            We offer sailing instruction to CSULB students and sponsor many types of sailing-related
            events through the club. Our efforts focus on improving the overall skills of our students
            and promoting sailing as a life-long sport.
          </p>
          <p style={{ fontSize: '17px', color: '#6b7280', lineHeight: '1.8' }}>
            We welcome members with all levels of sailing experience, including those who have never
            sailed before.
          </p>
        </div>

        {/* Fleet */}
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '40px', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>Our Fleet</h2>
          <p style={{ fontSize: '17px', color: '#6b7280', lineHeight: '1.8', marginBottom: '24px' }}>
            We teach complete beginners the basics of sailing using US Sailing standards, making use
            of our fleet of over 30 boats across a variety of classes.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {boats.map(boat => (
              <BoatButton key={boat.name} boat={boat} />
            ))}
          </div>
        </div>

        {/* Student Board */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Student Board</h2>
          <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '32px' }}>
            The student board rotates yearly and is elected by club members.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {boardMembers.map((member, index) => (
              <div key={index} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#e5e7eb',
                  flexShrink: 0,
                }}/>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '16px', margin: '0 0 4px', color: '#111827' }}>
                    {member.name}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coaches */}
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Coaches</h2>
          <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '32px' }}>
            Our volunteer coaches bring years of sailing experience to help every member improve on the water.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {coaches.map((coach, index) => (
              <div key={index} style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '10px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#bae6fd',
                  flexShrink: 0,
                }}/>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '16px', margin: '0 0 4px', color: '#111827' }}>
                    {coach.name}
                  </p>
                  <p style={{ fontSize: '14px', color: '#0ea5e9', margin: 0 }}>{coach.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
