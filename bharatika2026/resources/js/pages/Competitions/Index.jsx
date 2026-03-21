import { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { navigateWithTransition } from '../../hooks/usePageTransition'

const CATEGORY_CONFIG = {
  TIRTA: {
    bg: '#4A6FA5',
    description: 'Berarti air, mewakili kategori Mahasiswa DKV, DFT, IPDM.',
    titleSide: 'left',
  },
  BUANA: {
    bg: '#5C6B3A',
    description: 'Berarti tanah, mewakili kategori SMA.',
    titleSide: 'right',
  },
  BAYU: {
    bg: '#8B6914',
    description: 'Berarti angin, mewakili kategori umum.',
    titleSide: 'left',
  },
  AGNI: {
    bg: '#8B2A1A',
    description: 'Berarti api, mewakili kategori Mahasiswa Desain Interior.',
    titleSide: 'right',
  },
}

const DEFAULT_CONFIG = {
  bg: '#2A2420',
  description: '',
  titleSide: 'left',
}

function useFonts() {
  useEffect(() => {
    document.body.style.margin = '0'
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap'
    document.head.appendChild(l)
  }, [])
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

function CategoryBanner({ category, index }) {
  const [open, setOpen] = useState(false)
  const config = CATEGORY_CONFIG[category.name?.toUpperCase()] || { ...DEFAULT_CONFIG, bg: ['#4A6FA5','#5C6B3A','#8B6914','#8B2A1A'][index % 4] }
  const isRight = config.titleSide === 'right'
  const cream = '#E8D9A0'

  return (
    <div style={{ background: config.bg, overflow: 'hidden', transition: 'all 0.4s ease' }}>
      {/* Banner row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isRight ? '1fr auto auto' : 'auto 1fr auto',
          alignItems: 'center',
          padding: '0 2.5rem',
          minHeight: 180,
          gap: '2rem',
          cursor: 'pointer',
          position: 'relative',
        }}
        onClick={() => setOpen(!open)}
      >
        {isRight ? (
          <>
            {/* Chevron left */}
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              border: `2px solid ${cream}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'transform 0.3s',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cream} strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Description center */}
            <p style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 'clamp(15px, 1.8vw, 20px)',
              color: cream, opacity: 0.9, margin: 0,
              lineHeight: 1.6, textAlign: 'center',
            }}>{config.description}</p>

            {/* Title right */}
            <h2 style={{
              fontFamily: "'UnifrakturMaguntia', serif",
              fontSize: 'clamp(72px, 12vw, 160px)',
              color: cream, margin: 0, lineHeight: 0.85,
              letterSpacing: -2, flexShrink: 0,
            }}>{category.name}</h2>
          </>
        ) : (
          <>
            {/* Title left */}
            <h2 style={{
              fontFamily: "'UnifrakturMaguntia', serif",
              fontSize: 'clamp(72px, 12vw, 160px)',
              color: cream, margin: 0, lineHeight: 0.85,
              letterSpacing: -2, flexShrink: 0,
            }}>{category.name}</h2>

            {/* Description center */}
            <p style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 'clamp(15px, 1.8vw, 20px)',
              color: cream, opacity: 0.9, margin: 0,
              lineHeight: 1.6,
            }}>{config.description}</p>

            {/* Chevron right */}
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              border: `2px solid ${cream}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'transform 0.3s',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cream} strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </>
        )}
      </div>

      {/* Competitions dropdown */}
      <div style={{
        maxHeight: open ? '2000px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{
          padding: '0 2.5rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem',
          borderTop: `1px solid rgba(232,217,160,0.15)`,
          paddingTop: '1.5rem',
          marginTop: '0',
        }}>
          {category.competitions?.length > 0 ? category.competitions.map(comp => (
            <div key={comp.id} style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(232,217,160,0.15)',
              padding: '1.25rem 1.5rem',
              display: 'flex', flexDirection: 'column', gap: '0.75rem',
              transition: 'background 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.35)'; e.currentTarget.style.borderColor = 'rgba(232,217,160,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.2)'; e.currentTarget.style.borderColor = 'rgba(232,217,160,0.15)' }}
            >
              <div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: cream, margin: '0 0 0.4rem', fontWeight: 600, letterSpacing: 0.5 }}>{comp.name}</h3>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: cream, opacity: 0.55, margin: 0 }}>
                  {comp.min_participants === comp.max_participants
                    ? `${comp.min_participants} peserta per tim`
                    : `${comp.min_participants}–${comp.max_participants} peserta per tim`}
                </p>
              </div>
              <TLink href={`/competitions/${comp.id}/register`} style={{
                display: 'block', textAlign: 'center', padding: '8px',
                border: `1px solid ${cream}`, color: cream,
                fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3,
                textDecoration: 'none', textTransform: 'uppercase', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = cream; e.currentTarget.style.color = config.bg }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = cream }}
              >Daftar Sekarang</TLink>
            </div>
          )) : (
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: cream, opacity: 0.4, margin: 0 }}>
              Belum ada kompetisi tersedia
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CompetitionsIndex({ categories = [] }) {
  useFonts()
  return (
    <div style={{ minHeight: '100vh', background: '#1A1410' }}>
      <Navbar activeLink="competition" />
      <div style={{ paddingTop: 52 }}>
        {categories.map((category, index) => (
          <CategoryBanner key={category.id} category={category} index={index} />
        ))}
        {categories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: 3, color: '#E8D9A0', opacity: 0.25, textTransform: 'uppercase' }}>
              Belum ada kompetisi tersedia
            </p>
          </div>
        )}
      </div>
    </div>
  )
}