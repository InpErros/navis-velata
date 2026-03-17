import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

async function getEvents() {
  const redis = Redis.fromEnv()
  const events = await redis.get('events')
  return events || []
}

export default async function Events() {
  const events = await getEvents()

  
    const typeColors = {
      'Learn to Sail': { bg: '#f0f9ff', border: '#bae6fd', tag: '#0ea5e9' },
      'Casual Sail':   { bg: '#f0fdf4', border: '#bbf7d0', tag: '#16a34a' },
      'BBQ':           { bg: '#fff7ed', border: '#fed7aa', tag: '#ea580c' },
      'Maintenance':   { bg: '#fafafa', border: '#e5e7eb', tag: '#6b7280' },
      'Themed Event':  { bg: '#fdf4ff', border: '#e9d5ff', tag: '#9333ea' },
      'Social':        { bg: '#fff1f2', border: '#fecdd3', tag: '#e11d48' },
    }
  
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
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>Events</h1>
          <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto' }}>
            From casual sails to themed events and BBQs, there's always something happening
            at the CSULB Sailing Association.
          </p>
        </div>
  
        {/* Events list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {events.map((event, index) => {
            const colors = typeColors[event.type] || typeColors['Social']
            return (
              <div key={index} style={{
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                padding: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '24px',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{
                      backgroundColor: colors.tag,
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '4px 10px',
                      borderRadius: '999px',
                    }}>
                      {event.type}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 8px', color: '#111827' }}>
                    {event.title}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px' }}>
                    {event.date} · {event.time}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px' }}>
                    {event.location}
                  </p>
                  <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.7', margin: 0 }}>
                    {event.description}
                  </p>
                </div>
                <a href={event.registrationLink || '#'}
                data-external
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: event.registrationLink ? '#ecaa00' : '#d1d5db',
                  color: event.registrationLink ? '#000000' : '#9ca3af',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  pointerEvents: event.registrationLink ? 'auto' : 'none',
                }}
              >
                {event.registrationLink ? 'Register' : 'Coming Soon'}
              </a>
              </div>
              
            )
          })}
        
        </div>

        {/* Google Calendar */}
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Club Calendar</h2>
        <div style={{
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '64px',
          border: '1px solid #e5e7eb',
        }}>
          <iframe
            src="https://calendar.google.com/calendar/u/0/embed?src=48211216a0cec9408e4a852f7815a9b5236fce6350675de9212f4c42d817212c@group.calendar.google.com&ctz=America/Los_Angeles"
            style={{ border: 'none', width: '100%', height: '600px', display: 'block' }}
          />
        </div>
        </div>
      </div>
    )
  }