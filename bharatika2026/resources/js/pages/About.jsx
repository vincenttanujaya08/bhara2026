import { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { navigateWithTransition } from '../hooks/usePageTransition'

const C = {
  gold: '#C8A84B',
  cream: '#E8D9A0',
  parchment: '#D4C48A',
  crimson: '#8B1A1A',
  dark: '#0F0A05',
  darkCard: '#1A1410',
  charcoal: '#2A2420',
}

function useFonts() {
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.overflowX = 'hidden'
    document.body.style.background = C.dark
    if (document.getElementById('cssalient-font')) return
    const style = document.createElement('style')
    style.id = 'cssalient-font'
    style.textContent = `
      @font-face {
        font-family: 'CSSalient';
        src: url('/fonts/CSSalient-Regular.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'Nord';
        src: url('/fonts/NORD-Bold.ttf') format('truetype');
        font-weight: bold;
        font-style: normal;
      }
      @font-face {
        font-family: 'FamiljenGrotesk';
        src: url('/fonts/FamiljenGrotesk-Variable.ttf') format('truetype');
        font-weight: 100 900;
        font-style: normal;
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

function XBox({ style = {} }) {
  return (
    <div style={{ background: '#C8C0B0', position: 'relative', overflow: 'hidden', ...style }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#A09080" strokeWidth="1.5" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#A09080" strokeWidth="1.5" />
        <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" stroke="#A09080" strokeWidth="1" fill="none" />
      </svg>
    </div>
  )
}

function TLink({ href, children, style: s, onMouseEnter, onMouseLeave, onClick }) {
  const handle = (e) => { e.preventDefault(); onClick?.(e); navigateWithTransition(href) }
  return <a href={href} onClick={handle} style={{ cursor: 'pointer', ...s }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>{children}</a>
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

function HeroAbout() {
  return (
    <section style={{ paddingTop: 52, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 420 }}>
      <div style={{
        background: C.crimson, padding: '3rem 2.5rem',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 9px)',
      }}>
        <h1 style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 'clamp(36px, 6vw, 64px)',
          color: C.gold, margin: '0 0 0.25rem', lineHeight: 1, fontWeight: 400,
        }}>bharatika</h1>
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 3,
          color: C.cream, opacity: 0.6, textTransform: 'uppercase', margin: '0 0 1.75rem',
        }}>Creative Design Festival</p>
        <p style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: 15, lineHeight: 1.85, color: C.cream, opacity: 0.85, margin: 0,
        }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eros, facilisis quis
          vulputate ut, suscipit nec tellus. Phasellus pretium urna vel dignissim facilisis nunc,
          vulputate nec lectus quis, posuere condimentum diam. Suspendisse diam sed aliquam.
          Nullam hendrerit nisl sed mi consequat congue.
        </p>
      </div>
      <XBox style={{ minHeight: 420 }} />
    </section>
  )
}

function FakultasPartner() {
  const partnerLogos = Array(6).fill(null)
  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div style={{
        background: C.darkCard, padding: '2.5rem',
        borderTop: '1px solid rgba(200,168,75,0.1)',
        borderBottom: '1px solid rgba(200,168,75,0.1)',
      }}>
        <p style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: 14, lineHeight: 1.85, color: C.cream, opacity: 0.8, margin: 0,
        }}>
          Bharatika Creative Design Festival diselenggarakan oleh{' '}
          <strong style={{ color: C.cream, opacity: 1 }}>Fakultas Humaniora dan Industri Kreatif (FHIK)</strong>,{' '}
          Petra Christian University, Surabaya.
        </p>
      </div>
      <div style={{
        background: C.cream, padding: '2rem',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', alignItems: 'center' }}>
          {partnerLogos.map((_, i) => (
            <div key={i} style={{
              background: '#D4C48A', aspectRatio: '1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(139,26,26,0.1)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ opacity: 0.2 }}>
                <line x1="0" y1="0" x2="24" y2="24" stroke="#8B1A1A" strokeWidth="1" />
                <line x1="24" y1="0" x2="0" y2="24" stroke="#8B1A1A" strokeWidth="1" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section style={{
      background: C.crimson, padding: '4rem 2.5rem',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center',
      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 9px)',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', alignItems: 'end' }}>
        <XBox style={{ aspectRatio: '2/3', borderRadius: 2 }} />
        <XBox style={{ aspectRatio: '2/3.5', borderRadius: 2 }} />
        <XBox style={{ aspectRatio: '2/3', borderRadius: 2 }} />
      </div>
      <div>
        <p style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: 15, lineHeight: 1.9, color: C.cream, opacity: 0.88, margin: 0,
        }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor eros, facilisis
          quis vulputate ut, suscipit nec tellus. Phasellus pretium urna vel dignissim facilisis.
          Cras risus nunc, vulputate nec lectus quis, posuere condimentum diam.
        </p>
      </div>
    </section>
  )
}

function ConnectWithUs() {
  const contacts = [
    {
      label: 'Partnership',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={C.gold}>
          <path d="M20 2H4C2.9 2 2 2.9 2 4v16l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      ),
      href: '#',
    },
    {
      label: 'Social Media',
      icon: (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1" fill={C.gold} stroke="none" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={C.gold}>
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 12.67 0V8.69a8.18 8.18 0 0 0 4.78 1.54V6.79a4.85 4.85 0 0 1-1.01-.1z" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={C.gold}>
            <path d="M23 7s-.3-2-1.2-2.7C20.7 3.1 19.4 3 19.4 3S15.7 2.7 12 2.7s-7.4.3-7.4.3-1.3.1-2.4 1.3C1.3 5 1 7 1 7S.7 9.2.7 11.3v2c0 2.2.3 4.3.3 4.3s.3 2 1.2 2.7c1.1 1.1 2.6 1.1 3.3 1.2C7.3 21.7 12 21.7 12 21.7s3.7 0 6.2-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.7 1.2-2.7s.3-2.1.3-4.3v-2C23.3 9.2 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" />
          </svg>
        </div>
      ),
      href: '#',
    },
  ]
  return (
    <section style={{ background: C.darkCard }}>
      <div style={{
        background: C.crimson, padding: '3rem 2.5rem', textAlign: 'center',
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 9px)',
      }}>
        <h2 style={{
          fontFamily: "'UnifrakturMaguntia', serif",
          fontSize: 'clamp(48px, 10vw, 88px)',
          color: C.gold, margin: '0 0 0.25rem', lineHeight: 0.9,
        }}>connect</h2>
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: 6,
          color: C.cream, textTransform: 'uppercase', margin: 0, opacity: 0.7,
        }}>With Us</p>
      </div>
      <div>
        {contacts.map((c, i) => (
          <a key={i} href={c.href} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.25rem 2.5rem',
            background: i % 2 === 0 ? C.cream : C.parchment,
            textDecoration: 'none',
            borderBottom: '1px solid rgba(139,26,26,0.1)',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: C.crimson, fontWeight: 600, letterSpacing: 1 }}>{c.label}</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>{c.icon}</div>
          </a>
        ))}
      </div>
    </section>
  )
}

function OurTeam() {
  return (
    <section style={{
      background: C.crimson,
      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 9px)',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid rgba(232,217,160,0.1)' }}>
        <div style={{ padding: '4rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 5, color: C.cream, opacity: 0.6, textTransform: 'uppercase', margin: '0 0 0.25rem' }}>Our</p>
          <h2 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 'clamp(64px, 12vw, 110px)', color: C.gold, margin: 0, lineHeight: 0.85 }}>Team</h2>
        </div>
        <div style={{ padding: '4rem 2.5rem', borderLeft: '1px solid rgba(232,217,160,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, color: C.gold, textTransform: 'uppercase', margin: '0 0 1rem' }}>BPH</p>
          <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 15, lineHeight: 1.85, color: C.cream, opacity: 0.85, margin: 0 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor eros, facilisis quis
            vulputate ut, suscipit nec tellus. Phasellus pretium urna vel dignissim facilisis. Cras
            risus nunc, vulputate nec lectus quis, posuere condimentum diam. Suspendisse mollis auctor
            diam sed aliquam. Nullam hendrerit nisl sed mi consequat congue.
          </p>
        </div>
      </div>
      <div style={{ padding: '3rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.25rem' }}>
          {Array(6).fill(null).map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <XBox style={{ width: '100%', aspectRatio: '3/4', borderRadius: 2 }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: C.cream, margin: '0 0 0.2rem', fontWeight: 600 }}>Nama Member</p>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 12, color: C.cream, opacity: 0.5, margin: 0 }}>Jabatan</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: C.darkCard, padding: '2.5rem 2rem 1.75rem', borderTop: '1px solid rgba(200,168,75,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 26, color: C.cream, margin: '0 0 2px', fontWeight: 400 }}>bharatika</p>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, color: C.cream, opacity: 0.4, margin: 0, textTransform: 'uppercase' }}>Creative Design Festival</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {[
            <svg key="ig" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill={C.cream} stroke="none" /></svg>,
            <svg key="tt" width="18" height="18" viewBox="0 0 24 24" fill={C.cream}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 12.67 0V8.69a8.18 8.18 0 0 0 4.78 1.54V6.79a4.85 4.85 0 0 1-1.01-.1z" /></svg>,
            <svg key="yt" width="18" height="18" viewBox="0 0 24 24" fill={C.cream}><path d="M23 7s-.3-2-1.2-2.7C20.7 3.1 19.4 3 19.4 3S15.7 2.7 12 2.7s-7.4.3-7.4.3-1.3.1-2.4 1.3C1.3 5 1 7 1 7S.7 9.2.7 11.3v2c0 2.2.3 4.3.3 4.3s.3 2 1.2 2.7c1.1 1.1 2.6 1.1 3.3 1.2C7.3 21.7 12 21.7 12 21.7s3.7 0 6.2-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.7 1.2-2.7s.3-2.1.3-4.3v-2C23.3 9.2 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" /></svg>,
          ].map((icon, i) => (
            <a key={i} href="#" style={{
              width: 34, height: 34, border: '1px solid rgba(232,217,160,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,217,160,0.5)'; e.currentTarget.style.background = 'rgba(232,217,160,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,217,160,0.2)'; e.currentTarget.style.background = 'transparent' }}
            >{icon}</a>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(232,217,160,0.08)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.cream, opacity: 0.25, letterSpacing: 0.5, margin: 0 }}>
          © Bharatika Creative Design Festival 2026. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default function About() {
  useFonts()
  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Navbar activeLink="about" />
      <HeroAbout />
      <FakultasPartner />
      <Gallery />
      <ConnectWithUs />
      <OurTeam />
      <Footer />
    </div>
  )
}