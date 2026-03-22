// resources/js/pages/About.jsx
import { useState, useEffect } from 'react'
import { navigateWithTransition } from '../hooks/usePageTransition'
import MainLayout from '../Layouts/MainLayout'

const C = {
  gold: '#C8A84B', cream: '#E8D9A0', parchment: '#D4C48A',
  crimson: '#8B1A1A', dark: '#0F0A05', darkCard: '#1A1410',
}

function useFonts() {
  useEffect(() => {
    document.body.style.margin = '0'; document.body.style.padding = '0'; document.body.style.overflowX = 'hidden'
    document.body.style.background = C.dark
    if (document.getElementById('cssalient-font')) return
    const style = document.createElement('style')
    style.id = 'cssalient-font'
    style.textContent = `
      @font-face { font-family: 'CSSalient'; src: url('/fonts/CSSalient-Regular.ttf') format('truetype'); }
      @font-face { font-family: 'Nord'; src: url('/fonts/NORD-Bold.ttf') format('truetype'); font-weight: bold; }
      @font-face { font-family: 'FamiljenGrotesk'; src: url('/fonts/FamiljenGrotesk-Variable.ttf') format('truetype'); font-weight: 100 900; }
    `
    document.head.appendChild(style)
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
    document.head.appendChild(l)
  }, [])
}

function HeroAbout() {
  return (
    <section style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', paddingTop: 52 }}>
      <style>{`
        .hero-about-text {
          position: relative;
          z-index: 3;
          min-height: calc(100vh - 52px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 5vw, 5vw);
          max-width: 55%;
        }
        @media (max-width: 900px) {
          .hero-about-text { max-width: 80%; }
        }
        @media (max-width: 600px) {
          .hero-about-text { max-width: 100%; min-height: auto; padding-bottom: 3rem; }
        }
      `}</style>
      <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, filter: 'grayscale(100%) brightness(0.55)' }}>
        <source src="/videos/landing page bhara26.mp4" type="video/mp4" />
      </video>
      <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25, pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to right, rgba(139,26,26,0.97) 0%, rgba(139,26,26,0.85) 18%, rgba(139,26,26,0.3) 32%, rgba(139,26,26,0) 44%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'left center', opacity: 0.4, pointerEvents: 'none', maskImage: 'linear-gradient(to right, black 0%, black 18%, transparent 44%)', WebkitMaskImage: 'linear-gradient(to right, black 0%, black 18%, transparent 44%)' }} />
      <div className="hero-about-text">
        <img src="/images/BHRTK FOOTER.svg" alt="bharatika" style={{ width: 'clamp(200px, 35vw, 560px)', height: 'auto', marginBottom: '0.5rem' }} />
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.3vw, 18px)', color: C.gold, letterSpacing: 4, margin: '0 0 2rem', opacity: 0.85 }}>Creative Design Festival</p>
        <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(15px, 1.8vw, 28px)', lineHeight: 1.45, color: C.cream, opacity: 0.95, margin: 0, maxWidth: 580, fontWeight: 500 }}>
          Berjalan dari tahun 2016 hingga 2026, percikan semangat insan muda terus
          membakar api Bharatika untuk berjalan secara kreatif.
        </p>
      </div>
    </section>
  )
}

function FakultasPartner() {
  return (
    <section>
      <style>{`
        .fp-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
        }
        .fp-left {
          background: ${C.darkCard};
          padding: clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-top: 1px solid rgba(200,168,75,0.1);
          border-bottom: 1px solid rgba(200,168,75,0.1);
        }
        .fp-right {
          background: ${C.parchment};
          padding: clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 2rem;
        }
        .fp-logos-top {
          display: flex;
          gap: clamp(1.5rem, 4vw, 3rem);
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
        .fp-logos-bottom {
          display: flex;
          gap: clamp(1rem, 2.5vw, 2rem);
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .fp-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="fp-grid">
        <div className="fp-left">
          <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(14px, 1.6vw, 22px)', lineHeight: 1.6, color: C.cream, opacity: 0.85, margin: 0 }}>
            Bharatika Creative Design Festival diselenggarakan oleh{' '}
            <strong style={{ color: C.cream, opacity: 1, fontWeight: 700 }}>
              Fakultas Humaniora dan Industri Kreatif (FHIK), Petra Christian University, Surabaya.
            </strong>
          </p>
        </div>
        <div className="fp-right">
          <div className="fp-logos-top">
            <img src="/images/logos/petra.svg" alt="Petra" style={{ height: 'clamp(60px, 8vw, 90px)', width: 'auto', objectFit: 'contain' }} />
            <img src="/images/logos/fhik.svg" alt="FHIK" style={{ height: 'clamp(52px, 7vw, 80px)', width: 'auto', objectFit: 'contain' }} />
          </div>
          <div className="fp-logos-bottom">
            {['himavistra', 'himaintra', 'hima', 'hima_ed', 'himasahatra'].map(name => (
              <img key={name} src={`/images/logos/${name}.svg`} alt={name} style={{ height: 'clamp(44px, 5.5vw, 64px)', width: 'auto', objectFit: 'contain' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  const categories = [
    { name: 'TIRTA', strong: 'Berarti air',   desc: ', mewakili kategori Mahasiswa DKV, DFT, IPDM.' },
    { name: 'BAYU',  strong: 'Berarti angin', desc: ', mewakili kategori umum.' },
    { name: 'AGNI',  strong: 'Berarti api',   desc: ', mewakili kategori Mahasiswa Desain Interior.' },
    { name: 'BUANA', strong: 'Berarti tanah', desc: ', mewakili kategori SMA.' },
  ]
  const n = categories.length
  const [centerIdx, setCenterIdx] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setCenterIdx(i => (i + 1) % n), 3500)
    return () => clearInterval(timer)
  }, [])
  const getIdx = (off) => (centerIdx + off + n * 100) % n

  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: C.crimson }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', transform: 'rotate(180deg)', opacity: 0.9, pointerEvents: 'none', zIndex: 0 }} />
      <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12, pointerEvents: 'none', zIndex: 1 }} />
      <style>{`
        @keyframes charIn  { from { opacity:0.4; transform:translateX(55px) scale(0.83); filter:brightness(0.4); } to { opacity:1; transform:translateX(0) scale(1); filter:brightness(1); } }
        @keyframes charOut { from { opacity:1; transform:translateX(0) scale(1); filter:brightness(1); } to { opacity:0.4; transform:translateX(-55px) scale(0.83); filter:brightness(0.4); } }
        @keyframes charSide{ from { opacity:0.4; transform:translateX(30px) scale(0.83); } to { opacity:0.4; transform:translateX(0) scale(0.83); } }
        @keyframes descIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .gal-wrap {
          position: relative; z-index: 2;
          display: flex; flex-direction: row;
          min-height: 600px;
        }
        .gal-chars {
          width: 58%;
          display: flex; align-items: flex-end; justify-content: flex-end;
          padding-bottom: 2rem; padding-right: 2rem;
        }
        .gal-text {
          width: 42%;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 0 clamp(1.5rem, 3.5vw, 3.5rem) 3rem clamp(1rem, 2vw, 2rem);
          border-left: 1px solid rgba(232,217,160,0.18);
          text-align: right;
          gap: 1.5rem;
        }
        @media (max-width: 900px) {
          .gal-wrap { flex-direction: column; min-height: auto; }
          .gal-chars { width: 100%; justify-content: center; min-height: 360px; padding-right: 0; padding-bottom: 1.5rem; }
          .gal-text { width: 100%; border-left: none; border-top: 1px solid rgba(232,217,160,0.12); padding: 2rem 2.5rem 2.5rem; text-align: right; justify-content: center; gap: 1.25rem; }
        }
        @media (max-width: 540px) {
          .gal-chars { min-height: 280px; }
          .gal-text { padding: 1.5rem 1.25rem 2rem; gap: 1rem; }
        }
      `}</style>
      <div className="gal-wrap">
        <div className="gal-chars">
          {[-1, 0, 1].map(pos => {
            const item = categories[getIdx(pos)]
            const isActive = pos === 0
            return (
              <div key={centerIdx + '-' + pos}
                style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative', zIndex: isActive ? 3 : 1, marginLeft: pos === 0 ? -14 : pos === 1 ? -22 : 0, animation: isActive ? 'charIn 0.65s cubic-bezier(0.22,1,0.36,1) forwards' : pos === -1 ? 'charOut 0.65s cubic-bezier(0.22,1,0.36,1) forwards' : 'charSide 0.65s cubic-bezier(0.22,1,0.36,1) forwards' }}
              >
                <img src={`/images/${item.name}.svg`} alt={item.name}
                  style={{ width: isActive ? 'clamp(110px,16vw,255px)' : 'clamp(70px,10vw,170px)', height: isActive ? 'clamp(210px,32vw,480px)' : 'clamp(140px,20vw,330px)', objectFit: 'contain', objectPosition: 'bottom center', display: 'block', filter: isActive ? 'brightness(1)' : 'brightness(0.45)' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                <div style={{ paddingLeft: 2 }}>
                  <p style={{ fontFamily: "'CSSalient', sans-serif", fontSize: isActive ? 'clamp(18px,2.8vw,48px)' : 'clamp(11px,1.5vw,24px)', color: isActive ? C.gold : 'rgba(232,217,160,0.38)', margin: '4px 0 0', lineHeight: 1, textTransform: 'uppercase', letterSpacing: 1 }}>{item.name}</p>
                  {isActive && (
                    <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(11px,1vw,15px)', color: C.cream, opacity: 0.85, margin: '5px 0 0', lineHeight: 1.5, maxWidth: 220, animation: 'descIn 0.4s cubic-bezier(0.22,1,0.36,1) 0.3s both' }}>
                      <strong>{item.strong}</strong>{item.desc}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="gal-text">
          <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(13px,1.5vw,22px)', lineHeight: 1.85, color: C.gold, opacity: 0.95, margin: 0 }}>
            Lomba menjadi salah satu ciri khas Bharatika dari tahun ke tahun. Lomba ini dibagi menjadi 4 kategori yang masing-masing diwakili oleh satu punggawa.
          </p>
          <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(13px,1.5vw,22px)', lineHeight: 1.85, color: C.gold, opacity: 0.95, margin: 0 }}>
            Adapun punggawa Bharatika diantaranya: Tirta, Bayu, Agni, dan Buana.
          </p>
        </div>
      </div>
    </section>
  )
}

function MarqueeTicker() {
  const words = Array(12).fill('MERAJACIPTA')
  return (
    <div style={{ background: C.dark, borderBottom: '3px solid #8B1A1A', overflow: 'hidden', padding: '12px 0', position: 'relative', zIndex: 10 }}>
      <style>{`@keyframes marqueeBounce { 0% { transform: translateX(0); } 50% { transform: translateX(-50%); } 100% { transform: translateX(0); } }`}</style>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marqueeBounce 10s ease-in-out infinite' }}>
        {Array(2).fill(null).map((_, gi) => (
          <div key={gi} style={{ display: 'flex', flexShrink: 0 }}>
            {words.map((word, i) => (
              <span key={i} style={{ fontFamily: "'CSSalient', sans-serif", fontSize: 'clamp(28px,5vw,46px)', color: C.cream, paddingRight: 'clamp(3rem,5vw,6rem)', lineHeight: 1 }}>{word}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function PartnershipRow() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: C.parchment, borderBottom: '1px solid rgba(139,26,26,0.12)' }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'clamp(1.25rem, 3vw, 1.75rem) clamp(1.25rem, 4vw, 2.5rem)', cursor: 'pointer' }}>
        <span style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(18px, 3vw, 36px)', color: C.crimson, fontWeight: 700 }}>Partnership</span>
        <div style={{ width: 'clamp(36px,5vw,48px)', height: 'clamp(36px,5vw,48px)', borderRadius: '50%', background: C.crimson, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
      </div>
      <div style={{ overflow: 'hidden', maxHeight: open ? '250px' : '0px', transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ padding: `0 clamp(1.25rem, 4vw, 2.5rem) 1.75rem` }}>
          <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(16px, 2vw, 28px)', color: C.crimson, margin: 0, lineHeight: 1.7 }}>
            Reach out to our hotline:<br />
            Shera (083871738520) or Aurelina (087811812050)
          </p>
        </div>
      </div>
    </div>
  )
}

function ConnectWithUs() {
  return (
    <section style={{ background: C.darkCard }}>
      <div style={{ position: 'relative', overflow: 'hidden', background: C.crimson, padding: 'clamp(3rem, 6vw, 5rem) clamp(1.25rem, 4vw, 2.5rem)', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.7, pointerEvents: 'none' }} />
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'inline-block' }}>
          <h2 style={{ fontFamily: "'CSSalient', sans-serif", fontSize: 'clamp(60px, 14vw, 180px)', color: C.cream, margin: 0, lineHeight: 0.9, letterSpacing: 4, textTransform: 'uppercase' }}>connect</h2>
          <p style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(18px, 4vw, 52px)', color: C.cream, margin: 0, letterSpacing: 8, textTransform: 'uppercase', fontWeight: 700, textAlign: 'right' }}>With Us</p>
        </div>
      </div>
      <div style={{ height: 8, background: C.dark }} />
      <PartnershipRow />
      <div style={{ height: 8, background: C.dark }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'clamp(1.25rem, 3vw, 1.75rem) clamp(1.25rem, 4vw, 2.5rem)', background: C.parchment, flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(18px, 3vw, 36px)', color: C.crimson, fontWeight: 700 }}>Social Media</span>
        <div style={{ display: 'flex', gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', alignItems: 'center', flexWrap: 'wrap' }}>
          {[['LINE MERAH.svg','LINE',48],['IG MERAH.svg','Instagram',48],['TIKTOK MERAH.svg','TikTok',48],['YT MERAH.svg','YouTube',64]].map(([file, label, size]) => (
            <a key={label} href="#" style={{ width: 'clamp(36px,4.5vw,'+size+'px)', height: 'clamp(36px,4.5vw,'+size+'px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <img src={`/images/${file}`} alt={label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function OurTeam() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: '#A50D14' }}>
      <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, pointerEvents: 'none' }} />
      <style>{`
        .ot-grid {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem);
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
        }
        @media (max-width: 768px) {
          .ot-grid { grid-template-columns: 1fr; gap: 2rem; }
        }
      `}</style>
      <div className="ot-grid">
        <div>
          <p style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(22px, 4vw, 64px)', color: C.gold, margin: '0 0 -0.2em', fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase' }}>Our</p>
          <h2 style={{ fontFamily: "'CSSalient', sans-serif", fontSize: 'clamp(72px, 15vw, 200px)', color: C.gold, margin: 0, lineHeight: 0.85, textTransform: 'uppercase', letterSpacing: 2 }}>Team</h2>
        </div>
        <div>
          <p style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(16px, 2.5vw, 40px)', color: C.gold, margin: '0 0 1rem', fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase' }}>BPH</p>
          <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(14px, 1.5vw, 22px)', lineHeight: 1.75, color: C.gold, opacity: 0.9, margin: 0 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor eros, facilisis quis vulputate ut, suscipit nec tellus.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function About() {
  useFonts()
  return (
    <MainLayout>
      <HeroAbout />
      <FakultasPartner />
      <Gallery />
      <MarqueeTicker />
      <ConnectWithUs />
      <OurTeam />
    </MainLayout>
  )
}