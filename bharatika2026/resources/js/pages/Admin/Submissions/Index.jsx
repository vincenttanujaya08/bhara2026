// resources/js/pages/Admin/Submissions/Index.jsx
import { useState, useEffect, useMemo } from 'react'
import { Link, Head } from '@inertiajs/react'
import { AdminNav } from '../Dashboard'   // re-use shared nav

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
  BAYU:  '#8B6914',
  AGNI:  '#A03020',
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

export default function AdminSubmissionsIndex({ submissions = [] }) {
  useFonts()

  const [submissionStatus, setSubmissionStatus] = useState('all')
  const [catFilters, setCatFilters] = useState([])
  const [compFilters, setCompFilters] = useState([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const categories = useMemo(() =>
    [...new Set(submissions.map(s => s.competition?.category?.name?.toUpperCase()))].filter(Boolean).sort(),
    [submissions])

  const availableCompetitions = useMemo(() =>
    [...new Set(submissions
      .filter(s => catFilters.length === 0 || catFilters.includes(s.competition?.category?.name?.toUpperCase()))
      .map(s => s.competition?.name?.toUpperCase()))].filter(Boolean).sort(),
    [submissions, catFilters])

  const filtered = useMemo(() => submissions.filter(s => {
    const isSubmitted = !!s.submission_title
    const matchStatus = submissionStatus === 'all' || (submissionStatus === 'submitted' && isSubmitted) || (submissionStatus === 'pending' && !isSubmitted)
    const matchCat = catFilters.length === 0 || catFilters.includes(s.competition?.category?.name?.toUpperCase())
    const matchComp = compFilters.length === 0 || compFilters.includes(s.competition?.name?.toUpperCase())
    const q = search.toLowerCase()
    const matchSearch = !q || s.user?.name?.toLowerCase().includes(q) || s.submission_title?.toLowerCase().includes(q) || (s.participant_code ?? '').toLowerCase().includes(q)
    return matchStatus && matchCat && matchComp && matchSearch
  }), [submissions, submissionStatus, catFilters, compFilters, search])

  useEffect(() => { setCurrentPage(1) }, [submissionStatus, catFilters, compFilters, search])

  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const toggleCategory = (cat) => {
    setCatFilters(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
    setCompFilters([])
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
      <Head title="Galeri Submissions | Admin" />
      <AdminNav active="submissions" />

      <div style={{ paddingTop: 64 }}>

        {/* ── Header + Filters ── */}
        <div style={{ padding: 'clamp(1.5rem, 4vw, 4rem) clamp(1rem, 5vw, 4rem)', background: 'linear-gradient(to bottom, #150F0A, #0F0A05)', borderBottom: `2px solid ${C.border}` }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1.1vw, 13px)', letterSpacing: 6, color: C.gold, fontWeight: 900, margin: '0 0 0.75rem' }}>
            SUBMISSIONS CONTROL
          </p>
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(28px, 5vw, 72px)', color: C.white, margin: '0 0 clamp(1.5rem, 3vw, 3rem)', fontWeight: 800, lineHeight: 1 }}>
            Pemantauan Karya
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2.5vw, 2rem)' }}>
            {/* Search */}
            <input
              type="text" placeholder="CARI NAMA, JUDUL KARYA, ATAU NOMOR PESERTA..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: 'clamp(12px, 2.5vw, 24px)', background: 'rgba(255,255,255,0.05)', border: `3px solid ${C.gold}40`, color: C.white, fontFamily: "'EB Garamond', serif", fontSize: 'clamp(14px, 2vw, 24px)', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
            />

            {/* Status + Kategori */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 'clamp(1rem, 2vw, 2rem)' }}>
              <div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 0.9vw, 10px)', color: C.gold, fontWeight: 900, marginBottom: '0.6rem', letterSpacing: 2 }}>STATUS PENGUMPULAN</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {['all', 'submitted', 'pending'].map(s => (
                    <FilterButton key={s} active={submissionStatus === s} onClick={() => setSubmissionStatus(s)} showCheck={false}>
                      {s === 'all' ? 'SEMUA' : s === 'submitted' ? 'SUDAH KUMPUL' : 'BELUM'}
                    </FilterButton>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 0.9vw, 10px)', color: C.gold, fontWeight: 900, marginBottom: '0.6rem', letterSpacing: 2 }}>KATEGORI</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {categories.map(cat => (
                    <FilterButton key={cat} active={catFilters.includes(cat)} onClick={() => toggleCategory(cat)}>{cat}</FilterButton>
                  ))}
                </div>
              </div>
            </div>

            {/* Lomba spesifik */}
            {availableCompetitions.length > 0 && (
              <div style={{ borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: 'clamp(1rem, 2vw, 2rem)' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 0.9vw, 10px)', color: C.gold, fontWeight: 900, marginBottom: '0.6rem', letterSpacing: 2 }}>LOMBA SPESIFIK</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {availableCompetitions.map(comp => (
                    <FilterButton key={comp} active={compFilters.includes(comp)} onClick={() => setCompFilters(prev => prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp])}>
                      {comp}
                    </FilterButton>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Cards grid ── */}
        <div style={{ padding: 'clamp(1rem, 3vw, 4rem) clamp(1rem, 5vw, 4rem)', maxWidth: 1400, margin: '0 auto' }}>

          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(1rem, 2vw, 2.5rem)', flexWrap: 'wrap', gap: '0.75rem' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 12px)', color: C.gold, fontWeight: 900, letterSpacing: 1, margin: 0 }}>
              {filtered.length} KARYA — HAL. {currentPage}/{totalPages || 1}
            </p>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ background: 'none', border: `1px solid ${C.gold}`, color: C.gold, padding: 'clamp(5px,1vw,5px) clamp(10px,1.5vw,15px)', cursor: 'pointer', opacity: currentPage === 1 ? 0.3 : 1, fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 'clamp(9px,1vw,11px)' }}>PREV</button>
              <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} style={{ background: 'none', border: `1px solid ${C.gold}`, color: C.gold, padding: 'clamp(5px,1vw,5px) clamp(10px,1.5vw,15px)', cursor: 'pointer', opacity: currentPage === totalPages || totalPages === 0 ? 0.3 : 1, fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 'clamp(9px,1vw,11px)' }}>NEXT</button>
            </div>
          </div>

          {/* Responsive card grid: 1 col mobile → 2 col tablet → 3 col desktop */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: 'clamp(0.75rem, 2vw, 2rem)',
          }}>
            {paginatedData.map((sub) => {
              const hasWork = !!sub.submission_title
              const catName = sub.competition?.category?.name?.toUpperCase() || 'GENERAL'
              const catColor = CAT_THEME[catName] || C.gold

              return (
                <div key={sub.id} style={{
                  background: C.card, border: `2px solid ${hasWork ? C.border : 'rgba(255,255,255,0.05)'}`,
                  padding: 'clamp(1.25rem, 2.5vw, 2.5rem)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  opacity: hasWork ? 1 : 0.6,
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Color bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: catColor }} />

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div>
                        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px, 0.9vw, 9px)', color: catColor, fontWeight: 900, letterSpacing: 2, margin: 0 }}>{catName}</p>
                        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 11px)', color: C.white, fontWeight: 900, margin: 0 }}>{sub.competition?.name?.toUpperCase()}</p>
                      </div>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(7px, 0.8vw, 7px)', color: hasWork ? C.green : C.gold, border: `1px solid ${hasWork ? C.green : C.gold}`, padding: 'clamp(3px,0.5vw,4px) clamp(6px,1vw,10px)', letterSpacing: 1, fontWeight: 900, whiteSpace: 'nowrap' }}>
                        {hasWork ? 'SUBMITTED' : 'WAITING'}
                      </span>
                    </div>

                    <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(20px, 2.5vw, 30px)', color: C.white, fontWeight: 800, margin: '0 0 0.75rem', lineHeight: 1.2 }}>
                      {sub.submission_title || 'BELUM ADA JUDUL'}
                    </h2>

                    <div style={{ borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: '0.75rem' }}>
                      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(15px, 1.8vw, 18px)', color: C.white, fontWeight: 700, margin: '0 0 4px' }}>{sub.user?.name}</p>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.1vw, 12px)', color: C.gold, fontWeight: 900, margin: 0, letterSpacing: 2 }}>{sub.participant_code || 'NO-CODE'}</p>
                    </div>
                  </div>

                  <Link href={`/admin/submissions/${sub.id}`} style={{
                    display: 'block', width: '100%', padding: 'clamp(14px, 1.8vw, 18px)',
                    background: hasWork ? C.gold : 'rgba(255,255,255,0.05)',
                    color: hasWork ? C.dark : C.white,
                    textDecoration: 'none', textAlign: 'center',
                    fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 11px)', fontWeight: 900, letterSpacing: 3,
                    marginTop: '1.75rem', transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
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