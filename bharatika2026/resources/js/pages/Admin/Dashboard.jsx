// resources/js/pages/Admin/Dashboard.jsx
import { useEffect, useState } from 'react'
import { Link, Head } from '@inertiajs/react'

const C = {
  gold: '#C8A84B',
  goldLight: '#E8C96A',
  cream: '#E8D9A0',
  crimson: '#8B1A1A',
  dark: '#0F0A05',
  card: 'rgba(255,255,255,0.03)',
  border: 'rgba(200,168,75,0.2)',
  white: '#FFFFFF',
  green: '#7ECBA1',
  red: '#E08080',
}

function useFonts() {
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.background = C.dark
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=EB+Garamond:wght@400;700;800&display=swap'
    document.head.appendChild(l)
  }, [])
}

// ─── Shared AdminNav with hamburger ──────────────────────────────────────────
export function AdminNav({ active = 'dashboard' }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const NAV_ITEMS = [
    { label: 'DASHBOARD',    href: '/admin/dashboard',     key: 'dashboard' },
    { label: 'PENDAFTARAN',  href: '/admin/registrations', key: 'registrations' },
    { label: 'KARYA',        href: '/admin/submissions',   key: 'submissions' },
  ]

  return (
    <>
      <style>{`
        .admin-nav-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          background: #000;
          border-bottom: 2px solid ${C.gold};
        }
        /* ── Main bar row ── */
        .admin-nav-inner {
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(1rem, 4vw, 4rem);
          gap: 1rem;
        }
        .admin-nav-left {
          display: flex; align-items: center;
          gap: clamp(1rem, 3vw, 4rem);
          min-width: 0;
        }
        .admin-nav-logo {
          font-family: 'Cinzel', serif;
          font-size: clamp(16px, 2.2vw, 24px);
          color: ${C.gold}; font-weight: 900; letter-spacing: 3px;
          text-decoration: none; white-space: nowrap; flex-shrink: 0;
        }
        /* ── Desktop nav links ── */
        .admin-nav-links {
          display: flex; gap: clamp(1rem, 2vw, 2.5rem);
        }
        @media (max-width: 700px) {
          .admin-nav-links { display: none; }
        }
        .admin-nav-link {
          font-family: 'Cinzel', serif;
          font-size: clamp(10px, 1.1vw, 13px); letter-spacing: 2px;
          text-decoration: none; font-weight: 900;
          padding-bottom: 6px; transition: all 0.3s ease;
          white-space: nowrap;
        }
        /* ── Logout button ── */
        .admin-nav-logout {
          background: ${C.crimson}; border: none; color: ${C.white};
          font-family: 'Cinzel', serif; font-size: clamp(9px, 1vw, 12px);
          letter-spacing: 2px;
          padding: clamp(7px, 1.2vw, 11px) clamp(12px, 1.8vw, 24px);
          cursor: pointer; font-weight: 900; text-transform: uppercase;
          transition: all 0.2s ease; flex-shrink: 0; white-space: nowrap;
        }
        /* ── Hamburger ── */
        .admin-hamburger {
          display: none; background: none; border: none;
          cursor: pointer; padding: 4px; flex-shrink: 0;
        }
        @media (max-width: 700px) {
          .admin-hamburger { display: flex; flex-direction: column; gap: 5px; align-items: center; justify-content: center; }
          .admin-nav-logout { display: none; }
        }
        .admin-hamburger span {
          display: block; width: 24px; height: 2px;
          background: ${C.gold}; transition: all 0.3s;
        }
        /* ── Mobile dropdown ── */
        .admin-mobile-menu {
          background: #000; border-top: 1px solid ${C.border};
          padding: 1rem clamp(1rem, 4vw, 4rem) 1.5rem;
          display: flex; flex-direction: column; gap: 0.5rem;
        }
        .admin-mobile-link {
          font-family: 'Cinzel', serif; font-size: 13px; letter-spacing: 2px;
          text-decoration: none; font-weight: 900;
          padding: 14px 0; border-bottom: 1px solid rgba(200,168,75,0.1);
          display: block;
        }
        .admin-mobile-logout {
          background: ${C.crimson}; border: none; color: ${C.white};
          font-family: 'Cinzel', serif; font-size: 12px;
          letter-spacing: 2px; padding: 14px;
          cursor: pointer; font-weight: 900; text-transform: uppercase;
          width: 100%; margin-top: 0.5rem;
        }
      `}</style>

      <div className="admin-nav-bar">
        <div className="admin-nav-inner">
          {/* Left: logo + nav */}
          <div className="admin-nav-left">
            <Link href="/" className="admin-nav-logo">BHARATIKA</Link>

            <nav className="admin-nav-links">
              {NAV_ITEMS.map(({ label, href, key }) => (
                <Link key={key} href={href}
                  className="admin-nav-link"
                  style={{
                    color: active === key ? C.white : C.gold,
                    borderBottom: active === key ? `3px solid ${C.gold}` : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (active !== key) e.currentTarget.style.color = C.white }}
                  onMouseLeave={e => { if (active !== key) e.currentTarget.style.color = C.gold }}
                >{label}</Link>
              ))}
            </nav>
          </div>

          {/* Right: logout (desktop) + hamburger (mobile) */}
          <Link href="/logout" method="post" as="button" className="admin-nav-logout"
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >LOGOUT</Link>

          <button className="admin-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span style={{ transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="admin-mobile-menu">
            {NAV_ITEMS.map(({ label, href, key }) => (
              <Link key={key} href={href}
                className="admin-mobile-link"
                style={{ color: active === key ? C.gold : C.white }}
                onClick={() => setMenuOpen(false)}
              >{label}</Link>
            ))}
            <Link href="/logout" method="post" as="button" className="admin-mobile-logout">
              LOGOUT
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: C.card, border: `2px solid ${color}40`,
      padding: 'clamp(1.25rem, 3vw, 2.5rem)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 12px)', letterSpacing: 3, color, fontWeight: 900, margin: '0 0 1rem' }}>
        {label}
      </p>
      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(36px, 5vw, 64px)', color: C.white, margin: 0, fontWeight: 800, lineHeight: 1 }}>
        {value}
      </p>
    </div>
  )
}

export default function AdminDashboard({ stats = {} }) {
  useFonts()

  const cards = [
    { label: 'TOTAL PENDAFTAR',      value: stats.total ?? 0,    color: C.gold },
    { label: 'MENUNGGU VERIFIKASI',  value: stats.pending ?? 0,  color: C.goldLight },
    { label: 'PENDAFTARAN VALID',    value: stats.approved ?? 0, color: C.green },
    { label: 'PENDAFTARAN DITOLAK',  value: stats.rejected ?? 0, color: C.red },
  ]

  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Head title="Admin Dashboard | Bharatika" />
      <AdminNav active="dashboard" />

      {/* Nav is 64px */}
      <div style={{ paddingTop: 64 }}>

        {/* ── Header ── */}
        <div style={{
          padding: 'clamp(2rem, 6vw, 5rem) clamp(1rem, 5vw, 4rem)',
          background: 'linear-gradient(to bottom, #150F0A, #0F0A05)',
          borderBottom: `1px solid ${C.border}`,
        }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1.1vw, 13px)', letterSpacing: 6, color: C.gold, fontWeight: 900, margin: '0 0 1rem' }}>
            ADMINISTRATION PANEL
          </p>
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(28px, 6vw, 92px)', color: C.white, margin: 0, fontWeight: 800, lineHeight: 1 }}>
            Sistem Ringkasan Data
          </h1>
        </div>

        <div style={{ padding: 'clamp(1.5rem, 4vw, 4rem) clamp(1rem, 5vw, 4rem)', maxWidth: 1400, margin: '0 auto' }}>

          {/* ── Stat cards — responsive grid ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: 'clamp(0.75rem, 2vw, 2rem)',
            marginBottom: 'clamp(2.5rem, 5vw, 5rem)',
          }}>
            {cards.map(c => <StatCard key={c.label} {...c} />)}
          </div>

          {/* ── Urgent notice ── */}
          {(stats.pending ?? 0) > 0 && (
            <div style={{
              padding: 'clamp(1.25rem, 3vw, 2.5rem)',
              marginBottom: 'clamp(2.5rem, 5vw, 5rem)',
              borderLeft: `8px solid ${C.gold}`,
              background: 'rgba(255,255,255,0.02)',
              display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
              alignItems: 'center', justifyContent: 'space-between',
              gap: 'clamp(1rem, 3vw, 2rem)',
            }}>
              <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.1vw, 14px)', color: C.gold, fontWeight: 900, letterSpacing: 2, margin: '0 0 0.5rem' }}>
                  URGENT ACTION REQUIRED
                </p>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(16px, 2vw, 26px)', color: C.white, fontWeight: 700, margin: 0 }}>
                  Terdapat <span style={{ color: C.gold, fontSize: '1.3em', fontWeight: 800 }}>{stats.pending}</span> berkas pendaftaran baru yang memerlukan peninjauan segera.
                </p>
              </div>
              <Link href="/admin/registrations"
                style={{
                  background: C.gold, color: C.dark,
                  padding: 'clamp(14px, 2vw, 18px) clamp(20px, 3vw, 40px)',
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(10px, 1.1vw, 14px)', fontWeight: 900,
                  textDecoration: 'none', letterSpacing: 3,
                  transition: 'all 0.2s ease', textAlign: 'center',
                  flex: '0 0 auto', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.white}
                onMouseLeave={e => e.currentTarget.style.background = C.gold}
              >
                TINJAU BERKAS SEKARANG
              </Link>
            </div>
          )}

          {/* ── Nav controls ── */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 'clamp(2rem, 4vw, 4rem)' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.1vw, 13px)', letterSpacing: 4, color: C.gold, fontWeight: 900, marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
              KONTROL MANAJEMEN DATA
            </p>

            <div style={{ display: 'flex', gap: 'clamp(0.75rem, 2vw, 2rem)', flexWrap: 'wrap' }}>
              <Link href="/admin/registrations"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 'clamp(0.75rem, 2vw, 2rem)',
                  padding: 'clamp(16px, 3vw, 30px) clamp(20px, 5vw, 60px)',
                  background: C.white, color: C.dark,
                  fontFamily: "'Cinzel', serif", fontSize: 'clamp(11px, 1.3vw, 18px)', fontWeight: 900,
                  letterSpacing: 3, textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                  flex: '1 1 auto', minWidth: 'min(100%, 240px)',
                  textAlign: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 25px 50px rgba(200,168,75,0.25)` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)' }}
              >
                KELOLA SEMUA PENDAFTARAN
                {(stats.pending ?? 0) > 0 && (
                  <span style={{
                    background: C.crimson, color: C.white,
                    padding: 'clamp(5px, 1vw, 8px) clamp(10px, 1.5vw, 18px)', borderRadius: 2,
                    fontSize: 'clamp(9px, 1vw, 15px)', fontWeight: 900, letterSpacing: 1,
                    whiteSpace: 'nowrap',
                  }}>
                    {stats.pending} PENDING
                  </span>
                )}
              </Link>

              <Link href="/admin/submissions"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '2rem',
                  padding: 'clamp(16px, 3vw, 30px) clamp(20px, 5vw, 60px)',
                  background: 'transparent', color: C.gold,
                  fontFamily: "'Cinzel', serif", fontSize: 'clamp(11px, 1.3vw, 18px)', fontWeight: 900,
                  letterSpacing: 3, textDecoration: 'none', border: `3px solid ${C.gold}`,
                  transition: 'all 0.3s ease',
                  flex: '1 1 auto', minWidth: 'min(100%, 240px)',
                  textAlign: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.dark; e.currentTarget.style.transform = 'translateY(-6px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gold; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                GALERI KARYA PESERTA
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}