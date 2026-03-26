// resources/js/pages/Competitions/Index.jsx

import { useState, useEffect, useCallback, useRef } from 'react'
import { navigateWithTransition } from '../../hooks/usePageTransition'
import MainLayout from '../../Layouts/MainLayout'

const CREAM   = '#E8D9A0'
const GOLD    = '#C8A84B'
const CRIMSON = '#8B1A1A'

const CAT = {
  TIRTA: {
    bg: '#4A6FA5', text: CREAM, order: 1, photoLeft: false,
    desc: '<b>Berarti air</b>, mewakili kategori Mahasiswa DKV, DFT, IPDM.',
    photo: '/images/TIRTA.svg',
  },
  BUANA: {
    bg: '#5C6B3A', text: CREAM, order: 2, photoLeft: true,
    desc: '<b>Berarti tanah</b>, mewakili kategori SMA.',
    photo: '/images/BUANA.svg',
  },
  BAYU: {
    bg: '#8B6914', text: CREAM, order: 3, photoLeft: false,
    desc: '<b>Berarti angin</b>, mewakili kategori umum.',
    photo: '/images/BAYU.svg',
  },
  AGNI: {
    bg: '#8B2A1A', text: CREAM, order: 4, photoLeft: true,
    desc: '<b>Berarti api</b>, mewakili kategori Mahasiswa Desain Interior.',
    photo: '/images/AGNI.svg',
  },
}
const DEFAULT_CAT = { bg: '#2A2420', text: CREAM, order: 99, photoLeft: false, desc: '', photo: null }

// ─── Breakpoint hook ──────────────────────────────────────────────────────────
function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === 'undefined') return 'desktop'
    const w = window.innerWidth
    if (w < 640)  return 'mobile'
    if (w < 1024) return 'tablet'
    return 'desktop'
  })
  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth
      if (w < 640)  setBp('mobile')
      else if (w < 1024) setBp('tablet')
      else setBp('desktop')
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return bp
}

function useFonts() {
  useEffect(() => {
    if (!document.getElementById('ci-fonts')) {
      const s = document.createElement('style')
      s.id = 'ci-fonts'
      s.textContent = `
        @font-face { font-family:'CSSalient';      src:url('/fonts/CSSalient-Regular.ttf') format('truetype'); }
        @font-face { font-family:'Nord';            src:url('/fonts/NORD-Bold.ttf')         format('truetype'); font-weight:bold; }
        @font-face { font-family:'FamiljenGrotesk'; src:url('/fonts/FamiljenGrotesk-Variable.ttf') format('truetype'); font-weight:100 900; }
      `
      document.head.appendChild(s)
    }
    if (!document.getElementById('ci-gfonts')) {
      const l = document.createElement('link')
      l.id = 'ci-gfonts'; l.rel = 'stylesheet'
      l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
      document.head.appendChild(l)
    }
  }, [])
}

function Dots() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: `radial-gradient(circle, rgba(232,217,160,0.35) 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      opacity: 0.22,
    }} />
  )
}

// ─── Competition icon mapping ─────────────────────────────────────────────────
const COMP_ICONS = {
  'digital campaign':     '/images/competitions/digital campaign 1.svg',
  'character design':     '/images/competitions/character design 1.svg',
  'nail art':             '/images/competitions/nail art design 1.svg',
  'public seating':       '/images/competitions/public seating design 1.svg',
  'children room':        '/images/competitions/children room design 1.svg',
  'pop up':               '/images/competitions/pop up installations 1.svg',
  'film':                 '/images/competitions/film making 1.svg',
  'sneakers':             '/images/competitions/sneakers painting 1.svg',
  'game character':       '/images/competitions/game character design 1.svg',
  'fashion illustration': '/images/competitions/fashion illustration 1.svg',
  'content creating':     '/images/competitions/content creating 1.svg',
  'content creation':     '/images/competitions/content creating 1.svg',
  'private space':        '/images/competitions/private space design 1.svg',
  'english':              '/images/competitions/english public speakig 1.svg',
  'public speaking':      '/images/competitions/english public speakig 1.svg',
  'chinese':              '/images/competitions/chinese tourism pamphlet design 1.svg',
  'pamphlet':             '/images/competitions/chinese tourism pamphlet design 1.svg',
  'comic':                '/images/competitions/comic strip 1.svg',
}

function getIconSrc(name) {
  const n = (name || '').toLowerCase()
  const key = Object.keys(COMP_ICONS).find(k => n.includes(k))
  return COMP_ICONS[key] || '/images/competitions/content_creating_1.svg'
}

// ─── Chevron button ───────────────────────────────────────────────────────────
function ChevronCircle({ color, up = false, size = 44 }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: '50%',
      border: `2px solid ${color}`, flexShrink: 0,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {up ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
      </svg>
    </span>
  )
}

// ─── CLOSED ROW ───────────────────────────────────────────────────────────────
function ClosedRow({ category, cfg, flipLayout, onToggle }) {
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'
  const isTablet = bp === 'tablet'

  // Responsive sizes
  const nameFontSize = isMobile ? '13vw' : isTablet ? '9vw' : 'clamp(52px,9.5vw,128px)'
  const descFontSize = isMobile ? '13px' : isTablet ? '14px' : 'clamp(14px,1.7vw,22px)'
  const rowMinHeight = isMobile ? '90px' : isTablet ? '120px' : 'clamp(110px,17vw,170px)'
  const chevronSize  = isMobile ? 34 : isTablet ? 40 : 48

  // Mobile Layout (Stacked)
  if (isMobile) {
    return (
      <button onClick={onToggle} style={{
        display: 'block', width: '100%', background: cfg.bg,
        border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
        position: 'relative', overflow: 'hidden', minHeight: rowMinHeight,
      }}>
        <Dots />
        <div style={{ 
          position: 'relative', zIndex: 1, 
          display: 'flex', flexDirection: 'column', 
          padding: '14px 16px 18px', gap: 4 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ 
              fontFamily: "'CSSalient',sans-serif", fontSize: nameFontSize, 
              color: cfg.text, lineHeight: 0.85, textTransform: 'uppercase' 
            }}>
              {category.name}
            </span>
            <ChevronCircle color={cfg.text} size={chevronSize} />
          </div>
          <p style={{ 
            fontFamily: "'FamiljenGrotesk',sans-serif", fontSize: descFontSize, 
            color: cfg.text, margin: 0, lineHeight: 1.5, opacity: 0.85 
          }}
            dangerouslySetInnerHTML={{ __html: cfg.desc }} />
        </div>
      </button>
    )
  }

  // Tablet & Desktop Layout (Horizontal Grid)
  const hPad = isTablet ? '0 2rem' : '0 clamp(1.25rem,4vw,2.5rem)'
  const gap  = isTablet ? '1.5rem' : '3rem' // Jarak antar elemen

  return (
    <button onClick={onToggle} style={{
      display: 'block', width: '100%', background: cfg.bg,
      border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
      position: 'relative', overflow: 'hidden', minHeight: rowMinHeight,
    }}>
      <Dots />
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'grid',
        /* LOGIKA GRID:
           - max-content: Judul hanya mengambil lebar selebar teksnya saja (tidak lebar/fixed).
           - 1fr: Mengambil sisa ruang kosong layar sebagai "bantalan" agar Judul & Deskripsi terdorong ke pinggir.
           - auto: Deskripsi menyesuaikan isi teks.
        */
        gridTemplateColumns: flipLayout
          ? `${chevronSize}px 1fr auto max-content` // Untuk BUANA & AGNI (Judul di kanan)
          : `max-content auto 1fr ${chevronSize}px`, // Untuk TIRTA & BAYU (Judul di kiri)
        alignItems: 'center',
        gap,
        padding: hPad,
        minHeight: 'inherit',
        width: '100%', boxSizing: 'border-box',
      }}>
        {flipLayout ? (
          <>
            {/* Urutan: Chevron | Sisa Ruang (1fr) | Deskripsi | Judul */}
            <ChevronCircle color={cfg.text} size={chevronSize} />
            <div /> {/* Spacer fleksibel untuk mendorong teks ke kanan */}
            <p style={{
              fontFamily: "'FamiljenGrotesk',sans-serif",
              fontSize: descFontSize, color: cfg.text, margin: 0, lineHeight: 1.55,
              textAlign: 'right', // Teks rata kanan mengikuti judul
              maxWidth: '450px'
            }} dangerouslySetInnerHTML={{ __html: cfg.desc }} />
            <span style={{
              fontFamily: "'CSSalient',sans-serif",
              fontSize: nameFontSize, color: cfg.text, lineHeight: 0.85,
              textTransform: 'uppercase', letterSpacing: 2, flexShrink: 0,
            }}>
              {category.name}
            </span>
          </>
        ) : (
          <>
            {/* Urutan: Judul | Deskripsi | Sisa Ruang (1fr) | Chevron */}
            <span style={{
              fontFamily: "'CSSalient',sans-serif",
              fontSize: nameFontSize, color: cfg.text, lineHeight: 0.85,
              textTransform: 'uppercase', letterSpacing: 2, flexShrink: 0,
            }}>
              {category.name}
            </span>
            <p style={{
              fontFamily: "'FamiljenGrotesk',sans-serif",
              fontSize: descFontSize, color: cfg.text, margin: 0, lineHeight: 1.55,
              textAlign: 'left', // Teks rata kiri mengikuti judul
              maxWidth: '450px'
            }} dangerouslySetInnerHTML={{ __html: cfg.desc }} />
            <div /> {/* Spacer fleksibel untuk mendorong chevron ke kanan */}
            <ChevronCircle color={cfg.text} size={chevronSize} />
          </>
        )}
      </div>
    </button>
  )
}

// ─── OPEN PANEL (SEAMLESS INFINITE LOOP) ──────────────────────────────────────
function OpenPanel({ category, cfg, flipLayout, onToggle }) {
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'
  const isTablet = bp === 'tablet'

  const comps = category.competitions || []
  const trackRef = useRef(null)
  
  // State index untuk dot indicator (0 sampai comps.length - 1)
  const [idx, setIdx] = useState(0)

  // Duplikasi untuk efek looping: [Terakhir, ...Asli, Pertama]
  const extendedComps = comps.length > 1 
    ? [comps[comps.length - 1], ...comps, comps[0]] 
    : comps

  // Set posisi awal ke index 1 (item asli pertama)
  useEffect(() => {
    if (trackRef.current && comps.length > 1) {
      const slideW = trackRef.current.offsetWidth
      trackRef.current.scrollLeft = slideW
    }
  }, [comps.length])

  const drag = useRef({ 
    active: false, 
    startX: 0, 
    startScrollLeft: 0, 
    moved: false, 
    lastX: 0 
  })

  // Fungsi untuk reset posisi secara instan (Secret Jump)
  const handleInfiniteGap = useCallback(() => {
    const el = trackRef.current
    if (!el || comps.length <= 1 || drag.current.active) return

    const slideW = el.offsetWidth
    const currentScroll = el.scrollLeft
    const totalW = (extendedComps.length - 1) * slideW

    // Jika di Clone Terakhir (Paling Kanan) -> Lompat ke Asli Pertama
    if (currentScroll >= totalW) {
      el.style.scrollBehavior = 'auto'
      el.scrollLeft = slideW
    }
    // Jika di Clone Pertama (Paling Kiri) -> Lompat ke Asli Terakhir
    else if (currentScroll <= 0) {
      el.style.scrollBehavior = 'auto'
      el.scrollLeft = comps.length * slideW
    }

    // Update Dot Indicator berdasarkan posisi scroll
    const rawIdx = Math.round(el.scrollLeft / slideW) - 1
    const normalizedIdx = (rawIdx + comps.length) % comps.length
    if (normalizedIdx !== idx) setIdx(normalizedIdx)
  }, [comps.length, extendedComps.length, idx])

  const scrollTo = (targetIdx) => {
    const el = trackRef.current
    if (!el) return
    el.style.scrollBehavior = 'smooth'
    // +1 karena ada clone di index 0
    el.scrollLeft = (targetIdx + 1) * el.offsetWidth
  }

  const onPointerDown = (e) => {
    if (comps.length <= 1) return
    const el = trackRef.current
    const startX = e.clientX || (e.touches && e.touches[0].clientX)
    
    drag.current = {
      active: true,
      startX,
      lastX: startX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    }
    el.style.scrollSnapType = 'none'
    el.style.scrollBehavior = 'auto'
  }

  const onPointerMove = (e) => {
    if (!drag.current.active) return
    const el = trackRef.current
    const currentX = e.clientX || (e.touches && e.touches[0].clientX)
    
    // Multiplier 1.3 agar geser terasa ringan (minim effort)
    const dx = (drag.current.startX - currentX) * 1.3 
    
    if (Math.abs(dx) > 3) {
      drag.current.moved = true
      el.scrollLeft = drag.current.startScrollLeft + dx
    }
    drag.current.lastX = currentX
  }

  const onPointerUp = () => {
    if (!drag.current.active) return
    drag.current.active = false
    const el = trackRef.current
    if (!el) return

    el.style.scrollSnapType = 'x mandatory'
    el.style.scrollBehavior = 'smooth'

    const slideW = el.offsetWidth
    const velocity = drag.current.startX - drag.current.lastX
    
    // Hitung target berdasarkan posisi scroll saat ini
    let targetIdx = Math.round(el.scrollLeft / slideW) - 1

    // Swipe detection: jika cepat, paksa geser slide
    if (Math.abs(velocity) > 25) {
      targetIdx = velocity > 0 ? targetIdx + 1 : targetIdx - 1
    }

    scrollTo(targetIdx)
    
    // Beri sedikit jeda untuk animasi smooth selesai, lalu cek gap loop
    setTimeout(handleInfiniteGap, 450)
  }

  // ── Sizing Logic ──────────────────────────────────────────────────────────
  const nameFontSize = isMobile ? '13vw' : isTablet ? '9vw' : 'clamp(52px,9.5vw,128px)';
const descFontSize = isMobile ? '13px' : isTablet ? '14px' : 'clamp(14px,1.7vw,22px)';
  const compTitleSize = isMobile ? '18px' : isTablet ? '20px' : 'clamp(16px,2.4vw,30px)'
  const compDescSize  = isMobile ? '13px' : isTablet ? '14px' : 'clamp(13px,1.45vw,19px)'
  const iconSize      = isMobile ? '72px' : isTablet ? '88px' : 'clamp(76px,10vw,130px)'
  const btnPadH       = isMobile ? '10px 22px' : isTablet ? '10px 26px' : 'clamp(9px,1.3vw,13px) clamp(22px,3.5vw,44px)'
  const btnFontSize   = isMobile ? '9px' : '10px'
  const chevronSize   = isMobile ? 34 : isTablet ? 38 : 44
  const showChar      = !isMobile
  const charWidthPx   = isTablet ? 220 : 'clamp(280px,45%,580px)'
  const panelMinH = isMobile ? 'unset' : isTablet ? '380px' : 'clamp(420px,56vw,680px)'
  
  const charPadStyle  = showChar
    ? (flipLayout ? { paddingLeft: isTablet ? 220 : charWidthPx } : { paddingRight: isTablet ? 220 : charWidthPx })
    : {}

  const closeBtnPos   = isMobile
    ? { top: '12px', right: '12px' }
    : (flipLayout ? { top: '24px', left: '24px' } : { top: '24px', right: '24px' })

  return (
    <div style={{ position: 'relative', background: cfg.bg, overflow: 'hidden', minHeight: panelMinH }}>
      <Dots />

      <div style={{ position: 'relative', zIndex: 1, ...charPadStyle, minHeight: panelMinH }}>
        <div style={{
          display: 'flex', flexDirection: 'column',
          padding: isMobile ? '1.5rem 1rem' : '2.5rem 3.5rem',
          justifyContent: 'space-between', minHeight: panelMinH,
          boxSizing: 'border-box'
        }}>
          
          {/* Header */}
          <div style={{ marginBottom: '0.75rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexDirection: isMobile ? 'column' : (flipLayout ? 'row-reverse' : 'row') }}>
              <h2 style={{
                fontFamily: "'CSSalient',sans-serif", fontSize: nameFontSize,
                color: cfg.text, margin: 0, lineHeight: 0.88, textTransform: 'uppercase',
              }}>{category.name}</h2>
              <p style={{
                fontFamily: "'FamiljenGrotesk',sans-serif", fontSize: descFontSize,
                color: cfg.text, margin: isMobile ? 0 : '10px 0 0', lineHeight: 1.5, maxWidth: 280,
              }} dangerouslySetInnerHTML={{ __html: cfg.desc }} />
            </div>
          </div>

          {/* Seamless Track */}
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onScroll={handleInfiniteGap}
            style={{
              flex: 1, display: 'flex', overflowX: 'hidden',
              scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
              cursor: comps.length > 1 ? (drag.current.active ? 'grabbing' : 'grab') : 'default',
              userSelect: 'none', touchAction: 'pan-y',
            }}
          >
            {extendedComps.map((comp, i) => {
              const isApproved = comp?.registrations?.[0]?.payment_status === 'approved'
              return (
                <div key={i} style={{
                  minWidth: '100%', width: '100%', flexShrink: 0,
                  scrollSnapAlign: 'center', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                }}>
                  <img
                    src={getIconSrc(comp.name)}
                    alt=""
                    draggable={false}
                    style={{
                      width: iconSize, height: iconSize, marginBottom: '0.9rem',
                      filter: 'drop-shadow(0 4px 18px rgba(200,168,75,0.6))',
                      pointerEvents: 'none', userSelect: 'none'
                    }}
                  />
                  <h3 style={{
                    fontFamily: "'Cinzel',serif", fontSize: compTitleSize,
                    color: cfg.text, margin: '0 0 0.5rem', textTransform: 'uppercase', fontWeight: 700,
                  }}>{comp.name}</h3>
                  <p style={{
                    fontFamily: "'EB Garamond',serif", fontSize: compDescSize,
                    color: cfg.text, opacity: 0.88, lineHeight: 1.65, margin: '0 0 1.25rem', maxWidth: 420,
                  }}>
                    {`Peserta diminta untuk mengikuti lomba ${comp.name} sesuai dengan tema dan ketentuan dari panitia.`}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button style={{
                      padding: btnPadH, borderRadius: 50, border: `1.5px solid ${cfg.text}`,
                      background: 'transparent', color: cfg.text, fontFamily: "'Cinzel',serif",
                      fontSize: btnFontSize, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer',
                    }}>BRIEF</button>
                    <button 
                      onClick={() => {
                        if (drag.current.moved) return;
                        const reg = comp.registrations?.[0]
                        if (reg?.payment_status === 'approved') {
                          navigateWithTransition(`/history/${reg.id}`)
                        } else {
                          navigateWithTransition(`/competitions/${comp.id}/register`)
                        }
                      }}
                      style={{
                        padding: btnPadH, borderRadius: 50, border: 'none',
                        background: isApproved ? '#7ECBA1' : CREAM, color: isApproved ? '#0A2818' : CRIMSON,
                        fontFamily: "'Cinzel',serif", fontSize: btnFontSize, fontWeight: 900,
                        textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.28)',
                      }}
                    >{isApproved ? 'TERDAFTAR ✓' : 'DAFTAR'}</button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Indicators */}
          {comps.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1rem' }}>
              {comps.map((_, i) => (
                <div key={i} onClick={() => scrollTo(i)} style={{
                  width: i === idx ? 20 : 8, height: 8, borderRadius: 4,
                  background: i === idx ? cfg.text : `${cfg.text}40`,
                  transition: 'all 0.35s ease', cursor: 'pointer',
                }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Character Overlay */}
      {showChar && (
        <div style={{
          position: 'absolute', bottom: 0, height: '100%', zIndex: 5, pointerEvents: 'none',
          ...(flipLayout ? { left: 0, width: isTablet ? 220 : charWidthPx } : { right: 0, width: isTablet ? 220 : charWidthPx }),
        }}>
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2,
            background: flipLayout
              ? `linear-gradient(to right, ${cfg.bg} 0%, ${cfg.bg}BB 20%, transparent 55%)`
              : `linear-gradient(to left,  ${cfg.bg} 0%, ${cfg.bg}BB 20%, transparent 55%)`,
          }} />
          <img src={cfg.photo} alt="" style={{
            position: 'absolute', bottom: 0, height: '100%', width: 'auto',
            ...(flipLayout ? { right: '-30%' } : { left: '-30%' }),
            objectFit: 'contain', filter: 'drop-shadow(0 0 24px rgba(0,0,0,0.45))', zIndex: 3,
          }} />
        </div>
      )}

      {/* Close Button */}
      <button onClick={onToggle} style={{
        position: 'absolute', zIndex: 20, background: 'transparent', border: 'none',
        cursor: 'pointer', padding: 0, ...closeBtnPos,
      }}>
        <ChevronCircle color={cfg.text} up size={chevronSize} />
      </button>
    </div>
  )
}

function CategoryItem({ category, index, total, onOpenChange }) {
  const [open, setOpen] = useState(false)
  const [openHeight, setOpenHeight] = useState(0)
  const openPanelRef = useRef(null)
  
  const key        = category.name?.toUpperCase()
  const cfg        = CAT[key] || DEFAULT_CAT
  const flipLayout = index % 2 !== 0
  const toggle = useCallback(() => {
    setOpen(o => {
      const next = !o
      onOpenChange?.(next)
      return next
    })
  }, [onOpenChange])

  const bp = useBreakpoint()
  const closedHeight = bp === 'mobile' ? '90px' : bp === 'tablet' ? '120px' : '150px'

  

  // Ukur tinggi konten OpenPanel secara dinamis
  useEffect(() => {
    const el = openPanelRef.current
    if (!el) return

    const ro = new ResizeObserver(() => {
      setOpenHeight(el.scrollHeight)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const currentHeight = open ? `${openHeight}px` : closedHeight

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      height: currentHeight,
      transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      borderBottom: index === total - 1 ? 'none' : `1px solid ${cfg.text}15`,
      background: cfg.bg,
      margin: 0,
      padding: 0,
    }}>
      {/* SEKSI CLOSED */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%',
        height: closedHeight,
        opacity: open ? 0 : 1,
        transform: open ? 'scale(0.98) translateY(-10px)' : 'scale(1) translateY(0)',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: open ? 'none' : 'auto',
        zIndex: open ? 1 : 2,
      }}>
        <ClosedRow category={category} cfg={cfg} flipLayout={flipLayout} onToggle={toggle} />
      </div>

      {/* SEKSI OPEN — dibungkus ref untuk diukur */}
      <div
        ref={openPanelRef}
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: open ? 'auto' : 'none',
          zIndex: open ? 2 : 1,
        }}
      >
        <OpenPanel
          category={category}
          cfg={cfg}
          flipLayout={flipLayout}
          onToggle={toggle}
          isOpen={open}
        />
      </div>
    </div>
  )
}

// ─── Page export ──────────────────────────────────────────────────────────────
export default function CompetitionsIndex({ categories = [] }) {
  useFonts()
  const [anyOpen, setAnyOpen] = useState(false)

  const sorted = [...categories].sort((a, b) => {
    const oA = CAT[a.name?.toUpperCase()]?.order ?? 99
    const oB = CAT[b.name?.toUpperCase()]?.order ?? 99
    return oA - oB
  })

  return (
    <MainLayout>
      <div style={{ 
  paddingTop: 52,
  flex: 1,
  position: 'relative',
  background: '#0F0A05'  // ← selalu hitam
}}>
        {sorted.map((cat, i) => (
          <CategoryItem 
            key={cat.id} 
            category={cat} 
            index={i} 
            total={sorted.length}
            onOpenChange={(isOpen) => {
              if (isOpen) setAnyOpen(true)
              else {
                // cek apakah masih ada yang open (defer sedikit agar state lain update dulu)
                setTimeout(() => setAnyOpen(false), 50)
              }
            }}
          />
        ))}

        {/* Teks dekoratif di area bawah */}
<div style={{
  pointerEvents: 'none',
  padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,4vw,3.5rem)',
  overflow: 'hidden',
}}>
  <style>{`
    @keyframes textFloat {
      0%, 100% {
        transform: translateY(0);
        text-shadow: 0 10px 20px rgba(0,0,0,0.4);
        color: ${CREAM};
      }
      50% {
        transform: translateY(-15px);
        text-shadow: 0 20px 40px rgba(200,168,75,0.6);
        color: #FFF;
      }
    }
    .comp-ambient-text {
      animation: textFloat 4s ease-in-out infinite;
      display: inline-block;
    }
  `}</style>
  <h2 className="comp-ambient-text" style={{
  fontFamily: "'CSSalient', sans-serif",
  fontSize: 'clamp(48px, 14vw, 115px)',
  color: CREAM,
  opacity: 0.2,
  margin: 0,
  lineHeight: 0.9,
  textTransform: 'uppercase',
  letterSpacing: 2,
  justifyContent: 'center',
  textAlign: 'center'
}}>
  GET YOURSELF READY TO TAKE THE THRONE!
</h2>
</div>

        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
            <p style={{
              fontFamily: "'Cinzel',serif", fontSize: 12,
              letterSpacing: 3, color: CREAM, opacity: 0.2, textTransform: 'uppercase',
            }}>
              Belum ada kompetisi tersedia
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}