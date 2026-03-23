// resources/js/pages/Admin/Dashboard.jsx
import { useEffect } from 'react'
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
    l.id = 'bh-fonts'
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=EB+Garamond:wght@400;700;800&display=swap'
    document.head.appendChild(l)
  }, [])
}

function AdminNav({ active = 'dashboard' }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#000', height: 75,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(1.5rem, 5vw, 4rem)', // Padding dinamis
      borderBottom: `2px solid ${C.gold}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 3vw, 4rem)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(18px, 2.5vw, 24px)', color: C.gold, fontWeight: 900, letterSpacing: 3 }}>BHARATIKA</span>
        </Link>
        
        <nav style={{ display: 'flex', gap: 'clamp(1rem, 2vw, 2.5rem)' }}>
          {[
            { label: 'DASHBOARD', href: '/admin/dashboard', key: 'dashboard' },
            { label: 'PENDAFTARAN', href: '/admin/registrations', key: 'registrations' },
            { label: 'KARYA', href: '/admin/submissions', key: 'submissions' },
          ].map(({ label, href, key }) => (
            <Link key={key} href={href} 
              style={{
                fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.2vw, 13px)', letterSpacing: 2,
                color: active === key ? C.white : C.gold,
                textDecoration: 'none', fontWeight: 900,
                borderBottom: active === key ? `3px solid ${C.gold}` : '3px solid transparent',
                paddingBottom: 6, transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { if(active !== key) e.currentTarget.style.color = C.white }}
              onMouseLeave={e => { if(active !== key) e.currentTarget.style.color = C.gold }}
            >{label}</Link>
          ))}
        </nav>
      </div>

      <Link href="/logout" method="post" as="button" 
        style={{
          background: C.crimson, border: 'none',
          color: C.white, fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 12px)',
          letterSpacing: 2, padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 2vw, 28px)', cursor: 'pointer',
          fontWeight: 900, textTransform: 'uppercase',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.style.transform = 'translateY(0)' }}
      >LOGOUT</Link>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: C.card, border: `2px solid ${color}40`,
      padding: 'clamp(1.5rem, 3vw, 2.5rem)', 
      flex: '1 1 240px', // Card bisa mengecil tapi minimal 240px
      display: 'flex', flexDirection: 'column', justifyContent: 'center'
    }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1vw, 12px)', letterSpacing: 3, color: color, fontWeight: 900, margin: '0 0 1.5rem' }}>
        {label}
      </p>
      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(40px, 5vw, 64px)', color: C.white, margin: 0, fontWeight: 800, lineHeight: 1 }}>
        {value}
      </p>
    </div>
  )
}

export default function AdminDashboard({ stats = {} }) {
  useFonts()

  const cards = [
    { label: 'TOTAL PENDAFTAR', value: stats.total ?? 0,    color: C.gold },
    { label: 'MENUNGGU VERIFIKASI', value: stats.pending ?? 0,  color: C.goldLight },
    { label: 'PENDAFTARAN VALID',   value: stats.approved ?? 0, color: C.green },
    { label: 'PENDAFTARAN DITOLAK', value: stats.rejected ?? 0, color: C.red },
  ]

  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Head title="Admin Dashboard | Bharatika" />
      <AdminNav active="dashboard" />

      <div style={{ paddingTop: 75 }}>
        {/* Header Seksi & Responsif */}
        <div style={{
          padding: 'clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
          background: 'linear-gradient(to bottom, #150F0A, #0F0A05)',
          borderBottom: `1px solid ${C.border}`,
        }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.2vw, 13px)', letterSpacing: 6, color: C.gold, fontWeight: 900, margin: '0 0 1.5rem' }}>ADMINISTRATION PANEL</p>
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(36px, 7vw, 92px)', color: C.white, margin: 0, fontWeight: 800, lineHeight: 1 }}>
            Sistem Ringkasan Data
          </h1>
        </div>

        <div style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)', maxWidth: '1400px', margin: '0 auto' }}>

          {/* Statistik Utama: Grid yang menyesuaikan jumlah kolom berdasarkan lebar layar */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem', 
            marginBottom: '5rem' 
          }}>
            {cards.map(c => <StatCard key={c.label} {...c} />)}
          </div>

          {/* Notifikasi Urgensi (Jika Ada Pending) */}
          {(stats.pending ?? 0) > 0 && (
            <div style={{
              padding: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '5rem',
              borderLeft: `10px solid ${C.gold}`,
              background: 'rgba(255,255,255,0.02)',
              display: 'flex', flexDirection: 'row', flexWrap: 'wrap', // Biar tombol turun kalau layar sempit
              alignItems: 'center', justifyContent: 'space-between',
              gap: '2rem',
            }}>
              <div style={{ flex: '1 1 300px' }}>
                 <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(11px, 1.2vw, 14px)', color: C.gold, fontWeight: 900, letterSpacing: 2, margin: '0 0 0.5rem' }}>URGENT ACTION REQUIRED</p>
                 <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(18px, 2vw, 26px)', color: C.white, fontWeight: 700, margin: 0 }}>
                   Terdapat <span style={{ color: C.gold, fontSize: '1.3em', fontWeight: 800 }}>{stats.pending}</span> berkas pendaftaran baru yang memerlukan peninjauan segera.
                 </p>
              </div>
              <Link href="/admin/registrations" 
                style={{
                  background: C.gold, color: C.dark,
                  padding: '18px 40px', fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(11px, 1.2vw, 14px)', fontWeight: 900, textDecoration: 'none', letterSpacing: 3,
                  transition: 'all 0.2s ease', textAlign: 'center', flex: '0 0 auto'
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.white}
                onMouseLeave={e => e.currentTarget.style.background = C.gold}
              >
                TINJAU BERKAS SEKARANG
              </Link>
            </div>
          )}

          {/* Kontrol Navigasi Utama */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '4rem' }}>
            <p style={{ 
              fontFamily: "'Cinzel', serif", fontSize: 'clamp(11px, 1.2vw, 13px)', letterSpacing: 4, 
              color: C.gold, fontWeight: 900, marginBottom: '2.5rem' 
            }}>
              KONTROL MANAJEMEN DATA
            </p>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <Link href="/admin/registrations" 
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem',
                  padding: 'clamp(20px, 4vw, 30px) clamp(30px, 6vw, 60px)', 
                  background: C.white, color: C.dark,
                  fontFamily: "'Cinzel', serif", fontSize: 'clamp(14px, 1.5vw, 18px)', fontWeight: 900,
                  letterSpacing: 3, textDecoration: 'none', border: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                  flex: '1 1 auto', minWidth: '280px'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 25px 50px rgba(200,168,75,0.25)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)';
                }}
              >
                KELOLA SEMUA PENDAFTARAN
                
                {(stats.pending ?? 0) > 0 && (
                  <span style={{ 
                    background: C.crimson, color: C.white, 
                    padding: '8px 18px', borderRadius: '2px',
                    fontSize: 'clamp(10px, 1.2vw, 15px)', fontWeight: 900, letterSpacing: 1
                  }}>
                    {stats.pending} PENDING
                  </span>
                )}
              </Link>

              <Link href="/admin/submissions" 
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem',
                  padding: 'clamp(20px, 4vw, 30px) clamp(30px, 6vw, 60px)', 
                  background: 'transparent', color: C.gold,
                  fontFamily: "'Cinzel', serif", fontSize: 'clamp(14px, 1.5vw, 18px)', fontWeight: 900,
                  letterSpacing: 3, textDecoration: 'none', border: `3px solid ${C.gold}`,
                  transition: 'all 0.3s ease',
                  flex: '1 1 auto', minWidth: '280px'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = C.gold;
                  e.currentTarget.style.color = C.dark;
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = C.gold;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
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