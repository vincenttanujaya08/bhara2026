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
        {!menuOpen && (
          <a href="/" onClick={e => { e.preventDefault(); handleNav('/') }}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img src="/images/BHRTK MERAH 1.png" alt="bharatika" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
          </a>
        )}
        <div style={{
          display: 'flex', alignItems: 'center', gap: menuOpen ? '1rem' : '0.75rem',
          background: menuOpen ? C.parchment : 'transparent',
          borderRadius: menuOpen ? 50 : 0,
          padding: menuOpen ? '10px 20px' : '0',
          transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.crimson} strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            ) : (
              <img src="/images/BURGER.png" alt="menu" style={{ height: 16, width: 'auto', objectFit: 'contain' }} />
            )}
          </button>
          <a href={auth?.user ? '/history' : '/login'}
            onClick={e => { e.preventDefault(); handleNav(auth?.user ? '/history' : '/login') }}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', opacity: menuOpen ? 1 : 0.75, transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = menuOpen ? '1' : '0.75'}
          >
            <img src="/images/Group 3.png" alt="profile" style={{ height: menuOpen ? 26 : 20, width: 'auto', objectFit: 'contain', transition: 'height 0.35s' }} />
          </a>
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
            <div key={link.label} onClick={() => handleNav(link.href)}
              onMouseEnter={() => setHoveredLink(i)} onMouseLeave={() => setHoveredLink(null)}
              style={{ position: 'relative', cursor: 'pointer', lineHeight: 1.1, animation: menuOpen ? 'navItemIn 0.6s cubic-bezier(0.22,1,0.36,1) ' + (0.1 + i * 0.08) + 's both' : 'none', transform: hoveredLink === i ? 'translateX(12px)' : 'translateX(0)', transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
              <span style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(44px, 7vw, 90px)', fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: 2, display: 'block', lineHeight: 1.6, animation: hoveredLink === i ? 'nordOut 0.35s cubic-bezier(0.22,1,0.36,1) forwards' : 'nordIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards', transformOrigin: 'left center', userSelect: 'none', willChange: 'transform, opacity, filter' }}>{link.label}</span>
              <span style={{ fontFamily: "'CSSalient', sans-serif", fontSize: 'clamp(80px, 14vw, 180px)', fontWeight: 400, color: C.parchment, textTransform: 'uppercase', letterSpacing: 4, display: 'block', position: 'absolute', top: '50%', left: 0, animation: hoveredLink === i ? 'cssalientIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards' : 'cssalientOut 0.3s cubic-bezier(0.22,1,0.36,1) forwards', transformOrigin: 'left center', whiteSpace: 'nowrap', userSelect: 'none', willChange: 'transform, opacity, filter' }}>{link.label}</span>
            </div>
          ))}
          <div style={{ position: 'absolute', bottom: '2.5rem', left: '8vw', right: '8vw', borderTop: '1px solid rgba(232,217,160,0.2)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: menuOpen ? 'navItemIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.5s both' : 'none' }}>
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
    <section style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', paddingTop: 52 }}>
      <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, filter: 'grayscale(100%) brightness(0.55)' }}>
        <source src="/videos/landing page bhara26.mp4" type="video/mp4" />
      </video>
      <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25, pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to right, rgba(139,26,26,0.97) 0%, rgba(139,26,26,0.85) 18%, rgba(139,26,26,0.3) 32%, rgba(139,26,26,0) 44%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'left center', opacity: 0.4, pointerEvents: 'none', maskImage: 'linear-gradient(to right, black 0%, black 18%, transparent 44%)', WebkitMaskImage: 'linear-gradient(to right, black 0%, black 18%, transparent 44%)' }} />
      <div style={{ position: 'relative', zIndex: 3, minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 5vw', maxWidth: '55%' }}>
        <img src="/images/BHRTK FOOTER.svg" alt="bharatika" style={{ width: 'clamp(280px, 40vw, 560px)', height: 'auto', marginBottom: '0.5rem' }} />
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(12px, 1.5vw, 18px)', color: C.gold, letterSpacing: 4, margin: '0 0 3rem', opacity: 0.85 }}>Creative Design Festival</p>
        <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(18px, 2.2vw, 28px)', lineHeight: 1.45, color: C.cream, opacity: 0.95, margin: 0, maxWidth: 580, fontWeight: 500 }}>
          Berjalan dari tahun 2016 hingga 2026, percikan semangat insan muda terus
          membakar api Bharatika untuk berjalan secara kreatif. Di tahun 2026, Bharatika
          merayakan acara yang ke-11 dengan taraf internasional. Rangkaian acara Bharatika
          dibagi menjadi 3, yaitu acara, festival, dan lomba.
        </p>
      </div>
    </section>
  )
}

function FakultasPartner() {
  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr' }}>
      <div style={{ background: C.darkCard, padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderTop: '1px solid rgba(200,168,75,0.1)', borderBottom: '1px solid rgba(200,168,75,0.1)' }}>
        <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(16px, 1.8vw, 22px)', lineHeight: 1.6, color: C.cream, opacity: 0.85, margin: 0 }}>
          Bharatika Creative Design Festival<br />
          diselenggarakan oleh{' '}
          <strong style={{ color: C.cream, opacity: 1, fontWeight: 700 }}>
            Fakultas<br />Humaniora dan Industri Kreatif<br />(FHIK), Petra Christian University,<br />Surabaya.
          </strong>
        </p>
      </div>
      <div style={{ background: C.parchment, padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/logos/petra.svg" alt="Petra" style={{ height: 90, width: 'auto', objectFit: 'contain' }} />
          <img src="/images/logos/fhik.svg" alt="FHIK" style={{ height: 80, width: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <img src="/images/logos/himavistra.svg" alt="Himavistra" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
          <img src="/images/logos/himaintra.svg" alt="Himaintra" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
          <img src="/images/logos/hima.svg" alt="Hima" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
          <img src="/images/logos/hima_ed.svg" alt="Hima ED" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
          <img src="/images/logos/himasahatra.svg" alt="Himasahatra" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  const categories = [
    { name: 'TIRTA', desc: ', mewakili kategori Mahasiswa DKV, DFT, IPDM.' },
    { name: 'BAYU',  desc: ', mewakili kategori umum.' },
    { name: 'AGNI',  desc: ', mewakili kategori Mahasiswa Desain Interior.' },
    { name: 'BUANA', desc: ', mewakili kategori SMA.' },
  ]

  const n = categories.length
  const [centerIdx, setCenterIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCenterIdx(i => (i + 1) % n)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  const getIdx = (off) => (centerIdx + off + n * 100) % n

  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: C.crimson, minHeight: 560, display: 'flex', alignItems: 'stretch' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', transform: 'rotate(180deg)', opacity: 0.9, pointerEvents: 'none', zIndex: 0 }} />
      <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12, pointerEvents: 'none', zIndex: 1 }} />

      <style>{`
        @keyframes carouselLeft {
          0%   { opacity: 0.4; transform: translateX(140px) scale(0.78); filter: brightness(0.45); }
          100% { opacity: 1;   transform: translateX(0)     scale(1);    filter: brightness(1); }
        }
        @keyframes carouselMid {
          0%   { opacity: 1;   transform: translateX(0)      scale(1);    filter: brightness(1); }
          100% { opacity: 0.4; transform: translateX(-140px) scale(0.78); filter: brightness(0.45); }
        }
        @keyframes carouselRight {
          0%   { opacity: 0.4; transform: translateX(70px) scale(0.78); filter: brightness(0.45); }
          100% { opacity: 0.4; transform: translateX(0)    scale(0.78); filter: brightness(0.45); }
        }
        @keyframes descIn {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Left 2/3 — carousel */}
      <div style={{ position: 'relative', zIndex: 2, width: '66.666%', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '3rem 0 2.5rem', gap: '0.5rem' }}>
        {[-1, 0, 1].map(pos => {
          const item = categories[getIdx(pos)]
          const isActive = pos === 0
          return (
            <div key={centerIdx + '-' + pos} style={{
              flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
              width: isActive ? '240px' : '150px',
              animation: isActive
                ? 'carouselLeft 0.75s cubic-bezier(0.22,1,0.36,1) forwards'
                : pos === -1
                ? 'carouselMid 0.75s cubic-bezier(0.22,1,0.36,1) forwards'
                : 'carouselRight 0.75s cubic-bezier(0.22,1,0.36,1) forwards',
            }}>
              <img src={'/images/' + item.name + '.svg'} alt={item.name}
                style={{ width: isActive ? '240px' : '150px', height: isActive ? '400px' : '250px', objectFit: 'contain', objectPosition: 'bottom' }}
                onError={e => { e.target.style.display = 'none' }}
              />
              <p style={{ fontFamily: "'CSSalient', sans-serif", fontSize: isActive ? 'clamp(32px, 4.5vw, 56px)' : 'clamp(18px, 2.2vw, 28px)', color: isActive ? C.gold : C.cream, margin: '0.5rem 0 0.3rem', lineHeight: 1, textTransform: 'uppercase', letterSpacing: 2 }}>{item.name}</p>
              {isActive && (
                <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 14, color: C.cream, opacity: 0.85, margin: 0, textAlign: 'center', lineHeight: 1.4, maxWidth: 210, animation: 'descIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.4s both' }}>
                  <strong>{item.name === 'TIRTA' ? 'Berarti air' : item.name === 'BAYU' ? 'Berarti angin' : item.name === 'AGNI' ? 'Berarti api' : 'Berarti tanah'}</strong>
                  {item.desc}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Right 1/3 — text */}
      <div style={{ position: 'relative', zIndex: 2, width: '33.333%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 2.5rem', borderLeft: '1px solid rgba(232,217,160,0.1)', textAlign: 'right' }}>
        <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(20px, 2.2vw, 26px)', lineHeight: 1.8, color: C.gold, opacity: 0.95, margin: '0 0 2rem' }}>
          Lomba menjadi salah satu ciri<br />
          khas Bharatika dari tahun ke<br />
          tahun. Lomba ini dibagi menjadi 4<br />
          kategori yang masing-masing<br />
          diwakili oleh satu punggawa.
        </p>
        <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(20px, 2.2vw, 26px)', lineHeight: 1.8, color: C.gold, opacity: 0.95, margin: 0 }}>
          Adapun punggawa Bharatika<br />
          diantaranya: Tirta, Bayu, Agni, dan<br />
          Buana.
        </p>
      </div>
    </section>
  )
}

function MarqueeTicker() {
  const words = Array(12).fill('MERAJACIPTA')
  return (
    <div style={{ background: C.black, borderBottom: '3px solid #8B1A1A', overflow: 'hidden', padding: '12px 0', position: 'relative', zIndex: 10, marginTop: 0 }}>
      <style>{`
        @font-face { font-family: 'CSSalient'; src: url('/fonts/CSSalient-Regular.ttf') format('truetype'); }
        @keyframes marqueeBounce { 0% { transform: translateX(0); } 50% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
      `}</style>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marqueeBounce 10s ease-in-out infinite' }}>
        {Array(2).fill(null).map((_, gi) => (
          <div key={gi} style={{ display: 'flex', flexShrink: 0 }}>
            {words.map((word, i) => (
              <span key={i} style={{ fontFamily: "'CSSalient', sans-serif", fontSize: 46, color: C.cream, paddingRight: '6rem', lineHeight: 1 }}>{word}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function ConnectWithUs() {
  const contacts = [
    { label: 'Partnership', icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill={C.gold}><path d="M20 2H4C2.9 2 2 2.9 2 4v16l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>), href: '#' },
    { label: 'Social Media', icon: (<div style={{ display: 'flex', gap: '0.5rem' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill={C.gold} stroke="none" /></svg><svg width="20" height="20" viewBox="0 0 24 24" fill={C.gold}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 12.67 0V8.69a8.18 8.18 0 0 0 4.78 1.54V6.79a4.85 4.85 0 0 1-1.01-.1z" /></svg><svg width="20" height="20" viewBox="0 0 24 24" fill={C.gold}><path d="M23 7s-.3-2-1.2-2.7C20.7 3.1 19.4 3 19.4 3S15.7 2.7 12 2.7s-7.4.3-7.4.3-1.3.1-2.4 1.3C1.3 5 1 7 1 7S.7 9.2.7 11.3v2c0 2.2.3 4.3.3 4.3s.3 2 1.2 2.7c1.1 1.1 2.6 1.1 3.3 1.2C7.3 21.7 12 21.7 12 21.7s3.7 0 6.2-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.7 1.2-2.7s.3-2.1.3-4.3v-2C23.3 9.2 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" /></svg></div>), href: '#' },
  ]
  return (
    <section style={{ background: C.darkCard }}>
      {/* Header — crimson + bitmap + big text */}
      <div style={{ position: 'relative', overflow: 'hidden', background: C.crimson, padding: '5rem 2.5rem', textAlign: 'center' }}>
        {/* BG MERAH */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.7, pointerEvents: 'none' }} />
        {/* BITMAP */}
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, pointerEvents: 'none' }} />
        {/* Text */}
        <div style={{ position: 'relative', zIndex: 1, display: 'inline-block' }}>
          <h2 style={{
            fontFamily: "'CSSalient', sans-serif",
            fontSize: 'clamp(72px, 14vw, 180px)',
            color: C.cream, margin: 0, lineHeight: 0.9,
            letterSpacing: 4, textTransform: 'uppercase',
            display: 'block',
          }}>connect</h2>
          <p style={{
            fontFamily: "'Nord', sans-serif",
            fontSize: 'clamp(22px, 4vw, 52px)',
            color: C.cream, margin: 0, letterSpacing: 8,
            textTransform: 'uppercase', fontWeight: 700,
            textAlign: 'right', display: 'block',
          }}>With Us</p>
        </div>
      </div>
      {/* Gap hitam */}
      <div style={{ height: 8, background: C.dark }} />

      {/* Partnership — accordion */}
      <PartnershipRow />

      {/* Gap hitam */}
      <div style={{ height: 8, background: C.dark }} />

      {/* Social Media row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.75rem 2.5rem', background: C.parchment }}>
        <span style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(22px, 3vw, 36px)', color: C.crimson, fontWeight: 700 }}>Social Media</span>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a href="#" style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <img src="/images/LINE MERAH.svg" alt="LINE" style={{ width: 48, height: 48, objectFit: 'contain' }} />
          </a>
          <a href="#" style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <img src="/images/IG MERAH.svg" alt="Instagram" style={{ width: 48, height: 48, objectFit: 'contain' }} />
          </a>
          <a href="#" style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <img src="/images/TIKTOK MERAH.svg" alt="TikTok" style={{ width: 48, height: 48, objectFit: 'contain' }} />
          </a>
          <a href="#" style={{ width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <img src="/images/YT MERAH.svg" alt="YouTube" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          </a>
        </div>
      </div>
    </section>
  )
}

function PartnershipRow() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: C.parchment, borderBottom: '1px solid rgba(139,26,26,0.12)' }}>
      {/* Header row */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.75rem 2.5rem', cursor: 'pointer' }}
      >
        <span style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(22px, 3vw, 36px)', color: C.crimson, fontWeight: 700 }}>Partnership</span>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: C.crimson, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="2.5" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      {/* Dropdown content */}
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? '250px' : '0px',
        transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ padding: '0 2.5rem 1.75rem' }}>
          <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(18px, 2.2vw, 28px)', color: C.crimson, margin: 0, lineHeight: 1.7 }}>
            Reach out to our hotline:<br />
            Shera (083871738520) or Aurelina (087811812050)
          </p>
        </div>
      </div>
    </div>
  )
}

function OurTeam() {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      background: '#A50D14',
    }}>
      {/* BITMAP — lebih tebal */}
      <img src="/images/BITMAP.svg" alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', opacity: 0.35, pointerEvents: 'none',
      }} />

      {/* Header — OUR TEAM + BPH */}
      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '5rem 4rem', gap: '4rem', alignItems: 'center' }}>
        {/* Left — OUR TEAM */}
        <div>
          <p style={{
            fontFamily: "'Nord', sans-serif",
            fontSize: 'clamp(28px, 5vw, 64px)',
            color: C.gold, margin: '0 0 -0.2em', fontWeight: 700,
            letterSpacing: 6, textTransform: 'uppercase',
          }}>Our</p>
          <h2 style={{
            fontFamily: "'CSSalient', sans-serif",
            fontSize: 'clamp(80px, 16vw, 200px)',
            color: C.gold, margin: 0, lineHeight: 0.85,
            textTransform: 'uppercase', letterSpacing: 2,
          }}>Team</h2>
        </div>

        {/* Right — BPH + desc */}
        <div>
          <p style={{
            fontFamily: "'Nord', sans-serif",
            fontSize: 'clamp(20px, 3vw, 40px)',
            color: C.gold, margin: '0 0 1rem', fontWeight: 700,
            letterSpacing: 4, textTransform: 'uppercase',
          }}>BPH</p>
          <p style={{
            fontFamily: "'FamiljenGrotesk', sans-serif",
            fontSize: 'clamp(15px, 1.8vw, 22px)',
            lineHeight: 1.75, color: C.gold, opacity: 0.9, margin: 0,
          }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor
            eros, facilisis quis vulputate ut, suscipit nec tellus. Phasellus
            pretium urna vel dignissim facilisis. Cras risus nunc, vulputate nec
            lectus quis, posuere condimentum diam. Suspendisse mollis auctor diam
            sed aliquam. Nullam hendrerit nisl sed mi consequat congue.
          </p>
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
            <a key={i} href="#" style={{ width: 34, height: 34, border: '1px solid rgba(232,217,160,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,217,160,0.5)'; e.currentTarget.style.background = 'rgba(232,217,160,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,217,160,0.2)'; e.currentTarget.style.background = 'transparent' }}
            >{icon}</a>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(232,217,160,0.08)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.cream, opacity: 0.25, letterSpacing: 0.5, margin: 0 }}>© Bharatika Creative Design Festival 2026. All Rights Reserved.</p>
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
      <MarqueeTicker />
      <ConnectWithUs />
      <OurTeam />
      <Footer />
    </div>
  )
}