// resources/js/pages/Home.jsx
  import { useState, useEffect } from 'react'
  import { navigateWithTransition } from '../hooks/usePageTransition'
  import MainLayout from '../Layouts/MainLayout'

  const C = {
    gold: '#C8A84B', cream: '#E8D9A0', parchment: '#D4C48A',
    crimson: '#8B1A1A', dark: '#1A1410', charcoal: '#2A2420', black: '#0F0A05',
  }

  // ─── Breakpoint hook ──────────────────────────────────────────────────────────
  function useBreakpoint() {
    const [bp, setBp] = useState(() => {
      if (typeof window === 'undefined') return 'desktop'
      const w = window.innerWidth
      if (w < 640)  return 'mobile'
      if (w < 1024) return 'tablet'
      return 'desktop'
    })
    useEffect(() => {
      const handler = () => {
        const w = window.innerWidth
        if (w < 640)  setBp('mobile')
        else if (w < 1024) setBp('tablet')
        else setBp('desktop')
      }
      window.addEventListener('resize', handler)
      return () => window.removeEventListener('resize', handler)
    }, [])
    return bp
  }

  function TLink({ href, children, style: s, className, onMouseEnter, onMouseLeave, onClick }) {
    const handle = (e) => { e.preventDefault(); onClick?.(e); navigateWithTransition(href) }
    return (
      <a
        href={href}
        onClick={handle}
        className={className}
        style={{ cursor: 'pointer', ...s }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </a>
    )
  }

  function useFonts() {
    useEffect(() => {
      if (!document.getElementById('cssalient-font')) {
        const style = document.createElement('style')
        style.id = 'cssalient-font'
        style.textContent = `
          @font-face { font-family: 'CSSalient'; src: url('/fonts/CSSalient-Regular.ttf') format('truetype'); }
          @font-face { font-family: 'Nord'; src: url('/fonts/NORD-Bold.ttf') format('truetype'); font-weight: bold; }
          @font-face { font-family: 'FamiljenGrotesk'; src: url('/fonts/FamiljenGrotesk-Variable.ttf') format('truetype'); font-weight: 100 900; }
        `
        document.head.appendChild(style)
      }
      if (document.getElementById('bh-fonts')) return
      const l = document.createElement('link')
      l.id = 'bh-fonts'; l.rel = 'stylesheet'
      l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
      document.head.appendChild(l)
      document.body.style.margin = '0'
      document.body.style.padding = '0'
      document.body.style.overflowX = 'hidden'
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

  // ─── Hero ─────────────────────────────────────────────────────────────────────
  // ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ 
      position: 'relative', 
      width: '100%', 
      // Gunakan lvh (Large Viewport) untuk desktop agar tetap megah
      minHeight: 'clamp(300px, 100lvh, 900px)', 
      overflow: 'hidden' 
    }}>
      <style>{`
        .hero-btn {
          display: inline-block;
          padding: clamp(10px, 1.5vw, 14px) clamp(24px, 4.5vw, 40px);
          border: 1.5px solid transparent;
          color: ${C.crimson} !important;
          font-family: 'Cinzel', serif;
          font-size: clamp(9px, 1.1vw, 11px);
          letter-spacing: 3px;
          text-decoration: none;
          text-transform: uppercase;
          background: ${C.cream};
          transition: all 0.3s;
          border-radius: 50px;
          font-weight: 700;
          white-space: nowrap;
        }

        .hero-content {
          position: relative; 
          z-index: 2; 
          /* Gunakan lvh untuk desktop */
          min-height: 100lvh; 
          display: flex; 
          align-items: flex-end; 
          justify-content: center; 
          padding-bottom: clamp(3rem, 8vw, 10rem);
        }

        @media (max-width: 640px) {
          .hero-content {
            /* svh (Small Viewport Height) membantu mengatasi address bar Android */
            min-height: 280px; 
            /* Beri sedikit ruang lebih di bawah agar tombol tidak mepet navigasi HP */
            padding-bottom: 2.2rem;
          }
          
          /* Target khusus section agar tidak tertahan oleh parent 100vh */
          section:has(> .hero-content) {
            min-height: 280px !important;
            height: 280px !important;
          }
        }

        /* Perbaikan khusus untuk browser yang tidak support 'has' atau bug height */
        @media screen and (max-device-width: 480px) and (orientation: portrait) {
          .hero-content {
            min-height: 260px;
          }
        }
      `}</style>

      <video autoPlay loop muted playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', zIndex: 0 }}>
        <source src="/videos/Motion Background bhara26 FIXX.mp4" type="video/mp4" />
      </video>

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,10,5,0.2) 0%, rgba(15,10,5,0.05) 50%, rgba(15,10,5,0.5) 100%)', zIndex: 1 }} />

      <div className="hero-content">
        <TLink href="/about" className="hero-btn">Learn More</TLink>
      </div>
    </section>
  )
}

  // ─── Marquee ──────────────────────────────────────────────────────────────────
  function MarqueeTicker({ bg = C.black, borderColor = '#8B1A1A', textColor = C.cream, animName = 'marqueeBounce' }) {
    const words = Array(12).fill('MERAJACIPTA')
    return (
      <div style={{ background: bg, borderBottom: `3px solid ${borderColor}`, overflow: 'hidden', padding: '10px 0', position: 'relative', zIndex: 10 }}>
        <style>{`@keyframes ${animName} { 0% { transform: translateX(0); } 50% { transform: translateX(-50%); } 100% { transform: translateX(0); } }`}</style>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: `${animName} 10s ease-in-out infinite` }}>
          {Array(2).fill(null).map((_, gi) => (
            <div key={gi} style={{ display: 'flex', flexShrink: 0 }}>
              {words.map((word, i) => (
                <span key={i} style={{ fontFamily: "'CSSalient', sans-serif", fontSize: 'clamp(24px, 4.5vw, 46px)', color: textColor, paddingRight: 'clamp(2rem, 4vw, 6rem)', lineHeight: 1 }}>
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ─── About ────────────────────────────────────────────────────────────────────
  function About() {
    const [hovered, setHovered] = useState(false)
    const [mounted, setMounted] = useState(false)
    useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t) }, [])
    const kiri  = { rotate: '-7deg', tx: '-12%', w: 'clamp(160px, 30vw, 640px)', left: -60, top: '-22%' }
    const kanan = { rotate: '-5deg', tx: '12%',  w: 'clamp(140px, 26vw, 640px)', right: -20, bottom: '-10%' }
    const enterTransition = 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.9s ease'
    const exitTransition  = 'transform 1.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.6s ease'
    return (
      <section id="about"
        style={{ background: C.crimson, position: 'relative', overflow: 'hidden', padding: 'clamp(2.5rem, 5vw, 5rem) clamp(1rem, 4vw, 2rem)', minHeight: 420 }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: kiri.w, aspectRatio: '509.1 / 678.8', left: kiri.left, top: kiri.top, backgroundImage: "url('/images/CATUR KIRI.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', pointerEvents: 'none', zIndex: 0, transition: mounted ? (hovered ? enterTransition : exitTransition) : 'none', transform: hovered ? `rotate(${kiri.rotate}) translateX(${kiri.tx})` : `rotate(${kiri.rotate}) translateX(-120%)`, opacity: hovered ? 1 : 0 }} />
        <div style={{ position: 'absolute', width: kanan.w, aspectRatio: '509.1 / 678.8', right: kanan.right, bottom: kanan.bottom, backgroundImage: "url('/images/CATUR KANAN.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', pointerEvents: 'none', zIndex: 0, transition: mounted ? (hovered ? enterTransition : exitTransition) : 'none', transform: hovered ? `rotate(${kanan.rotate}) translateX(${kanan.tx})` : `rotate(${kanan.rotate}) translateX(120%)`, opacity: hovered ? 1 : 0 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: '100%', maxWidth: 700, margin: '0.25rem auto 0', backgroundImage: "url('/images/VECTOR.png')", backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'contain', aspectRatio: '3240 / 1440' }} />
          <div style={{ marginTop: '0.5rem' }}>
            <h3 style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(12px, 1.6vw, 24px)', color: C.gold, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase', margin: '0 0 1.25rem' }}>
              Merajarela &amp; Menciptakan
            </h3>
            <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(13px, 1.3vw, 17px)', lineHeight: 1.85, color: C.cream, opacity: 0.92, maxWidth: 580, margin: '0 auto' }}>
              Banyak insan muda kreatif punya ketakutan untuk bersaing dengan ribuan desainer di luar sana. Mereka ragu dan merasa insecure dalam berkarya. Dengan tema "MERAJACIPTA" Bharatika Creative Design Festival 2026 diharapkan dapat menjadi dorongan bagi insan muda untuk tetap berkarya "merajalela" dalam ketakutan mereka.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // ─── Events list (updated) ────────────────────────────────────────────────────
  const EVENTS = [
    {
      title: 'Creative Talk',
      desc: 'Talkshow bersama pakar-pakar industri kreatif.',
      img: '/images/events/ct 1.svg',
    },
    {
      title: 'Competition',
      desc: 'Lomba untuk para insan kreatif dari berbagai kalangan.',
      img: '/images/events/comp 1.svg',
    },
    {
      title: 'Creative Market',
      desc: 'Meet the Judges Agni, Tirta, Bayu & Awarding Night.',
      img: '/images/events/cm 1.svg',
    },
    {
      title: 'Exhibition',
      desc: 'Pameran karya terbaik peserta Bharatika 2026.',
      img: '/images/events/exhib 1.svg',
    },
  ]

  // ─── Register & Events ────────────────────────────────────────────────────────
  function RegisterEvents() {
    const bp = useBreakpoint()
    const isMobile = bp === 'mobile'
    const isTablet = bp === 'tablet'

    return (
      <section id="events">
        <style>{`
          /* ── Grid outer ── */
          .re-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          @media (max-width: 900px) {
            .re-grid { grid-template-columns: 1fr; }
          }

          /* ── Left panel ── */
          .re-left {
            background: ${C.parchment};
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-image: radial-gradient(circle, rgba(160,140,60,0.18) 1px, transparent 1px);
            background-size: 14px 14px;
            min-height: clamp(420px, 56vw, 560px);
          }
          @media (max-width: 900px) {
            .re-left { min-height: auto; }
          }

          /* ── Right panel ── */
          .re-right {
            background: #1E1A14;
            display: grid;
            grid-template-columns: 1fr 1fr;
            background-image: radial-gradient(circle, rgba(80,60,20,0.15) 1px, transparent 1px);
            background-size: 14px 14px;
            min-height: clamp(420px, 56vw, 560px);
          }
          @media (max-width: 900px) {
            .re-right { min-height: auto; }
          }
          @media (max-width: 640px) {
            .re-right { align-items: center;
    text-align: center;
    padding: 1.5rem 1.5rem 1rem; }
          }

          /* ── Events scroll column ── */
          .re-right-events {
            overflow: hidden;
            position: relative;
            padding: 1.25rem 1rem 1.25rem 0.5rem;
            height: clamp(300px, 42vw, 560px);
          }
          @media (max-width: 900px) {
            .re-right-events { height: clamp(240px, 50vw, 380px); }
          }
          @media (max-width: 640px) {
            .re-right-events {
              height: 280px;
              padding: 1rem;
              border-top: 1px solid rgba(232,217,160,0.12);
            }
          }

          @keyframes eventsScrollUpDown {
            0%   { transform: translateY(0); }
            50%  { transform: translateY(-50%); }
            100% { transform: translateY(0); }
          }

          /* ── Right info column ── */
          .re-right-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: clamp(1.5rem, 3vw, 3rem) 1rem clamp(1.5rem, 3vw, 3rem) clamp(1.25rem, 3vw, 2.5rem);
            gap: clamp(0.75rem, 2vw, 1rem);
          }

          /* ── Left inner layout ── */
          .re-left-title-wrap {
            padding: clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 3vw, 2.5rem) 0;
            text-align: center;
          }
          .re-left-btn-wrap {
            padding: clamp(0.75rem,2vw,1rem) clamp(1.25rem, 3vw, 2.5rem) clamp(1.25rem, 3vw, 2rem);
            text-align: center;
          }
        `}</style>

        <div className="re-grid">

          {/* ── LEFT: Register ── */}
          <div className="re-left">
            <div className="re-left-title-wrap">
              <p style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(10px, 1.3vw, 12px)', letterSpacing: 5, color: C.crimson, textTransform: 'uppercase', margin: '0', fontWeight: 700 }}>Register</p>
              <h2 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 'clamp(48px, 9vw, 100px)', color: C.crimson, margin: 0, lineHeight: 0.9, position: 'relative', zIndex: 2, marginBottom: isMobile ? '-1.5rem' : '-3rem' }}>Now!</h2>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, position: 'relative', zIndex: 1, padding: '1rem' }}>
              <XBox style={{ width: isMobile ? '70%' : 'clamp(140px, 65%, 433px)', aspectRatio: '433.8 / 418.16' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: `0 clamp(1.25rem, 3vw, 2.5rem)`, marginTop: '0.75rem' }}>
              <span style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(9px, 1.3vw, 12px)', color: C.crimson, fontWeight: 700, letterSpacing: 2, whiteSpace: 'nowrap' }}>00 JAN</span>
              <div style={{ flex: 1, height: 1.5, background: C.crimson, opacity: 0.6 }} />
              <span style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(9px, 1.3vw, 12px)', color: C.crimson, fontWeight: 700, letterSpacing: 2, whiteSpace: 'nowrap' }}>00 FEB</span>
            </div>

            <div className="re-left-btn-wrap">
              <TLink href="/register"
                style={{ display: 'inline-block', padding: 'clamp(10px, 1.3vw, 14px) clamp(24px, 4vw, 48px)', background: C.crimson, color: C.cream, fontFamily: "'Nord', sans-serif", fontSize: 'clamp(9px, 1.1vw, 11px)', letterSpacing: 4, textDecoration: 'none', textTransform: 'uppercase', borderRadius: 50, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >See More</TLink>
            </div>
          </div>

          {/* ── RIGHT: Our Events ── */}
          <div className="re-right">

            {/* Info column */}
            <div className="re-right-info">
              <div>
                <h2 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 'clamp(38px, 6vw, 88px)', color: C.gold, margin: 0, lineHeight: 0.9 }}>Our</h2>
                <p style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(11px, 1.6vw, 20px)', color: C.gold, margin: '0.2rem 0 0', letterSpacing: 4, fontWeight: 700, textTransform: 'uppercase' }}>Events</p>
              </div>

              <div>
                <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(11px, 1.3vw, 14px)', color: C.cream, opacity: 0.75, margin: '0 0 0.4rem', lineHeight: 1.4 }}>
                  At Petra Christian University, Surabaya
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(10px, 1.2vw, 13px)', color: C.cream, fontWeight: 700 }}>03</span>
                  <div style={{ flex: 1, height: 1.5, background: C.cream, opacity: 0.35 }} />
                  <span style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(10px, 1.2vw, 13px)', color: C.cream, fontWeight: 700 }}>06 JUN</span>
                </div>
              </div>

              <TLink href="/competitions"
                style={{ display: 'inline-block', padding: 'clamp(9px, 1.1vw, 12px) clamp(14px, 1.8vw, 24px)', background: C.parchment, color: C.dark, fontFamily: "'Nord', sans-serif", fontSize: 'clamp(8px, 0.9vw, 10px)', letterSpacing: 3, textDecoration: 'none', textTransform: 'uppercase', borderRadius: 50, transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => e.currentTarget.style.background = C.gold}
                onMouseLeave={e => e.currentTarget.style.background = C.parchment}
              >See More</TLink>
            </div>

            {/* Events scroll column */}
            <div className="re-right-events">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'eventsScrollUpDown 14s ease-in-out infinite' }}>
                {[...EVENTS, ...EVENTS].map((ev, i) => (
                  <div key={i} style={{ flexShrink: 0 }}>

                    {/* Event image */}
                    <div style={{
                      width: '100%', aspectRatio: '16/9', marginBottom: '0.6rem',
                      background: 'rgba(232,217,160,0.06)',
                      borderRadius: 4, overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <img
                        src={ev.img}
                        alt={ev.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    </div>

                    {/* ── Event name — large Nord bold, matching reference ── */}
                    <p style={{
                      fontFamily: "'Nord', sans-serif",
                      fontSize: 'clamp(18px, 2.8vw, 52px)',
                      color: C.cream,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 'clamp(1px, 0.2vw, 3px)',
                      lineHeight: 1.05,
                      margin: '0 0 0.25rem',
                    }}>
                      {ev.title}
                    </p>

                    {/* ── Description — FamiljenGrotesk, readable size ── */}
                    <p style={{
                      fontFamily: "'FamiljenGrotesk', sans-serif",
                      fontSize: 'clamp(12px, 1.25vw, 16px)',
                      color: C.cream,
                      lineHeight: 1.55,
                      opacity: 0.70,
                      margin: 0,
                    }}>
                      {ev.desc}
                    </p>

                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    )
  }

  // ─── Red divider ──────────────────────────────────────────────────────────────
  function RedDivider() {
    return <div style={{ height: 14, background: C.crimson }} />
  }

  // ─── Merch ────────────────────────────────────────────────────────────────────
  function Merch() {
    const [btnHover, setBtnHover] = useState(false)
    return (
      <section id="merch" style={{
        background: C.parchment, position: 'relative', overflow: 'hidden',
        padding: 'clamp(2.5rem, 5vw, 5rem) 0',
        backgroundImage: 'radial-gradient(circle, rgba(160,140,60,0.18) 1px, transparent 1px)',
        backgroundSize: '14px 14px',
      }}>
        <p style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(11px, 1.3vw, 18px)', letterSpacing: 6, color: C.crimson, textTransform: 'uppercase', textAlign: 'center', margin: '0 0 2.5rem', fontWeight: 700 }}>
          Take a look at our Merch
        </p>
        <div style={{ position: 'relative', textAlign: 'center', margin: 'clamp(3rem, 6vw, 5rem) 0 clamp(4rem, 8vw, 8rem)' }}>
          <h2 style={{ fontFamily: "'CSSalient', sans-serif", fontSize: 'clamp(60px, 20vw, 340px)', margin: 0, lineHeight: 0.85, color: 'transparent', WebkitTextStroke: '2px ' + C.dark, userSelect: 'none', letterSpacing: 8, whiteSpace: 'nowrap' }}>MERCH</h2>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'clamp(120px, 22vw, 380px)', zIndex: 2 }}>
            <img src="/images/BHAJUKITA.svg" alt="Bhajukita" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <a href="#"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{ display: 'inline-block', padding: 'clamp(10px, 1.3vw, 14px) clamp(28px, 5vw, 52px)', background: btnHover ? 'transparent' : C.crimson, color: btnHover ? C.crimson : C.cream, border: `1.5px solid ${C.crimson}`, fontFamily: "'Nord', sans-serif", fontSize: 'clamp(9px, 1.1vw, 12px)', letterSpacing: 4, textDecoration: 'none', textTransform: 'uppercase', borderRadius: 50, transition: 'all 0.3s', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >Here</a>
        </div>
      </section>
    )
  }

  // ─── Partners ─────────────────────────────────────────────────────────────────
  function Partners() {
    return (
      <section id="partners" style={{ background: C.cream, padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem) clamp(3rem, 6vw, 5rem)', borderTop: '1px solid rgba(139,26,26,0.12)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vw, 3rem)' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 10px)', letterSpacing: 5, color: C.crimson, textTransform: 'uppercase', margin: '0 0 0.15rem' }}>Our</p>
          <h2 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 'clamp(48px, 11vw, 120px)', color: C.crimson, margin: 0, lineHeight: 0.9 }}>Partners</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(100px, 20vw, 140px), 1fr))', gap: 'clamp(0.5rem, 1.5vw, 1rem)', maxWidth: 540, margin: '0 auto' }}>
          {Array(6).fill(null).map((_, i) => <XBox key={i} style={{ aspectRatio: '1' }} />)}
        </div>
      </section>
    )
  }

  // ─── Page ─────────────────────────────────────────────────────────────────────
  export default function Home({ competitions = [] }) {
    useFonts()
    return (
      <MainLayout>
        <Hero />
        <MarqueeTicker bg={C.black} borderColor="#8B1A1A" textColor={C.cream} animName="marqueeBounce1" />
        <About />
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <RegisterEvents />
            <MarqueeTicker bg={C.crimson} borderColor={C.crimson} textColor={C.cream} animName="marqueeBounce2" />
            <RedDivider />
            <Merch />
            <Partners />
          </div>
          <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', opacity: 0.15, pointerEvents: 'none', zIndex: 2 }} />
        </div>
      </MainLayout>
    )
  }