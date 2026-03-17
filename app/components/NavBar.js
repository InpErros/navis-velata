import Image from 'next/image'
import Link from 'next/link'
import './NavBar.css'

export default function NavBar() {
  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo">
        <Image src="/logo-borderless.png" alt="CSULB Sailing Association" width={48} height={48} style={{ objectFit: 'contain' }} />
        <span style={{
          fontFamily: "'Farro', sans-serif",
          fontWeight: '700',
          fontSize: '16px',
          color: '#ecaa00',
          lineHeight: '1.2',
          whiteSpace: 'nowrap',
        }}>
          CSULB Sailing Association
        </span>
      </Link>

      {/* CSS-only hamburger toggle */}
      <input type="checkbox" id="nav-toggle" className="nav-toggle" />
      <label htmlFor="nav-toggle" className="nav-hamburger">
        <span /><span /><span />
      </label>

      <div className="nav-links">
        <Link href="/learn-to-sail">Learn to Sail</Link>
        <Link href="/events">Events</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <a href="https://commerce.cashnet.com/csulbclubsports?itemcode=LBCS-SAILASN" data-external target="_blank" rel="noopener noreferrer" className="nav-donate">Cashnet</a>
      </div>
    </nav>
  )
}