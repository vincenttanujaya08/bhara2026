// resources/js/pages/Admin/Submissions/Index.jsx
import { useState, useEffect, useMemo } from 'react'
import { Link, Head } from '@inertiajs/react'

const C = {
  gold: '#C8A84B',
  goldLight: '#E8C96A',
  crimson: '#8B1A1A',
  dark: '#0F0A05',
  card: 'rgba(255,255,255,0.03)',
  border: 'rgba(200,168,75,0.2)',
  white: '#FFFFFF',
  green: '#7ECBA1',
  red: '#E08080',
}

const CAT_THEME = {
  TIRTA: '#4A7FA5',
  BAYU: '#8B6914',
  AGNI: '#A03020',
  BUANA: '#4A6B3A',
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

function AdminNav({ active = 'submissions' }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#000', height: 75,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(1rem, 5vw, 4rem)', borderBottom: `2px solid ${C.gold}`,
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
            }}>{label}</Link>
          ))}
        </nav>
      </div>
      <Link href="/logout" method="post" as="button" style={{
        background: C.crimson, border: 'none', color: C.white, fontFamily: "'Cinzel', serif", 
        fontSize: 'clamp(9px, 1vw, 12px)', padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 2vw, 28px)', cursor: 'pointer', fontWeight: 900, textTransform: 'uppercase',
      }}>LOGOUT</Link>
    </div>
  )
}

export default function AdminSubmissionsIndex({ submissions = [] }) {
  useFonts()
  
  const [submissionStatus, setSubmissionStatus] = useState('all')
  const [catFilters, setCatFilters] = useState([])
  const [compFilters, setCompFilters] = useState([])
  const [search, setSearch] = useState('')
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12 

  // --- AMBIL DATA KATEGORI ---
  const categories = useMemo(() => [...new Set(submissions.map(s => s.competition?.category?.name?.toUpperCase()))].filter(Boolean).sort(), [submissions])
  
  // --- AMBIL DATA LOMBA (BERDASARKAN KATEGORI TERPILIH) ---
  const availableCompetitions = useMemo(() => {
    return [...new Set(submissions
      .filter(s => catFilters.length === 0 || catFilters.includes(s.competition?.category?.name?.toUpperCase()))
      .map(s => s.competition?.name?.toUpperCase()))].filter(Boolean).sort()
  }, [submissions, catFilters])

  const filtered = useMemo(() => {
    return submissions.filter(s => {
      const isSubmitted = !!s.submission_title
      const matchStatus = submissionStatus === 'all' || (submissionStatus === 'submitted' && isSubmitted) || (submissionStatus === 'pending' && !isSubmitted)
      const matchCat = catFilters.length === 0 || catFilters.includes(s.competition?.category?.name?.toUpperCase())
      const matchComp = compFilters.length === 0 || compFilters.includes(s.competition?.name?.toUpperCase())
      const q = search.toLowerCase()
      const matchSearch = !q || s.user?.name?.toLowerCase().includes(q) || s.submission_title?.toLowerCase().includes(q) || (s.participant_code ?? '').toLowerCase().includes(q)
      
      return matchStatus && matchCat && matchComp && matchSearch
    })
  }, [submissions, submissionStatus, catFilters, compFilters, search])

  // Reset pagination saat filter berubah
  useEffect(() => { setCurrentPage(1) }, [submissionStatus, catFilters, compFilters, search])

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
      <Head title="Galeri Submissions | Admin" />
      <AdminNav active="submissions" />
      
      <div style={{ paddingTop: 75 }}>
        <div style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 4rem)', background: 'linear-gradient(to bottom, #150F0A, #0F0A05)', borderBottom: `2px solid ${C.border}` }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.2vw, 13px)', letterSpacing: 6, color: C.gold, fontWeight: 900, margin: '0 0 1rem' }}>SUBMISSIONS CONTROL</p>
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(36px, 6vw, 72px)', color: C.white, margin: '0 0 3rem', fontWeight: 800, lineHeight: 1 }}>
            Pemantauan Karya
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <input 
              type="text" placeholder="CARI NAMA, JUDUL KARYA, ATAU NOMOR PESERTA..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: 'clamp(15px, 3vw, 24px)', background: 'rgba(255,255,255,0.05)',
                border: `3px solid ${C.gold}40`, color: C.white,
                fontFamily: "'EB Garamond', serif", fontSize: 'clamp(16px, 2.5vw, 24px)', fontWeight: 700, outline: 'none'
              }}
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 10px)', color: C.gold, fontWeight: 900, marginBottom: '0.8rem', letterSpacing: 2 }}>STATUS PENGUMPULAN</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['all', 'submitted', 'pending'].map(s => (
                     <FilterButton key={s} active={submissionStatus === s} onClick={() => setSubmissionStatus(s)} showCheck={false}>{s === 'all' ? 'SEMUA' : s === 'submitted' ? 'SUDAH KUMPUL' : 'BELUM'}</FilterButton>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 10px)', color: C.gold, fontWeight: 900, marginBottom: '0.8rem', letterSpacing: 2 }}>KATEGORI</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {categories.map(cat => (
                    <FilterButton key={cat} active={catFilters.includes(cat)} onClick={() => toggleCategory(cat)}>{cat}</FilterButton>
                  ))}
                </div>
              </div>
            </div>

            {/* --- SMART FILTER LOMBA SPESIFIK --- */}
            {availableCompetitions.length > 0 && (
              <div style={{ marginTop: '1rem', borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: '2rem' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 10px)', color: C.gold, fontWeight: 900, marginBottom: '0.8rem', letterSpacing: 2 }}>LOMBA SPESIFIK</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {availableCompetitions.map(comp => (
                    <FilterButton 
                      key={comp} 
                      active={compFilters.includes(comp)} 
                      onClick={() => setCompFilters(prev => prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp])}
                    >
                      {comp}
                    </FilterButton>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: 'clamp(1.5rem, 4vw, 4rem) clamp(1rem, 5vw, 4rem)', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
             <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.2vw, 12px)', color: C.gold, fontWeight: 900, letterSpacing: 1 }}>
               DITEMUKAN {filtered.length} KARYA — HALAMAN {currentPage} / {totalPages || 1}
             </p>
             <div style={{ display: 'flex', gap: '10px' }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} style={{ background: 'none', border: `1px solid ${C.gold}`, color: C.gold, padding: '5px 15px', cursor: 'pointer', opacity: currentPage === 1 ? 0.3 : 1 }}>PREV</button>
                <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} style={{ background: 'none', border: `1px solid ${C.gold}`, color: C.gold, padding: '5px 15px', cursor: 'pointer', opacity: currentPage === totalPages || totalPages === 0 ? 0.3 : 1 }}>NEXT</button>
             </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', 
            gap: '2rem' 
          }}>
            {paginatedData.map((sub) => {
              const hasWork = !!sub.submission_title
              const catName = sub.competition?.category?.name?.toUpperCase() || 'GENERAL'
              const catColor = CAT_THEME[catName] || C.gold
              
              return (
                <div key={sub.id} style={{ 
                  background: C.card, border: `2px solid ${hasWork ? C.border : 'rgba(255,255,255,0.05)'}`, 
                  padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  opacity: hasWork ? 1 : 0.6,
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: catColor }} />

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                          <p style={{ fontFamily: "'Cinzel', serif", fontSize: '9px', color: catColor, fontWeight: 900, letterSpacing: 2, margin: 0 }}>{catName}</p>
                          <p style={{ fontFamily: "'Cinzel', serif", fontSize: '11px', color: C.white, fontWeight: 900, margin: 0 }}>{sub.competition?.name?.toUpperCase()}</p>
                        </div>
                        <span style={{ 
                          fontFamily: "'Cinzel', serif", fontSize: '7px', 
                          color: hasWork ? C.green : C.gold, border: `1px solid ${hasWork ? C.green : C.gold}`, 
                          padding: '4px 10px', letterSpacing: 1, fontWeight: 900 
                        }}>
                            {hasWork ? 'SUBMITTED' : 'WAITING'}
                        </span>
                    </div>

                    <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(24px, 2.5vw, 30px)', color: C.white, fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.2 }}>
                      {sub.submission_title || 'BELUM ADA JUDUL'}
                    </h2>
                    
                    <div style={{ borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: '1rem' }}>
                      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '18px', color: C.white, fontWeight: 700, margin: '0 0 5px' }}>{sub.user?.name}</p>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: '12px', color: C.gold, fontWeight: 900, margin: 0, letterSpacing: 2 }}>{sub.participant_code || 'NO-CODE'}</p>
                    </div>
                  </div>
                  
                  <Link href={`/admin/submissions/${sub.id}`} style={{
                    display: 'block', width: '100%', padding: '18px', 
                    background: hasWork ? C.gold : 'rgba(255,255,255,0.05)', 
                    color: hasWork ? C.dark : C.white,
                    textDecoration: 'none', textAlign: 'center', fontFamily: "'Cinzel', serif", 
                    fontSize: '11px', fontWeight: 900, letterSpacing: 3, marginTop: '2.5rem',
                    transition: 'all 0.3s ease'
                  }}>
                    {hasWork ? 'LIHAT DETAIL KARYA ↗' : 'LIHAT DETAIL PESERTA'}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}