import { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'

const C = {
  gold: '#C8A84B',
  cream: '#E8D9A0',
  crimson: '#8B1A1A',
  dark: '#0F0A05',
  card: '#1A1410',
  surface: '#161210',
  border: 'rgba(200,168,75,0.15)',
}

const STATUS = {
  pending:  { label: 'Menunggu', color: '#C8A84B', bg: 'rgba(200,168,75,0.1)',  border: 'rgba(200,168,75,0.3)' },
  approved: { label: 'Diterima', color: '#7ECBA1', bg: 'rgba(126,203,161,0.1)', border: 'rgba(126,203,161,0.3)' },
  rejected: { label: 'Ditolak',  color: '#E08080', bg: 'rgba(224,128,128,0.1)', border: 'rgba(224,128,128,0.3)' },
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

function AdminNav({ active }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,7,3,0.97)', height: 58,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2.5rem', borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 17, color: C.gold }}>bharatika</span>
        </Link>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.cream, opacity: 0.35, textTransform: 'uppercase' }}>Admin Panel</span>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          {[{ label: 'Dashboard', href: '/admin/dashboard', key: 'dashboard' }, { label: 'Pendaftaran', href: '/admin/registrations', key: 'registrations' }].map(({ label, href, key }) => (
            <Link key={key} href={href} style={{
              fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2,
              color: active === key ? C.gold : C.cream, textDecoration: 'none',
              textTransform: 'uppercase', opacity: active === key ? 1 : 0.55,
              borderBottom: active === key ? `1px solid ${C.gold}` : 'none', paddingBottom: 2,
            }}>{label}</Link>
          ))}
        </nav>
      </div>
      <Link href="/logout" method="post" as="button" style={{
        background: 'transparent', border: `1px solid rgba(200,168,75,0.2)`,
        color: C.cream, fontFamily: "'Cinzel', serif", fontSize: 9,
        letterSpacing: 2, padding: '5px 16px', cursor: 'pointer',
        textTransform: 'uppercase', opacity: 0.5,
      }}>Logout</Link>
    </div>
  )
}

function StatusBadge({ status }) {
  const s = STATUS[status] ?? STATUS.pending
  return (
    <span style={{
      fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2,
      textTransform: 'uppercase', padding: '4px 12px',
      border: `1px solid ${s.border}`, color: s.color,
      background: s.bg, whiteSpace: 'nowrap',
    }}>{s.label}</span>
  )
}

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Menunggu' },
  { key: 'approved', label: 'Diterima' },
  { key: 'rejected', label: 'Ditolak' },
]

export default function AdminRegistrationsIndex({ registrations = [], flash = {} }) {
  useFonts()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = registrations.filter(r => {
    const matchStatus = filter === 'all' || r.payment_status === filter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      r.user?.name?.toLowerCase().includes(q) ||
      r.competition?.name?.toLowerCase().includes(q) ||
      (r.participant_code ?? '').toLowerCase().includes(q) ||
      r.user?.instansi?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  return (
    <div style={{ background: C.dark, minHeight: '100vh', fontFamily: "'Cinzel', serif" }}>
      <AdminNav active="registrations" />

      <div style={{ paddingTop: 58 }}>
        {/* Header */}
        <div style={{
          padding: '3rem 3rem 2rem', background: C.surface,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 4, color: C.gold, opacity: 0.65, textTransform: 'uppercase', margin: '0 0 0.4rem' }}>Admin</p>
          <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 'clamp(36px, 5vw, 56px)', color: C.cream, margin: '0 0 1.5rem', lineHeight: 1 }}>Kelola Pendaftaran</h1>

          {/* Filter + Search */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {FILTERS.map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)} style={{
                  padding: '7px 18px', fontFamily: "'Cinzel', serif", fontSize: 9,
                  letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer',
                  border: `1px solid ${filter === f.key ? C.gold : 'rgba(200,168,75,0.2)'}`,
                  background: filter === f.key ? C.gold : 'transparent',
                  color: filter === f.key ? C.dark : C.cream,
                  transition: 'all 0.2s',
                }}>{f.label}</button>
              ))}
            </div>
            <input
              type="text" placeholder="Cari nama, kompetisi, kode peserta..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, minWidth: 220, padding: '8px 14px',
                background: 'rgba(200,168,75,0.04)',
                border: `1px solid rgba(200,168,75,0.2)`,
                color: C.cream, fontFamily: "'EB Garamond', serif",
                fontSize: 14, outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ padding: '2rem 3rem 6rem' }}>

          {/* Flash */}
          {flash.success && (
            <div style={{ padding: '12px 16px', marginBottom: '1.5rem', border: `1px solid rgba(126,203,161,0.3)`, background: 'rgba(126,203,161,0.06)' }}>
              <p style={{ color: '#7ECBA1', fontSize: 14, margin: 0, fontFamily: "'EB Garamond', serif" }}>{flash.success}</p>
            </div>
          )}

          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, color: C.cream, opacity: 0.3, textTransform: 'uppercase', margin: '0 0 1rem' }}>
            Menampilkan {filtered.length} dari {registrations.length} pendaftaran
          </p>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem', border: `1px solid ${C.border}` }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, color: C.cream, opacity: 0.25, textTransform: 'uppercase' }}>Tidak ada data</p>
            </div>
          ) : (
            <div style={{ border: `1px solid ${C.border}` }}>
              {/* Table header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 0.9fr 0.8fr 0.5fr',
                padding: '12px 1.5rem',
                background: 'rgba(200,168,75,0.05)',
                borderBottom: `1px solid ${C.border}`,
              }}>
                {['Peserta', 'Kompetisi', 'Kode Peserta', 'Status', 'Aksi'].map(h => (
                  <p key={h} style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 3, color: C.gold, opacity: 0.65, textTransform: 'uppercase', margin: 0 }}>{h}</p>
                ))}
              </div>

              {filtered.map((reg, i) => (
                <div key={reg.id} style={{
                  display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 0.9fr 0.8fr 0.5fr',
                  padding: '1.1rem 1.5rem', alignItems: 'center',
                  borderBottom: i < filtered.length - 1 ? `1px solid rgba(200,168,75,0.07)` : 'none',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,168,75,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.cream, margin: '0 0 0.2rem', fontWeight: 500 }}>{reg.user?.name}</p>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 12, color: C.cream, opacity: 0.4, margin: 0 }}>{reg.user?.instansi}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.75, margin: '0 0 0.15rem' }}>{reg.competition?.name}</p>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.cream, opacity: 0.3, margin: 0, letterSpacing: 1 }}>{reg.competition?.category?.name}</p>
                  </div>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: C.gold, margin: 0, opacity: reg.participant_code ? 1 : 0.3 }}>
                    {reg.participant_code ?? '—'}
                  </p>
                  <StatusBadge status={reg.payment_status} />
                  <Link href={`/admin/registrations/${reg.id}`} style={{
                    fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2,
                    color: C.gold, textDecoration: 'none', textTransform: 'uppercase',
                    opacity: 0.7, transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={e => e.target.style.opacity = 1}
                    onMouseLeave={e => e.target.style.opacity = 0.7}
                  >Detail →</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
