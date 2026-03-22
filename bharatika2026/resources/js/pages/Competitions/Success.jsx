import { useEffect } from 'react'
import { Head } from '@inertiajs/react'
import { navigateWithTransition } from '../../hooks/usePageTransition'
import MainLayout from '../../Layouts/MainLayout'

const C = {
  cream: '#E8D9A0',
  gold: '#C8A84B',
  crimson: '#8B1A1A',
  black: '#0F0A05',
  parchment: '#D4C48A',
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

      {/* Hero — full crimson bg under navbar */}
      <div style={{ minHeight: 'calc(100vh - 52px)', paddingTop: 52, background: C.crimson, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1 }} />
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, zIndex: 1, mixBlendMode: 'overlay' }} />

        <main style={{ flex: 1, position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'Cinzel', serif", color: C.cream, letterSpacing: '6px', fontSize: 'clamp(12px, 2vw, 16px)', marginBottom: '1.5rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.9 }}>
              Your registration has been submitted
            </p>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(48px, 12vw, 130px)', color: C.cream, margin: 0, lineHeight: 0.9, letterSpacing: '15px', fontWeight: 900, textShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
              VERIFYING
            </h1>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(14px, 3vw, 28px)', color: C.gold, margin: '2.5rem 0 4.5rem', letterSpacing: '8px', fontWeight: 700 }}>
              WE'LL NOTIFY YOU SOON
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigateWithTransition('/history')}
                style={{ background: 'transparent', color: C.cream, border: `2px solid ${C.cream}`, padding: '18px 45px', borderRadius: '50px', fontFamily: "'Cinzel', serif", fontSize: '11px', fontWeight: 900, letterSpacing: '3px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232, 217, 160, 0.15)'; e.currentTarget.style.transform = 'translateY(-5px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                VIEW DASHBOARD
              </button>
              <button
                onClick={() => navigateWithTransition('/')}
                style={{ background: C.cream, color: C.crimson, border: 'none', padding: '18px 45px', borderRadius: '50px', fontFamily: "'Cinzel', serif", fontSize: '11px', fontWeight: 900, letterSpacing: '3px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 8px 25px rgba(0,0,0,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                BACK TO HOME
              </button>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}