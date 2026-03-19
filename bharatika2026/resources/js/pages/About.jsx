import { useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'

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
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
    document.head.appendChild(l)
  }, [])
}

/* ─── Placeholder X box ─── */
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

/* ─── NAVBAR ─── */
function Navbar() {
  const { auth } = usePage().props

  const navLinks = [
    { label: 'Home',        href: '/' },
    { label: 'Events',      href: '/#events' },
    { label: 'Competition', href: '/competitions' },
    { label: 'About',       href: '/about' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 1.75rem',
      background: 'rgba(15,10,5,0.92)',
      borderBottom: '1px solid rgba(200,168,75,0.15)',
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 17, color: C.cream }}>bharatika</span>
      </Link>

      {/* Nav links + user icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {navLinks.map(({ label, href }) => (
          <Link key={label} href={href} style={{
            fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2,
            color: label === 'About' ? C.gold : C.cream,
            textDecoration: 'none', textTransform: 'uppercase',
            opacity: label === 'About' ? 1 : 0.75,
            borderBottom: label === 'About' ? `1px solid ${C.gold}` : 'none',
            paddingBottom: 2, transition: 'opacity 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => {
              e.currentTarget.style.color = label === 'About' ? C.gold : C.cream
              e.currentTarget.style.opacity = label === 'About' ? '1' : '0.75'
            }}
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
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </Link>
      </div>
    </nav>
  )
}

/* ─── SECTION 1: Hero About ─── */
function HeroAbout() {
  return (
    <section style={{ paddingTop: 52, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 420 }}>
      {/* Left: dark bg + logo + text */}
      <div style={{
        background: C.crimson, padding: '3rem 2.5rem',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 9px)',
      }}>
        <h1 style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 'clamp(36px, 6vw, 64px)',
          color: C.gold, margin: '0 0 0.25rem', lineHeight: 1,
          fontWeight: 400,
        }}>bharatika</h1>
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 3,
          color: C.cream, opacity: 0.6, textTransform: 'uppercase',
          margin: '0 0 1.75rem',
        }}>Creative Design Festival</p>
        <p style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: 15, lineHeight: 1.85, color: C.cream, opacity: 0.85,
          margin: 0,
        }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eros, facilisis quis
          vulputate ut, suscipit nec tellus. Phasellus pretium urna vel dignissim facilisis nunc,
          vulputate nec lectus quis, posuere condimentum diam. Suspendisse diam sed aliquam.
          Nullam hendrerit nisl sed mi consequat congue.
        </p>
      </div>

      {/* Right: image placeholder */}
      <XBox style={{ minHeight: 420 }} />
    </section>
  )
}

/* ─── SECTION 2: Info Fakultas + Partner Logos ─── */
function FakultasPartner() {
  const partnerLogos = Array(6).fill(null)

  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left: info text */}
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

      {/* Right: partner logos grid */}
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

/* ─── SECTION 3: Gallery + Description ─── */
function Gallery() {
  return (
    <section style={{
      background: C.crimson, padding: '4rem 2.5rem',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center',
      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 9px)',
    }}>
      {/* Left: 3 portrait images */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', alignItems: 'end' }}>
        <XBox style={{ aspectRatio: '2/3', borderRadius: 2 }} />
        <XBox style={{ aspectRatio: '2/3.5', borderRadius: 2 }} />
        <XBox style={{ aspectRatio: '2/3', borderRadius: 2 }} />
      </div>

      {/* Right: description */}
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

/* ─── SECTION 4: Connect With Us ─── */
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
          {/* Instagram */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1" fill={C.gold} stroke="none" />
          </svg>
          {/* TikTok */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill={C.gold}>
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 12.67 0V8.69a8.18 8.18 0 0 0 4.78 1.54V6.79a4.85 4.85 0 0 1-1.01-.1z" />
          </svg>
          {/* YouTube */}
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
      {/* Title */}
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

      {/* Contact rows */}
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
            <span style={{
              fontFamily: "'Cinzel', serif", fontSize: 15,
              color: C.crimson, fontWeight: 600, letterSpacing: 1,
            }}>{c.label}</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>{c.icon}</div>
          </a>
        ))}
      </div>
    </section>
  )
}

/* ─── SECTION 5: Our Team ─── */
const TEAMS = [
  {
    division: 'BPH',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor eros, facilisis quis vulputate ut, suscipit nec tellus. Phasellus pretium urna vel dignissim facilisis. Cras risus nunc, vulputate nec lectus quis, posuere condimentum diam. Suspendisse mollis auctor diam sed aliquam. Nullam hendrerit nisl sed mi consequat congue.',
    members: Array(3).fill(null),
  },
]

function OurTeam() {
  return (
    <section style={{
      background: C.crimson,
      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 9px)',
    }}>
      {/* Title row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        borderBottom: '1px solid rgba(232,217,160,0.1)',
      }}>
        {/* Left: big title */}
        <div style={{ padding: '4rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 5, color: C.cream, opacity: 0.6, textTransform: 'uppercase', margin: '0 0 0.25rem' }}>Our</p>
          <h2 style={{
            fontFamily: "'UnifrakturMaguntia', serif",
            fontSize: 'clamp(64px, 12vw, 110px)',
            color: C.gold, margin: 0, lineHeight: 0.85,
          }}>Team</h2>
        </div>

        {/* Right: division description */}
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

      {/* Team member cards (placeholder) */}
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

/* ─── FOOTER ─── */
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

/* ─── PAGE ─── */
export default function About() {
  useFonts()

  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Navbar />
      <HeroAbout />
      <FakultasPartner />
      <Gallery />
      <ConnectWithUs />
      <OurTeam />
      <Footer />
    </div>
  )
}