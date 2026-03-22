import { useEffect, useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { navigateWithTransition } from '../../hooks/usePageTransition'

const C = {
  gold: '#C8A84B',
  cream: '#E8D9A0',
  parchment: '#D4C48A',
  crimson: '#8B1A1A',
  black: '#0F0A05',
  darkBg: '#121212',
}

function Navbar({ activeLink = '' }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const { auth } = usePage().props

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: 'Competitions', href: '/competitions' },
    { label: 'About', href: '/about' },
  ]

  const handleNav = (href) => {
    setMenuOpen(false)
    setTimeout(() => navigateWithTransition(href), 400)
  }

  return (
    <>
      <style>{`
        @keyframes overlayIn { from { clip-path: circle(0% at calc(100% - 2.5rem) 26px); } to { clip-path: circle(170% at calc(100% - 2.5rem) 26px); } }
        @keyframes overlayOut { from { clip-path: circle(170% at calc(100% - 2.5rem) 26px); } to { clip-path: circle(0% at calc(100% - 2.5rem) 26px); } }
        @keyframes navItemIn { from { opacity: 0; transform: translateX(-60px) skewX(-8deg); } to { opacity: 1; transform: translateX(0) skewX(0deg); } }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: 52,
        display: 'flex', alignItems: 'center', justifyContent: menuOpen ? 'flex-end' : 'space-between',
        padding: '0 1.75rem', background: menuOpen ? 'transparent' : (scrolled ? 'rgba(235,217,157,0.98)' : 'rgba(235,217,157,0.85)'),
        backdropFilter: menuOpen ? 'none' : 'blur(6px)', borderBottom: (!menuOpen && scrolled) ? '1px solid rgba(139,26,26,0.25)' : 'none', transition: 'all 0.35s',
      }}>
        {!menuOpen && (
          <a href="/" onClick={e => { e.preventDefault(); handleNav('/') }} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src="/images/BHRTK MERAH 1.png" alt="bharatika" style={{ height: 32, width: 'auto' }} />
          </a>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: menuOpen ? '1rem' : '0.75rem', background: menuOpen ? C.parchment : 'transparent', borderRadius: menuOpen ? 50 : 0, padding: menuOpen ? '10px 20px' : '0', transition: 'all 0.35s' }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {menuOpen ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.crimson} strokeWidth="2.5"><line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" /></svg> : <img src="/images/BURGER.png" style={{ height: 16 }} />}
          </button>
          <a href={auth?.user ? '/history' : '/login'} onClick={e => { e.preventDefault(); handleNav(auth?.user ? '/history' : '/login') }} style={{ opacity: menuOpen ? 1 : 0.75 }}>
            <img src="/images/Group 3.png" style={{ height: menuOpen ? 26 : 20 }} />
          </a>
        </div>
      </nav>

      <div style={{ position: 'fixed', inset: 0, zIndex: 250, background: C.crimson, animation: menuOpen ? 'overlayIn 0.65s forwards' : 'overlayOut 0.5s forwards', pointerEvents: menuOpen ? 'all' : 'none', overflow: 'hidden' }}>
        <img src="/images/BITMAP.svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5 }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8vw' }}>
          {navLinks.map((link, i) => (
            <div key={link.label} onClick={() => handleNav(link.href)} style={{ position: 'relative', cursor: 'pointer', lineHeight: 1.1, animation: menuOpen ? `navItemIn 0.6s ${0.1 + i * 0.08}s both` : 'none' }}>
              <span style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(44px, 7vw, 90px)', fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: 2, display: 'block', lineHeight: 1.6 }}>{link.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function Footer() {
  return (
    <footer style={{ background: C.black, padding: '2.5rem 2rem 1.75rem', borderTop: '1px solid rgba(200,168,75,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 26, color: C.cream, margin: '0 0 2px' }}>bharatika</p>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, color: C.cream, opacity: 0.4, textTransform: 'uppercase', margin: 0 }}>Creative Design Festival</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {['ig', 'tt', 'yt'].map((key) => (
            <div key={key} style={{ width: 34, height: 34, border: '1px solid rgba(232,217,160,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 18, height: 18, background: C.cream, opacity: 0.5 }}></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(232,217,160,0.08)', paddingTop: '1.25rem', textAlign: 'right' }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.cream, opacity: 0.25, margin: 0 }}>© Bharatika 2026. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

function useFonts() {
  useEffect(() => {
    if (document.getElementById('bh-fonts')) return
    const style = document.createElement('style')
    style.id = 'bh-fonts'
    style.textContent = `
      @font-face { font-family: 'CSSalient'; src: url('/fonts/CSSalient-Regular.ttf') format('truetype'); }
      @font-face { font-family: 'Nord'; src: url('/fonts/NORD-Bold.ttf') format('truetype'); }
      
      @keyframes headlineIn {
        0% { opacity: 0; transform: translateY(20px); filter: blur(8px); }
        100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
      }
      @keyframes formAreaIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `
    document.head.appendChild(style)
    const l = document.createElement('link')
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cinzel+Decorative:wght@400;700&family=FamiljenGrotesk:wght@400;700&display=swap'
    document.head.appendChild(l)
  }, [])
}

export default function Login({ flash = {} }) {
  useFonts()
  const { data, setData, post, processing, errors } = useForm({ email: '', password: '' })
  const submit = (e) => { e.preventDefault(); post('/login') }

  const inputStyle = (err) => ({
    width: '100%',
    padding: '12px 16px',
    background: 'transparent',
    border: `1.5px solid ${err ? '#E08080' : C.cream}`,
    borderRadius: '14px',
    color: '#fff',
    fontFamily: "'FamiljenGrotesk', sans-serif",
    fontSize: '15px',
    outline: 'none',
    marginTop: '6px'
  })

  return (
    <div style={{ background: C.black, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Main Content Area - fills exactly between navbar and footer */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        paddingTop: 52, // Height of Navbar
        overflow: 'hidden' 
      }}>
        
        {/* Left Section (40%) */}
        <div style={{ 
          flex: '0 0 40%', 
          position: 'relative', 
          background: C.crimson, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          padding: '0 5vw', 
          overflow: 'hidden' 
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1 }} />
          <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12, zIndex: 1 }} />
          
          <h1 style={{ 
            fontFamily: "'CSSalient', sans-serif", 
            fontSize: 'clamp(42px, 7vw, 105px)', 
            color: C.cream, 
            lineHeight: 0.82, 
            textTransform: 'uppercase', 
            margin: 0, 
            zIndex: 2,
            letterSpacing: '1px',
            animation: 'headlineIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards'
          }}>
            Get Yourself Ready To Take The Throne!
          </h1>
        </div>

        {/* Right Section (60%) */}
        <div style={{ 
          flex: '0 0 60%', 
          background: C.darkBg, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          position: 'relative',
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: '24px 24px'
        }}>
          <div style={{ width: '100%', maxWidth: '380px', padding: '2rem', zIndex: 1, animation: 'formAreaIn 0.8s ease-out both' }}>
            <h2 style={{ 
              fontFamily: "'Cinzel', serif", 
              fontSize: '44px', 
              color: C.cream, 
              textAlign: 'center', 
              letterSpacing: '10px', 
              marginBottom: '48px',
              fontWeight: 400
            }}>SIGN IN</h2>

            <form onSubmit={submit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: '11px', color: '#fff', opacity: 0.7, textTransform: 'capitalize', marginLeft: '4px' }}>E-Mail</label>
                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} style={inputStyle(errors.email)} placeholder="h14240000@john.petra.ac.id" />
                {errors.email && <p style={{ color: '#E08080', fontSize: '11px', marginTop: '6px' }}>{errors.email}</p>}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: '11px', color: '#fff', opacity: 0.7, textTransform: 'capitalize', marginLeft: '4px' }}>Password</label>
                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} style={inputStyle(errors.password)} placeholder="********" />
                {errors.password && <p style={{ color: '#E08080', fontSize: '11px', marginTop: '6px' }}>{errors.password}</p>}
              </div>

              <div style={{ marginBottom: '40px' }}>
                <a href="#" style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: '12px', color: C.cream, opacity: 0.8, textDecoration: 'underline' }}>Forgot Password</a>
              </div>

              <button 
                type="submit" 
                disabled={processing} 
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  background: C.cream, 
                  color: C.crimson, 
                  border: 'none', 
                  borderRadius: '50px', 
                  fontFamily: "'Cinzel', serif", 
                  fontSize: '13px', 
                  fontWeight: 700, 
                  letterSpacing: '2px', 
                  cursor: 'pointer',
                  opacity: processing ? 0.6 : 1,
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={e => !processing && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => !processing && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                SIGN IN
              </button>

              <p style={{ color: '#fff', fontSize: '12px', textAlign: 'center', marginTop: '24px', opacity: 0.6, fontFamily: "'FamiljenGrotesk', sans-serif" }}>
                Don't have any accounts yet? {' '}
                <span onClick={() => navigateWithTransition('/register')} style={{ color: C.cream, cursor: 'pointer', textDecoration: 'underline' }}>Sign up here</span>
              </p>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}