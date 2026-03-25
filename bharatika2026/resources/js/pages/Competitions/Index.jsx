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

  // Font size tiers
  const nameFontSize = isMobile ? '13vw' : isTablet ? '9vw' : 'clamp(52px,9.5vw,128px)'
  const descFontSize = isMobile ? '13px' : isTablet ? '14px' : 'clamp(14px,1.7vw,22px)'
  const rowMinHeight = isMobile ? '90px' : isTablet ? '120px' : 'clamp(110px,17vw,170px)'
  const chevronSize  = isMobile ? 34 : isTablet ? 40 : 48

  if (isMobile) {
    // Mobile: stack vertikally — name besar di atas, desc kecil di bawah, chevron di pojok
    return (
      <button onClick={onToggle} style={{
        display: 'block', width: '100%', background: cfg.bg,
        border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
        position: 'relative', overflow: 'hidden',
        minHeight: rowMinHeight,
      }}>
        <Dots />
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          padding: '14px 16px 18px',
          gap: 4,
        }}>
          {/* Name row with chevron */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontFamily: "'CSSalient',sans-serif",
              fontSize: nameFontSize,
              color: cfg.text, lineHeight: 0.85,
              textTransform: 'uppercase', letterSpacing: 1,
            }}>
              {category.name}
            </span>
            <ChevronCircle color={cfg.text} size={chevronSize} />
          </div>
          {/* Desc */}
          <p style={{
            fontFamily: "'FamiljenGrotesk',sans-serif",
            fontSize: descFontSize, color: cfg.text,
            margin: 0, lineHeight: 1.5, opacity: 0.85,
          }}
            dangerouslySetInnerHTML={{ __html: cfg.desc }} />
        </div>
      </button>
    )
  }

  // Tablet & Desktop: horizontal grid (same logic, tighter on tablet)
  const hPad = isTablet ? '0 1.5rem' : '0 clamp(1.25rem,4vw,2.5rem)'
  const gap  = isTablet ? '1rem' : 'clamp(1rem,3vw,2.5rem)'

  return (
    <button onClick={onToggle} style={{
      display: 'block', width: '100%', background: cfg.bg,
      border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
      position: 'relative', overflow: 'hidden',
      minHeight: rowMinHeight,
    }}>
      <Dots />
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'grid',
        gridTemplateColumns: flipLayout
          ? `${chevronSize}px 1fr auto`
          : `auto 1fr ${chevronSize}px`,
        alignItems: 'center',
        gap,
        padding: hPad,
        minHeight: 'inherit',
        width: '100%', boxSizing: 'border-box',
      }}>
        {flipLayout ? (
          <>
            <ChevronCircle color={cfg.text} size={chevronSize} />
            <p style={{
              fontFamily: "'FamiljenGrotesk',sans-serif",
              fontSize: descFontSize, color: cfg.text, margin: 0, lineHeight: 1.55,
            }}
              dangerouslySetInnerHTML={{ __html: cfg.desc }} />
            <span style={{
              fontFamily: "'CSSalient',sans-serif",
              fontSize: nameFontSize, color: cfg.text, lineHeight: 0.85,
              textTransform: 'uppercase', letterSpacing: 2, flexShrink: 0, whiteSpace: 'nowrap',
            }}>
              {category.name}
            </span>
          </>
        ) : (
          <>
            <span style={{
              fontFamily: "'CSSalient',sans-serif",
              fontSize: nameFontSize, color: cfg.text, lineHeight: 0.85,
              textTransform: 'uppercase', letterSpacing: 2, flexShrink: 0, whiteSpace: 'nowrap',
            }}>
              {category.name}
            </span>
            <p style={{
              fontFamily: "'FamiljenGrotesk',sans-serif",
              fontSize: descFontSize, color: cfg.text, margin: 0, lineHeight: 1.55,
            }}
              dangerouslySetInnerHTML={{ __html: cfg.desc }} />
            <ChevronCircle color={cfg.text} size={chevronSize} />
          </>
        )}
      </div>
    </button>
  )
}

// ─── OPEN PANEL ───────────────────────────────────────────────────────────────
function OpenPanel({ category, cfg, flipLayout, onToggle }) {
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'
  const isTablet = bp === 'tablet'

  const comps    = category.competitions || []
  const trackRef = useRef(null)
  const [idx, setIdx] = useState(0)

  const drag = useRef({ active: false, startX: 0, startScrollLeft: 0, moved: false })

  const syncIdx = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const slideW = el.offsetWidth
    if (slideW === 0) return
    const newIdx = Math.round(el.scrollLeft / slideW)
    setIdx(Math.min(Math.max(newIdx, 0), comps.length - 1))
  }, [comps.length])

  const scrollTo = useCallback((targetIdx) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: targetIdx * el.offsetWidth, behavior: 'smooth' })
    setIdx(targetIdx)
  }, [])

  const onPointerDown = useCallback((e) => {
    const el = trackRef.current
    if (!el) return
    drag.current = {
      active: true,
      startX: e.touches ? e.touches[0].clientX : e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    }
    el.style.scrollBehavior = 'auto'
  }, [])

  const onPointerMove = useCallback((e) => {
    if (!drag.current.active) return
    if (e.cancelable) e.preventDefault()
    const el = trackRef.current
    if (!el) return
    const x  = e.touches ? e.touches[0].clientX : e.clientX
    const dx = drag.current.startX - x
    if (Math.abs(dx) > 5) drag.current.moved = true
    el.scrollLeft = drag.current.startScrollLeft + dx
  }, [])

  const onPointerUp = useCallback(() => {
    if (!drag.current.active) return
    drag.current.active = false
    const el = trackRef.current
    if (!el) return
    el.style.scrollBehavior = 'smooth'
    if (drag.current.moved) {
      const slideW  = el.offsetWidth
      const nearest = Math.round(el.scrollLeft / slideW)
      scrollTo(Math.min(Math.max(nearest, 0), comps.length - 1))
    }
  }, [comps.length, scrollTo])

  const handleBtnClick = useCallback((action, e) => {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
      return
    }
    action()
  }, [])

  // ── Responsive sizing values ────────────────────────────────────────────────
  const nameFontSize = isMobile ? '11vw' : isTablet ? '6vw' : 'clamp(34px,5.2vw,78px)'
  const descFontSize = isMobile ? '12px' : isTablet ? '13px' : 'clamp(12px,1.4vw,18px)'
  const compTitleSize = isMobile ? '18px' : isTablet ? '20px' : 'clamp(16px,2.4vw,30px)'
  const compDescSize  = isMobile ? '13px' : isTablet ? '14px' : 'clamp(13px,1.45vw,19px)'
  const iconSize      = isMobile ? '72px' : isTablet ? '88px' : 'clamp(76px,10vw,130px)'
  const btnPadH       = isMobile ? '10px 22px' : isTablet ? '10px 26px' : 'clamp(9px,1.3vw,13px) clamp(22px,3.5vw,44px)'
  const btnFontSize   = isMobile ? '9px' : '10px'
  const chevronSize   = isMobile ? 34 : isTablet ? 38 : 44

  // ── Character overlay — hidden on mobile, smaller on tablet ────────────────
  // On mobile we skip the character overlay completely to give full width to content
  const showChar = !isMobile
  // The padding we reserve for the character panel
  const charWidthPx = isTablet ? 220 : 'clamp(280px,45%,580px)'
  // In tablet mode we use a fixed pixel amount
  const charPadStyle = showChar
    ? (flipLayout
        ? { paddingLeft:  isTablet ? 220 : charWidthPx }
        : { paddingRight: isTablet ? 220 : charWidthPx })
    : {}

  const panelMinH = isMobile ? 'auto' : isTablet ? '380px' : 'clamp(420px,56vw,680px)'

  // Close button offset
  const closeBtnPos = isMobile
    ? { top: '12px', right: '12px' }
    : (flipLayout
        ? { top: 'clamp(14px,2vw,24px)', left:  'clamp(14px,2vw,24px)' }
        : { top: 'clamp(14px,2vw,24px)', right: 'clamp(14px,2vw,24px)' })

  // ── Character overlay element ───────────────────────────────────────────────
  const CharOverlay = showChar && (
    <div style={{
      position: 'absolute',
      bottom: 0,
      ...(flipLayout
        ? { left: 0, width: isTablet ? 220 : charWidthPx }
        : { right: 0, width: isTablet ? 220 : charWidthPx }
      ),
      height: '100%',
      zIndex: 5,
      pointerEvents: 'none',
    }}>
      {/* Gradient blend */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: flipLayout
          ? `linear-gradient(to right, ${cfg.bg} 0%, ${cfg.bg}BB 20%, transparent 55%)`
          : `linear-gradient(to left,  ${cfg.bg} 0%, ${cfg.bg}BB 20%, transparent 55%)`,
      }} />
      <img
        src={cfg.photo} alt={category.name}
        style={{
          position: 'absolute', bottom: 0,
          ...(flipLayout
            ? { right: '-30%', left: 'auto' }
            : { left:  '-30%', right: 'auto' }
          ),
          height: '100%', width: 'auto',
          objectFit: 'contain', objectPosition: 'bottom center',
          filter: 'drop-shadow(0 0 24px rgba(0,0,0,0.45))',
          zIndex: 3, userSelect: 'none',
        }}
        onError={e => { e.target.style.display = 'none' }}
      />
    </div>
  )

  // ── Content inner area ──────────────────────────────────────────────────────
  const hPad = isMobile ? '1rem 1rem 1.25rem' : isTablet ? '1.25rem 1.5rem' : 'clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,4vw,3.5rem)'

  const ContentArea = (
    <div style={{
      display: 'flex', flexDirection: 'column',
      padding: hPad,
      justifyContent: 'space-between',
      overflow: 'hidden',
      position: 'relative',
      minHeight: panelMinH,
    }}>
      {/* ── Category header ── */}
      <div style={{ marginBottom: '0.75rem', flexShrink: 0 }}>
        {/* On mobile: always stacked, no flip */}
        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{
              fontFamily: "'CSSalient',sans-serif",
              fontSize: nameFontSize,
              color: cfg.text, margin: 0, lineHeight: 0.88,
              textTransform: 'uppercase',
            }}>{category.name}</h2>
            <p style={{
              fontFamily: "'FamiljenGrotesk',sans-serif",
              fontSize: descFontSize,
              color: cfg.text, margin: 0, lineHeight: 1.5,
            }}
              dangerouslySetInnerHTML={{ __html: cfg.desc }} />
          </div>
        ) : flipLayout ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(0.75rem,1.5vw,1.25rem)', flexWrap: 'wrap' }}>
            <p style={{
              fontFamily: "'FamiljenGrotesk',sans-serif",
              fontSize: descFontSize,
              color: cfg.text, margin: 'clamp(4px,0.8vw,10px) 0 0',
              lineHeight: 1.5, maxWidth: 280,
            }} dangerouslySetInnerHTML={{ __html: cfg.desc }} />
            <h2 style={{
              fontFamily: "'CSSalient',sans-serif",
              fontSize: nameFontSize,
              color: cfg.text, margin: 0, lineHeight: 0.88,
              textTransform: 'uppercase', flexShrink: 0,
            }}>{category.name}</h2>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(0.75rem,1.5vw,1.25rem)', flexWrap: 'wrap' }}>
            <h2 style={{
              fontFamily: "'CSSalient',sans-serif",
              fontSize: nameFontSize,
              color: cfg.text, margin: 0, lineHeight: 0.88,
              textTransform: 'uppercase', flexShrink: 0,
            }}>{category.name}</h2>
            <p style={{
              fontFamily: "'FamiljenGrotesk',sans-serif",
              fontSize: descFontSize,
              color: cfg.text, margin: 'clamp(4px,0.8vw,10px) 0 0',
              lineHeight: 1.5, maxWidth: 280,
            }} dangerouslySetInnerHTML={{ __html: cfg.desc }} />
          </div>
        )}
      </div>

      {/* ── Carousel track ── */}
      <div
        ref={trackRef}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
        onScroll={syncIdx}
        style={{
          flex: 1,
          display: 'flex',
          overflowX: 'scroll',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: comps.length > 1 ? 'grab' : 'default',
          userSelect: 'none',
          WebkitOverflowScrolling: 'touch',
          minHeight: 0,
          // Prevent accidental vertical scroll stealing on mobile
          touchAction: 'pan-x',
        }}
      >
        <style>{`[data-comp-track]::-webkit-scrollbar { display: none; }`}</style>

        {comps.map((comp, i) => {
          const isApproved = comp?.registrations?.[0]?.payment_status === 'approved'
          return (
            <div
              key={i}
              style={{
                minWidth: '100%',
                width: '100%',
                flexShrink: 0,
                scrollSnapAlign: 'center',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center',
                padding: isMobile ? '0 4px' : '0 8px',
                boxSizing: 'border-box',
              }}
            >
              {/* Icon */}
              <img
                src={getIconSrc(comp.name)}
                alt={comp.name}
                style={{
                  width: iconSize, height: iconSize,
                  marginBottom: isMobile ? '0.6rem' : '0.9rem',
                  filter: 'drop-shadow(0 4px 18px rgba(200,168,75,0.6))',
                  pointerEvents: 'none',
                  objectFit: 'contain',
                  userSelect: 'none',
                }}
                onError={e => { e.target.style.opacity = '0.3' }}
              />

              {/* Competition name */}
              <h3 style={{
                fontFamily: "'Cinzel',serif",
                fontSize: compTitleSize,
                color: cfg.text, margin: '0 0 0.5rem',
                letterSpacing: isMobile ? '1px' : 'clamp(2px,0.4vw,5px)',
                textTransform: 'uppercase', fontWeight: 700,
              }}>{comp.name}</h3>

              {/* Description */}
              <p style={{
                fontFamily: "'EB Garamond',serif",
                fontSize: compDescSize,
                color: cfg.text, opacity: 0.88,
                lineHeight: 1.65,
                margin: `0 0 ${isMobile ? '0.6rem' : 'clamp(0.75rem,1.5vw,1.25rem)'}`,
                maxWidth: isMobile ? '90%' : 420,
              }}>
                {`Peserta diminta untuk mengikuti lomba ${comp.name} sesuai dengan tema dan ketentuan dari panitia.`}
              </p>

              {/* Participants */}
              <p style={{
                fontFamily: "'Cinzel',serif",
                fontSize: isMobile ? '8px' : 'clamp(8px,0.9vw,10px)',
                color: cfg.text, opacity: 0.5,
                letterSpacing: 3, textTransform: 'uppercase',
                margin: `0 0 ${isMobile ? '0.75rem' : 'clamp(0.75rem,1.5vw,1.25rem)'}`,
              }}>
                {comp.min_participants === comp.max_participants
                  ? `${comp.min_participants} Peserta`
                  : `${comp.min_participants}–${comp.max_participants} Peserta`}
              </p>

              {/* Action buttons */}
              <div style={{
                display: 'flex',
                gap: isMobile ? '0.5rem' : 'clamp(0.6rem,1.5vw,1rem)',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                <button
                  style={{
                    padding: btnPadH,
                    borderRadius: 50,
                    border: `1.5px solid ${cfg.text}`,
                    background: 'transparent', color: cfg.text,
                    fontFamily: "'Cinzel',serif",
                    fontSize: btnFontSize,
                    fontWeight: 700, letterSpacing: 3,
                    textTransform: 'uppercase', cursor: 'pointer',
                    transition: 'background 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = `${cfg.text}18`}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={(e) => handleBtnClick(() => { /* brief action */ }, e)}
                >BRIEF</button>

                <button
                  style={{
                    padding: btnPadH,
                    borderRadius: 50, border: 'none',
                    background: isApproved ? '#7ECBA1' : CREAM,
                    color: isApproved ? '#0A2818' : CRIMSON,
                    fontFamily: "'Cinzel',serif",
                    fontSize: btnFontSize,
                    fontWeight: 900, letterSpacing: 3,
                    textTransform: 'uppercase', cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.28)',
                    transition: 'transform 0.18s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  onClick={(e) => handleBtnClick(() => {
                    const reg = comp.registrations?.[0]
                    if (reg?.payment_status === 'approved') {
                      navigateWithTransition(`/history/${reg.id}`)
                    } else {
                      navigateWithTransition(`/competitions/${comp.id}/register`)
                    }
                  }, e)}
                >{isApproved ? 'TERDAFTAR ✓' : 'DAFTAR'}</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Dot indicator ── */}
      {comps.length > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: isMobile ? '6px' : '8px',
          marginTop: isMobile ? '0.75rem' : '1rem',
          flexShrink: 0,
        }}>
          {comps.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === idx ? 20 : 8, height: 8, borderRadius: 4,
                background: i === idx ? cfg.text : `${cfg.text}40`,
                transition: 'all 0.35s ease',
                cursor: 'pointer',
              }}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div style={{
      position: 'relative', background: cfg.bg,
      overflow: 'hidden',
      minHeight: panelMinH,
    }}>
      <Dots />

      {/* Content wrapper — padded away from character overlay on tablet/desktop */}
      <div style={{
        position: 'relative', zIndex: 1,
        ...charPadStyle,
        minHeight: panelMinH,
      }}>
        {ContentArea}
      </div>

      {/* Character overlay */}
      {CharOverlay}

      {/* Close button */}
      <button onClick={onToggle} style={{
        position: 'absolute',
        zIndex: 20,
        background: 'transparent', border: 'none',
        cursor: 'pointer', padding: 0, lineHeight: 0,
        ...closeBtnPos,
      }}>
        <ChevronCircle color={cfg.text} up size={chevronSize} />
      </button>
    </div>
  )
}

// ─── Category item ────────────────────────────────────────────────────────────
function CategoryItem({ category, index }) {
  const [open, setOpen] = useState(false)
  const key        = category.name?.toUpperCase()
  const cfg        = CAT[key] || DEFAULT_CAT
  const flipLayout = index % 2 !== 0
  const toggle     = useCallback(() => setOpen(o => !o), [])

  return (
    <div>
      {open
        ? <OpenPanel  category={category} cfg={cfg} flipLayout={flipLayout} onToggle={toggle} />
        : <ClosedRow  category={category} cfg={cfg} flipLayout={flipLayout} onToggle={toggle} />
      }
    </div>
  )
}

// ─── Page export ──────────────────────────────────────────────────────────────
export default function CompetitionsIndex({ categories = [] }) {
  useFonts()

  const sorted = [...categories].sort((a, b) => {
    const oA = CAT[a.name?.toUpperCase()]?.order ?? 99
    const oB = CAT[b.name?.toUpperCase()]?.order ?? 99
    return oA - oB
  })

  return (
    <MainLayout>
      <div style={{ paddingTop: 52 }}>
        {sorted.map((cat, i) => (
          <CategoryItem key={cat.id} category={cat} index={i} />
        ))}
        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '8rem 2rem', background: '#0F0A05' }}>
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