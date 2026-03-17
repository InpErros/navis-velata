import './globals.css'
import Image from 'next/image'

export const metadata = {
  title: 'CSULB Sailing Association',
  description: 'The official website of the CSULB Sailing Association',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        {/* Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 32px',
          backgroundColor: '#000000',
        }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src="/logo-borderless.png" alt="CSULB Sailing Association" width={48} height={48} style={{ objectFit: 'contain' }} />
            <span style={{ fontWeight: '700', fontSize: '16px', color: '#ffffff', lineHeight: '1.2' }}>
              CSULB<br/>Sailing Association
            </span>
          </a>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="/" style={navLink}>Home</a>
            <a href="/about" style={navLink}>About</a>
            <a href="/events" style={navLink}>Events</a>
            <a href="/learn-to-sail" style={navLink}>Learn to Sail</a>
            <a href="/contact" style={navLink}>Contact</a>
            <a href="https://commerce.cashnet.com/csulbclubsports?itemcode=LBCS-SAILAS1" target="_blank" rel="noopener noreferrer" style={donateBtn}>Donate</a>
          </div>
        </nav>

        {/* Page content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          backgroundColor: '#000000',
          padding: '40px 32px',
          marginTop: '64px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src="/logo-borderless.png" alt="CSULB Sailing Association" width={36} height={36} style={{ objectFit: 'contain' }} />
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>CSULB Sailing Association</span>
          </div>

          <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>
            © {new Date().getFullYear()} CSULB Sailing Association. All rights reserved.
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="https://www.instagram.com/sailcsulb/" target="_blank" rel="noopener noreferrer" style={socialLink}>Instagram</a>
            <a href="https://discord.gg/DYuD3Zs4JE" target="_blank" rel="noopener noreferrer" style={socialLink}>Discord</a>
          </div>
        </footer>

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