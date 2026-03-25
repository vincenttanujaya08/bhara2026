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

// Mapping nama kompetisi → file SVG di public/images/competitions/
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
              <img
                src={getIconSrc(comp.name)}
                alt={comp.name}
                style={{
                  width:'clamp(76px,10vw,130px)', height:'clamp(76px,10vw,130px)',
                  marginBottom:'0.9rem',
                  filter:'drop-shadow(0 4px 18px rgba(200,168,75,0.6))',
                  pointerEvents:'none',
                  objectFit:'contain',
                  userSelect:'none',
                }}
                onError={e => { e.target.style.opacity = '0.3' }}
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