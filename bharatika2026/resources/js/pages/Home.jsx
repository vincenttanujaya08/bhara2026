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

function Navbar({ activeLink = '' }) {
  const [scrolled, setScrolled] = useState(false)
  const { auth } = usePage().props
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const NC = { gold: '#C8A84B', cream: '#E8D9A0', crimson: '#8B1A1A', dark: '#1A1410' }
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/#events' },
    { label: 'Competition', href: '/competitions' },
    { label: 'About', href: '/about' },
  ]
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 52,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 1.75rem',
      background: scrolled ? 'rgba(235,217,157,0.98)' : 'rgba(235,217,157,0.85)',
      backdropFilter: 'blur(6px)',
      borderBottom: scrolled ? '1px solid rgba(139,26,26,0.25)' : 'none',
      transition: 'background 0.35s, border 0.35s',
    }}>
      <TLink href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <img src="/images/BHRTK MERAH 1.png" alt="bharatika" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
      </TLink>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {navLinks.map(({ label, href }) => {
          const isActive = activeLink === label.toLowerCase()
          return (
            <TLink key={label} href={href} style={{
              fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2,
              color: isActive ? NC.crimson : NC.dark,
              textDecoration: 'none', textTransform: 'uppercase',
              opacity: isActive ? 1 : 0.75,
              borderBottom: isActive ? `1px solid ${NC.crimson}` : 'none',
              paddingBottom: isActive ? 2 : 0,
              transition: 'opacity 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = NC.crimson }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = isActive ? '1' : '0.75'
                e.currentTarget.style.color = isActive ? NC.crimson : NC.dark
              }}
            >{label}</TLink>
          )
        })}
        <TLink href={auth?.user ? '/history' : '/login'}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', opacity: 0.75, transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.75'}
        >
          <img src="/images/Group 3.png" alt="profile" style={{ height: 22, width: 'auto', objectFit: 'contain' }} />
        </TLink>
      </div>
    </nav>
  )
}

function useFonts() {
  useEffect(() => {
    if (!document.getElementById('cssalient-font')) {
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
    }
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
    document.head.appendChild(l)
    document.body.style.margin = '0'; document.body.style.padding = '0'; document.body.style.overflowX = 'hidden'
  }, [])
}

function XBox({ style = {} }) {
  return (
    <div style={{ background: '#C8C0B0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', ...style }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#A09080" strokeWidth="1.5" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#A09080" strokeWidth="1.5" />
        <rect x="0.75" y="0.75" width="calc(100% - 1.5px)" height="calc(100% - 1.5px)" stroke="#A09080" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}

function Hero() {
  return (
    <section style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <video autoPlay loop muted playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      >
        <source src="/videos/Motion Background bhara26 FIXX.mp4" type="video/mp4" />
      </video>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,10,5,0.2) 0%, rgba(15,10,5,0.05) 50%, rgba(15,10,5,0.5) 100%)', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '12rem' }}>
        <TLink href="/about" style={{ display: 'inline-block', padding: '18px 64px', border: '1.5px solid transparent', color: C.crimson, fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: 5, textDecoration: 'none', textTransform: 'uppercase', background: C.cream, backdropFilter: 'blur(4px)', transition: 'all 0.3s', borderRadius: 50 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; e.currentTarget.style.color = C.gold; e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.backdropFilter = 'none' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.cream; e.currentTarget.style.color = C.crimson; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.backdropFilter = 'blur(4px)' }}
        >Learn More</TLink>
      </div>
    </section>
  )
}

function MarqueeTicker() {
  const words = Array(12).fill('MERAJACIPTA')
  return (
    <div style={{
      background: C.black,
      borderBottom: '3px solid #8B1A1A',
      overflow: 'hidden',
      padding: '12px 0',
      position: 'relative',
      zIndex: 10,
      marginTop: 0,
    }}>
      <style>{`
        @font-face {
          font-family: 'CSSalient';
          src: url('/fonts/CSSalient-Regular.ttf') format('truetype');
        }
        @keyframes marqueeBounce {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
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

function About() {
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const kiri  = { rotate: '-7deg', tx: '-12%', w: 'clamp(350px, 45vw, 640px)', left: -120, top: '-22%' }
  const kanan = { rotate: '-5deg', tx: '12%',  w: 'clamp(300px, 40vw, 640px)', right: -50, bottom: '-10%' }

  const enterTransition = 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.9s ease'
  const exitTransition  = 'transform 1.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.6s ease'

  return (
    <section
      id="about"
      style={{ background: C.crimson, position: 'relative', overflow: 'hidden', padding: '5rem 2rem 5rem', minHeight: 520 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', pointerEvents: 'none' }} />
      <div style={{
        position: 'absolute', width: kiri.w, aspectRatio: '509.1 / 678.8',
        left: kiri.left, top: kiri.top,
        backgroundImage: "url('/images/CATUR KIRI.svg')",
        backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
        pointerEvents: 'none', zIndex: 0,
        transition: mounted ? (hovered ? enterTransition : exitTransition) : 'none',
        transform: hovered ? `rotate(${kiri.rotate}) translateX(${kiri.tx})` : `rotate(${kiri.rotate}) translateX(-120%)`,
        opacity: hovered ? 1 : 0,
      }} />
      <div style={{
        position: 'absolute', width: kanan.w, aspectRatio: '509.1 / 678.8',
        right: kanan.right, bottom: kanan.bottom,
        backgroundImage: "url('/images/CATUR KANAN.svg')",
        backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
        pointerEvents: 'none', zIndex: 0,
        transition: mounted ? (hovered ? enterTransition : exitTransition) : 'none',
        transform: hovered ? `rotate(${kanan.rotate}) translateX(${kanan.tx})` : `rotate(${kanan.rotate}) translateX(120%)`,
        opacity: hovered ? 1 : 0,
      }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: '100%', maxWidth: 700, margin: '0.25rem auto 0', backgroundImage: "url('/images/VECTOR.png')", backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'contain', aspectRatio: '3240 / 1440' }} />
        <div style={{ marginTop: '0.5rem' }}>
          <h3 style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(16px, 2.2vw, 24px)', color: C.gold, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase', margin: '0 0 1.5rem' }}>Merajarela & Menciptakan</h3>
          <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(14px, 1.4vw, 17px)', lineHeight: 1.85, color: C.cream, opacity: 0.92, maxWidth: 580, margin: '0 auto' }}>
            Banyak insan muda kreatif punya ketakutan untuk bersaing dengan ribuan desainer
            di luar sana. Mereka ragu dan merasa insecure dalam berkarya. Dengan tema
            "MERAJACIPTA" Bharatika Creative Design Festival 2026 diharapkan dapat
            menjadi dorongan bagi insan muda untuk tetap berkarya "merajalela" dalam
            ketakutan mereka.
          </p>
        </div>
      </div>
    </section>
  )
}

function RegisterEvents() {
  const events = [
    { title: 'Creative Talk', desc: 'Talkshow bersama pakar-pakar industri kreatif.' },
    { title: 'Workshop Design', desc: 'Workshop intensif dengan desainer profesional.' },
    { title: 'Exhibition', desc: 'Pameran karya terbaik peserta Bharatika 2026.' },
    { title: 'Competition', desc: 'Lomba untuk para insan kreatif dari berbagai kalangan.' },
    { title: 'Networking', desc: 'Sesi networking bersama industri kreatif.' },
  ]

  return (
    <section id="events" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>

      {/* LEFT */}
      <div style={{ background: C.parchment, minHeight: 560, display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundImage: "radial-gradient(circle, rgba(160,140,60,0.18) 1px, transparent 1px)", backgroundSize: "14px 14px" }}>
        <div style={{ padding: "2rem 2.5rem 0", textAlign: "center" }}>
          <p style={{ fontFamily: "'Nord', sans-serif", fontSize: 12, letterSpacing: 5, color: C.crimson, textTransform: "uppercase", margin: "0", fontWeight: 700 }}>Register</p>
          <h2 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: "clamp(64px, 9vw, 100px)", color: C.crimson, margin: 0, lineHeight: 0.9, position: "relative", zIndex: 2, marginBottom: "-5rem" }}>Now!</h2>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, position: "relative", zIndex: 1 }}>
          <XBox style={{ width: "clamp(200px, 80%, 433.8px)", aspectRatio: "433.8 / 418.16" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 2.5rem", marginTop: "0.75rem" }}>
          <span style={{ fontFamily: "'Nord', sans-serif", fontSize: 12, color: C.crimson, fontWeight: 700, letterSpacing: 2, whiteSpace: "nowrap" }}>00 JAN</span>
          <div style={{ flex: 1, height: 1.5, background: C.crimson, opacity: 0.6 }} />
          <span style={{ fontFamily: "'Nord', sans-serif", fontSize: 12, color: C.crimson, fontWeight: 700, letterSpacing: 2, whiteSpace: "nowrap" }}>00 FEB</span>
        </div>
        <div style={{ padding: "1rem 2.5rem 2rem", textAlign: "center" }}>
          <TLink href="/register" style={{ display: "inline-block", padding: "14px 48px", background: C.crimson, color: C.cream, fontFamily: "'Nord', sans-serif", fontSize: 11, letterSpacing: 4, textDecoration: "none", textTransform: "uppercase", borderRadius: 50, transition: "opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >See More</TLink>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ background: "#1E1A14", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 560, backgroundImage: "radial-gradient(circle, rgba(80,60,20,0.15) 1px, transparent 1px)", backgroundSize: "14px 14px" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "3rem 1rem 3rem 2.5rem", gap: "1rem" }}>
          <div>
            <h2 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: "clamp(52px, 7vw, 88px)", color: C.gold, margin: 0, lineHeight: 0.9 }}>Our</h2>
            <p style={{ fontFamily: "'Nord', sans-serif", fontSize: "clamp(14px, 2vw, 20px)", color: C.gold, margin: "0.2rem 0 0", letterSpacing: 4, fontWeight: 700, textTransform: "uppercase" }}>Events</p>
          </div>
          <div>
            <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 14, color: C.cream, opacity: 0.75, margin: "0 0 0.4rem", lineHeight: 1.4 }}>At Petra Christian University, Surabaya</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontFamily: "'Nord', sans-serif", fontSize: 13, color: C.cream, fontWeight: 700 }}>03</span>
              <div style={{ flex: 1, height: 1.5, background: C.cream, opacity: 0.35 }} />
              <span style={{ fontFamily: "'Nord', sans-serif", fontSize: 13, color: C.cream, fontWeight: 700 }}>06 JUN</span>
            </div>
          </div>
          <TLink href="/competitions" style={{ display: "inline-block", padding: "12px 24px", background: C.parchment, color: C.dark, fontFamily: "'Nord', sans-serif", fontSize: 10, letterSpacing: 3, textDecoration: "none", textTransform: "uppercase", borderRadius: 50, transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.gold}
            onMouseLeave={e => e.currentTarget.style.background = C.parchment}
          >See More</TLink>
        </div>
        <div style={{ overflow: "hidden", position: "relative", padding: "1.5rem 1rem 1.5rem 0.5rem", height: "560px" }}>
          <style>{`
            @keyframes eventsScrollUpDown {
              0%   { transform: translateY(0); }
              50%  { transform: translateY(-50%); }
              100% { transform: translateY(0); }
            }
          `}</style>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", animation: "eventsScrollUpDown 12s ease-in-out infinite" }}>
            {[...events, ...events].map((ev, i) => (
              <div key={i} style={{ flexShrink: 0 }}>
                <XBox style={{ width: "100%", aspectRatio: "16/9", marginBottom: "0.25rem" }} />
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: C.cream, fontWeight: 600, margin: "0 0 0.1rem", letterSpacing: 1, textTransform: "uppercase" }}>{ev.title}</p>
                <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 12, color: C.cream, lineHeight: 1.4, opacity: 0.7, margin: 0 }}>{ev.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function RedDivider() { return <div style={{ height: 14, background: C.crimson }} /> }

function MarqueeTicker2() {
  const words = Array(12).fill('MERAJACIPTA')
  return (
    <div style={{
      background: C.crimson,
      overflow: 'hidden',
      padding: '12px 0',
      position: 'relative',
      zIndex: 10,
    }}>
      <style>{`
        @keyframes marqueeBounce2 {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marqueeBounce2 10s ease-in-out infinite' }}>
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

function Merch() {
  return (
    <section id="merch" style={{ background: C.parchment, position: "relative", overflow: "hidden", padding: "5rem 0 5rem", backgroundImage: "radial-gradient(circle, rgba(160,140,60,0.18) 1px, transparent 1px)", backgroundSize: "14px 14px" }}>
      <p style={{ fontFamily: "'Nord', sans-serif", fontSize: "clamp(13px, 1.5vw, 18px)", letterSpacing: 6, color: C.crimson, textTransform: "uppercase", textAlign: "center", margin: "0 0 4rem", fontWeight: 700 }}>Take a look at our Merch</p>
      <div style={{ position: "relative", textAlign: "center", margin: "0 0 5rem" }}>
        <h2 style={{
          fontFamily: "'CSSalient', sans-serif",
          fontSize: "clamp(140px, 28vw, 340px)",
          margin: 0,
          lineHeight: 0.85,
          color: "transparent",
          WebkitTextStroke: "2px " + C.dark,
          userSelect: "none",
          letterSpacing: 8,
          whiteSpace: "nowrap",
        }}>MERCH</h2>
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(220px, 28vw, 380px)",
          zIndex: 2,
        }}>
          <img src="/images/BHAJUKITA.svg" alt="Bhajukita" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <a href="#" style={{ display: "inline-block", padding: "14px 52px", background: C.crimson, color: C.cream, fontFamily: "'Nord', sans-serif", fontSize: 12, letterSpacing: 4, textDecoration: "none", textTransform: "uppercase", borderRadius: 50, transition: "opacity 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >Here</a>
      </div>
    </section>
  )
}

function Partners() {
  return (
    <section id="partners" style={{ background: C.cream, padding: '4rem 2rem 5rem', borderTop: '1px solid rgba(139,26,26,0.12)' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 5, color: C.crimson, textTransform: 'uppercase', margin: '0 0 0.15rem' }}>Our</p>
        <h2 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 'clamp(64px, 14vw, 120px)', color: C.crimson, margin: 0, lineHeight: 0.9 }}>Partners</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: 540, margin: '0 auto' }}>
        {Array(6).fill(null).map((_, i) => <XBox key={i} style={{ aspectRatio: '1' }} />)}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: C.dark, padding: '2.5rem 2rem 1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 28, color: C.cream, margin: '0 0 2px', fontWeight: 400 }}>bharatika</p>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, color: C.cream, opacity: 0.45, margin: 0, textTransform: 'uppercase' }}>Creative Design Festival</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {[
            <svg key="ig" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill={C.cream} stroke="none"/></svg>,
            <svg key="tt" width="18" height="18" viewBox="0 0 24 24" fill={C.cream}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 12.67 0V8.69a8.18 8.18 0 0 0 4.78 1.54V6.79a4.85 4.85 0 0 1-1.01-.1z"/></svg>,
            <svg key="yt" width="18" height="18" viewBox="0 0 24 24" fill={C.cream}><path d="M23 7s-.3-2-1.2-2.7C20.7 3.1 19.4 3 19.4 3S15.7 2.7 12 2.7s-7.4.3-7.4.3-1.3.1-2.4 1.3C1.3 5 1 7 1 7S.7 9.2.7 11.3v2c0 2.2.3 4.3.3 4.3s.3 2 1.2 2.7c1.1 1.1 2.6 1.1 3.3 1.2C7.3 21.7 12 21.7 12 21.7s3.7 0 6.2-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.7 1.2-2.7s.3-2.1.3-4.3v-2C23.3 9.2 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/></svg>,
            <svg key="fb" width="18" height="18" viewBox="0 0 24 24" fill={C.cream}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
          ].map((icon, i) => (
            <a key={i} href="#" style={{ width: 34, height: 34, border: '1px solid rgba(232,217,160,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'border-color 0.2s, background 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,217,160,0.6)'; e.currentTarget.style.background = 'rgba(232,217,160,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,217,160,0.25)'; e.currentTarget.style.background = 'transparent' }}
            >{icon}</a>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(232,217,160,0.1)', paddingTop: '1.25rem', textAlign: 'right' }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.cream, opacity: 0.3, letterSpacing: 0.5, margin: 0 }}>© Bharatika Creative Design Festival 2026. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default function Home({ competitions = [] }) {
  useFonts()
  return (
    <div style={{ background: C.black, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeLink="home" />
      <Hero />
      <MarqueeTicker />
      <About /><RegisterEvents /><MarqueeTicker2 /><RedDivider /><Merch /><Partners /><Footer />
    </div>
  )
}