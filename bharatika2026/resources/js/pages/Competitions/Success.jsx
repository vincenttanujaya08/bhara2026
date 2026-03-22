// resources/js/pages/Competitions/Success.jsx
import { useEffect } from 'react'
import { Head } from '@inertiajs/react'
import { navigateWithTransition } from '../../hooks/usePageTransition'
import MainLayout from '../../Layouts/MainLayout'

const C = {
  cream: '#E8D9A0', gold: '#C8A84B', crimson: '#8B1A1A',
  black: '#0F0A05', parchment: '#D4C48A',
}

export default function RegistrationSuccess() {
  useEffect(() => {
    document.body.style.background = C.crimson
    if (!document.getElementById('bh-fonts')) {
      const l = document.createElement('link')
      l.id = 'bh-fonts'; l.rel = 'stylesheet'
      l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;700;900&family=EB+Garamond:wght@400;700&display=swap'
      document.head.appendChild(l)
    }
  }, [])

  return (
    <MainLayout>
      <Head title="Registration Submitted" />
      <style>{`
        .suc-main {
          flex: 1;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,2rem);
        }
        .suc-btns {
          display: flex;
          gap: clamp(0.75rem,2vw,1.5rem);
          justify-content: center;
          flex-wrap: wrap;
        }
        .suc-btn {
          padding: clamp(13px,2vw,18px) clamp(24px,4vw,45px);
          border-radius: 50px;
          font-family: 'Cinzel', serif;
          font-size: clamp(10px,1.1vw,11px);
          font-weight: 900;
          letter-spacing: 3px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        @media (max-width: 480px) {
          .suc-btns { flex-direction: column; align-items: center; }
          .suc-btn { width: 100%; max-width: 280px; }
        }
      `}</style>
      <div style={{ minHeight: 'calc(100vh - 52px)', paddingTop: 52, background: C.crimson, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1 }} />
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, zIndex: 1, mixBlendMode: 'overlay' }} />
        <main className="suc-main">
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'Cinzel', serif", color: C.cream, letterSpacing: 'clamp(3px,1.5vw,6px)', fontSize: 'clamp(11px,1.5vw,16px)', marginBottom: '1.5rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.9 }}>
              Your registration has been submitted
            </p>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(40px,11vw,130px)', color: C.cream, margin: 0, lineHeight: 0.9, letterSpacing: 'clamp(4px,2vw,15px)', fontWeight: 900, textShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
              VERIFYING
            </h1>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(13px,2.5vw,28px)', color: C.gold, margin: 'clamp(1.5rem,3vw,2.5rem) 0 clamp(2.5rem,5vw,4.5rem)', letterSpacing: 'clamp(3px,1.5vw,8px)', fontWeight: 700 }}>
              WE'LL NOTIFY YOU SOON
            </p>
            <div className="suc-btns">
              <button onClick={() => navigateWithTransition('/history')} className="suc-btn"
                style={{ background: 'transparent', color: C.cream, border: `2px solid ${C.cream}` }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,217,160,0.15)'; e.currentTarget.style.transform = 'translateY(-5px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}>
                VIEW DASHBOARD
              </button>
              <button onClick={() => navigateWithTransition('/')} className="suc-btn"
                style={{ background: C.cream, color: C.crimson, border: 'none', boxShadow: '0 8px 25px rgba(0,0,0,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                BACK TO HOME
              </button>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}