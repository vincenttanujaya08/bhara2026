import { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { navigateWithTransition } from '../../hooks/usePageTransition'

const C = {
  gold: '#C8A84B',
  cream: '#E8D9A0',
  parchment: '#D4C48A',
  crimson: '#8B1A1A',
  dark: '#1A1410',
  black: '#0F0A05',
}

const CATEGORY_CONFIG = {
  TIRTA: { bg: '#4A6FA5', description: '<b>Berarti air</b>, mewakili kategori Mahasiswa DKV, DFT, IPDM.', order: 1 },
  BUANA: { bg: '#5C6B3A', description: '<b>Berarti tanah</b>, mewakili kategori SMA.', order: 2 },
  BAYU: { bg: '#8B6914', description: '<b>Berarti angin</b>, mewakili kategori umum.', order: 3 },
  AGNI: { bg: '#8B2A1A', description: '<b>Berarti api</b>, mewakili kategori Mahasiswa Desain Interior.', order: 4 },
}

const DEFAULT_CONFIG = { bg: '#2A2420', description: '', order: 99 }

/* ─── Navbar Component (Fullscreen Overlay) ─── */
function Navbar() {
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
        @keyframes overlayIn { from { clip-path: circle(0% at calc(100% - 2.5rem) 26px); } to { clip-path: circle(170% at calc(100% - 2.5rem) 26px); } }
        @keyframes overlayOut { from { clip-path: circle(170% at calc(100% - 2.5rem) 26px); } to { clip-path: circle(0% at calc(100% - 2.5rem) 26px); } }
        @keyframes navItemIn { from { opacity: 0; transform: translateX(-60px) skewX(-8deg); } to { opacity: 1; transform: translateX(0) skewX(0deg); } }
        @keyframes nordOut { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }
        @keyframes nordIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes cssalientIn { 0% { opacity: 0; transform: translateY(-50%) scaleX(1.1); filter: blur(6px); } 100% { opacity: 1; transform: translateY(-50%) scaleX(1); filter: blur(0px); } }
        @keyframes cssalientOut { 0% { opacity: 1; transform: translateY(-50%) scaleX(1); filter: blur(0px); } 100% { opacity: 0; transform: translateY(-40%) scaleX(1.1); filter: blur(6px); } }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: 52,
        display: 'flex', alignItems: 'center', justifyContent: menuOpen ? 'flex-end' : 'space-between',
        padding: '0 1.75rem',
        background: menuOpen ? 'transparent' : (scrolled ? 'rgba(235,217,157,0.98)' : 'rgba(235,217,157,0.85)'),
        backdropFilter: menuOpen ? 'none' : 'blur(6px)',
        borderBottom: (!menuOpen && scrolled) ? '1px solid rgba(139,26,26,0.25)' : 'none',
        transition: 'background 0.35s, border 0.35s',
      }}>
        {!menuOpen && (
          <div onClick={() => handleNav('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img src="/images/BHRTK MERAH 1.png" alt="bharatika" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
          </div>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', gap: menuOpen ? '1rem' : '0.75rem',
          background: menuOpen ? C.parchment : 'transparent',
          borderRadius: 50, padding: menuOpen ? '10px 20px' : '0', transition: 'all 0.35s',
        }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.crimson} strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            ) : (
              <img src="/images/BURGER.png" alt="menu" style={{ height: 16, width: 'auto', objectFit: 'contain' }} />
            )}
          </button>
          <div onClick={() => handleNav(auth?.user ? '/history' : '/login')} style={{ cursor: 'pointer', opacity: menuOpen ? 1 : 0.75 }}>
            <img src="/images/Group 3.png" alt="profile" style={{ height: menuOpen ? 26 : 20, width: 'auto', objectFit: 'contain', transition: 'height 0.35s' }} />
          </div>
        </div>
      </nav>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 250, background: C.crimson,
        animation: menuOpen ? 'overlayIn 0.65s cubic-bezier(0.22,1,0.36,1) forwards' : 'overlayOut 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        pointerEvents: menuOpen ? 'all' : 'none', overflow: 'hidden',
      }}>
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '0 8vw' }}>
          {navLinks.map((link, i) => (
            <div key={link.label} onClick={() => handleNav(link.href)} onMouseEnter={() => setHoveredLink(i)} onMouseLeave={() => setHoveredLink(null)}
              style={{ position: 'relative', cursor: 'pointer', lineHeight: 1.1, animation: menuOpen ? `navItemIn 0.6s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.08}s both` : 'none', transform: hoveredLink === i ? 'translateX(12px)' : 'translateX(0)', transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
              <span style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(44px, 7vw, 90px)', fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: 2, display: 'block', lineHeight: 1.6, animation: hoveredLink === i ? 'nordOut 0.35s forwards' : 'nordIn 0.35s forwards' }}>{link.label}</span>
              <span style={{ fontFamily: "'CSSalient', sans-serif", fontSize: 'clamp(80px, 14vw, 180px)', fontWeight: 400, color: C.parchment, textTransform: 'uppercase', letterSpacing: 4, display: 'block', position: 'absolute', top: '50%', left: 0, animation: hoveredLink === i ? 'cssalientIn 0.4s forwards' : 'cssalientOut 0.3s forwards', transformOrigin: 'left center', whiteSpace: 'nowrap' }}>{link.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function CategoryBanner({ category, index }) {
  const [open, setOpen] = useState(false)
  const config = CATEGORY_CONFIG[category.name?.toUpperCase()] || DEFAULT_CONFIG
  const isRight = index % 2 !== 0 
  const cream = '#E8D9A0'

  return (
    <div style={{ background: config.bg, overflow: 'hidden', transition: 'all 0.4s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isRight ? '1fr auto auto' : 'auto 1fr auto', alignItems: 'center', padding: '0 2.5rem', minHeight: 180, gap: '2rem', cursor: 'pointer', position: 'relative' }} onClick={() => setOpen(!open)}>
        {isRight ? (
          <>
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: `2px solid ${cream}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cream} strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(15px, 1.8vw, 20px)', color: cream, opacity: 0.9, margin: 0, lineHeight: 1.6, textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: config.description }} />
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(40px, 8vw, 100px)', fontWeight: 700, color: cream, margin: 0, lineHeight: 0.85, letterSpacing: 2, flexShrink: 0 }}>{category.name}</h2>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(40px, 8vw, 100px)', fontWeight: 700, color: cream, margin: 0, lineHeight: 0.85, letterSpacing: 2, flexShrink: 0 }}>{category.name}</h2>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(15px, 1.8vw, 20px)', color: cream, opacity: 0.9, margin: 0, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: config.description }} />
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: `2px solid ${cream}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cream} strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </>
        )}
      </div>

      <div style={{ maxHeight: open ? '2000px' : '0', overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div style={{ padding: '0 2.5rem 2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', borderTop: `1px solid rgba(232,217,160,0.15)`, paddingTop: '1.5rem' }}>
          {category.competitions?.length > 0 ? category.competitions.map(comp => {
            const userReg = comp.registrations?.[0];
            const isApproved = userReg?.payment_status === 'approved';
            const isPending = userReg?.payment_status === 'pending';

            return (
              <div key={comp.id} style={{ 
                background: 'rgba(0,0,0,0.2)', 
                border: `1px solid ${isApproved ? 'rgba(126,203,161,0.4)' : 'rgba(232,217,160,0.15)'}`, 
                padding: '1.25rem 1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem', 
                transition: 'all 0.2s' 
              }}>
                <div>
                  <h3 style={{ 
                    fontFamily: "'Cinzel', serif", 
                    fontSize: 14, 
                    color: isApproved ? '#7ECBA1' : cream, 
                    margin: '0 0 0.4rem', 
                    fontWeight: 600, 
                    letterSpacing: 0.5 
                  }}>
                    {comp.name} {isApproved && '✓'}
                  </h3>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: cream, opacity: 0.55, margin: 0 }}>{comp.min_participants === comp.max_participants ? `${comp.min_participants} peserta` : `${comp.min_participants}–${comp.max_participants} peserta`}</p>
                </div>
                
                <button 
                  onClick={() => {
                    if (isApproved) {
                      navigateWithTransition(`/history/${userReg.id}`);
                    } else {
                      // Jika pending, controller show() akan otomatis melempar ke page Success/Verifying
                      navigateWithTransition(`/competitions/${comp.id}/register`);
                    }
                  }} 
                  style={{ 
                    display: 'block', 
                    width: '100%', 
                    textAlign: 'center', 
                    padding: '8px', 
                    border: `1px solid ${isApproved ? '#7ECBA1' : cream}`, 
                    background: isApproved ? 'rgba(126,203,161,0.1)' : 'transparent', 
                    color: isApproved ? '#7ECBA1' : cream, 
                    fontFamily: "'Cinzel', serif", 
                    fontSize: 9, 
                    letterSpacing: 3, 
                    textTransform: 'uppercase', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s' 
                  }} 
                  onMouseEnter={e => { 
                    if (!isApproved) {
                      e.currentTarget.style.background = cream; 
                      e.currentTarget.style.color = config.bg; 
                    }
                  }} 
                  onMouseLeave={e => { 
                    if (!isApproved) {
                      e.currentTarget.style.background = 'transparent'; 
                      e.currentTarget.style.color = cream; 
                    }
                  }}
                >
                  {isApproved ? 'Sudah Terdaftar' : 'Daftar Sekarang'}
                </button>
              </div>
            );
          }) : (
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: cream, opacity: 0.4, margin: 0 }}>Belum ada kompetisi tersedia</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CompetitionsIndex({ categories = [] }) {
  useEffect(() => {
    document.body.style.margin = '0'
    if (!document.getElementById('bh-fonts')) {
      const l = document.createElement('link')
      l.id = 'bh-fonts'
      l.rel = 'stylesheet'
      l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
      document.head.appendChild(l)
    }
  }, [])

  const sortedCategories = [...categories].sort((a, b) => {
    const orderA = CATEGORY_CONFIG[a.name.toUpperCase()]?.order || 99
    const orderB = CATEGORY_CONFIG[b.name.toUpperCase()]?.order || 99
    return orderA - orderB
  })

  return (
    <div style={{ minHeight: '100vh', background: '#1A1410' }}>
      <Navbar />
      <div style={{ paddingTop: 52 }}>
        {sortedCategories.map((category, index) => (
          <CategoryBanner key={category.id} category={category} index={index} />
        ))}
        {sortedCategories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: 3, color: '#E8D9A0', opacity: 0.25, textTransform: 'uppercase' }}>Belum ada kompetisi tersedia</p>
          </div>
        )}
      </div>
    </div>
  )
}