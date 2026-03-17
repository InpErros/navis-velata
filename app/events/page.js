export default function Events() {
    const events = [
      {
        title: 'Learn to Sail Session',
        date: 'April 5, 2026',
        time: '10:00 AM – 1:00 PM',
        location: 'CSULB Sailing Base',
        description: 'A beginner-friendly session teaching the fundamentals of sailing using US Sailing standards. Open to all CSULB students.',
        type: 'Learn to Sail',
        registrationLink: 'https://your-registration-link.com',
      },
      {
        title: 'Casual Sail Day',
        date: 'April 12, 2026',
        time: '11:00 AM – 3:00 PM',
        location: 'CSULB Sailing Base',
        description: 'A relaxed afternoon on the water for members of all skill levels. Come enjoy the breeze and good company.',
        type: 'Casual Sail',
        registrationLink: 'https://your-registration-link.com',
      },
      {
        title: 'Spring BBQ',
        date: 'April 19, 2026',
        time: '12:00 PM – 4:00 PM',
        location: 'CSULB Sailing Base',
        description: 'Join us for our annual spring BBQ! Food, fun, and friends. A great chance to meet other club members.',
        type: 'BBQ',
        registrationLink: 'https://your-registration-link.com',
      },
      {
        title: 'Boat Maintenance Day',
        date: 'April 26, 2026',
        time: '9:00 AM – 12:00 PM',
        location: 'CSULB Sailing Base',
        description: 'Help us keep our fleet in top shape! All skill levels welcome — a great way to learn more about our boats.',
        type: 'Maintenance',
        registrationLink: 'https://your-registration-link.com',
      },
      {
        title: 'Pirate Themed Sail',
        date: 'May 3, 2026',
        time: '11:00 AM – 3:00 PM',
        location: 'CSULB Sailing Base',
        description: 'Dress up and sail the high seas! Our famous themed sail event — costumes encouraged.',
        type: 'Themed Event',
        registrationLink: 'https://your-registration-link.com',
      },
      {
        title: 'End of Semester Social',
        date: 'May 17, 2026',
        time: '5:00 PM – 8:00 PM',
        location: 'TBD',
        description: 'Celebrate the end of the semester with your fellow sailors. Details to be announced.',
        type: 'Social',
        registrationLink: 'https://your-registration-link.com',
      },
    ]
  
    const typeColors = {
      'Learn to Sail': { bg: '#f0f9ff', border: '#bae6fd', tag: '#0ea5e9' },
      'Casual Sail':   { bg: '#f0fdf4', border: '#bbf7d0', tag: '#16a34a' },
      'BBQ':           { bg: '#fff7ed', border: '#fed7aa', tag: '#ea580c' },
      'Maintenance':   { bg: '#fafafa', border: '#e5e7eb', tag: '#6b7280' },
      'Themed Event':  { bg: '#fdf4ff', border: '#e9d5ff', tag: '#9333ea' },
      'Social':        { bg: '#fff1f2', border: '#fecdd3', tag: '#e11d48' },
    }
  
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px' }}>
  
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
                <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" style={{
                  backgroundColor: '#0ea5e9',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  Register
                </a>
              </div>
            )
          })}
        </div>
  
      </div>
    )
  }