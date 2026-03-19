import { useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'

const C = {
  gold: '#C8A84B', cream: '#E8D9A0', crimson: '#8B1A1A',
  dark: '#0F0A05', card: '#1A1410', border: 'rgba(200,168,75,0.15)',
}

const STATUS = {
  pending:  { label: 'Menunggu Validasi', color: '#C8A84B', bg: 'rgba(200,168,75,0.1)',  border: 'rgba(200,168,75,0.3)' },
  approved: { label: 'Valid / Lunas',     color: '#7ECBA1', bg: 'rgba(126,203,161,0.1)', border: 'rgba(126,203,161,0.3)' },
  rejected: { label: 'Ditolak',           color: '#E08080', bg: 'rgba(224,128,128,0.1)', border: 'rgba(224,128,128,0.3)' },
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

function StatusBadge({ status }) {
  const s = STATUS[status] ?? STATUS.pending
  return (
    <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', padding: '5px 14px', border: `1px solid ${s.border}`, color: s.color, background: s.bg }}>
      {s.label}
    </span>
  )
}

export default function History({ registrations = [], flash = {} }) {
  useFonts()
  const { auth } = usePage().props

  return (
    <div style={{ background: C.dark, minHeight: '100vh', fontFamily: "'Cinzel', serif" }}>
      {/* Navbar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.75rem', background: 'rgba(15,10,5,0.96)', borderBottom: `1px solid ${C.border}` }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 17, color: C.cream }}>bharatika</span>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/competitions" style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2, color: C.cream, textDecoration: 'none', textTransform: 'uppercase', opacity: 0.65 }}>Competitions</Link>
          <Link href="/logout" method="post" as="button" style={{ background: 'transparent', border: `1px solid rgba(200,168,75,0.2)`, color: C.cream, fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, padding: '5px 14px', cursor: 'pointer', textTransform: 'uppercase', opacity: 0.5 }}>Logout</Link>
        </div>
      </div>

      <div style={{ paddingTop: 52, maxWidth: 860, margin: '0 auto', padding: '80px 2rem 6rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 4, color: C.gold, opacity: 0.65, textTransform: 'uppercase', margin: '0 0 0.4rem' }}>Akun Saya</p>
          <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 'clamp(40px, 7vw, 72px)', color: C.cream, margin: 0, lineHeight: 1.1 }}>Riwayat Pendaftaran</h1>
        </div>

        {/* Flash */}
        {flash.success && (
          <div style={{ padding: '12px 16px', border: `1px solid rgba(126,203,161,0.3)`, background: 'rgba(126,203,161,0.06)', marginBottom: '2rem' }}>
            <p style={{ color: '#7ECBA1', fontSize: 14, margin: 0, fontFamily: "'EB Garamond', serif" }}>{flash.success}</p>
          </div>
        )}

        {/* Empty state */}
        {registrations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', border: `1px solid ${C.border}` }}>
            <p style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 48, color: C.gold, opacity: 0.25, margin: '0 0 1rem' }}>♟</p>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, color: C.cream, opacity: 0.3, textTransform: 'uppercase', margin: '0 0 2rem' }}>Belum ada pendaftaran</p>
            <Link href="/competitions" style={{ display: 'inline-block', padding: '10px 28px', border: `1px solid ${C.gold}`, color: C.gold, fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 3, textDecoration: 'none', textTransform: 'uppercase' }}>
              Lihat Kompetisi
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {registrations.map(reg => (
              <Link key={reg.id} href={`/history/${reg.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: C.card, border: `1px solid ${C.border}`,
                  padding: '1.75rem 2rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,168,75,0.35)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateX(0)' }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, color: C.gold, opacity: 0.55, textTransform: 'uppercase', margin: '0 0 0.3rem' }}>
                      {reg.competition?.category?.name ?? 'Kompetisi'}
                    </p>
                    <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 17, color: C.cream, margin: '0 0 0.5rem', fontWeight: 600 }}>{reg.competition?.name}</h3>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      {reg.participant_code && (
                        <div>
                          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.gold, opacity: 0.5, margin: '0 0 0.15rem', textTransform: 'uppercase' }}>Kode Peserta</p>
                          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: C.gold, margin: 0, fontWeight: 600 }}>{reg.participant_code}</p>
                        </div>
                      )}
                      <div>
                        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.cream, opacity: 0.35, margin: '0 0 0.15rem', textTransform: 'uppercase' }}>Tanggal Daftar</p>
                        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.6, margin: 0 }}>
                          {new Date(reg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                    <StatusBadge status={reg.payment_status} />
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, color: C.gold, opacity: 0.6, textTransform: 'uppercase' }}>Detail →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
