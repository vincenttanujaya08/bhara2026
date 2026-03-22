import { useState, useEffect } from 'react'
import { navigateWithTransition } from '../hooks/usePageTransition'
import MainLayout from '../Layouts/MainLayout'

const C = {
  gold: '#C8A84B', cream: '#E8D9A0', parchment: '#D4C48A',
  crimson: '#8B1A1A', dark: '#1A1410', charcoal: '#2A2420', black: '#0F0A05',
}

function TLink({ href, children, style: s, onMouseEnter, onMouseLeave, onClick }) {
  const handle = (e) => { e.preventDefault(); onClick?.(e); navigateWithTransition(href) }
  return <a href={href} onClick={handle} style={{ cursor: 'pointer', ...s }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>{children}</a>
}

// ...existing code...

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
      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '12rem', marginTop: '4rem' }}>
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

function About() {
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t) }, [])
  const kiri  = { rotate: '-7deg', tx: '-12%', w: 'clamp(350px, 45vw, 640px)', left: -120, top: '-22%' }
  const kanan = { rotate: '-5deg', tx: '12%',  w: 'clamp(300px, 40vw, 640px)', right: -50, bottom: '-10%' }
  const enterTransition = 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.9s ease'
  const exitTransition  = 'transform 1.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.6s ease'
  return (
    <section id="about" style={{ background: C.crimson, position: 'relative', overflow: 'hidden', padding: '5rem 2rem 5rem', minHeight: 520 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: kiri.w, aspectRatio: '509.1 / 678.8', left: kiri.left, top: kiri.top, backgroundImage: "url('/images/CATUR KIRI.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', pointerEvents: 'none', zIndex: 0, transition: mounted ? (hovered ? enterTransition : exitTransition) : 'none', transform: hovered ? `rotate(${kiri.rotate}) translateX(${kiri.tx})` : `rotate(${kiri.rotate}) translateX(-120%)`, opacity: hovered ? 1 : 0 }} />
      <div style={{ position: 'absolute', width: kanan.w, aspectRatio: '509.1 / 678.8', right: kanan.right, bottom: kanan.bottom, backgroundImage: "url('/images/CATUR KANAN.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', pointerEvents: 'none', zIndex: 0, transition: mounted ? (hovered ? enterTransition : exitTransition) : 'none', transform: hovered ? `rotate(${kanan.rotate}) translateX(${kanan.tx})` : `rotate(${kanan.rotate}) translateX(120%)`, opacity: hovered ? 1 : 0 }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: '100%', maxWidth: 700, margin: '0.25rem auto 0', backgroundImage: "url('/images/VECTOR.png')", backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'contain', aspectRatio: '3240 / 1440' }} />
        <div style={{ marginTop: '0.5rem' }}>
          <h3 style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(16px, 2.2vw, 24px)', color: C.gold, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase', margin: '0 0 1.5rem' }}>Merajarela & Menciptakan</h3>
          <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(14px, 1.4vw, 17px)', lineHeight: 1.85, color: C.cream, opacity: 0.92, maxWidth: 580, margin: '0 auto' }}>
            Banyak insan muda kreatif punya ketakutan untuk bersaing dengan ribuan desainer di luar sana. Mereka ragu dan merasa insecure dalam berkarya. Dengan tema "MERAJACIPTA" Bharatika Creative Design Festival 2026 diharapkan dapat menjadi dorongan bagi insan muda untuk tetap berkarya "merajalela" dalam ketakutan mereka.
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
            @keyframes eventsScrollUpDown { 0% { transform: translateY(0); } 50% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
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
    <div style={{ background: C.crimson, overflow: 'hidden', padding: '12px 0', position: 'relative', zIndex: 10 }}>
      <style>{`@keyframes marqueeBounce2 { 0% { transform: translateX(0); } 50% { transform: translateX(-50%); } 100% { transform: translateX(0); } }`}</style>
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
  const [btnHover, setBtnHover] = useState(false)
  return (
    <section id="merch" style={{ background: C.parchment, position: "relative", overflow: "hidden", padding: "5rem 0 5rem", backgroundImage: "radial-gradient(circle, rgba(160,140,60,0.18) 1px, transparent 1px)", backgroundSize: "14px 14px" }}>
      <p style={{ fontFamily: "'Nord', sans-serif", fontSize: "clamp(13px, 1.5vw, 18px)", letterSpacing: 6, color: C.crimson, textTransform: "uppercase", textAlign: "center", margin: "0 0 4rem", fontWeight: 700 }}>Take a look at our Merch</p>
      <div style={{ position: "relative", textAlign: "center", margin: "0 0 5rem" }}>
        <h2 style={{ fontFamily: "'CSSalient', sans-serif", fontSize: "clamp(140px, 28vw, 340px)", margin: 0, lineHeight: 0.85, color: "transparent", WebkitTextStroke: "2px " + C.dark, userSelect: "none", letterSpacing: 8, whiteSpace: "nowrap" }}>MERCH</h2>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "clamp(220px, 28vw, 380px)", zIndex: 2 }}>
          <img src="/images/BHAJUKITA.svg" alt="Bhajukita" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <a
          href="#"
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            display: "inline-block", padding: "14px 52px",
            background: btnHover ? 'transparent' : C.crimson,
            color: btnHover ? C.crimson : C.cream,
            border: `1.5px solid ${C.crimson}`,
            fontFamily: "'Nord', sans-serif", fontSize: 12, letterSpacing: 4,
            textDecoration: "none", textTransform: "uppercase",
            borderRadius: 50, transition: "all 0.3s", cursor: 'pointer',
          }}
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

// ...existing code...

export default function Home({ competitions = [] }) {
  useFonts()
  return (
    <MainLayout>
      <Hero />
      <MarqueeTicker />
      <About />
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <RegisterEvents />
          <MarqueeTicker2 />
          <RedDivider />
          <Merch />
          <Partners />
        </div>
        <img
          src="/images/BITMAP.svg"
          alt=""
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top left',
            opacity: 0.15, pointerEvents: 'none', zIndex: 2,
          }}
        />
      </div>
    </MainLayout>
  )
}