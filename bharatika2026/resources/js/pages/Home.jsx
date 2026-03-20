import { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'

const C = {
  gold: '#C8A84B',
  cream: '#E8D9A0',
  parchment: '#D4C48A',
  crimson: '#8B1A1A',
  dark: '#1A1410',
  charcoal: '#2A2420',
  black: '#0F0A05',
}

/* ─── Fonts loader ─── */
function useFonts() {
  useEffect(() => {
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
    document.head.appendChild(l)
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.overflowX = 'hidden'
  }, [])
}

/* ─── Placeholder image (X box) ─── */
function XBox({ style = {} }) {
  return (
    <div style={{
      background: '#C8C0B0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#A09080" strokeWidth="1.5" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#A09080" strokeWidth="1.5" />
        <rect x="0.75" y="0.75" width="calc(100% - 1.5px)" height="calc(100% - 1.5px)" stroke="#A09080" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}

/* ─── NAVBAR ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { auth } = usePage().props

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navLinks = [
    { label: 'Home',        href: '/' },
    { label: 'Events',      href: '/#events' },
    { label: 'Competition', href: '/competitions' },
    { label: 'About',       href: '/about' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 52,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 1.75rem',
      background: scrolled ? 'rgba(15,10,5,0.96)' : 'rgba(15,10,5,0.55)',
      backdropFilter: 'blur(6px)',
      borderBottom: scrolled ? '1px solid rgba(200,168,75,0.18)' : 'none',
      transition: 'background 0.35s, border 0.35s',
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 17, color: C.cream, fontWeight: 400, letterSpacing: 0.5,
        }}>bharatika</span>
      </Link>

      {/* Nav links + user icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {navLinks.map(({ label, href }) => (
          <Link key={label} href={href} style={{
            fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2,
            color: C.cream, textDecoration: 'none', textTransform: 'uppercase',
            opacity: 0.75, transition: 'opacity 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = C.gold }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.color = C.cream }}
          >{label}</Link>
        ))}

        {/* User icon */}
        <Link href={auth?.user ? '/history' : '/login'} style={{
          color: C.cream, textDecoration: 'none',
          display: 'flex', alignItems: 'center',
          opacity: 0.75, transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.75'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="1.8">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </Link>
      </div>
    </nav>
  )
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Full-bleed placeholder image */}
      <XBox style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(15,10,5,0.35) 0%, rgba(15,10,5,0.1) 40%, rgba(15,10,5,0.6) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 2rem 4rem',
      }}>
        {/* Subtitle */}
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 5,
          color: C.cream, textTransform: 'uppercase', margin: '0 0 1rem', opacity: 0.8,
        }}>bharatika · 2026</p>

        {/* Decorative lines */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: 50, height: 1, background: C.gold, opacity: 0.6 }} />
          <svg width="8" height="8" viewBox="0 0 8 8"><polygon points="4,0 8,4 4,8 0,4" fill={C.gold} /></svg>
          <div style={{ width: 50, height: 1, background: C.gold, opacity: 0.6 }} />
        </div>

        {/* Main title */}
        <h1 style={{
          fontFamily: "'UnifrakturMaguntia', serif",
          fontSize: 'clamp(64px, 16vw, 140px)',
          color: C.gold,
          margin: '0 0 0.5rem',
          lineHeight: 0.85,
          textShadow: '2px 4px 24px rgba(0,0,0,0.7)',
          letterSpacing: -2,
        }}>Merajacipta</h1>

        {/* Tagline */}
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 6,
          color: C.cream, textTransform: 'uppercase', margin: '1.25rem 0 3rem', opacity: 0.65,
        }}>Berani · Bersahaja · Bertata</p>

        {/* CTA Button */}
        <Link href="/about" style={{
          display: 'inline-block',
          padding: '10px 32px',
          border: '1px solid rgba(232,217,160,0.7)',
          color: C.cream,
          fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 4,
          textDecoration: 'none', textTransform: 'uppercase',
          background: 'rgba(15,10,5,0.35)',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.25s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.black; e.currentTarget.style.borderColor = C.gold }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,10,5,0.35)'; e.currentTarget.style.color = C.cream; e.currentTarget.style.borderColor = 'rgba(232,217,160,0.7)' }}
        >Learn More</Link>
      </div>
    </section>
  )
}

/* ─── ABOUT (crimson section) ─── */
function About() {
  return (
    <section id="about" style={{
      background: C.crimson,
      position: 'relative',
      overflow: 'hidden',
      padding: '5rem 2rem 5rem',
      minHeight: 520,
    }}>
      {/* Diagonal texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.05) 8px, rgba(0,0,0,0.05) 9px)',
      }} />

      {/* CATUR kiri — atas kiri, terpotong tepi */}
      <div style={{
        position: 'absolute',
        width: 'clamp(350px, 40vw, 640px)',
        aspectRatio: '509.1 / 678.8',
        left: 0,
        top: '-12%',
        backgroundImage: "url('/images/CATUR.png')",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        transform: 'rotate(7deg) translateX(-12%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
 
      {/* CATUR kanan — bawah kanan, terpotong tepi, mirror */}
      <div style={{
        position: 'absolute',
        width: 'clamp(300px, 40vw, 500px)',
        aspectRatio: '509.1 / 678.8',
        right: 0,
        bottom: '-10%',
        backgroundImage: "url('/images/CATUR.png')",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        transform: 'rotate(-5deg) translateX(12%) scaleX(-1)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Center content */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 800, margin: '0 auto',
        textAlign: 'center',
      }}>

        {/*Vector — sebagai tulisan Merajacipta */}
        <div style={{
          width: '100%',
          maxWidth: 700,
          margin: '0.25rem auto 0',
          backgroundImage: "url('/images/VECTOR.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          aspectRatio: '3240 / 1440',
        }} />

        

        {/* Lorem ipsum section */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(14px, 2.5vw, 20px)',
            color: C.cream, fontWeight: 400, letterSpacing: 4,
            textTransform: 'uppercase', margin: '0 0 1.25rem',
          }}>Lorem Ipsum Dolor Sit</h3>
          <p style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            lineHeight: 1.9,
            color: C.cream, opacity: 0.88,
            maxWidth: 600, margin: '0 auto',
          }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor eros, facilisis quis
            vulputate ut, suscipit nec tellus. Phasellus pretium urna vel dignissim facilisis. Cras
            risus nunc, vulputate nec lectus quis, posuere condimentum diam. Suspendisse mollis auctor
            diam sed aliquam. Nullam hendrerit nisl sed mi consequat congue.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── REGISTER + EVENTS (split section) ─── */
function RegisterEvents() {
  return (
    <section id="events" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
 
      {/* LEFT — Register Now (cream/parchment) */}
      <div style={{
        background: C.parchment,
        minHeight: 560,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundImage: 'radial-gradient(circle, rgba(160,140,60,0.18) 1px, transparent 1px)',
        backgroundSize: '14px 14px',
      }}>
        {/* Register + Now! — Now! overlap ke image */}
        <div style={{ padding: '2rem 2.5rem 0', textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: 5,
            color: C.crimson, textTransform: 'uppercase',
            margin: '0 0 0', fontWeight: 700,
          }}>Register</p>
          <h2 style={{
            fontFamily: "'UnifrakturMaguntia', serif",
            fontSize: 'clamp(64px, 9vw, 100px)',
            color: C.crimson, margin: 0, lineHeight: 0.9,
            position: 'relative',
            zIndex: 2,
            marginBottom: '-5rem', // overlap ke image
          }}>Now!</h2>
        </div>
 
        {/* Image placeholder — Now! overlap di atas tepi */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flex: 1,
          position: 'relative', 
          zIndex: 1 
        }}>
          <XBox style={{ 
            width: 'clamp(200px, 80%, 433.8px)', 
            aspectRatio: '433.8 / 418.16',
          }} />
        </div>
 
        {/* Register button bottom — rounded pill */}
        <div style={{ padding: '2rem 2.5rem', textAlign: 'center' }}>
          <Link href="/register" style={{
            display: 'inline-block', padding: '12px 40px',
            background: C.crimson, color: C.cream,
            fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3,
            textDecoration: 'none', textTransform: 'uppercase',
            borderRadius: 50,
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >Register</Link>
        </div>
      </div>
 
      {/* RIGHT — Our Events (dark charcoal) */}
      <div style={{
        background: '#1E1A14',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: 560,
        backgroundImage: 'radial-gradient(circle, rgba(80,60,20,0.15) 1px, transparent 1px)',
        backgroundSize: '14px 14px',
      }}>
 
        {/* Left col: Our Events + See More button */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'flex-start',
          padding: '3rem 1rem 3rem 2.5rem',
          gap: '2rem',
        }}>
          <h2 style={{
            fontFamily: "'UnifrakturMaguntia', serif",
            fontSize: 'clamp(52px, 7vw, 88px)',
            color: C.gold, margin: 0, lineHeight: 0.9,
          }}>Our<br />Events</h2>
 
          {/* See More — rounded pill border */}
          <Link href="/competitions" style={{
            display: 'inline-block', padding: '10px 28px',
            border: `1.5px solid ${C.gold}`, color: C.gold,
            fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 3,
            textDecoration: 'none', textTransform: 'uppercase',
            borderRadius: 50,
            transition: 'all 0.2s',
            background: 'rgba(200,168,75,0.08)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.dark }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,168,75,0.08)'; e.currentTarget.style.color = C.gold }}
          >See More</Link>
        </div>
 
        {/* Right col: image + description */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          padding: '3rem 2.5rem 3rem 1rem',
          gap: '1.25rem',
        }}>
          <XBox style={{ width: '100%', aspectRatio: '1' }} />
          <div>
            <p style={{
              fontFamily: "'Cinzel', serif", fontSize: 12, color: C.cream,
              fontWeight: 600, margin: '0 0 0.5rem', letterSpacing: 1,
              textTransform: 'uppercase',
            }}>Lorem Ips–</p>
            <p style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 14, color: C.cream, lineHeight: 1.7, opacity: 0.7, margin: 0,
            }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor eros.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── RED DIVIDER ─── */
function RedDivider() {
  return <div style={{ height: 14, background: C.crimson }} />
}

/* ─── MERCH ─── */
function Merch() {
  return (
    <section id="merch" style={{ background: C.cream, padding: '5rem 2rem', textAlign: 'center' }}>
      <p style={{
        fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 5,
        color: C.crimson, textTransform: 'uppercase', margin: '0 0 0.15rem',
      }}>Take a look at our</p>
      <h2 style={{
        fontFamily: "'UnifrakturMaguntia', serif",
        fontSize: 'clamp(64px, 14vw, 120px)',
        color: C.crimson, margin: '0 0 2.5rem', lineHeight: 0.9,
      }}>Merch</h2>

      {/* Merch image */}
      <div style={{ maxWidth: 380, margin: '0 auto 2.5rem' }}>
        <XBox style={{ width: '100%', aspectRatio: '4/3' }} />
      </div>

      <Link href="#" style={{
        display: 'inline-block', padding: '10px 32px',
        background: C.crimson, color: C.cream,
        fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 4,
        textDecoration: 'none', textTransform: 'uppercase', borderRadius: 2,
        transition: 'opacity 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >Here</Link>
    </section>
  )
}

/* ─── PARTNERS ─── */
function Partners() {
  return (
    <section id="partners" style={{
      background: C.cream, padding: '4rem 2rem 5rem',
      borderTop: '1px solid rgba(139,26,26,0.12)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 5,
          color: C.crimson, textTransform: 'uppercase', margin: '0 0 0.15rem',
        }}>Our</p>
        <h2 style={{
          fontFamily: "'UnifrakturMaguntia', serif",
          fontSize: 'clamp(64px, 14vw, 120px)',
          color: C.crimson, margin: 0, lineHeight: 0.9,
        }}>Partners</h2>
      </div>

      {/* 2 rows × 3 cols */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem', maxWidth: 540, margin: '0 auto',
      }}>
        {Array(6).fill(null).map((_, i) => (
          <XBox key={i} style={{ aspectRatio: '1' }} />
        ))}
      </div>
    </section>
  )
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{
      background: C.dark,
      padding: '2.5rem 2rem 1.75rem',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '2rem', marginBottom: '1.5rem',
      }}>
        {/* Left: logo */}
        <div>
          <p style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 28, color: C.cream, margin: '0 0 2px', fontWeight: 400,
          }}>bharatika</p>
          <p style={{
            fontFamily: "'Cinzel', serif", fontSize: 9,
            letterSpacing: 2, color: C.cream, opacity: 0.45,
            margin: 0, textTransform: 'uppercase',
          }}>Creative Design Festival</p>
        </div>

        {/* Right: social icons */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {[
            // Instagram
            <svg key="ig" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill={C.cream} stroke="none" /></svg>,
            // TikTok
            <svg key="tt" width="18" height="18" viewBox="0 0 24 24" fill={C.cream}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.54V6.79a4.85 4.85 0 0 1-1.01-.1z" /></svg>,
            // YouTube
            <svg key="yt" width="18" height="18" viewBox="0 0 24 24" fill={C.cream}><path d="M23 7s-.3-2-1.2-2.7C20.7 3.1 19.4 3 19.4 3S15.7 2.7 12 2.7s-7.4.3-7.4.3-1.3.1-2.4 1.3C1.3 5 1 7 1 7S.7 9.2.7 11.3v2c0 2.2.3 4.3.3 4.3s.3 2 1.2 2.7c1.1 1.1 2.6 1.1 3.3 1.2C7.3 21.7 12 21.7 12 21.7s3.7 0 6.2-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.7 1.2-2.7s.3-2.1.3-4.3v-2C23.3 9.2 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" /></svg>,
            // Facebook/other
            <svg key="fb" width="18" height="18" viewBox="0 0 24 24" fill={C.cream}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
          ].map((icon, i) => (
            <a key={i} href="#" style={{
              width: 34, height: 34,
              border: '1px solid rgba(232,217,160,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,217,160,0.6)'; e.currentTarget.style.background = 'rgba(232,217,160,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,217,160,0.25)'; e.currentTarget.style.background = 'transparent' }}
            >{icon}</a>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div style={{ borderTop: '1px solid rgba(232,217,160,0.1)', paddingTop: '1.25rem', textAlign: 'right' }}>
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: 9,
          color: C.cream, opacity: 0.3, letterSpacing: 0.5, margin: 0,
        }}>© Bharatika Creative Design Festival 2026. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

/* ─── PAGE ─── */
export default function Home({ competitions = [] }) {
  useFonts()

  return (
    <div style={{ background: C.black, minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <About />
      <RegisterEvents />
      <RedDivider />
      <Merch />
      <Partners />
      <Footer />
    </div>
  )
}