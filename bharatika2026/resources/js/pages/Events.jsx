import { useEffect } from 'react'
import MainLayout from '../Layouts/MainLayout'

const C = {
  gold: '#C8A84B', cream: '#E8D9A0', parchment: '#D4C48A',
  crimson: '#8B1A1A', dark: '#1A1410', black: '#0F0A05',
}

function useFonts() {
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.overflowX = 'hidden'
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

export default function Events() {
  useFonts()
  return (
    <MainLayout>
      <section style={{
        position: 'relative',
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: C.crimson,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/images/BG MERAH.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(139,26,26,0.3) 0%, rgba(80,10,10,0.5) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p style={{
            fontFamily: "'CSSalient', sans-serif",
            fontSize: 'clamp(48px, 10vw, 120px)',
            color: C.cream,
            margin: 0,
            lineHeight: 1,
            letterSpacing: 4,
            textTransform: 'uppercase',
            opacity: 0.92,
          }}>coming soon</p>
        </div>
      </section>
    </MainLayout>
  )
}