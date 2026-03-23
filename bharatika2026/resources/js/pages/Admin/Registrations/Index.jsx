// resources/js/pages/Admin/RegistrationsIndex.jsx
import { useState, useEffect, useMemo } from 'react'
import { Link, Head } from '@inertiajs/react'

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

function AdminNav({ active = 'registrations' }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#000', height: 75,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(1.5rem, 5vw, 4rem)', borderBottom: `2px solid ${C.gold}`,
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
            <Link key={key} href={href} style={{
              fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.2vw, 13px)', letterSpacing: 2,
              color: active === key ? C.white : C.gold, textDecoration: 'none', fontWeight: 900,
              borderBottom: active === key ? `3px solid ${C.gold}` : '3px solid transparent',
              paddingBottom: 6, transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => { if(active !== key) e.currentTarget.style.color = C.white }}
              onMouseLeave={e => { if(active !== key) e.currentTarget.style.color = C.gold }}
            >{label}</Link>
          ))}
        </nav>
      </div>
      <Link href="/logout" method="post" as="button" style={{
        background: C.crimson, border: 'none', color: C.white, fontFamily: "'Cinzel', serif", 
        fontSize: 'clamp(9px, 1vw, 12px)', padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 2vw, 28px)', cursor: 'pointer', fontWeight: 900, textTransform: 'uppercase',
        transition: 'all 0.2s ease',
      }}
        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.style.transform = 'translateY(0)' }}
      >LOGOUT</Link>
    </div>
  )
}

export default function AdminRegistrationsIndex({ registrations = [] }) {
  useFonts()
  
  const [statusFilter, setStatusFilter] = useState('all')
  const [catFilters, setCatFilters] = useState([])
  const [compFilters, setCompFilters] = useState([])
  const [search, setSearch] = useState('')
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => { setCurrentPage(1) }, [statusFilter, catFilters, compFilters, search])

  const categories = useMemo(() => [...new Set(registrations.map(r => r.competition?.category?.name?.toUpperCase()))].filter(Boolean).sort(), [registrations])
  
  const availableCompetitions = useMemo(() => [...new Set(registrations
    .filter(r => catFilters.length === 0 || catFilters.includes(r.competition?.category?.name?.toUpperCase()))
    .map(r => r.competition?.name?.toUpperCase()))].filter(Boolean).sort(), [registrations, catFilters])

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

  const FilterButton = ({ active, onClick, children, showCheck = true }) => (
    <button onClick={onClick} style={{
      padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 20px)', 
      fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 10px)', fontWeight: 900, cursor: 'pointer',
      border: `2px solid ${active ? C.gold : 'rgba(255,255,255,0.1)'}`,
      background: active ? `${C.gold}20` : 'rgba(255,255,255,0.05)',
      color: active ? C.gold : C.white,
      display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
    }}>
      {showCheck && <div style={{ width: 10, height: 10, border: `1px solid ${C.gold}`, background: active ? C.gold : 'transparent' }} />}
      {children}
    </button>
  )

  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Head title="Manajemen Pendaftaran | Admin" />
      <AdminNav active="registrations" />

      <div style={{ paddingTop: 75 }}>
        {/* Header Section Responsif */}
        <div style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)', background: 'linear-gradient(to bottom, #150F0A, #0F0A05)', borderBottom: `1px solid ${C.border}` }}>
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(36px, 6vw, 72px)', color: C.white, margin: '0 0 clamp(1.5rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1 }}>
            Kelola Pendaftar
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <input type="text" placeholder="CARI NAMA ATAU KODE..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: 'clamp(15px, 3vw, 24px)', background: 'rgba(255,255,255,0.05)', border: `2px solid ${C.gold}40`, color: C.white, fontFamily: "'EB Garamond', serif", fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 700, outline: 'none' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 10px)', color: C.gold, fontWeight: 900, marginBottom: '0.8rem', letterSpacing: 2 }}>STATUS</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['all', 'pending', 'approved', 'rejected'].map(s => (
                    <FilterButton key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} showCheck={false}>{s.toUpperCase()}</FilterButton>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 10px)', color: C.gold, fontWeight: 900, marginBottom: '0.8rem', letterSpacing: 2 }}>KATEGORI</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {categories.map(cat => <FilterButton key={cat} active={catFilters.includes(cat)} onClick={() => toggleCategory(cat)}>{cat}</FilterButton>)}
                </div>
              </div>
            </div>
            
            {availableCompetitions.length > 0 && (
              <div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 10px)', color: C.gold, fontWeight: 900, marginBottom: '0.8rem', letterSpacing: 2 }}>LOMBA SPESIFIK</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {availableCompetitions.map(comp => (
                    <FilterButton key={comp} active={compFilters.includes(comp)} onClick={() => setCompFilters(prev => prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp])}>{comp}</FilterButton>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* List Peserta Responsif */}
        <div style={{ padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 5vw, 4rem)', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
             <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.2vw, 12px)', color: C.gold, fontWeight: 900, letterSpacing: 1 }}>
               DITEMUKAN {filtered.length} DATA — HALAMAN {currentPage} DARI {totalPages || 1}
             </p>
             <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} style={{ background: 'none', border: `1px solid ${C.gold}`, color: C.gold, padding: '8px 15px', cursor: 'pointer', opacity: currentPage === 1 ? 0.3 : 1 }}>PREV</button>
                <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} style={{ background: 'none', border: `1px solid ${C.gold}`, color: C.gold, padding: '8px 15px', cursor: 'pointer', opacity: currentPage === totalPages || totalPages === 0 ? 0.3 : 1 }}>NEXT</button>
             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {paginatedData.map((reg) => {
              const s = STATUS_MAP[reg.payment_status] || STATUS_MAP.pending;
              return (
                <div key={reg.id} style={{ 
                    background: C.card, border: `1px solid ${C.border}`, padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1.5rem, 3vw, 2.5rem)', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' 
                }}>
                  <div style={{ flex: '2 1 300px' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 1vw, 10px)', color: C.gold, fontWeight: 900, margin: '0 0 4px', letterSpacing: 1 }}>{reg.competition?.category?.name} — {reg.competition?.name}</p>
                    <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(20px, 3vw, 26px)', color: C.white, margin: 0, fontWeight: 800 }}>{reg.user?.name}</h2>
                  </div>
                  
                  <div style={{ flex: '1 1 100px', textAlign: 'center' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 1vw, 9px)', color: C.gold, fontWeight: 900, margin: '0 0 2px' }}>KODE</p>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(14px, 2vw, 18px)', color: C.white, fontWeight: 900, margin: 0 }}>{reg.participant_code || '---'}</p>
                  </div>

                  <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'flex-end' }}>
                    <span style={{ color: s.color, fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 1vw, 10px)', fontWeight: 900, letterSpacing: 1 }}>{s.label}</span>
                    <Link href={`/admin/registrations/${reg.id}`} style={{ background: C.white, color: C.dark, padding: '10px 20px', textDecoration: 'none', fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 10px)', fontWeight: 900, textAlign: 'center' }}>DETAIL</Link>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
               {[...Array(totalPages)].map((_, i) => (
                 <button key={i} onClick={() => setCurrentPage(i + 1)} style={{
                   width: '40px', height: '40px', background: currentPage === i + 1 ? C.gold : 'transparent',
                   color: currentPage === i + 1 ? C.dark : C.gold, border: `1px solid ${C.gold}`,
                   fontWeight: 900, cursor: 'pointer', marginBottom: '5px'
                 }}>{i + 1}</button>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}