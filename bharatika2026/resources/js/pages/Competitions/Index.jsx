// resources/js/pages/Competitions/Index.jsx
import { useState, useEffect } from 'react'
import { navigateWithTransition } from '../../hooks/usePageTransition'
import MainLayout from '../../Layouts/MainLayout'

const C = {
  gold: '#C8A84B', cream: '#E8D9A0', parchment: '#D4C48A',
  crimson: '#8B1A1A', dark: '#1A1410', black: '#0F0A05',
}

const CATEGORY_CONFIG = {
  TIRTA: { bg: '#4A6FA5', description: '<b>Berarti air</b>, mewakili kategori Mahasiswa DKV, DFT, IPDM.', order: 1 },
  BUANA: { bg: '#5C6B3A', description: '<b>Berarti tanah</b>, mewakili kategori SMA.', order: 2 },
  BAYU:  { bg: '#8B6914', description: '<b>Berarti angin</b>, mewakili kategori umum.', order: 3 },
  AGNI:  { bg: '#8B2A1A', description: '<b>Berarti api</b>, mewakili kategori Mahasiswa Desain Interior.', order: 4 },
}
const DEFAULT_CONFIG = { bg: '#2A2420', description: '', order: 99 }

function CategoryBanner({ category, index }) {
  const [open, setOpen] = useState(false)
  const config = CATEGORY_CONFIG[category.name?.toUpperCase()] || DEFAULT_CONFIG
  const isRight = index % 2 !== 0
  const cream = '#E8D9A0'

  return (
    <div style={{ background: config.bg, overflow: 'hidden', transition: 'all 0.4s ease' }}>
      <style>{`
        .cat-banner-row {
          display: grid;
          grid-template-columns: ${isRight ? '1fr auto auto' : 'auto 1fr auto'};
          align-items: center;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          min-height: clamp(120px, 18vw, 180px);
          gap: clamp(1rem, 3vw, 2rem);
          cursor: pointer;
          position: relative;
        }
        .cat-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(32px, 7vw, 100px);
          font-weight: 700;
          color: ${cream};
          margin: 0;
          line-height: 0.85;
          letter-spacing: 2px;
          flex-shrink: 0;
        }
        .cat-desc {
          font-family: 'EB Garamond', serif;
          font-size: clamp(13px, 1.6vw, 20px);
          color: ${cream};
          opacity: 0.9;
          margin: 0;
          line-height: 1.6;
        }
        .cat-chevron {
          width: clamp(34px,4.5vw,44px);
          height: clamp(34px,4.5vw,44px);
          border-radius: 50%;
          border: 2px solid ${cream};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s;
        }
        @media (max-width: 768px) {
          .cat-banner-row {
            grid-template-columns: 1fr auto !important;
            grid-template-rows: auto auto;
          }
          .cat-title { grid-row: 1; grid-column: 1; }
          .cat-chevron { grid-row: 1; grid-column: 2; }
          .cat-desc { grid-row: 2; grid-column: 1 / -1; padding-bottom: 1rem; }
        }
        @media (max-width: 480px) {
          .cat-title { font-size: clamp(28px, 9vw, 52px); }
        }
      `}</style>
      <div className="cat-banner-row" onClick={() => setOpen(!open)}>
        {isRight ? (
          <>
            <div className="cat-chevron" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cream} strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <p className="cat-desc" dangerouslySetInnerHTML={{ __html: config.description }} />
            <h2 className="cat-title">{category.name}</h2>
          </>
        ) : (
          <>
            <h2 className="cat-title">{category.name}</h2>
            <p className="cat-desc" dangerouslySetInnerHTML={{ __html: config.description }} />
            <div className="cat-chevron" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cream} strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </>
        )}
      </div>

      <div style={{ maxHeight: open ? '2000px' : '0', overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ padding: '0 clamp(1.25rem,4vw,2.5rem) clamp(1.5rem,3vw,2.5rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', borderTop: `1px solid rgba(232,217,160,0.15)`, paddingTop: 'clamp(1rem,2vw,1.5rem)' }}>
          {category.competitions?.length > 0 ? category.competitions.map(comp => {
            const userReg = comp.registrations?.[0]
            const isApproved = userReg?.payment_status === 'approved'
            return (
              <div key={comp.id} style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${isApproved ? 'rgba(126,203,161,0.4)' : 'rgba(232,217,160,0.15)'}`, padding: 'clamp(1rem,2vw,1.25rem) clamp(1rem,2.5vw,1.5rem)', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'all 0.2s' }}>
                <div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(13px,1.4vw,14px)', color: isApproved ? '#7ECBA1' : cream, margin: '0 0 0.4rem', fontWeight: 600, letterSpacing: 0.5 }}>
                    {comp.name} {isApproved && '✓'}
                  </h3>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(12px,1.3vw,13px)', color: cream, opacity: 0.55, margin: 0 }}>
                    {comp.min_participants === comp.max_participants ? `${comp.min_participants} peserta` : `${comp.min_participants}–${comp.max_participants} peserta`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (isApproved) navigateWithTransition(`/history/${userReg.id}`)
                    else navigateWithTransition(`/competitions/${comp.id}/register`)
                  }}
                  style={{ display: 'block', width: '100%', textAlign: 'center', padding: 'clamp(7px,1vw,8px)', border: `1px solid ${isApproved ? '#7ECBA1' : cream}`, background: isApproved ? 'rgba(126,203,161,0.1)' : 'transparent', color: isApproved ? '#7ECBA1' : cream, fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px,0.9vw,9px)', letterSpacing: 3, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { if (!isApproved) { e.currentTarget.style.background = cream; e.currentTarget.style.color = config.bg } }}
                  onMouseLeave={e => { if (!isApproved) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = cream } }}
                >
                  {isApproved ? 'Sudah Terdaftar' : 'Daftar Sekarang'}
                </button>
              </div>
            )
          }) : (
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: cream, opacity: 0.4, margin: 0 }}>Belum ada kompetisi tersedia</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CompetitionsIndex({ categories = [] }) {
  useEffect(() => {
    document.body.style.margin = '0'
    if (!document.getElementById('bh-fonts')) {
      const l = document.createElement('link')
      l.id = 'bh-fonts'; l.rel = 'stylesheet'
      l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
      document.head.appendChild(l)
    }
  }, [])

  const sortedCategories = [...categories].sort((a, b) => {
    const orderA = CATEGORY_CONFIG[a.name.toUpperCase()]?.order || 99
    const orderB = CATEGORY_CONFIG[b.name.toUpperCase()]?.order || 99
    return orderA - orderB
  })

  return (
    <MainLayout>
      <div style={{ paddingTop: 52 }}>
        {sortedCategories.map((category, index) => (
          <CategoryBanner key={category.id} category={category} index={index} />
        ))}
        {sortedCategories.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'clamp(4rem,10vw,8rem) 2rem' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: 3, color: '#E8D9A0', opacity: 0.25, textTransform: 'uppercase' }}>Belum ada kompetisi tersedia</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}