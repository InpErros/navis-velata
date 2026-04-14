'use client';

import Link from 'next/link';
import PageHero from '../components/PageHero';

export default function LearnToSail() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <div className="page-card" style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        color: '#111827',
      }}>

        <PageHero title="Learn to Sail" imageSrc='/hero-learntosail.avif' objectPosition='center bottom'/>

        <div className="page-content">

        {/* Program cards */}
        <div className="grid-2col">

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
                For current CSULB students. Progress through Sailing A, B, and C trainings
                using our dinghy fleet, and learn the basics of sailing!
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
                aboard our beautiful Shields.
              </p>
              <span style={{
                color: '#16a34a', fontWeight: '600', fontSize: '15px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                View Shields courses →
              </span>
            </div>
          </Link>

        </div>
        </div>{/* end padding */}
      </div>{/* end page-card */}
    </div>
  );
}
