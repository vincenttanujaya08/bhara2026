import { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'

const C = {
  gold: '#C8A84B', cream: '#E8D9A0', parchment: '#D4C48A',
  crimson: '#8B1A1A', dark: '#0F0A05', card: '#1A1410',
  charcoal: '#2A2420', border: 'rgba(200,168,75,0.15)',
}

function useFonts() {
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.background = C.dark
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap'
    document.head.appendChild(l)
  }, [])
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { auth } = usePage().props
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
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
      background: scrolled ? 'rgba(15,10,5,0.96)' : 'rgba(15,10,5,0.85)',
      backdropFilter: 'blur(6px)',
      borderBottom: `1px solid ${C.border}`,
      transition: 'background 0.35s',
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 17, color: C.cream }}>bharatika</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {navLinks.map(({ label, href }) => (
          <Link key={label} href={href} style={{
            fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2,
            color: label === 'Competition' ? C.gold : C.cream,
            textDecoration: 'none', textTransform: 'uppercase',
            opacity: label === 'Competition' ? 1 : 0.75,
            borderBottom: label === 'Competition' ? `1px solid ${C.gold}` : 'none',
            paddingBottom: 2, transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.color = label === 'Competition' ? C.gold : C.cream; e.currentTarget.style.opacity = label === 'Competition' ? '1' : '0.75' }}
          >{label}</Link>
        ))}
        <Link href={auth?.user ? '/history' : '/login'} style={{ color: C.cream, textDecoration: 'none', display: 'flex', alignItems: 'center', opacity: 0.75 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="1.8">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </Link>
      </div>
    </nav>
  )
}

export default function CompetitionsIndex({ categories = [] }) {
  useFonts()
  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div style={{
        paddingTop: 52, padding: '100px 2rem 4rem', textAlign: 'center',
        backgroundImage: `radial-gradient(ellipse 70% 50% at 50% 30%, rgba(139,26,26,0.12) 0%, transparent 70%)`,
      }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 5, color: C.gold, textTransform: 'uppercase', margin: '0 0 0.5rem', opacity: 0.75 }}>Ikut Serta Dalam</p>
        <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 'clamp(52px, 10vw, 96px)', color: C.cream, margin: '0 0 1rem', lineHeight: 1 }}>Competitions</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ width: 60, height: 1, background: `linear-gradient(to right, transparent, ${C.gold})` }} />
          <svg width="8" height="8" viewBox="0 0 8 8"><polygon points="4,0 8,4 4,8 0,4" fill={C.gold} /></svg>
          <div style={{ width: 60, height: 1, background: `linear-gradient(to left, transparent, ${C.gold})` }} />
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 2rem 6rem', maxWidth: 1100, margin: '0 auto' }}>
        {categories.map(category => (
          <div key={category.id} style={{ marginBottom: '4rem' }}>
            {/* Category header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 4, height: 36, background: C.crimson }} />
              <div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.gold, opacity: 0.65, textTransform: 'uppercase', margin: '0 0 0.2rem' }}>Kategori</p>
                <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: C.cream, margin: 0, letterSpacing: 1 }}>{category.name}</h2>
              </div>
            </div>  

            {/* Competition cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {category.competitions?.map(comp => (
                <div key={comp.id} style={{
                  background: C.card, border: `1px solid ${C.border}`,
                  padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
                  transition: 'border-color 0.25s, transform 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,168,75,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {/* Placeholder image */}
                  <div style={{ height: 130, background: '#2A1F14', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    <svg width="36" height="36" viewBox="0 0 36 36" style={{ opacity: 0.1 }}>
                      <line x1="0" y1="0" x2="36" y2="36" stroke={C.gold} strokeWidth="1" />
                      <line x1="36" y1="0" x2="0" y2="36" stroke={C.gold} strokeWidth="1" />
                      <rect x="0" y="0" width="36" height="36" stroke={C.gold} strokeWidth="1" fill="none" />
                    </svg>
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: C.cream, margin: '0 0 0.5rem', fontWeight: 600 }}>{comp.name}</h3>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: C.cream, opacity: 0.5, margin: 0 }}>
                      {comp.min_participants === comp.max_participants
                        ? `${comp.min_participants} peserta per tim`
                        : `${comp.min_participants}–${comp.max_participants} peserta per tim`}
                    </p>
                  </div>

                  <Link href={`/competitions/${comp.id}`} style={{
                    display: 'block', textAlign: 'center', padding: '10px',
                    border: `1px solid ${C.gold}`, color: C.gold,
                    fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 3,
                    textDecoration: 'none', textTransform: 'uppercase', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.dark }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gold }}
                  >Daftar Sekarang</Link>
                </div>
              ))}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '8rem 2rem', border: `1px solid ${C.border}` }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: 3, color: C.cream, opacity: 0.25, textTransform: 'uppercase' }}>Belum ada kompetisi tersedia</p>
          </div>
        )}
      </div>
    </div>
  )
}
