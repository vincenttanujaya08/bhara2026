import { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { navigateWithTransition } from '../hooks/usePageTransition'

const C = {
  gold: '#C8A84B', cream: '#E8D9A0', parchment: '#D4C48A',
  crimson: '#8B1A1A', dark: '#1A1410', charcoal: '#2A2420', black: '#0F0A05',
}

function TLink({ href, children, style: s, onMouseEnter, onMouseLeave, onClick }) {
  const handle = (e) => { e.preventDefault(); onClick?.(e); navigateWithTransition(href) }
  return <a href={href} onClick={handle} style={{ cursor: 'pointer', ...s }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>{children}</a>
}

function useFonts() {
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.overflowX = 'hidden'
    if (document.getElementById('cssalient-font')) return
    const style = document.createElement('style')
    style.id = 'cssalient-font'
    style.textContent = `
      @font-face {
        font-family: 'CSSalient';
        src: url('/fonts/CSSalient-Regular.ttf') format('truetype');
        font-weight: normal; font-style: normal;
      }
      @font-face {
        font-family: 'Nord';
        src: url('/fonts/NORD-Bold.ttf') format('truetype');
        font-weight: bold; font-style: normal;
      }
      @font-face {
        font-family: 'FamiljenGrotesk';
        src: url('/fonts/FamiljenGrotesk-Variable.ttf') format('truetype');
        font-weight: 100 900; font-style: normal;
      }
    `
    document.head.appendChild(style)
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
    document.head.appendChild(l)
  }, [])
}

function Navbar({ activeLink = '' }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const { auth } = usePage().props

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: 'Competitions', href: '/competitions' },
    { label: 'About', href: '/about' },
  ]

  const handleNav = (href) => {
    setMenuOpen(false)
    setTimeout(() => navigateWithTransition(href), 400)
  }

  return (
    <>
      <style>{`
        @keyframes overlayIn {
          from { clip-path: circle(0% at calc(100% - 2.5rem) 26px); }
          to   { clip-path: circle(170% at calc(100% - 2.5rem) 26px); }
        }
        @keyframes overlayOut {
          from { clip-path: circle(170% at calc(100% - 2.5rem) 26px); }
          to   { clip-path: circle(0% at calc(100% - 2.5rem) 26px); }
        }
        @keyframes navItemIn {
          from { opacity: 0; transform: translateX(-60px) skewX(-8deg); }
          to   { opacity: 1; transform: translateX(0) skewX(0deg); }
        }
        @keyframes nordOut {
          0%   { opacity: 1; transform: translateY(0) skewX(0deg) scaleX(1); filter: blur(0px); }
          100% { opacity: 0; transform: translateY(-20px) skewX(-6deg) scaleX(0.85); filter: blur(4px); }
        }
        @keyframes nordIn {
          0%   { opacity: 0; transform: translateY(20px) skewX(-6deg) scaleX(0.85); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) skewX(0deg) scaleX(1); filter: blur(0px); }
        }
        @keyframes cssalientIn {
          0%   { opacity: 0; transform: translateY(-50%) skewX(6deg) scaleX(1.08); filter: blur(6px); }
          60%  { filter: blur(0px); }
          100% { opacity: 1; transform: translateY(-50%) skewX(0deg) scaleX(1); filter: blur(0px); }
        }
        @keyframes cssalientOut {
          0%   { opacity: 1; transform: translateY(-50%) skewX(0deg) scaleX(1); filter: blur(0px); }
          100% { opacity: 0; transform: translateY(-40%) skewX(6deg) scaleX(1.08); filter: blur(6px); }
        }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: menuOpen ? 72 : 52,
        display: 'flex', alignItems: 'center', justifyContent: menuOpen ? 'flex-end' : 'space-between',
        padding: '0 1.75rem',
        background: menuOpen ? 'transparent' : (scrolled ? 'rgba(235,217,157,0.98)' : 'rgba(235,217,157,0.85)'),
        backdropFilter: menuOpen ? 'none' : 'blur(6px)',
        borderBottom: (!menuOpen && scrolled) ? '1px solid rgba(139,26,26,0.25)' : 'none',
        transition: 'background 0.35s, border 0.35s',
      }}>
        {/* Logo — hidden when menu open */}
        {!menuOpen && (
          <a href="/" onClick={e => { e.preventDefault(); handleNav('/') }}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img src="/images/BHRTK MERAH 1.png" alt="bharatika"
              style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
          </a>
        )}

        {/* Right: flat when closed, pill when open */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: menuOpen ? '1rem' : '0.75rem',
          background: menuOpen ? C.parchment : 'transparent',
          borderRadius: menuOpen ? 50 : 0,
          padding: menuOpen ? '10px 20px' : '0',
          transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}>
          {/* Burger / X */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.crimson} strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            ) : (
              <img src="/images/BURGER.png" alt="menu" style={{ height: 16, width: 'auto', objectFit: 'contain' }} />
            )}
          </button>



          {/* Profile */}
          <a href={auth?.user ? '/history' : '/login'}
            onClick={e => { e.preventDefault(); handleNav(auth?.user ? '/history' : '/login') }}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', opacity: menuOpen ? 1 : 0.75, transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = menuOpen ? '1' : '0.75'}
          >
            <img src="/images/Group 3.png" alt="profile"
              style={{ height: menuOpen ? 26 : 20, width: 'auto', objectFit: 'contain', transition: 'height 0.35s' }} />
          </a>
        </div>
      </nav>

      {/* Fullscreen overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 250,
        background: C.crimson,
        animation: menuOpen ? 'overlayIn 0.65s cubic-bezier(0.22,1,0.36,1) forwards' : 'overlayOut 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        pointerEvents: menuOpen ? 'all' : 'none',
        overflow: 'hidden',
      }}>
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '0 8vw' }}>
          {navLinks.map((link, i) => (
            <div key={link.label}
              onClick={e => { handleNav(link.href) }}
              onMouseEnter={() => setHoveredLink(i)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                position: 'relative',
                cursor: 'pointer',
                lineHeight: 1.1,
                animation: menuOpen ? 'navItemIn 0.6s cubic-bezier(0.22,1,0.36,1) ' + (0.1 + i * 0.08) + 's both' : 'none',
                transform: hoveredLink === i ? 'translateX(12px)' : 'translateX(0)',
                transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              {/* Nord layer — animates out on hover */}
              <span style={{
                fontFamily: "'Nord', sans-serif",
                fontSize: 'clamp(44px, 7vw, 90px)',
                fontWeight: 700,
                color: C.gold,
                textTransform: 'uppercase',
                letterSpacing: 2,
                display: 'block',
                lineHeight: 1.6,
                animation: hoveredLink === i ? 'nordOut 0.35s cubic-bezier(0.22,1,0.36,1) forwards' : 'nordIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
                transformOrigin: 'left center',
                userSelect: 'none',
                willChange: 'transform, opacity, filter',
              }}>{link.label}</span>
              {/* CSSalient layer — animates in on hover */}
              <span style={{
                fontFamily: "'CSSalient', sans-serif",
                fontSize: 'clamp(80px, 14vw, 180px)',
                fontWeight: 400,
                color: C.parchment,
                textTransform: 'uppercase',
                letterSpacing: 4,
                display: 'block',
                position: 'absolute',
                top: '50%',
                left: 0,
                animation: hoveredLink === i ? 'cssalientIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards' : 'cssalientOut 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
                transformOrigin: 'left center',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                willChange: 'transform, opacity, filter',
              }}>{link.label}</span>
            </div>
          ))}
          <div style={{
            position: 'absolute', bottom: '2.5rem', left: '8vw', right: '8vw',
            borderTop: '1px solid rgba(232,217,160,0.2)', paddingTop: '1.25rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            animation: menuOpen ? 'navItemIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.5s both' : 'none',
          }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: C.cream, opacity: 0.45, margin: 0, letterSpacing: 3, textTransform: 'uppercase' }}>Bharatika 2026</p>
            <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 12, color: C.cream, opacity: 0.45, margin: 0 }}>Petra Christian University, Surabaya</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Events() {
  useFonts()
  return (
    <div style={{ minHeight: '100vh', background: C.crimson, display: 'flex', flexDirection: 'column' }}>
      <Navbar activeLink="events" />

      {/* Hero — full screen BG MERAH + Coming Soon */}
      <section style={{
        flex: 1,
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* BG MERAH texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/images/BG MERAH.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} />

        {/* Subtle gradient overlay at bottom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(139,26,26,0.3) 0%, rgba(80,10,10,0.5) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Coming Soon text */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p style={{
            fontFamily: "'CSSalient', sans-serif",
            fontSize: 'clamp(48px, 10vw, 120px)',
            color: C.cream,
            margin: 0,
            lineHeight: 1,
            letterSpacing: 4,
            textTransform: 'uppercase',
            opacity: 0.92,
          }}>coming soon</p>
        </div>
      </section>
    </div>
  )
}