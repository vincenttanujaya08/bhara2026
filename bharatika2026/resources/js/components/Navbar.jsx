import { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { navigateWithTransition } from '../hooks/usePageTransition'

const C = {
  gold: '#C8A84B',
  cream: '#E8D9A0',
  parchment: '#D4C48A',
  crimson: '#8B1A1A',
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const { auth } = usePage().props

  useEffect(() => {
    // Cek posisi scroll saat mount untuk jaga-jaga jika page di-refresh di posisi bawah
    setScrolled(window.scrollY > 10)
    
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNav = (href) => {
    setMenuOpen(false)
    setTimeout(() => navigateWithTransition(href), 400)
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: 'Competitions', href: '/competitions' },
    
    { label: 'About', href: '/about' },
    { label: 'Dashboard', href: '/history' },
  ]

  return (
    <>
      <style>{`
        @keyframes overlayIn { from { clip-path: circle(0% at calc(100% - 2.5rem) 26px); } to { clip-path: circle(170% at calc(100% - 2.5rem) 26px); } }
        @keyframes overlayOut { from { clip-path: circle(170% at calc(100% - 2.5rem) 26px); } to { clip-path: circle(0% at calc(100% - 2.5rem) 26px); } }
        @keyframes navItemIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes nordOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-15px); } }
        @keyframes nordIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cssalientIn { from { opacity: 0; transform: translateY(-50%) scaleX(1.05); filter: blur(4px); } to { opacity: 1; transform: translateY(-50%) scaleX(1); filter: blur(0px); } }
        @keyframes cssalientOut { from { opacity: 1; transform: translateY(-50%) scaleX(1); filter: blur(0px); } to { opacity: 0; transform: translateY(-40%) scaleX(1.05); filter: blur(4px); } }
      `}</style>

      {/* Main Navbar Bar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 400, height: 60,
        display: 'flex', alignItems: 'center', justifyContent: menuOpen ? 'flex-end' : 'space-between',
        padding: '0 1.75rem',
        // FIX: Langsung pakai warna cream (rgba 235, 217, 157) sejak awal agar tidak tembus background merah
        background: menuOpen ? 'transparent' : 'rgba(235, 217, 157, 0.98)',
        backdropFilter: menuOpen ? 'none' : 'blur(10px)',
        // Border muncul hanya saat di-scroll
        borderBottom: (!menuOpen && scrolled) ? '1px solid rgba(139, 26, 26, 0.15)' : 'none',
        transition: 'all 0.35s ease-in-out',
      }}>
        {!menuOpen && (
          <div onClick={() => handleNav('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img src="/images/BHRTK MERAH 1.png" alt="bharatika" style={{ height: 32 }} />
          </div>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          background: menuOpen ? C.parchment : 'transparent',
          borderRadius: 50, padding: menuOpen ? '10px 20px' : '0', transition: 'all 0.35s',
        }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.crimson} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <img src="/images/BURGER.png" alt="menu" style={{ height: 16 }} />
            )}
          </button>
          <div onClick={() => handleNav(auth?.user ? '/history' : '/login')} style={{ cursor: 'pointer', opacity: menuOpen ? 1 : 0.75 }}>
            <img src="/images/Group 3.png" alt="profile" style={{ height: menuOpen ? 26 : 20 }} />
          </div>
        </div>
      </nav>

      {/* Fullscreen Overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 350, background: C.crimson,
        animation: menuOpen ? 'overlayIn 0.6s ease-out forwards' : 'overlayOut 0.5s ease-in forwards',
        pointerEvents: menuOpen ? 'all' : 'none', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1 }} />
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />

        {/* Links Container */}
        <div style={{ 
          position: 'relative', zIndex: 1, height: '100%', 
          display: 'flex', flexDirection: 'column', justifyContent: 'center', 
          padding: '0 8vw' 
        }}>
          {navLinks.map((link, i) => (
            <div 
              key={link.label} 
              onClick={() => handleNav(link.href)} 
              onMouseEnter={() => setHoveredLink(i)} 
              onMouseLeave={() => setHoveredLink(null)}
              style={{ 
                position: 'relative', 
                cursor: 'pointer', 
                marginBottom: '1rem',
                animation: menuOpen ? `navItemIn 0.5s ease-out ${0.1 + i * 0.05}s both` : 'none',
              }}
            >
              <span style={{ 
                fontFamily: "'Nord', sans-serif", 
                fontSize: 'clamp(32px, 6vw, 72px)', 
                fontWeight: 700, 
                color: C.gold, 
                textTransform: 'uppercase', 
                letterSpacing: 2, 
                display: 'block', 
                lineHeight: 1.2,
                animation: hoveredLink === i ? 'nordOut 0.3s forwards' : 'nordIn 0.3s forwards'
              }}>
                {link.label}
              </span>
              <span style={{ 
                fontFamily: "'CSSalient', sans-serif", 
                fontSize: 'clamp(60px, 12vw, 130px)', 
                fontWeight: 400, 
                color: C.parchment, 
                textTransform: 'uppercase', 
                letterSpacing: 4, 
                display: 'block', 
                position: 'absolute', 
                top: '50%', 
                left: 0, 
                animation: hoveredLink === i ? 'cssalientIn 0.4s forwards' : 'cssalientOut 0.3s forwards', 
                transformOrigin: 'left center', 
                whiteSpace: 'nowrap',
                pointerEvents: 'none'
              }}>
                {link.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Text on Overlay */}
        <div style={{ 
          position: 'absolute', bottom: '40px', left: '8vw', right: '8vw', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          borderTop: `1.5px solid ${C.gold}`, 
          paddingTop: '20px',
          animation: menuOpen ? 'navItemIn 0.6s ease-out 0.5s both' : 'none'
        }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', color: C.gold, letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.9, fontWeight: 700 }}>
            Bharatika 2026
          </span>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', color: C.gold, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9, textAlign: 'right', fontWeight: 700 }}>
            Petra Christian University, Surabaya
          </span>
        </div>
      </div>
    </>
  )
}