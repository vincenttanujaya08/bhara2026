import { useEffect } from 'react'
import { Link } from '@inertiajs/react'

const C = {
  gold: '#C8A84B',
  cream: '#E8D9A0',
  crimson: '#8B1A1A',
  dark: '#0F0A05',
  card: '#1A1410',
  surface: '#161210',
  muted: 'rgba(232,217,160,0.45)',
  border: 'rgba(200,168,75,0.15)',
}

function useFonts() {
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.background = C.dark
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap'
    document.head.appendChild(l)
  }, [])
}

function AdminNav({ active = 'dashboard' }) {
  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', key: 'dashboard' },
    { label: 'Pendaftaran', href: '/admin/registrations', key: 'registrations' },
  ]
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,7,3,0.97)', height: 58,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2.5rem',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 17, color: C.gold, fontWeight: 400 }}>bharatika</span>
        </Link>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.cream, opacity: 0.35, textTransform: 'uppercase' }}>Admin Panel</span>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          {navItems.map(({ label, href, key }) => (
            <Link key={key} href={href} style={{
              fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2,
              color: active === key ? C.gold : C.cream,
              textDecoration: 'none', textTransform: 'uppercase',
              opacity: active === key ? 1 : 0.55,
              borderBottom: active === key ? `1px solid ${C.gold}` : 'none',
              paddingBottom: 2, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.opacity = 1 }}
              onMouseLeave={e => { e.currentTarget.style.color = active === key ? C.gold : C.cream; e.currentTarget.style.opacity = active === key ? 1 : 0.55 }}
            >{label}</Link>
          ))}
        </nav>
      </div>
      <Link href="/logout" method="post" as="button" style={{
        background: 'transparent', border: `1px solid rgba(200,168,75,0.2)`,
        color: C.cream, fontFamily: "'Cinzel', serif", fontSize: 9,
        letterSpacing: 2, padding: '5px 16px', cursor: 'pointer',
        textTransform: 'uppercase', opacity: 0.5, transition: 'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderColor = C.gold }}
        onMouseLeave={e => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.borderColor = 'rgba(200,168,75,0.2)' }}
      >Logout</Link>
    </div>
  )
}

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      padding: '1.75rem 2rem',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,168,75,0.35)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.cream, opacity: 0.4, textTransform: 'uppercase', margin: 0 }}>{label}</p>
        <span style={{ fontSize: 18, opacity: 0.2 }}>{icon}</span>
      </div>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 42, color: color ?? C.gold, margin: 0, fontWeight: 700, lineHeight: 1 }}>{value}</p>
    </div>
  )
}

export default function AdminDashboard({ stats = {} }) {
  useFonts()

  const cards = [
    { label: 'Total Pendaftar', value: stats.total ?? 0,    color: C.gold,    icon: '♟' },
    { label: 'Menunggu',        value: stats.pending ?? 0,  color: '#C8A84B', icon: '◷' },
    { label: 'Diterima',        value: stats.approved ?? 0, color: '#7ECBA1', icon: '✓' },
    { label: 'Ditolak',         value: stats.rejected ?? 0, color: '#E08080', icon: '✕' },
  ]

  return (
    <div style={{ background: C.dark, minHeight: '100vh', fontFamily: "'Cinzel', serif" }}>
      <AdminNav active="dashboard" />

      <div style={{ paddingTop: 58 }}>
        {/* Page header */}
        <div style={{
          padding: '3rem 3rem 2.5rem',
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          backgroundImage: `radial-gradient(ellipse 50% 80% at 0% 50%, rgba(139,26,26,0.07) 0%, transparent 70%)`,
        }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 4, color: C.gold, opacity: 0.65, textTransform: 'uppercase', margin: '0 0 0.4rem' }}>Admin Panel</p>
          <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 'clamp(40px, 5vw, 64px)', color: C.cream, margin: 0, lineHeight: 1 }}>Dashboard</h1>
        </div>

        <div style={{ padding: '2.5rem 3rem', maxWidth: 1100 }}>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
            {cards.map(c => <StatCard key={c.label} {...c} />)}
          </div>

          {/* Pending alert */}
          {(stats.pending ?? 0) > 0 && (
            <div style={{
              padding: '1.25rem 1.5rem', marginBottom: '2rem',
              border: `1px solid rgba(200,168,75,0.25)`,
              background: 'rgba(200,168,75,0.04)',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
                <path d="M9 1 L17 16 L1 16 Z" stroke={C.gold} strokeWidth="1.5" fill="none" />
                <line x1="9" y1="7" x2="9" y2="11" stroke={C.gold} strokeWidth="1.5" />
                <circle cx="9" cy="13.5" r="0.8" fill={C.gold} />
              </svg>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.cream, opacity: 0.75, margin: 0 }}>
                Ada <strong style={{ color: C.gold }}>{stats.pending} pendaftaran</strong> yang menunggu verifikasi.{' '}
                <Link href="/admin/registrations" style={{ color: C.gold, textDecoration: 'underline' }}>Verifikasi sekarang →</Link>
              </p>
            </div>
          )}

          {/* Quick actions */}
          <div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.cream, opacity: 0.3, textTransform: 'uppercase', margin: '0 0 1rem' }}>Aksi Cepat</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/admin/registrations" style={{
                display: 'inline-block', padding: '12px 28px',
                background: C.crimson, color: C.cream,
                fontFamily: "'Cinzel', serif", fontSize: 10,
                letterSpacing: 2, textDecoration: 'none', textTransform: 'uppercase',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >Kelola Pendaftaran</Link>

              <Link href={`/admin/registrations?status=pending`} style={{
                display: 'inline-block', padding: '12px 28px',
                border: `1px solid ${C.gold}`, color: C.gold,
                fontFamily: "'Cinzel', serif", fontSize: 10,
                letterSpacing: 2, textDecoration: 'none', textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.dark }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gold }}
              >Lihat yang Menunggu ({stats.pending ?? 0})</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
