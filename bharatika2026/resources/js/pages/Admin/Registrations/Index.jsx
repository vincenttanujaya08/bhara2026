// resources/js/pages/Admin/Registrations/Index.jsx
import { useState, useEffect, useMemo } from 'react'
import { Link, Head } from '@inertiajs/react'
import ConfirmModal from '@/components/ConfirmModal'
import { route } from 'ziggy-js'
import { AdminNav } from '../Dashboard'   // re-use shared nav

const C = {
  gold: '#C8A84B',
  goldLight: '#E8C96A',
  dark: '#0F0A05',
  card: 'rgba(255,255,255,0.03)',
  border: 'rgba(200,168,75,0.2)',
  white: '#FFFFFF',
  green: '#7ECBA1',
  red: '#E08080',
  crimson: '#8B1A1A',
}

const STATUS_MAP = {
  pending:  { label: 'MENUNGGU', color: C.gold },
  approved: { label: 'VALID',    color: C.green },
  rejected: { label: 'REVISI',   color: C.red },
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

export default function AdminRegistrationsIndex({ registrations = [] }) {
  useFonts()

  const [statusFilter, setStatusFilter] = useState('all')
  const [catFilters, setCatFilters] = useState([])
  const [compFilters, setCompFilters] = useState([])
  const [search, setSearch] = useState('')
  const [showExportModal, setShowExportModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => { setCurrentPage(1) }, [statusFilter, catFilters, compFilters, search])

  const categories = useMemo(() =>
    [...new Set(registrations.map(r => r.competition?.category?.name?.toUpperCase()))].filter(Boolean).sort(),
    [registrations])

  const availableCompetitions = useMemo(() =>
    [...new Set(registrations
      .filter(r => catFilters.length === 0 || catFilters.includes(r.competition?.category?.name?.toUpperCase()))
      .map(r => r.competition?.name?.toUpperCase()))].filter(Boolean).sort(),
    [registrations, catFilters])

  const filtered = useMemo(() => registrations.filter(r => {
    const matchStatus = statusFilter === 'all' || r.payment_status === statusFilter
    const matchCat = catFilters.length === 0 || catFilters.includes(r.competition?.category?.name?.toUpperCase())
    const matchComp = compFilters.length === 0 || compFilters.includes(r.competition?.name?.toUpperCase())
    const q = search.toLowerCase()
    const matchSearch = !q || r.user?.name?.toLowerCase().includes(q) || r.competition?.name?.toLowerCase().includes(q) || (r.participant_code ?? '').toLowerCase().includes(q)
    return matchStatus && matchCat && matchComp && matchSearch
  }), [registrations, statusFilter, catFilters, compFilters, search])

  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const toggleCategory = (cat) => {
    setCatFilters(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
    setCompFilters([])
  }

  const handleExport = () => {
    window.open('/admin/registrations/export', '_blank')
    setShowExportModal(false)
  }

  const FilterButton = ({ active, onClick, children, showCheck = true }) => (
    <button onClick={onClick} style={{
      padding: 'clamp(7px, 1.3vw, 12px) clamp(10px, 1.8vw, 20px)',
      fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 0.9vw, 10px)', fontWeight: 900, cursor: 'pointer',
      border: `2px solid ${active ? C.gold : 'rgba(255,255,255,0.1)'}`,
      background: active ? `${C.gold}20` : 'rgba(255,255,255,0.05)',
      color: active ? C.gold : C.white,
      display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s',
      whiteSpace: 'nowrap',
    }}>
      {showCheck && <div style={{ width: 9, height: 9, border: `1px solid ${C.gold}`, background: active ? C.gold : 'transparent', flexShrink: 0 }} />}
      {children}
    </button>
  )

  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Head title="Manajemen Pendaftaran | Admin" />
      <AdminNav active="registrations" />

      <div style={{ paddingTop: 64 }}>

        {/* ── Header + Filters ── */}
        <div style={{ padding: 'clamp(1.5rem, 4vw, 4rem) clamp(1rem, 5vw, 4rem)', background: 'linear-gradient(to bottom, #150F0A, #0F0A05)', borderBottom: `1px solid ${C.border}` }}>
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(28px, 5vw, 72px)', color: C.white, margin: '0 0 clamp(1.25rem, 3vw, 3rem)', fontWeight: 800, lineHeight: 1 }}>
            Kelola Pendaftar
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2.5vw, 2rem)' }}>
            {/* Search */}
            <input type="text" placeholder="CARI NAMA ATAU KODE..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: 'clamp(12px, 2.5vw, 24px)', background: 'rgba(255,255,255,0.05)', border: `2px solid ${C.gold}40`, color: C.white, fontFamily: "'EB Garamond', serif", fontSize: 'clamp(14px, 2vw, 20px)', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
            />

            {/* Status + Kategori grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 'clamp(1rem, 2vw, 2rem)' }}>
              <div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 0.9vw, 10px)', color: C.gold, fontWeight: 900, marginBottom: '0.6rem', letterSpacing: 2 }}>STATUS</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {['all', 'pending', 'approved', 'rejected'].map(s => (
                    <FilterButton key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} showCheck={false}>{s.toUpperCase()}</FilterButton>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 0.9vw, 10px)', color: C.gold, fontWeight: 900, marginBottom: '0.6rem', letterSpacing: 2 }}>KATEGORI</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {categories.map(cat => <FilterButton key={cat} active={catFilters.includes(cat)} onClick={() => toggleCategory(cat)}>{cat}</FilterButton>)}
                </div>
              </div>
            </div>

            {/* Lomba spesifik */}
            {availableCompetitions.length > 0 && (
              <div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 0.9vw, 10px)', color: C.gold, fontWeight: 900, marginBottom: '0.6rem', letterSpacing: 2 }}>LOMBA SPESIFIK</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {availableCompetitions.map(comp => (
                    <FilterButton key={comp} active={compFilters.includes(comp)} onClick={() => setCompFilters(prev => prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp])}>{comp}</FilterButton>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── List ── */}
        <div style={{ padding: 'clamp(1rem, 3vw, 3rem) clamp(1rem, 5vw, 4rem)', maxWidth: 1400, margin: '0 auto' }}>

          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 12px)', color: C.gold, fontWeight: 900, letterSpacing: 1, margin: 0 }}>
                {filtered.length} DATA — HAL. {currentPage}/{totalPages || 1}
              </p>
              <button
                onClick={() => setShowExportModal(true)}
                style={{ background: 'transparent', border: `1px solid ${C.green}`, color: C.green, padding: 'clamp(6px,1vw,8px) clamp(10px,1.5vw,16px)', fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px,0.9vw,10px)', fontWeight: 900, letterSpacing: 1, cursor: 'pointer', transition: 'all 0.3s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.green; e.currentTarget.style.color = C.dark }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.green }}
              >EXPORT EXCEL (VALID)</button>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ background: 'none', border: `1px solid ${C.gold}`, color: C.gold, padding: 'clamp(6px,1vw,8px) clamp(10px,1.5vw,15px)', cursor: 'pointer', opacity: currentPage === 1 ? 0.3 : 1, fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px,1vw,11px)', fontWeight: 900 }}>PREV</button>
              <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} style={{ background: 'none', border: `1px solid ${C.gold}`, color: C.gold, padding: 'clamp(6px,1vw,8px) clamp(10px,1.5vw,15px)', cursor: 'pointer', opacity: currentPage === totalPages || totalPages === 0 ? 0.3 : 1, fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px,1vw,11px)', fontWeight: 900 }}>NEXT</button>
            </div>
          </div>

          {/* Registration rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {paginatedData.map((reg) => {
              const s = STATUS_MAP[reg.payment_status] || STATUS_MAP.pending
              return (
                <div key={reg.id} style={{
                  background: C.card, border: `1px solid ${C.border}`,
                  padding: 'clamp(0.75rem, 2vw, 1.5rem) clamp(1rem, 3vw, 2.5rem)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: '0.75rem',
                }}>
                  {/* Name + category */}
                  <div style={{ flex: '2 1 200px', minWidth: 0 }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(7px, 0.9vw, 10px)', color: C.gold, fontWeight: 900, margin: '0 0 3px', letterSpacing: 1 }}>
                      {reg.competition?.category?.name} — {reg.competition?.name}
                    </p>
                    <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(17px, 2.5vw, 26px)', color: C.white, margin: 0, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {reg.user?.name}
                    </h2>
                  </div>

                  {/* Code */}
                  <div style={{ flex: '0 1 90px', textAlign: 'center' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(7px, 0.9vw, 9px)', color: C.gold, fontWeight: 900, margin: '0 0 2px' }}>KODE</p>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(12px, 1.8vw, 18px)', color: C.white, fontWeight: 900, margin: 0 }}>
                      {reg.participant_code || '---'}
                    </p>
                  </div>

                  {/* Status + CTA */}
                  <div style={{ flex: '0 1 auto', display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 1.5vw, 1.5rem)' }}>
                    <span style={{ color: s.color, fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 0.9vw, 10px)', fontWeight: 900, letterSpacing: 1, whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                    <Link href={`/admin/registrations/${reg.id}`}
                      style={{ background: C.white, color: C.dark, padding: 'clamp(8px,1.2vw,10px) clamp(12px,1.8vw,20px)', textDecoration: 'none', fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px,0.9vw,10px)', fontWeight: 900, whiteSpace: 'nowrap' }}
                    >DETAIL</Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Page number buttons */}
          {totalPages > 1 && (
            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} style={{
                  width: 36, height: 36, background: currentPage === i + 1 ? C.gold : 'transparent',
                  color: currentPage === i + 1 ? C.dark : C.gold, border: `1px solid ${C.gold}`,
                  fontWeight: 900, cursor: 'pointer', fontFamily: "'Cinzel', serif", fontSize: 11,
                }}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={handleExport}
        title="Export Data Pendaftaran"
        message="Sistem akan menyiapkan file Excel berisi seluruh data pendaftar yang sudah divalidasi (VALID), lengkap dengan bukti pembayaran. Lanjutkan?"
        confirmText="YA, DOWNLOAD"
        cancelText="BATAL"
      />
    </div>
  )
}