import { useEffect, useState, useMemo } from 'react'
import { Head } from '@inertiajs/react'
import { navigateWithTransition } from '../../hooks/usePageTransition'
import MainLayout from '../../Layouts/MainLayout'

const C = {
  gold: '#C8A84B',
  cream: '#E8D9A0',
  parchment: '#D4C48A',
  crimson: '#8B1A1A',
  dark: '#14100D',
  black: '#0F0A05',
  white: '#FFFFFF',
  border: 'rgba(232, 217, 160, 0.25)', 
  green: '#9EF0C1', 
  wood: '#F5C493',  
}

const STATUS_THEME = {
  pending:  { label: 'VERIFIKASI', color: C.gold,  bg: 'rgba(0,0,0,0.3)', border: 'rgba(200,168,75,0.4)' },
  approved: { label: 'TERDAFTAR',  color: C.green, bg: 'rgba(0,0,0,0.3)', border: 'rgba(158,240,193,0.4)' },
  rejected: { label: 'DITOLAK',    color: '#FFBABA', bg: 'rgba(0,0,0,0.3)', border: 'rgba(255,186,186,0.4)' },
}

export default function History({ registrations = [], flash = {} }) {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const categories = useMemo(() => {
    const names = registrations.map(r => r.competition?.category?.name).filter(Boolean)
    return ['all', ...new Set(names)]
  }, [registrations])

  const filteredData = useMemo(() => {
    return registrations.filter(reg => {
      const matchSearch = reg.competition?.name?.toLowerCase().includes(search.toLowerCase())
      const matchCat = catFilter === 'all' || reg.competition?.category?.name === catFilter
      const matchStatus = statusFilter === 'all' || reg.payment_status === statusFilter
      return matchSearch && matchCat && matchStatus
    })
  }, [registrations, search, catFilter, statusFilter])

  return (
    <MainLayout>
      <Head title="Dashboard" />
      
      <main style={{ minHeight: '100vh', background: C.crimson, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', opacity: 1, pointerEvents: 'none' }} />
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, mixBlendMode: 'overlay', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '140px 1.5rem 6rem', position: 'relative', zIndex: 10 }}>
          
          <header style={{ marginBottom: '3.5rem', animation: 'headerFadeIn 0.8s ease-out' }}>
            {/* Teks kecil dihapus sesuai request */}
            <h1 style={{ 
                fontFamily: "'Cinzel', serif", 
                fontSize: 'clamp(32px, 6vw, 64px)', // Ukuran judul dibuat sedikit lebih tegas
                color: C.cream, 
                margin: 0, 
                fontWeight: 700, 
                letterSpacing: '4px', 
                textTransform: 'uppercase', 
                textShadow: '0 4px 15px rgba(0,0,0,0.4)' 
            }}>
                DASHBOARD
            </h1>
          </header>

          <div style={{ 
            display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3.5rem',
            animation: 'contentFadeIn 0.8s ease-out 0.1s both'
          }}>
            <input 
              type="text" placeholder="Cari kompetisi..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: '2 1 300px', padding: '14px 20px', background: 'rgba(0,0,0,0.25)', border: `1px solid rgba(232, 217, 160, 0.4)`, color: C.white, fontFamily: "'EB Garamond', serif", fontSize: 16, outline: 'none', backdropFilter: 'blur(5px)' }}
            />
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              style={{ flex: '1 1 180px', padding: '14px', background: 'rgba(0,0,0,0.25)', border: `1px solid rgba(232, 217, 160, 0.4)`, color: C.cream, fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 1, outline: 'none', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>
              <option value="all" style={{background: C.crimson}}>KATEGORI: SEMUA</option>
              {categories.filter(c => c !== 'all').map(c => <option key={c} value={c} style={{background: C.crimson}}>{c.toUpperCase()}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ flex: '1 1 180px', padding: '14px', background: 'rgba(0,0,0,0.25)', border: `1px solid rgba(232, 217, 160, 0.4)`, color: C.cream, fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 1, outline: 'none', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>
              <option value="all" style={{background: C.crimson}}>STATUS: SEMUA</option>
              <option value="pending" style={{background: C.crimson}}>PENDING</option>
              <option value="approved" style={{background: C.crimson}}>TERDAFTAR</option>
              <option value="rejected" style={{background: C.crimson}}>DITOLAK</option>
            </select>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.5rem',
            animation: 'contentFadeIn 1s ease-out 0.2s both'
          }}>
            {filteredData.map((reg) => {
                const theme = STATUS_THEME[reg.payment_status] || STATUS_THEME.pending;
                
                let statusLabel = 'INFO';
                let statusValue = '';
                let statusColor = C.cream;
                let isItalic = false;
                let showNotes = false;

                if (reg.payment_status === 'pending') {
                  statusLabel = 'PROSES';
                  statusValue = 'Verifikasi Pembayaran';
                  statusColor = C.gold;
                } else if (reg.payment_status === 'rejected') {
                  statusLabel = 'TINDAKAN';
                  statusValue = 'Perlu Revisi Dokumen';
                  statusColor = C.wood; 
                  showNotes = true;
                } else if (reg.payment_status === 'approved') {
                  statusLabel = 'PENGUMPULAN';
                  if (reg.submission_file) {
                    statusValue = 'Karya Sudah Terkumpul';
                    statusColor = C.green;
                  } else {
                    statusValue = 'Menunggu Pengumpulan Karya';
                    statusColor = '#FFDADA'; 
                    isItalic = true;
                  }
                }

                return (
                  <div 
                    key={reg.id} 
                    onClick={() => navigateWithTransition(`/history/${reg.id}`)}
                    style={{
                      background: 'rgba(15, 10, 5, 0.92)', 
                      border: `1px solid ${reg.payment_status === 'rejected' ? 'rgba(245, 196, 147, 0.5)' : C.border}`,
                      padding: '1.75rem',
                      display: 'flex', flexDirection: 'column',
                      cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = '#000000' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = reg.payment_status === 'rejected' ? 'rgba(245, 196, 147, 0.5)' : C.border; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(15, 10, 5, 0.92)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div style={{ padding: '3px 10px', border: `1px solid ${theme.border}`, color: theme.color, fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 1.5, fontWeight: 700, background: theme.bg }}>
                        {theme.label}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color: C.gold, opacity: 0.7, fontWeight: 700 }}>ID</span>
                        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: C.cream, fontWeight: 800, letterSpacing: 1 }}>{reg.participant_code || '---'}</span>
                      </div>
                    </div>

                    <div style={{ marginBottom: showNotes ? '1.25rem' : '2.5rem', flex: 1 }}>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, color: C.gold, opacity: 0.8 }}>{reg.competition?.category?.name}</span>
                      <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: C.white, margin: '6px 0 0', fontWeight: 700, lineHeight: 1.25 }}>{reg.competition?.name}</h3>
                    </div>

                    {showNotes && reg.rejection_note && (
                      <div style={{ 
                        background: 'rgba(212, 163, 115, 0.12)', 
                        borderLeft: `2px solid ${C.wood}`,
                        padding: '10px 14px',
                        marginBottom: '1.5rem'
                      }}>
                        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 7, color: C.wood, margin: '0 0 4px', letterSpacing: 1.5, fontWeight: 700 }}>CATATAN PANITIA</p>
                        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: C.cream, margin: 0, lineHeight: 1.4 }}>
                          "{reg.rejection_note}"
                        </p>
                      </div>
                    )}

                    <div style={{ borderTop: `1px solid rgba(232, 217, 160, 0.1)`, paddingTop: '1.25rem' }}>
                        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 7, color: C.gold, opacity: 0.7, margin: '0 0 2px', letterSpacing: 1 }}>{statusLabel}</p>
                        <p style={{ 
                          fontFamily: "'EB Garamond', serif", 
                          fontSize: 15, 
                          color: statusColor, 
                          margin: 0, 
                          fontWeight: 500,
                          fontStyle: isItalic ? 'italic' : 'normal'
                        }}>
                          {statusValue}
                        </p>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes headerFadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes contentFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </MainLayout>
  )
}