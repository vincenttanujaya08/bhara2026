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

const ICON_SVG = {
  'digital campaign': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><polygon fill="url(#gg)" points="60,8 74,36 105,40 83,62 88,93 60,78 32,93 37,62 15,40 46,36"/><circle fill="#5A3A08" cx="60" cy="54" r="18"/><polygon fill="#F5DF8A" points="52,45 52,63 72,54"/></svg>`,
  'character design': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><circle fill="url(#gg)" cx="60" cy="36" r="26"/><circle fill="#5A3A08" cx="60" cy="36" r="19"/><path fill="url(#gg)" d="M33 54 Q28 78 26 100 L94 100 Q92 78 87 54 Q74 66 60 66 Q46 66 33 54Z"/><circle fill="#F5DF8A" cx="50" cy="33" r="4.5"/><circle fill="#F5DF8A" cx="70" cy="33" r="4.5"/></svg>`,
  'nail art': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><ellipse fill="url(#gg)" cx="30" cy="74" rx="11" ry="26" transform="rotate(-12 30 74)"/><ellipse fill="url(#gg)" cx="50" cy="70" rx="11" ry="30"/><ellipse fill="url(#gg)" cx="70" cy="70" rx="11" ry="30"/><ellipse fill="url(#gg)" cx="90" cy="74" rx="11" ry="26" transform="rotate(12 90 74)"/></svg>`,
  'public seating': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><rect fill="url(#gg)" x="14" y="50" width="92" height="14" rx="6"/><rect fill="url(#gg)" x="18" y="64" width="14" height="40" rx="5"/><rect fill="url(#gg)" x="88" y="64" width="14" height="40" rx="5"/><rect fill="url(#gg)" x="12" y="20" width="96" height="32" rx="6"/></svg>`,
  'children room': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><path fill="url(#gg)" d="M18 58 Q18 28 60 28 Q102 28 102 58 Q102 90 60 102 Q18 90 18 58Z"/><path fill="#5A3A08" d="M26 58 Q26 36 60 36 Q94 36 94 58 Q94 80 60 92 Q26 80 26 58Z"/><rect fill="#F5DF8A" x="54" y="60" width="12" height="22" rx="3"/><circle fill="#F5DF8A" cx="40" cy="66" r="8"/><circle fill="#F5DF8A" cx="80" cy="66" r="8"/></svg>`,
  'pop up': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><polygon fill="url(#gg)" points="60,8 102,34 102,86 60,110 18,86 18,34"/><polygon fill="#5A3A08" points="60,18 94,40 94,82 60,98 26,82 26,40"/><rect fill="url(#gg)" x="50" y="70" width="20" height="28" rx="3"/></svg>`,
  'film': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><rect fill="url(#gg)" x="8" y="28" width="82" height="62" rx="6"/><rect fill="#5A3A08" x="14" y="34" width="70" height="50" rx="4"/><polygon fill="#F5DF8A" points="42,46 42,72 70,59"/><polygon fill="url(#gg)" points="90,34 110,24 110,90 90,80"/></svg>`,
  'sneakers': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><path fill="url(#gg)" d="M8 80 Q14 46 35 44 Q50 40 66 50 Q80 44 97 48 L108 62 L106 80 Z"/><path fill="#5A3A08" d="M14 78 Q20 50 36 48 Q50 46 64 55 Q78 48 94 52 L100 64 L98 76 Z"/><path fill="url(#gg)" d="M8 78 L108 73 L108 82 L8 84 Z"/></svg>`,
  'game character': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><circle fill="url(#gg)" cx="60" cy="40" r="28"/><circle fill="#5A3A08" cx="60" cy="40" r="20"/><polygon fill="url(#gg)" points="34,22 42,10 48,24"/><polygon fill="url(#gg)" points="86,22 78,10 72,24"/><path fill="url(#gg)" d="M33 58 Q28 82 26 104 L94 104 Q92 82 87 58 Q74 70 60 70 Q46 70 33 58Z"/></svg>`,
  'fashion illustration': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><path fill="url(#gg)" d="M38 10 L60 22 L82 10 L96 30 L82 38 L82 108 L38 108 L38 38 L24 30 Z"/><rect fill="#5A3A08" x="42" y="40" width="36" height="66"/><path fill="#F5DF8A" d="M48 22 L60 30 L72 22 L74 36 L60 44 L46 36 Z"/></svg>`,
  'content creating': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><circle fill="url(#gg)" cx="60" cy="60" r="52"/><circle fill="#5A3A08" cx="60" cy="60" r="42"/><polygon fill="#F5DF8A" points="46,42 46,78 82,60"/></svg>`,
  'private space': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><path fill="url(#gg)" d="M20 56 L60 14 L100 56 L100 106 L20 106 Z"/><path fill="#5A3A08" d="M26 59 L60 20 L94 59 L94 102 L26 102 Z"/><rect fill="url(#gg)" x="48" y="74" width="24" height="28" rx="3"/></svg>`,
  'english': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><circle fill="url(#gg)" cx="60" cy="60" r="52"/><circle fill="#5A3A08" cx="60" cy="60" r="44"/><ellipse fill="none" stroke="#F5DF8A" stroke-width="2.5" cx="60" cy="60" rx="28" ry="44"/><line x1="16" y1="60" x2="104" y2="60" stroke="#F5DF8A" stroke-width="2.5"/></svg>`,
  'chinese': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><rect fill="url(#gg)" x="16" y="10" width="88" height="100" rx="6"/><rect fill="#5A3A08" x="22" y="16" width="76" height="88" rx="4"/><line x1="34" y1="36" x2="86" y2="36" stroke="#F5DF8A" stroke-width="2.5"/><line x1="34" y1="64" x2="86" y2="64" stroke="#F5DF8A" stroke-width="2.5"/></svg>`,
  'comic strip': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><rect fill="url(#gg)" x="6" y="22" width="48" height="38" rx="4" transform="rotate(-8 30 41)"/><rect fill="#5A3A08" x="12" y="28" width="38" height="28" rx="3" transform="rotate(-8 31 42)"/><rect fill="url(#gg)" x="66" y="16" width="48" height="38" rx="4" transform="rotate(6 90 35)"/><rect fill="#5A3A08" x="72" y="22" width="36" height="28" rx="3" transform="rotate(6 90 36)"/></svg>`,
}

function getIconSVG(name) {
  const n = (name || '').toLowerCase()
  const key = Object.keys(ICON_SVG).find(k => n.includes(k))
  return ICON_SVG[key] || ICON_SVG['content creating']
}

function ChevronCircle({ color, up = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 'clamp(36px,4.5vw,52px)', height: 'clamp(36px,4.5vw,52px)',
      borderRadius: '50%', border: `2px solid ${color}`, flexShrink: 0,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {up ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
      </svg>
    </span>
  )
}

function ClosedRow({ category, cfg, flipLayout, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      display: 'block', width: '100%', background: cfg.bg,
      border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
      position: 'relative', overflow: 'hidden',
      minHeight: 'clamp(110px,17vw,170px)',
    }}>
      <Dots />
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'grid',
        gridTemplateColumns: flipLayout ? 'clamp(36px,4.5vw,52px) 1fr auto' : 'auto 1fr clamp(36px,4.5vw,52px)',
        alignItems: 'center',
        gap: 'clamp(1rem,3vw,2.5rem)',
        padding: '0 clamp(1.25rem,4vw,2.5rem)',
        minHeight: 'inherit',
        width: '100%', boxSizing: 'border-box',
      }}>
        {flipLayout ? (
          <>
            <ChevronCircle color={cfg.text} />
            <p style={{ fontFamily:"'FamiljenGrotesk',sans-serif", fontSize:'clamp(14px,1.7vw,22px)', color:cfg.text, margin:0, lineHeight:1.55 }}
              dangerouslySetInnerHTML={{ __html: cfg.desc }} />
            <span style={{ fontFamily:"'CSSalient',sans-serif", fontSize:'clamp(52px,9.5vw,128px)', color:cfg.text, lineHeight:0.85, textTransform:'uppercase', letterSpacing:2, flexShrink:0, whiteSpace:'nowrap' }}>
              {category.name}
            </span>
          </>
        ) : (
          <>
            <span style={{ fontFamily:"'CSSalient',sans-serif", fontSize:'clamp(52px,9.5vw,128px)', color:cfg.text, lineHeight:0.85, textTransform:'uppercase', letterSpacing:2, flexShrink:0, whiteSpace:'nowrap' }}>
              {category.name}
            </span>
            <p style={{ fontFamily:"'FamiljenGrotesk',sans-serif", fontSize:'clamp(14px,1.7vw,22px)', color:cfg.text, margin:0, lineHeight:1.55 }}
              dangerouslySetInnerHTML={{ __html: cfg.desc }} />
            <ChevronCircle color={cfg.text} />
          </>
        )}
      </div>
    </button>
  )
}

function OpenPanel({ category, cfg, flipLayout, onToggle }) {
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

  // Karakter sebagai absolute overlay — tidak masuk grid, bebas overlap ke konten
  const CharOverlay = (
    <div style={{
      position:'absolute',
      bottom:0,
      // flipLayout (BUANA/AGNI): karakter kolom kiri, geser ujungnya ke arah konten (kanan)
      // normal (TIRTA/BAYU): karakter kolom kanan, geser ujungnya ke arah konten (kiri)
      ...(flipLayout
        ? { left:0, width:'clamp(280px,45%,580px)' }
        : { right:0, width:'clamp(280px,45%,580px)' }
      ),
      height:'100%',
      zIndex:5,
      pointerEvents:'none',
    }}>
      {/* Gradient fade agar karakter blend ke background */}
      <div style={{
        position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
        background: flipLayout
          ? `linear-gradient(to right, ${cfg.bg} 0%, ${cfg.bg}BB 20%, transparent 55%)`
          : `linear-gradient(to left, ${cfg.bg} 0%, ${cfg.bg}BB 20%, transparent 55%)`,
      }} />
      <img
        src={cfg.photo} alt={category.name}
        style={{
          position:'absolute', bottom:0,
          // Geser karakter ke sisi tengah (menuju konten) sebesar 30%
          ...(flipLayout
            ? { right:'-30%', left:'auto' }
            : { left:'-30%', right:'auto' }
          ),
          height:'100%', width:'auto',
          objectFit:'contain', objectPosition:'bottom center',
          filter:'drop-shadow(0 0 24px rgba(0,0,0,0.45))',
          zIndex:3, userSelect:'none',
        }}
        onError={e => { e.target.style.display='none' }}
      />
    </div>
  )

  const ContentArea = (
    <div style={{
      display:'flex', flexDirection:'column',
      padding:'clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,4vw,3.5rem)',
      justifyContent:'space-between',
      overflow:'hidden',
      position:'relative',
      minHeight:'clamp(300px,40vw,540px)',
    }}>
      {/* Header kategori — urutan ikut flipLayout */}
      <div style={{ marginBottom:'0.75rem', flexShrink:0 }}>
        {flipLayout ? (
          <div style={{ display:'flex', alignItems:'flex-start', gap:'clamp(0.75rem,1.5vw,1.25rem)', flexWrap:'wrap' }}>
            <p style={{
              fontFamily:"'FamiljenGrotesk',sans-serif",
              fontSize:'clamp(12px,1.4vw,18px)',
              color:cfg.text, margin:'clamp(4px,0.8vw,10px) 0 0',
              lineHeight:1.5, maxWidth:280,
            }} dangerouslySetInnerHTML={{ __html: cfg.desc }} />
            <h2 style={{
              fontFamily:"'CSSalient',sans-serif",
              fontSize:'clamp(34px,5.2vw,78px)',
              color:cfg.text, margin:0, lineHeight:0.88,
              textTransform:'uppercase', flexShrink:0,
            }}>{category.name}</h2>
          </div>
        ) : (
          <div style={{ display:'flex', alignItems:'flex-start', gap:'clamp(0.75rem,1.5vw,1.25rem)', flexWrap:'wrap' }}>
            <h2 style={{
              fontFamily:"'CSSalient',sans-serif",
              fontSize:'clamp(34px,5.2vw,78px)',
              color:cfg.text, margin:0, lineHeight:0.88,
              textTransform:'uppercase', flexShrink:0,
            }}>{category.name}</h2>
            <p style={{
              fontFamily:"'FamiljenGrotesk',sans-serif",
              fontSize:'clamp(12px,1.4vw,18px)',
              color:cfg.text, margin:'clamp(4px,0.8vw,10px) 0 0',
              lineHeight:1.5, maxWidth:280,
            }} dangerouslySetInnerHTML={{ __html: cfg.desc }} />
          </div>
        )}
      </div>

      {/* Horizontal scroll track */}
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
          flex:1,
          display:'flex',
          overflowX:'scroll',
          overflowY:'hidden',
          scrollSnapType:'x mandatory',
          scrollBehavior:'smooth',
          scrollbarWidth:'none',
          msOverflowStyle:'none',
          cursor: comps.length > 1 ? 'grab' : 'default',
          userSelect:'none',
          WebkitOverflowScrolling:'touch',
          minHeight:0,
        }}
      >
        <style>{`[data-comp-track]::-webkit-scrollbar { display: none; }`}</style>

        {comps.map((comp, i) => {
          const isApproved = comp?.registrations?.[0]?.payment_status === 'approved'
          return (
            <div
              key={i}
              style={{
                minWidth:'100%',
                width:'100%',
                flexShrink:0,
                scrollSnapAlign:'center',
                display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center',
                textAlign:'center', padding:'0 8px', boxSizing:'border-box',
              }}
            >
              <div
                style={{
                  width:'clamp(76px,10vw,130px)', height:'clamp(76px,10vw,130px)',
                  marginBottom:'0.9rem',
                  filter:'drop-shadow(0 4px 18px rgba(200,168,75,0.6))',
                  pointerEvents:'none',
                }}
                dangerouslySetInnerHTML={{ __html: getIconSVG(comp.name) }}
              />
              <h3 style={{
                fontFamily:"'Cinzel',serif",
                fontSize:'clamp(16px,2.4vw,30px)',
                color:cfg.text, margin:'0 0 0.7rem',
                letterSpacing:'clamp(2px,0.4vw,5px)',
                textTransform:'uppercase', fontWeight:700,
              }}>{comp.name}</h3>
              <p style={{
                fontFamily:"'EB Garamond',serif",
                fontSize:'clamp(13px,1.45vw,19px)',
                color:cfg.text, opacity:0.88,
                lineHeight:1.65, margin:'0 0 clamp(0.75rem,1.5vw,1.25rem)',
                maxWidth:420,
              }}>
                {`Peserta diminta untuk mengikuti lomba ${comp.name} sesuai dengan tema dan ketentuan dari panitia.`}
              </p>
              <p style={{
                fontFamily:"'Cinzel',serif", fontSize:'clamp(8px,0.9vw,10px)',
                color:cfg.text, opacity:0.5, letterSpacing:3, textTransform:'uppercase',
                margin:'0 0 clamp(0.75rem,1.5vw,1.25rem)',
              }}>
                {comp.min_participants === comp.max_participants
                  ? `${comp.min_participants} Peserta`
                  : `${comp.min_participants}–${comp.max_participants} Peserta`}
              </p>
              <div style={{ display:'flex', gap:'clamp(0.6rem,1.5vw,1rem)', flexWrap:'wrap', justifyContent:'center' }}>
                <button
                  style={{
                    padding:'clamp(9px,1.3vw,13px) clamp(22px,3.5vw,44px)',
                    borderRadius:50, border:`1.5px solid ${cfg.text}`,
                    background:'transparent', color:cfg.text,
                    fontFamily:"'Cinzel',serif", fontSize:'clamp(9px,1vw,11px)',
                    fontWeight:700, letterSpacing:3, textTransform:'uppercase', cursor:'pointer',
                    transition:'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background=`${cfg.text}18`}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  onClick={(e) => handleBtnClick(() => { /* brief action */ }, e)}
                >BRIEF</button>
                <button
                  style={{
                    padding:'clamp(9px,1.3vw,13px) clamp(22px,3.5vw,44px)',
                    borderRadius:50, border:'none',
                    background: isApproved ? '#7ECBA1' : CREAM,
                    color: isApproved ? '#0A2818' : CRIMSON,
                    fontFamily:"'Cinzel',serif", fontSize:'clamp(9px,1vw,11px)',
                    fontWeight:900, letterSpacing:3, textTransform:'uppercase', cursor:'pointer',
                    boxShadow:'0 4px 14px rgba(0,0,0,0.28)',
                    transition:'transform 0.18s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
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

      {/* Dot indicator */}
      {comps.length > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'1rem', flexShrink:0 }}>
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
    <div style={{ position:'relative', background:cfg.bg, overflow:'hidden', minHeight:'clamp(420px,56vw,680px)' }}>
      <Dots />

      {/* Konten full width, padding di sisi karakter agar slide pertama tidak tertutup */}
      <div style={{
        position:'relative', zIndex:1,
        paddingLeft:  flipLayout ? 'clamp(280px,45%,580px)' : 0,
        paddingRight: flipLayout ? 0 : 'clamp(280px,45%,580px)',
        minHeight:'clamp(420px,56vw,680px)',
      }}>
        {ContentArea}
      </div>

      {/* Karakter overlay — absolute di atas konten, tidak masuk flow */}
      {CharOverlay}

      {/* Tombol tutup — posisi ikut flipLayout */}
      <button onClick={onToggle} style={{
        position:'absolute', top:'clamp(14px,2vw,24px)',
        ...(flipLayout
          ? { left:'clamp(14px,2vw,24px)' }
          : { right:'clamp(14px,2vw,24px)' }),
        zIndex:20, background:'transparent', border:'none', cursor:'pointer', padding:0, lineHeight:0,
      }}>
        <ChevronCircle color={cfg.text} up />
      </button>
    </div>
  )
}

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
          <div style={{ textAlign:'center', padding:'8rem 2rem', background:'#0F0A05' }}>
            <p style={{ fontFamily:"'Cinzel',serif", fontSize:12, letterSpacing:3, color:CREAM, opacity:0.2, textTransform:'uppercase' }}>
              Belum ada kompetisi tersedia
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}