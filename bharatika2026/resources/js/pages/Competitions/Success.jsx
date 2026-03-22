import { useEffect, useState } from 'react'
import { Head, usePage } from '@inertiajs/react'
import { navigateWithTransition } from '../../hooks/usePageTransition'

const C = {
  cream: '#E8D9A0',
  gold: '#C8A84B',
  crimson: '#8B1A1A',
  black: '#0F0A05',
  parchment: '#D4C48A',
}

/* ─── Navbar Component ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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

  const handleNav = (href) => {
    setMenuOpen(false)
    setTimeout(() => navigateWithTransition(href), 400)
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: 'Competitions', href: '/competitions' },
    { label: 'About', href: '/about' },
  ]

  return (
    <>
      <style>{`
        @keyframes overlayIn { from { clip-path: circle(0% at calc(100% - 2.5rem) 26px); } to { clip-path: circle(170% at calc(100% - 2.5rem) 26px); } }
        @keyframes overlayOut { from { clip-path: circle(170% at calc(100% - 2.5rem) 26px); } to { clip-path: circle(0% at calc(100% - 2.5rem) 26px); } }
        @keyframes navItemIn { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: 60,
        display: 'flex', alignItems: 'center', justifyContent: menuOpen ? 'flex-end' : 'space-between',
        padding: '0 1.75rem', 
        background: menuOpen ? 'transparent' : 'rgba(235,217,157,0.98)',
        backdropFilter: menuOpen ? 'none' : 'blur(10px)',
        borderBottom: (!menuOpen && scrolled) ? '1px solid rgba(139,26,26,0.15)' : 'none',
        transition: 'all 0.35s ease-in-out',
      }}>
        {!menuOpen && (
          <div onClick={() => handleNav('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img src="/images/BHRTK MERAH 1.png" alt="bharatika" style={{ height: 32 }} />
          </div>
        )}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          background: menuOpen ? C.parchment : 'transparent', 
          borderRadius: 50, 
          padding: menuOpen ? '10px 20px' : '0', 
          transition: 'all 0.35s' 
        }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.crimson} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            ) : (
              <img src="/images/BURGER.png" alt="menu" style={{ height: 16 }} />
            )}
          </button>
          <div onClick={() => handleNav(auth?.user ? '/history' : '/login')} style={{ cursor: 'pointer', opacity: menuOpen ? 1 : 0.75 }}>
            <img src="/images/Group 3.png" alt="profile" style={{ height: menuOpen ? 26 : 20 }} />
          </div>
        </div>
      </nav>

      <div style={{ position: 'fixed', inset: 0, zIndex: 250, background: C.crimson, animation: menuOpen ? 'overlayIn 0.65s forwards' : 'overlayOut 0.5s forwards', pointerEvents: menuOpen ? 'all' : 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5 }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8vw' }}>
          {navLinks.map((link, i) => (
            <div key={link.label} onClick={() => handleNav(link.href)} style={{ cursor: 'pointer', marginBottom: '1.5rem', animation: menuOpen ? `navItemIn 0.6s ${0.1 + i * 0.08}s both` : 'none' }}>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(32px, 6vw, 80px)', fontWeight: 900, color: C.gold, textTransform: 'uppercase', letterSpacing: 4 }}>{link.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ─── Page Content ─── */
export default function RegistrationSuccess() {
  useEffect(() => {
    document.body.style.background = C.crimson
    if (!document.getElementById('bh-fonts')) {
      const l = document.createElement('link')
      l.id = 'bh-fonts'
      l.rel = 'stylesheet'
      l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;700;900&family=EB+Garamond:wght@400;700&display=swap'
      document.head.appendChild(l)
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: C.crimson, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <Head title="Registration Submitted" />
      <Navbar />
      
      {/* Background Layer */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1 }} />
      <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, zIndex: 1, mixBlendMode: 'overlay' }} />

      <main style={{ flex: 1, position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 2rem 5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cinzel', serif", color: C.cream, letterSpacing: '6px', fontSize: 'clamp(12px, 2vw, 16px)', marginBottom: '1.5rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.9 }}>
            Your registration has been submitted
          </p>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(48px, 12vw, 130px)', color: C.cream, margin: 0, lineHeight: 0.9, letterSpacing: '15px', fontWeight: 900, textShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
            VERIFYING
          </h1>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(14px, 3vw, 28px)', color: C.gold, margin: '2.5rem 0 4.5rem', letterSpacing: '8px', fontWeight: 700 }}>
            WE’LL NOTIFY YOU SOON
          </p>

          {/* Action Buttons Container */}
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            
            {/* View Dashboard Button */}
            <button 
              onClick={() => navigateWithTransition('/history')}
              style={{ 
                background: 'transparent', color: C.cream, border: `2px solid ${C.cream}`, padding: '18px 45px', borderRadius: '50px', fontFamily: "'Cinzel', serif", fontSize: '11px', fontWeight: 900, letterSpacing: '3px', cursor: 'pointer', transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(232, 217, 160, 0.15)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              VIEW DASHBOARD
            </button>

            {/* Back to Home Button */}
            <button 
              onClick={() => navigateWithTransition('/')}
              style={{ 
                background: C.cream, color: C.crimson, border: 'none', padding: '18px 45px', borderRadius: '50px', fontFamily: "'Cinzel', serif", fontSize: '11px', fontWeight: 900, letterSpacing: '3px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 8px 25px rgba(0,0,0,0.4)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </main>

      <footer style={{ position: 'relative', zIndex: 2, background: C.black, padding: '4rem 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>
         <img src="/images/BHRTK FOOTER.svg" alt="bharatika" style={{ height: 60, opacity: 0.9 }} />
         <div style={{ display: 'flex', gap: '2rem' }}>
            {/* Social Placeholder Icons */}
            {[1, 2, 3].map(i => (
              <div key={i} style={{ width: 36, height: 36, border: '1px solid rgba(232,217,160,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                  <div style={{ width: 16, height: 16, background: C.cream, opacity: 0.5 }}></div>
              </div>
            ))}
         </div>
         <p style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', color: C.cream, opacity: 0.4, letterSpacing: '2px', textAlign: 'center', lineHeight: 2 }}>
           © Bharatika Creative Design Festival 2026. <br /> All Rights Reserved. <br /> Petra Christian University, Surabaya.
         </p>
      </footer>
    </div>
  )
}