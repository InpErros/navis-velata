import Link from 'next/link';

export default function LearnToSail() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <div className="page-card" style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '48px',
        color: '#111827',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>Learn to Sail</h1>
          <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.8', maxWidth: '650px', margin: '0 auto' }}>
            We run two sailing programs — one for CSULB students and one open to the general public.
            Select the program that applies to you.
          </p>
        </div>

        {/* Program cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>

          {/* Student Program */}
          <Link href="/learn-to-sail/student" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '2px solid #bae6fd',
              borderRadius: '16px',
              padding: '40px 32px',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,165,233,0.2)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                backgroundColor: '#0ea5e9', marginBottom: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px',
              }}>
                🎓
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                Student Program
              </h2>
              <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7', marginBottom: '24px', flex: 1 }}>
                For current CSULB students. Progress through Sailing A, B, and C certifications
                using our dinghy fleet, and gain independent access to the boatyard.
              </p>
              <span style={{
                color: '#0ea5e9', fontWeight: '600', fontSize: '15px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                View student courses →
              </span>
            </div>
          </Link>

          {/* Public Program */}
          <Link href="/learn-to-sail/public" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '2px solid #bbf7d0',
              borderRadius: '16px',
              padding: '40px 32px',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(22,163,74,0.2)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                backgroundColor: '#16a34a', marginBottom: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px',
              }}>
                ⛵
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                Community Program
              </h2>
              <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7', marginBottom: '24px', flex: 1 }}>
                Open to adults in the general public. Learn the fundamentals of keelboat sailing
                aboard our Shields fleet in a welcoming, beginner-friendly environment.
              </p>
              <span style={{
                color: '#16a34a', fontWeight: '600', fontSize: '15px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                View community courses →
              </span>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
