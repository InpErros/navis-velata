import './globals.css'
import Image from 'next/image'
import NavBar from './components/NavBar'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import ExternalLinkModal from './components/ExternalLinkModal'
import SiteBanner from './components/SiteBanner'
import { cookies } from 'next/headers'

// ─── Site-wide banner message ─────────────────────────────────────────────────
// Set to a string to show a dismissible banner at the bottom of every page.
// Set to null to hide it.
const SITE_BANNER = null
// Example: const SITE_BANNER = '🌊 Spring sailing courses are now open — register today!'

export const metadata = {
  title: 'CSULB Sailing Association',
  description: 'The official website of the CSULB Sailing Association',
}

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const maintenanceAccess = cookieStore.get('maintenance_access')?.value === 'unlocked'

  return (
    <html lang="en">
      <body>

        {/* Navigation */}
        <NavBar />

        {/* Page content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="site-footer" style={{
          backgroundColor: '#ffffff',
          padding: '40px 32px',
          marginTop: '64px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src="/logo-borderless.svg" alt="CSULB Sailing Association" width={36} height={36} style={{ objectFit: 'contain' }} />
            <span style={{
              fontFamily: "'Farro', sans-serif",
              fontWeight: '700',
              fontSize: '16px',
              color: '#000000',
            }}>
              CSULB Sailing Association
            </span>
          </div>

          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
            <p style={{ color: '#003a45', fontSize: '13px', margin: '0 0 4px' }}>
              © {new Date().getFullYear()} CSULB Sailing Association. All rights reserved.
            </p>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>
              All water activities are conducted in accordance with{' '}
              <a href="https://dbw.parks.ca.gov" target="_blank" rel="noopener noreferrer" style={{ color: '#006E90', textDecoration: 'none', fontWeight: '600' }}>
                California Division of Boating and Waterways
              </a>{' '}
              safety guidelines.
            </p>
          </div>

          <a href="/admin" className="footer-admin-link" style={{ color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </a>
        </footer>
        {/* Maintenance access bar */}
        {maintenanceAccess && (
          <div style={{
            position: 'fixed', bottom: '16px', right: '16px', zIndex: 9999,
            backgroundColor: '#1e3a5f', color: '#fff',
            borderRadius: '8px', padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: '10px',
            fontSize: '13px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            <span style={{ opacity: 0.7 }}>Temp access</span>
            <a href="/api/maintenance-logout" style={{
              backgroundColor: '#dc2626', color: '#fff',
              padding: '4px 12px', borderRadius: '6px',
              textDecoration: 'none', fontSize: '12px', fontWeight: '700',
            }}>
              Lock Site
            </a>
          </div>
        )}

        <Analytics />
        <SpeedInsights />
        <ExternalLinkModal />
        <SiteBanner message={SITE_BANNER} />
      </body>
    </html>
  )
}

const navLink = {
  textDecoration: 'none',
  color: '#ffffff',
  fontSize: '15px',
}

const donateBtn = {
  backgroundColor: '#ecaa00',
  color: '#000000',
  padding: '8px 18px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: '700',
}

const socialLink = {
  textDecoration: 'none',
  color: '#66c8d8',
  fontSize: '14px',
}