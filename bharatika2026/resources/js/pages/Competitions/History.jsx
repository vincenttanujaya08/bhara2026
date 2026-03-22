import { useState, useMemo, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import { navigateWithTransition } from '../../hooks/usePageTransition'
import MainLayout from '../../Layouts/MainLayout'


const C = {
  gold: '#C8A84B',
  goldLight: '#E8C96A',
  cream: '#E8D9A0',
  parchment: '#D4C48A',
  crimson: '#8B1A1A',
  dark: '#0F0A05',
  ink: '#1A1208',
}


const STATUS = {
  pending:  { label: 'Verifikasi',  color: '#C8A84B', glow: 'rgba(200,168,75,0.4)',  seal: '⏳', bg: 'rgba(200,168,75,0.06)' },
  approved: { label: 'Terdaftar',   color: '#7ECBA1', glow: 'rgba(126,203,161,0.4)', seal: '✦', bg: 'rgba(126,203,161,0.06)' },
  rejected: { label: 'Ditolak',     color: '#E08080', glow: 'rgba(224,128,128,0.4)', seal: '✕', bg: 'rgba(224,128,128,0.06)' },
}


const CATEGORY_COLOR = {
  TIRTA: '#4A7FA5',
  BAYU:  '#8B6914',
  AGNI:  '#A03020',
  BUANA: '#4A6B3A',
}


function useFonts() {
  useEffect(() => {
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
    document.head.appendChild(l)
    if (document.getElementById('cssalient-font')) return
    const s = document.createElement('style')
    s.id = 'cssalient-font'
    s.textContent = `@font-face { font-family:'FamiljenGrotesk'; src:url('/fonts/FamiljenGrotesk-Variable.ttf') format('truetype'); font-weight:100 900; }`
    document.head.appendChild(s)
  }, [])
}


// Ornamental divider SVG
function OrnamentDivider({ color = C.gold, opacity = 0.3 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${color})` }} />
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M8 0 L10 6 L16 6 L11 10 L13 16 L8 12 L3 16 L5 10 L0 6 L6 6 Z" fill={color} />
      </svg>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  )
}


// Wax seal component
function WaxSeal({ status }) {
  const s = STATUS[status] || STATUS.pending
  return (
    <div style={{
      width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
      background: `radial-gradient(circle at 35% 35%, ${s.color}cc, ${s.color}66)`,
      boxShadow: `0 0 0 2px ${s.color}40, 0 4px 12px ${s.color}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20, position: 'relative',
    }}>
      <span style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>{s.seal}</span>
      {/* Seal ring */}
      <div style={{
        position: 'absolute', inset: 3, borderRadius: '50%',
        border: `1px solid ${s.color}60`,
      }} />
    </div>
  )
}


// Category banner strip
function CategoryBanner({ name }) {
  const color = CATEGORY_COLOR[name?.toUpperCase()] || C.crimson
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      background: `${color}25`, border: `1px solid ${color}50`,
      padding: '3px 10px 3px 6px',
    }}>
      <div style={{ width: 6, height: 6, background: color, transform: 'rotate(45deg)', flexShrink: 0 }} />
      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color: color, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
        {name}
      </span>
    </div>
  )
}


function ParchmentCard({ reg }) {
  const [hovered, setHovered] = useState(false)
  const s = STATUS[reg.payment_status] || STATUS.pending
  const catColor = CATEGORY_COLOR[reg.competition?.category?.name?.toUpperCase()] || C.crimson


  const footerText = reg.payment_status === 'pending'
    ? 'Menunggu verifikasi panitia'
    : reg.payment_status === 'approved'
    ? (reg.submission_file ? 'Karya telah dikumpulkan' : 'Silakan kumpulkan karya Anda')
    : 'Dokumen perlu direvisi'


  return (
    <div
      onClick={() => navigateWithTransition(`/history/${reg.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', cursor: 'pointer',
        background: `linear-gradient(145deg, #1C0F08 0%, #140C06 60%, #1A1008 100%)`,
        border: `1px solid ${hovered ? C.gold : 'rgba(200,168,75,0.15)'}`,
        padding: '0', overflow: 'hidden',
        transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
        boxShadow: hovered
          ? `0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px ${C.gold}30`
          : '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      {/* Category color accent top bar */}
      <div style={{ height: 3, background: `linear-gradient(to right, ${catColor}, ${catColor}40)` }} />


      {/* Status glow bg */}
      <div style={{ position: 'absolute', inset: 0, background: s.bg, pointerEvents: 'none' }} />


      {/* Corner ornament top-right */}
      <div style={{ position: 'absolute', top: 12, right: 12, opacity: 0.15 }}>
        <svg width="32" height="32" viewBox="0 0 32 32">
          <path d="M0 0 L32 0 L32 32" fill="none" stroke={C.gold} strokeWidth="1" />
          <path d="M6 0 L32 0 L32 26" fill="none" stroke={C.gold} strokeWidth="0.5" />
        </svg>
      </div>


      <div style={{ padding: '1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Top row: seal + competition name */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <WaxSeal status={reg.payment_status} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <CategoryBanner name={reg.competition?.category?.name} />
            <h3 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(14px, 2vw, 17px)',
              color: C.cream, margin: '0.5rem 0 0',
              fontWeight: 600, lineHeight: 1.25,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {reg.competition?.name}
            </h3>
          </div>
        </div>


        {/* Status label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{
            fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2,
            color: s.color, textTransform: 'uppercase', fontWeight: 600,
            borderBottom: `1px solid ${s.color}50`, paddingBottom: 2,
          }}>{s.label}</span>
          <span style={{
            fontFamily: "'Cinzel', serif", fontSize: 11,
            color: reg.participant_code ? C.gold : 'rgba(200,168,75,0.2)',
            letterSpacing: 2, fontWeight: reg.participant_code ? 700 : 400,
          }}>
            {reg.participant_code || '— — —'}
          </span>
        </div>


        <OrnamentDivider color={s.color} opacity={0.2} />


        {/* Footer */}
        <p style={{
          fontFamily: "'EB Garamond', serif", fontSize: 13,
          color: s.color, margin: '0.75rem 0 0',
          fontStyle: 'italic', opacity: 0.85, lineHeight: 1.4,
        }}>
          {footerText}
        </p>
      </div>


      {/* Bottom corner ornament */}
      <div style={{ position: 'absolute', bottom: 10, left: 12, opacity: 0.1 }}>
        <svg width="28" height="28" viewBox="0 0 32 32">
          <path d="M0 32 L0 0 L32 32" fill="none" stroke={C.gold} strokeWidth="1" />
        </svg>
      </div>
    </div>
  )
}


export default function History({ registrations = [] }) {
  useFonts()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')


  const categories = useMemo(() => {
    const names = registrations.map(r => r.competition?.category?.name).filter(Boolean)
    return [...new Set(names)]
  }, [registrations])


  const filtered = useMemo(() => registrations.filter(r => {
    const q = search.toLowerCase()
    return (
      (!q || r.competition?.name?.toLowerCase().includes(q)) &&
      (catFilter === 'all' || r.competition?.category?.name === catFilter) &&
      (statusFilter === 'all' || r.payment_status === statusFilter)
    )
  }), [registrations, search, catFilter, statusFilter])


  const stats = {
    total: registrations.length,
    approved: registrations.filter(r => r.payment_status === 'approved').length,
    pending: registrations.filter(r => r.payment_status === 'pending').length,
    rejected: registrations.filter(r => r.payment_status === 'rejected').length,
  }


  return (
    <MainLayout>
      <Head title="Dashboard" />
      <div style={{ minHeight: '100vh', background: C.dark, position: 'relative', overflow: 'hidden' }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #3A0808 0%, #0F0A05 60%)', pointerEvents: 'none' }} />
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08, pointerEvents: 'none', mixBlendMode: 'overlay' }} />


        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '110px 2rem 6rem' }}>


          {/* ── Hero header ── */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 6, color: C.gold, opacity: 0.6, textTransform: 'uppercase', margin: '0 0 0.75rem' }}>
              Bharatika 2026
            </p>
            <h1 style={{
              fontFamily: "'UnifrakturMaguntia', serif",
              fontSize: 'clamp(48px, 8vw, 96px)',
              color: C.cream, margin: '0 0 0.5rem', lineHeight: 1,
            }}>
              Daftar Pendaftaran
            </h1>
            <OrnamentDivider color={C.gold} opacity={0.4} />


            {/* Stats row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Total', value: stats.total, color: C.cream },
                { label: 'Terdaftar', value: stats.approved, color: STATUS.approved.color },
                { label: 'Menunggu', value: stats.pending, color: STATUS.pending.color },
                { label: 'Ditolak', value: stats.rejected, color: STATUS.rejected.color },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(24px, 4vw, 36px)', color, margin: 0, fontWeight: 700, lineHeight: 1 }}>{value}</p>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color, opacity: 0.55, margin: '4px 0 0', letterSpacing: 2, textTransform: 'uppercase' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>


          {/* ── Filter bar ── */}
          <div style={{
            display: 'flex', gap: '0.75rem', marginBottom: '2.5rem',
            flexWrap: 'wrap',
            background: 'rgba(200,168,75,0.04)',
            border: '1px solid rgba(200,168,75,0.12)',
            padding: '1rem',
          }}>
            <input
              type="text"
              placeholder="Cari nama kompetisi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: '2 1 200px', padding: '10px 14px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(200,168,75,0.2)',
                color: C.cream, outline: 'none',
                fontFamily: "'EB Garamond', serif", fontSize: 15,
                transition: 'border 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(200,168,75,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(200,168,75,0.2)'}
            />
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              style={{ flex: '1 1 140px', padding: '10px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(200,168,75,0.2)', color: C.cream, fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 1, outline: 'none', cursor: 'pointer' }}>
              <option value="all" style={{ background: C.dark }}>Semua Kategori</option>
              {categories.map(c => <option key={c} value={c} style={{ background: C.dark }}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ flex: '1 1 140px', padding: '10px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(200,168,75,0.2)', color: C.cream, fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 1, outline: 'none', cursor: 'pointer' }}>
              <option value="all" style={{ background: C.dark }}>Semua Status</option>
              <option value="pending" style={{ background: C.dark }}>Menunggu</option>
              <option value="approved" style={{ background: C.dark }}>Terdaftar</option>
              <option value="rejected" style={{ background: C.dark }}>Ditolak</option>
            </select>
          </div>


          {/* ── Cards ── */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
              <p style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 48, color: C.cream, opacity: 0.15, margin: '0 0 1rem' }}>✦</p>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: C.cream, opacity: 0.25, letterSpacing: 3, textTransform: 'uppercase' }}>Tidak ada pendaftaran</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {filtered.map(r => <ParchmentCard key={r.id} reg={r} />)}
            </div>
          )}


        </div>
      </div>
    </MainLayout>
  )
}

