'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import './NavBar.css'

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo" onClick={close}>
        <Image src="/logo-borderless.png" alt="CSULB Sailing Association" width={48} height={48} style={{ objectFit: 'contain' }} />
        <span style={{
          fontFamily: "'Farro', sans-serif",
          fontWeight: '700',
          fontSize: '16px',
          color: '#000000',
          lineHeight: '1.2',
          whiteSpace: 'nowrap',
        }}>
          CSULB Sailing Association
        </span>
      </Link>

      <button
        className="nav-hamburger"
        onClick={() => setOpen(prev => !prev)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>

      <div className={`nav-links${open ? ' nav-links-open' : ''}`}>
        <Link href="/learn-to-sail" onClick={close}>Learn to Sail</Link>
        <Link href="/events"        onClick={close}>Events</Link>
        <Link href="/about"         onClick={close}>About</Link>
        <Link href="/contact"       onClick={close}>Contact</Link>
        <a href="https://commerce.cashnet.com/csulbclubsports?itemcode=LBCS-SAILASN"
           data-external target="_blank" rel="noopener noreferrer"
           className="nav-donate" onClick={close}>
          Cashnet
        </a>
      </div>
    </nav>
  )
}
