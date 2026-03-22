import { useState, useEffect } from 'react'
import { navigateWithTransition } from '../hooks/usePageTransition'
import MainLayout from '../Layouts/MainLayout'

const C = {
  gold: '#C8A84B',
  cream: '#E8D9A0',
  parchment: '#D4C48A',
  crimson: '#8B1A1A',
  dark: '#0F0A05',
  darkCard: '#1A1410',
}

function useFonts() {
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.overflowX = 'hidden'
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
      <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, filter: 'grayscale(100%) brightness(0.55)' }}>
        <source src="/videos/landing page bhara26.mp4" type="video/mp4" />
      </video>
      <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25, pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to right, rgba(139,26,26,0.97) 0%, rgba(139,26,26,0.85) 18%, rgba(139,26,26,0.3) 32%, rgba(139,26,26,0) 44%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'left center', opacity: 0.4, pointerEvents: 'none', maskImage: 'linear-gradient(to right, black 0%, black 18%, transparent 44%)', WebkitMaskImage: 'linear-gradient(to right, black 0%, black 18%, transparent 44%)' }} />
      <div style={{ position: 'relative', zIndex: 3, minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 5vw', maxWidth: '55%' }}>
        <img src="/images/BHRTK FOOTER.svg" alt="bharatika" style={{ width: 'clamp(280px, 40vw, 560px)', height: 'auto', marginBottom: '0.5rem' }} />
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(12px, 1.5vw, 18px)', color: C.gold, letterSpacing: 4, margin: '0 0 3rem', opacity: 0.85 }}>Creative Design Festival</p>
        <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(18px, 2.2vw, 28px)', lineHeight: 1.45, color: C.cream, opacity: 0.95, margin: 0, maxWidth: 580, fontWeight: 500 }}>
          Berjalan dari tahun 2016 hingga 2026, percikan semangat insan muda terus
          membakar api Bharatika untuk berjalan secara kreatif. Di tahun 2026, Bharatika
          merayakan acara yang ke-11 dengan taraf internasional. Rangkaian acara Bharatika
          dibagi menjadi 3, yaitu acara, festival, dan lomba.
        </p>
      </div>
    </section>
  )
}

function FakultasPartner() {
  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr' }}>
      <div style={{ background: C.darkCard, padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderTop: '1px solid rgba(200,168,75,0.1)', borderBottom: '1px solid rgba(200,168,75,0.1)' }}>
        <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(16px, 1.8vw, 22px)', lineHeight: 1.6, color: C.cream, opacity: 0.85, margin: 0 }}>
          Bharatika Creative Design Festival<br />
          diselenggarakan oleh{' '}
          <strong style={{ color: C.cream, opacity: 1, fontWeight: 700 }}>
            Fakultas<br />Humaniora dan Industri Kreatif<br />(FHIK), Petra Christian University,<br />Surabaya.
          </strong>
        </p>
      </div>
      <div style={{ background: C.parchment, padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/logos/petra.svg" alt="Petra" style={{ height: 90, width: 'auto', objectFit: 'contain' }} />
          <img src="/images/logos/fhik.svg" alt="FHIK" style={{ height: 80, width: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <img src="/images/logos/himavistra.svg" alt="Himavistra" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
          <img src="/images/logos/himaintra.svg" alt="Himaintra" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
          <img src="/images/logos/hima.svg" alt="Hima" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
          <img src="/images/logos/hima_ed.svg" alt="Hima ED" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
          <img src="/images/logos/himasahatra.svg" alt="Himasahatra" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
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
        @keyframes charIn  { from { opacity:0.4; transform:translateX(55px) scale(0.83); filter:brightness(0.4); } to { opacity:1;   transform:translateX(0) scale(1);   filter:brightness(1); } }
        @keyframes charOut { from { opacity:1;   transform:translateX(0) scale(1);   filter:brightness(1); } to { opacity:0.4; transform:translateX(-55px) scale(0.83); filter:brightness(0.4); } }
        @keyframes charSide{ from { opacity:0.4; transform:translateX(30px) scale(0.83); filter:brightness(0.4); } to { opacity:0.4; transform:translateX(0) scale(0.83); filter:brightness(0.4); } }
        @keyframes descIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        .gal-wrap {
          position: relative; z-index: 2;
          display: flex; flex-direction: row;
          min-height: 600px;
        }

        .gal-chars {
          width: 58%;
          display: flex; align-items: flex-end; justify-content: flex-end;
          padding-bottom: 2rem;
          padding-right: 2rem;
        }

        .gal-text {
          width: 42%;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 0 3.5rem 3rem 2rem;
          border-left: 1px solid rgba(232,217,160,0.18);
          text-align: right;
          gap: 1.5rem;
        }

        @media (max-width: 1280px) {
          .gal-chars { width: 58%; padding-right: 1.5rem; }
          .gal-text  { width: 42%; padding: 0 2.5rem 2.5rem 1.5rem; }
        }

        @media (max-width: 900px) {
          .gal-wrap  { flex-direction: column; min-height: auto; }
          .gal-chars { width: 100%; justify-content: center; min-height: 360px;
                       padding-bottom: 1.5rem; padding-right: 0; }
          .gal-text  { width: 100%; border-left: none;
                       border-top: 1px solid rgba(232,217,160,0.12);
                       padding: 2rem 2.5rem 2.5rem; text-align: right;
                       justify-content: center; gap: 1.25rem; }
        }

        @media (max-width: 540px) {
          .gal-chars { min-height: 280px; }
          .gal-text  { padding: 1.5rem 1.25rem 2rem; gap: 1rem; }
        }
      `}</style>

      <div className="gal-wrap">

        <div className="gal-chars">
          {[-1, 0, 1].map(pos => {
            const item = categories[getIdx(pos)]
            const isActive = pos === 0
            return (
              <div
                key={centerIdx + '-' + pos}
                style={{
                  flexShrink: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  position: 'relative',
                  zIndex: isActive ? 3 : 1,
                  marginLeft: pos === 0 ? -14 : pos === 1 ? -22 : 0,
                  animation: isActive
                    ? 'charIn 0.65s cubic-bezier(0.22,1,0.36,1) forwards'
                    : pos === -1
                    ? 'charOut 0.65s cubic-bezier(0.22,1,0.36,1) forwards'
                    : 'charSide 0.65s cubic-bezier(0.22,1,0.36,1) forwards',
                }}
              >
                <img
                  src={`/images/${item.name}.svg`}
                  alt={item.name}
                  style={{
                    width:  isActive ? 'clamp(150px,18vw,255px)' : 'clamp(95px,12vw,170px)',
                    height: isActive ? 'clamp(280px,36vw,480px)' : 'clamp(190px,24vw,330px)',
                    objectFit: 'contain', objectPosition: 'bottom center', display: 'block',
                    filter: isActive ? 'brightness(1)' : 'brightness(0.45)',
                  }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                <div style={{ paddingLeft: 2 }}>
                  <p style={{
                    fontFamily: "'CSSalient', sans-serif",
                    fontSize: isActive ? 'clamp(20px,3.2vw,48px)' : 'clamp(12px,1.7vw,24px)',
                    color: isActive ? C.gold : 'rgba(232,217,160,0.38)',
                    margin: '4px 0 0', lineHeight: 1, textTransform: 'uppercase', letterSpacing: 1,
                  }}>{item.name}</p>
                  {isActive && (
                    <p style={{
                      fontFamily: "'FamiljenGrotesk', sans-serif",
                      fontSize: 'clamp(12px,1.1vw,15px)',
                      color: C.cream, opacity: 0.85,
                      margin: '5px 0 0', lineHeight: 1.5, maxWidth: 220,
                      animation: 'descIn 0.4s cubic-bezier(0.22,1,0.36,1) 0.3s both',
                    }}>
                      <strong>{item.strong}</strong>{item.desc}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="gal-text">
          <p style={{
            fontFamily: "'FamiljenGrotesk', sans-serif",
            fontSize: 'clamp(14px,1.7vw,22px)', lineHeight: 1.85,
            color: C.gold, opacity: 0.95, margin: 0,
          }}>
            Lomba menjadi salah satu ciri<br />khas Bharatika dari tahun ke<br />tahun. Lomba ini dibagi menjadi 4<br />kategori yang masing-masing<br />diwakili oleh satu punggawa.
          </p>
          <p style={{
            fontFamily: "'FamiljenGrotesk', sans-serif",
            fontSize: 'clamp(14px,1.7vw,22px)', lineHeight: 1.85,
            color: C.gold, opacity: 0.95, margin: 0,
          }}>
            Adapun punggawa Bharatika<br />diantaranya: Tirta, Bayu, Agni, dan<br />Buana.
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
              <span key={i} style={{ fontFamily: "'CSSalient', sans-serif", fontSize: 46, color: C.cream, paddingRight: '6rem', lineHeight: 1 }}>{word}</span>
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
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.75rem 2.5rem', cursor: 'pointer' }}>
        <span style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(22px, 3vw, 36px)', color: C.crimson, fontWeight: 700 }}>Partnership</span>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.crimson, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
      </div>
      <div style={{ overflow: 'hidden', maxHeight: open ? '250px' : '0px', transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ padding: '0 2.5rem 1.75rem' }}>
          <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(18px, 2.2vw, 28px)', color: C.crimson, margin: 0, lineHeight: 1.7 }}>
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
      <div style={{ position: 'relative', overflow: 'hidden', background: C.crimson, padding: '5rem 2.5rem', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.7, pointerEvents: 'none' }} />
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'inline-block' }}>
          <h2 style={{ fontFamily: "'CSSalient', sans-serif", fontSize: 'clamp(72px, 14vw, 180px)', color: C.cream, margin: 0, lineHeight: 0.9, letterSpacing: 4, textTransform: 'uppercase', display: 'block' }}>connect</h2>
          <p style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(22px, 4vw, 52px)', color: C.cream, margin: 0, letterSpacing: 8, textTransform: 'uppercase', fontWeight: 700, textAlign: 'right', display: 'block' }}>With Us</p>
        </div>
      </div>
      <div style={{ height: 8, background: C.dark }} />
      <PartnershipRow />
      <div style={{ height: 8, background: C.dark }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.75rem 2.5rem', background: C.parchment }}>
        <span style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(22px, 3vw, 36px)', color: C.crimson, fontWeight: 700 }}>Social Media</span>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {[['LINE MERAH.svg','LINE',48],['IG MERAH.svg','Instagram',48],['TIKTOK MERAH.svg','TikTok',48],['YT MERAH.svg','YouTube',64]].map(([file, label, size]) => (
            <a key={label} href="#" style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <img src={`/images/${file}`} alt={label} style={{ width: size, height: size, objectFit: 'contain' }} />
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
      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '5rem 4rem', gap: '4rem', alignItems: 'center' }}>
        <div>
          <p style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(28px, 5vw, 64px)', color: C.gold, margin: '0 0 -0.2em', fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase' }}>Our</p>
          <h2 style={{ fontFamily: "'CSSalient', sans-serif", fontSize: 'clamp(80px, 16vw, 200px)', color: C.gold, margin: 0, lineHeight: 0.85, textTransform: 'uppercase', letterSpacing: 2 }}>Team</h2>
        </div>
        <div>
          <p style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(20px, 3vw, 40px)', color: C.gold, margin: '0 0 1rem', fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase' }}>BPH</p>
          <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(15px, 1.8vw, 22px)', lineHeight: 1.75, color: C.gold, opacity: 0.9, margin: 0 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor
            eros, facilisis quis vulputate ut, suscipit nec tellus. Phasellus
            pretium urna vel dignissim facilisis. Cras risus nunc, vulputate nec
            lectus quis, posuere condimentum diam.
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