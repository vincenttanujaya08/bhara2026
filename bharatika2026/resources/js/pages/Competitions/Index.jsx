// resources/js/pages/Competitions/Index.jsx

import { useState, useEffect, useCallback } from 'react'
import { navigateWithTransition } from '../../hooks/usePageTransition'
import MainLayout from '../../Layouts/MainLayout'

const CREAM   = '#E8D9A0'
const GOLD    = '#C8A84B'
const CRIMSON = '#8B1A1A'

// ── Category config — photo paths use UPPERCASE SVG filenames ────────
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

// ── Font loader ──────────────────────────────────────────────────────
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

// ── Dot texture ──────────────────────────────────────────────────────
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

// ── Gold icons (inline SVG strings keyed by keyword) ─────────────────
const ICON_SVG = {
  'digital campaign': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><polygon fill="url(#gg)" points="60,8 74,36 105,40 83,62 88,93 60,78 32,93 37,62 15,40 46,36"/><circle fill="#5A3A08" cx="60" cy="54" r="18"/><polygon fill="#F5DF8A" points="52,45 52,63 72,54"/><path fill="url(#gg)" d="M25 18 L34 9 L43 22" stroke="none"/><path fill="url(#gg)" d="M77 22 L86 9 L95 18" stroke="none"/></svg>`,
  'character design': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><circle fill="url(#gg)" cx="60" cy="36" r="26"/><circle fill="#5A3A08" cx="60" cy="36" r="19"/><path fill="url(#gg)" d="M33 54 Q28 78 26 100 L94 100 Q92 78 87 54 Q74 66 60 66 Q46 66 33 54Z"/><circle fill="#F5DF8A" cx="50" cy="33" r="4.5"/><circle fill="#F5DF8A" cx="70" cy="33" r="4.5"/><path fill="none" stroke="#F5DF8A" stroke-width="2.8" stroke-linecap="round" d="M50 46 Q60 54 70 46"/></svg>`,
  'nail art': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><ellipse fill="url(#gg)" cx="30" cy="74" rx="11" ry="26" transform="rotate(-12 30 74)"/><ellipse fill="url(#gg)" cx="50" cy="70" rx="11" ry="30"/><ellipse fill="url(#gg)" cx="70" cy="70" rx="11" ry="30"/><ellipse fill="url(#gg)" cx="90" cy="74" rx="11" ry="26" transform="rotate(12 90 74)"/><ellipse fill="#5A3A08" cx="30" cy="72" rx="7.5" ry="20" transform="rotate(-12 30 72)"/><ellipse fill="#5A3A08" cx="50" cy="68" rx="7.5" ry="24"/><ellipse fill="#5A3A08" cx="70" cy="68" rx="7.5" ry="24"/><ellipse fill="#5A3A08" cx="90" cy="72" rx="7.5" ry="20" transform="rotate(12 90 72)"/><circle fill="#F5DF8A" cx="60" cy="24" r="9"/><path fill="url(#gg)" d="M55 17 L60 6 L65 17 L74 13 L70 22"/></svg>`,
  'public seating': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><rect fill="url(#gg)" x="14" y="50" width="92" height="14" rx="6"/><rect fill="url(#gg)" x="18" y="64" width="14" height="40" rx="5"/><rect fill="url(#gg)" x="88" y="64" width="14" height="40" rx="5"/><rect fill="url(#gg)" x="12" y="20" width="96" height="32" rx="6"/><rect fill="#5A3A08" x="18" y="26" width="84" height="22" rx="4"/><circle fill="#F5DF8A" cx="60" cy="13" r="7"/></svg>`,
  'children room': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><path fill="url(#gg)" d="M18 58 Q18 28 60 28 Q102 28 102 58 Q102 90 60 102 Q18 90 18 58Z"/><path fill="#5A3A08" d="M26 58 Q26 36 60 36 Q94 36 94 58 Q94 80 60 92 Q26 80 26 58Z"/><path fill="url(#gg)" d="M38 53 Q48 38 60 43 Q72 38 82 53" stroke="none"/><rect fill="#F5DF8A" x="54" y="60" width="12" height="22" rx="3"/><circle fill="#F5DF8A" cx="40" cy="66" r="8"/><circle fill="#F5DF8A" cx="80" cy="66" r="8"/></svg>`,
  'pop up': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><polygon fill="url(#gg)" points="60,8 102,34 102,86 60,110 18,86 18,34"/><polygon fill="#5A3A08" points="60,18 94,40 94,82 60,98 26,82 26,40"/><rect fill="url(#gg)" x="50" y="70" width="20" height="28" rx="3"/><rect fill="#F5DF8A" x="28" y="45" width="22" height="18" rx="2"/><rect fill="#F5DF8A" x="70" y="45" width="22" height="18" rx="2"/></svg>`,
  'film': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><rect fill="url(#gg)" x="8" y="28" width="82" height="62" rx="6"/><rect fill="#5A3A08" x="14" y="34" width="70" height="50" rx="4"/><polygon fill="#F5DF8A" points="42,46 42,72 70,59"/><polygon fill="url(#gg)" points="90,34 110,24 110,90 90,80"/><rect fill="url(#gg)" x="12" y="20" width="12" height="12" rx="2"/><rect fill="url(#gg)" x="36" y="20" width="12" height="12" rx="2"/><rect fill="url(#gg)" x="60" y="20" width="12" height="12" rx="2"/></svg>`,
  'sneakers': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><path fill="url(#gg)" d="M8 80 Q14 46 35 44 Q50 40 66 50 Q80 44 97 48 L108 62 L106 80 Z"/><path fill="#5A3A08" d="M14 78 Q20 50 36 48 Q50 46 64 55 Q78 48 94 52 L100 64 L98 76 Z"/><path fill="#F5DF8A" d="M36 60 L55 55 L60 65 L40 69 Z"/><path fill="url(#gg)" d="M8 78 L108 73 L108 82 L8 84 Z"/><circle fill="#F5DF8A" cx="80" cy="36" r="8"/><path fill="url(#gg)" d="M75 29 L80 18 L85 29 L94 25 L89 34"/></svg>`,
  'game character': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><circle fill="url(#gg)" cx="60" cy="40" r="28"/><circle fill="#5A3A08" cx="60" cy="40" r="20"/><polygon fill="url(#gg)" points="34,22 42,10 48,24"/><polygon fill="url(#gg)" points="86,22 78,10 72,24"/><path fill="url(#gg)" d="M33 58 Q28 82 26 104 L94 104 Q92 82 87 58 Q74 70 60 70 Q46 70 33 58Z"/><circle fill="#F5DF8A" cx="50" cy="38" r="5"/><circle fill="#F5DF8A" cx="70" cy="38" r="5"/><path fill="none" stroke="#F5DF8A" stroke-width="2.5" stroke-linecap="round" d="M50 52 Q60 60 70 52"/></svg>`,
  'fashion illustration': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><path fill="url(#gg)" d="M38 10 L60 22 L82 10 L96 30 L82 38 L82 108 L38 108 L38 38 L24 30 Z"/><rect fill="#5A3A08" x="42" y="40" width="36" height="66"/><path fill="#F5DF8A" d="M48 22 L60 30 L72 22 L74 36 L60 44 L46 36 Z"/><circle fill="url(#gg)" cx="60" cy="66" r="9"/><circle fill="#F5DF8A" cx="60" cy="66" r="4"/></svg>`,
  'content creating': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><circle fill="url(#gg)" cx="60" cy="60" r="52"/><circle fill="#5A3A08" cx="60" cy="60" r="42"/><polygon fill="#F5DF8A" points="46,42 46,78 82,60"/><circle fill="url(#gg)" cx="60" cy="60" r="14"/><circle fill="#F5DF8A" cx="60" cy="60" r="7"/></svg>`,
  'private space': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><path fill="url(#gg)" d="M20 56 L60 14 L100 56 L100 106 L20 106 Z"/><path fill="#5A3A08" d="M26 59 L60 20 L94 59 L94 102 L26 102 Z"/><rect fill="url(#gg)" x="48" y="74" width="24" height="28" rx="3"/><rect fill="#F5DF8A" x="30" y="60" width="22" height="18" rx="2"/><rect fill="#F5DF8A" x="68" y="60" width="22" height="18" rx="2"/><circle fill="#F5DF8A" cx="60" cy="49" r="7"/></svg>`,
  'english': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><circle fill="url(#gg)" cx="60" cy="60" r="52"/><circle fill="#5A3A08" cx="60" cy="60" r="44"/><ellipse fill="none" stroke="#F5DF8A" stroke-width="2.5" cx="60" cy="60" rx="28" ry="44"/><line x1="16" y1="60" x2="104" y2="60" stroke="#F5DF8A" stroke-width="2.5"/><line x1="60" y1="16" x2="60" y2="104" stroke="#F5DF8A" stroke-width="2.5"/><path fill="none" stroke="#F5DF8A" stroke-width="2" d="M18 40 Q60 32 102 40 M18 80 Q60 88 102 80"/></svg>`,
  'chinese': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><rect fill="url(#gg)" x="16" y="10" width="88" height="100" rx="6"/><rect fill="#5A3A08" x="22" y="16" width="76" height="88" rx="4"/><line x1="34" y1="36" x2="86" y2="36" stroke="#F5DF8A" stroke-width="2.5"/><line x1="34" y1="50" x2="66" y2="50" stroke="#F5DF8A" stroke-width="2.5"/><line x1="34" y1="64" x2="86" y2="64" stroke="#F5DF8A" stroke-width="2.5"/><line x1="34" y1="78" x2="74" y2="78" stroke="#F5DF8A" stroke-width="2.5"/><line x1="34" y1="92" x2="86" y2="92" stroke="#F5DF8A" stroke-width="2.5"/><circle fill="url(#gg)" cx="94" cy="94" r="18"/><path fill="#5A3A08" d="M88 94 L94 86 L100 94 L94 102 Z"/></svg>`,
  'comic strip': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><radialGradient id="gg" cx="38%" cy="28%"><stop offset="0%" stop-color="#F5DF8A"/><stop offset="55%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5510"/></radialGradient></defs><rect fill="url(#gg)" x="6" y="22" width="48" height="38" rx="4" transform="rotate(-8 30 41)"/><rect fill="#5A3A08" x="12" y="28" width="38" height="28" rx="3" transform="rotate(-8 31 42)"/><rect fill="url(#gg)" x="66" y="16" width="48" height="38" rx="4" transform="rotate(6 90 35)"/><rect fill="#5A3A08" x="72" y="22" width="36" height="28" rx="3" transform="rotate(6 90 36)"/><path fill="url(#gg)" d="M38 68 L82 63 L90 84 L46 89 Z"/><circle fill="#F5DF8A" cx="88" cy="78" r="10"/><path fill="url(#gg)" d="M82 69 L88 58 L94 69 L100 65 L96 76"/><circle fill="#F5DF8A" cx="38" cy="79" r="7"/></svg>`,
}

function getIconSVG(name) {
  const n = (name || '').toLowerCase()
  const key = Object.keys(ICON_SVG).find(k => n.includes(k))
  return ICON_SVG[key] || ICON_SVG['content creating']
}

// ── Chevron circle button ────────────────────────────────────────────
function ChevronCircle({ color, up = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 'clamp(36px,4.5vw,52px)', height: 'clamp(36px,4.5vw,52px)',
      borderRadius: '50%',
      border: `2px solid ${color}`,
      flexShrink: 0,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {up
          ? <polyline points="18 15 12 9 6 15" />
          : <polyline points="6 9 12 15 18 9" />
        }
      </svg>
    </span>
  )
}

// ── Slide nav arrow ──────────────────────────────────────────────────
function NavArrow({ left, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      width: 40, height: 40, borderRadius: '50%',
      background: `${color}20`, border: `1.5px solid ${color}60`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', flexShrink: 0,
    }}
      onMouseEnter={e => e.currentTarget.style.background = `${color}40`}
      onMouseLeave={e => e.currentTarget.style.background = `${color}20`}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2.5" strokeLinecap="round">
        {left ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  )
}

// ── Collapsed banner ─────────────────────────────────────────────────
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
        gridTemplateColumns: flipLayout
          ? 'clamp(36px,4.5vw,52px) 1fr auto'
          : 'auto 1fr clamp(36px,4.5vw,52px)',
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

// ── Photo side ───────────────────────────────────────────────────────
function PhotoSide({ cfg, catName }) {
  return (
    <div style={{ position:'relative', overflow:'hidden', minHeight:'clamp(300px,40vw,540px)' }}>
      <div style={{
        position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
        background:`linear-gradient(to right, ${cfg.bg}CC 0%, transparent 35%, ${cfg.bg}99 100%)`,
      }} />
      <img src={cfg.photo} alt={catName}
        style={{
          position:'absolute', bottom:0, left:'50%',
          transform:'translateX(-50%)',
          height:'98%', width:'auto', maxWidth:'130%',
          objectFit:'contain', objectPosition:'bottom center',
          filter:'drop-shadow(0 0 28px rgba(0,0,0,0.5))',
          zIndex:1,
        }}
        onError={e => { e.target.style.display='none' }}
      />
    </div>
  )
}

// ── Content side ─────────────────────────────────────────────────────
function ContentSide({ cfg, category, comp, comps, idx, prev, next, onDaftar }) {
  const isApproved = comp?.registrations?.[0]?.payment_status === 'approved'

  return (
    <div style={{
      display:'flex', flexDirection:'column',
      padding:'clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,4vw,3.5rem)',
      justifyContent:'space-between',
    }}>

      {/* Category header */}
      <div style={{ marginBottom:'0.5rem' }}>
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
      </div>

      {/* Slide content */}
      {comp ? (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0.5rem 0' }}>

          {/* Gold icon */}
          <div style={{ width:'clamp(76px,10vw,130px)', height:'clamp(76px,10vw,130px)', marginBottom:'0.9rem', filter:'drop-shadow(0 4px 18px rgba(200,168,75,0.6))' }}
            dangerouslySetInnerHTML={{ __html: getIconSVG(comp.name) }}
          />

          {/* Comp name */}
          <h3 style={{
            fontFamily:"'Cinzel',serif",
            fontSize:'clamp(16px,2.4vw,30px)',
            color:cfg.text, margin:'0 0 0.7rem',
            letterSpacing:'clamp(2px,0.4vw,5px)',
            textTransform:'uppercase', fontWeight:700,
          }}>{comp.name}</h3>

          {/* Description */}
          <p style={{
            fontFamily:"'EB Garamond',serif",
            fontSize:'clamp(13px,1.45vw,19px)',
            color:cfg.text, opacity:0.88,
            lineHeight:1.65, margin:'0 0 clamp(1rem,2vw,1.5rem)',
            maxWidth:420,
          }}>
            {`Peserta diminta untuk mengikuti lomba ${comp.name} sesuai dengan tema dan ketentuan dari panitia.`}
          </p>

          {/* Peserta count */}
          <p style={{
            fontFamily:"'Cinzel',serif", fontSize:'clamp(8px,0.9vw,10px)',
            color:cfg.text, opacity:0.5,
            letterSpacing:3, textTransform:'uppercase',
            margin:'0 0 clamp(1rem,2vw,1.4rem)',
          }}>
            {comp.min_participants === comp.max_participants
              ? `${comp.min_participants} Peserta`
              : `${comp.min_participants}–${comp.max_participants} Peserta`}
          </p>

          {/* Buttons */}
          <div style={{ display:'flex', gap:'clamp(0.6rem,1.5vw,1rem)', flexWrap:'wrap', justifyContent:'center' }}>
            <button style={{
              padding:'clamp(9px,1.3vw,13px) clamp(22px,3.5vw,44px)',
              borderRadius:50, border:`1.5px solid ${cfg.text}`,
              background:'transparent', color:cfg.text,
              fontFamily:"'Cinzel',serif", fontSize:'clamp(9px,1vw,11px)',
              fontWeight:700, letterSpacing:3, textTransform:'uppercase', cursor:'pointer',
            }}
              onMouseEnter={e => e.currentTarget.style.background=`${cfg.text}18`}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >BRIEF</button>

            <button onClick={onDaftar} style={{
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
            >{isApproved ? 'TERDAFTAR ✓' : 'DAFTAR'}</button>
          </div>
        </div>
      ) : (
        <p style={{ color:cfg.text, opacity:0.35, fontFamily:"'Cinzel',serif", fontSize:12, textAlign:'center' }}>
          Belum ada lomba tersedia
        </p>
      )}

      {/* Slide nav */}
      {comps.length > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', marginTop:'1rem' }}>
          <NavArrow left onClick={prev} color={cfg.text} />
          <span style={{ fontFamily:"'Cinzel',serif", fontSize:10, color:cfg.text, opacity:0.5, letterSpacing:2, minWidth:44, textAlign:'center' }}>
            {idx + 1} / {comps.length}
          </span>
          <NavArrow left={false} onClick={next} color={cfg.text} />
        </div>
      )}
    </div>
  )
}

// ── Expanded panel ───────────────────────────────────────────────────
function OpenPanel({ category, cfg, flipLayout, onToggle }) {
  const comps = category.competitions || []
  const [idx, setIdx] = useState(0)
  const comp = comps[idx] || null

  const prev = useCallback(() => setIdx(i => (i - 1 + comps.length) % comps.length), [comps.length])
  const next = useCallback(() => setIdx(i => (i + 1) % comps.length), [comps.length])

  const handleDaftar = () => {
    if (!comp) return
    const reg = comp.registrations?.[0]
    if (reg?.payment_status === 'approved') navigateWithTransition(`/history/${reg.id}`)
    else navigateWithTransition(`/competitions/${comp.id}/register`)
  }

  return (
    <div style={{ position:'relative', background:cfg.bg, overflow:'hidden', minHeight:'clamp(420px,56vw,680px)' }}>
      <Dots />

      <div style={{
        position:'relative', zIndex:1,
        display:'grid',
        gridTemplateColumns: flipLayout
          ? 'clamp(220px,38%,500px) 1fr'   // photo | content
          : '1fr clamp(220px,38%,500px)',   // content | photo
        minHeight:'inherit',
      }}>
        {flipLayout ? (
          <>
            <PhotoSide   cfg={cfg} catName={category.name} />
            <ContentSide cfg={cfg} category={category} comp={comp} comps={comps} idx={idx} prev={prev} next={next} onDaftar={handleDaftar} />
          </>
        ) : (
          <>
            <ContentSide cfg={cfg} category={category} comp={comp} comps={comps} idx={idx} prev={prev} next={next} onDaftar={handleDaftar} />
            <PhotoSide   cfg={cfg} catName={category.name} />
          </>
        )}
      </div>

      {/* Close button — explicit button element, no event conflicts */}
      <button
        onClick={onToggle}
        style={{
          position:'absolute',
          top:'clamp(14px,2vw,24px)',
          right:'clamp(14px,2vw,24px)',
          zIndex:20,
          background:'transparent', border:'none',
          cursor:'pointer', padding:0, lineHeight:0,
        }}
      >
        <ChevronCircle color={cfg.text} up />
      </button>
    </div>
  )
}

// ── Category accordion ───────────────────────────────────────────────
function CategoryItem({ category, index }) {
  const [open, setOpen] = useState(false)
  const key        = category.name?.toUpperCase()
  const cfg        = CAT[key] || DEFAULT_CAT
  const flipLayout = index % 2 !== 0   // odd rows flip (title/photo swap sides)

  const toggle = useCallback(() => setOpen(o => !o), [])

  return (
    <div>
      {open
        ? <OpenPanel   category={category} cfg={cfg} flipLayout={flipLayout} onToggle={toggle} />
        : <ClosedRow   category={category} cfg={cfg} flipLayout={flipLayout} onToggle={toggle} />
      }
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────
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