import { useState, useEffect } from 'react'
import { useForm, usePage } from '@inertiajs/react'

const C = {
  gold: '#C8A84B',
  cream: '#E8D9A0',
  parchment: '#D4C48A',
  crimson: '#8B1A1A',
  black: '#0F0A05',
  darkBg: '#121212',
}

/* ─── Shared Components ─── */

function Navbar({ activeLink = '' }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src="/images/BHRTK MERAH 1.png" alt="bharatika" style={{ height: 32, width: 'auto' }} />
          </a>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: menuOpen ? '1rem' : '0.75rem', background: menuOpen ? C.parchment : 'transparent', borderRadius: 50, padding: menuOpen ? '10px 20px' : '0', transition: 'all 0.35s' }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.crimson} strokeWidth="2.5"><line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" /></svg>
            ) : (
              <img src="/images/BURGER.png" alt="menu" style={{ height: 16 }} />
            )}
          </button>
          <a href={auth?.user ? '/history' : '/login'} style={{ textDecoration: 'none', opacity: menuOpen ? 1 : 0.75 }}>
            <img src="/images/Group 3.png" alt="profile" style={{ height: 26 }} />
          </a>
        </div>
      </nav>

      <div style={{ position: 'fixed', inset: 0, zIndex: 250, background: C.crimson, animation: menuOpen ? 'overlayIn 0.65s forwards' : 'overlayOut 0.5s forwards', pointerEvents: menuOpen ? 'all' : 'none', overflow: 'hidden' }}>
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5 }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8vw' }}>
          {navLinks.map((link, i) => (
            <div key={link.label} style={{ animation: menuOpen ? `navItemIn 0.6s ${0.1 + i * 0.08}s both` : 'none' }}>
              <span style={{ fontFamily: "'Nord', sans-serif", fontSize: '44px', fontWeight: 700, color: C.gold, textTransform: 'uppercase' }}>{link.label}</span>
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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 26, color: C.cream, margin: 0 }}>bharatika</p>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.cream, opacity: 0.4, textTransform: 'uppercase' }}>Creative Design Festival</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(232,217,160,0.08)', paddingTop: '1.25rem', textAlign: 'right' }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.cream, opacity: 0.25, margin: 0 }}>© Bharatika 2026. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

/* ─── Field and Indicator ─── */

function StepIndicator({ current, total = 3 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: '2.5rem' }}>
      {Array(total).fill(null).map((_, i) => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: (i + 1) <= current ? C.cream : 'rgba(232, 217, 160, 0.2)', transition: '0.4s ease' }} />
      ))}
    </div>
  )
}

function Field({ label, value, onChange, error, placeholder, type = "text", inputMode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: '11px', color: '#fff', opacity: 0.7, textTransform: 'capitalize', marginLeft: '4px' }}>{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        inputMode={inputMode}
        placeholder={placeholder}
        style={{ width: '100%', padding: '12px 18px', background: 'transparent', border: `1.5px solid ${error ? '#E08080' : C.cream}`, borderRadius: '14px', color: '#fff', fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: '14px', outline: 'none', marginTop: '6px' }} 
      />
      {error && <p style={{ color: '#E08080', fontSize: '11px', marginTop: '4px', marginLeft: '4px' }}>{error}</p>}
    </div>
  )
}

/* ─── Main Register Page ─── */

export default function Register() {
  const [step, setStep] = useState(1)
  const [localErrors, setLocalErrors] = useState({})
  const { data, setData, post, processing, errors: serverErrors } = useForm({
    name: '', email: '', instansi: '', whatsapp: '', line_id: '', password: '', password_confirmation: '',
  })

  useEffect(() => {
    document.body.style.background = C.black
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cinzel+Decorative:wght@400;700&family=FamiljenGrotesk:wght@400;700&display=swap'
    document.head.appendChild(l)
  }, [])

  const validateStep = (s) => {
    const errs = {}
    if (s === 1) {
      if (!data.name.trim()) errs.name = 'Full Name is required';
      if (!data.email.trim()) {
        errs.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errs.email = 'Invalid email format';
      }
      if (!data.instansi.trim()) errs.instansi = 'Institution is required';
    }
    if (s === 2) {
      const phoneDigits = data.whatsapp.replace(/[^0-9]/g, '');
      if (!data.whatsapp.trim()) {
        errs.whatsapp = 'Phone number is required';
      } else if (phoneDigits.length < 9 || phoneDigits.length > 15) {
        errs.whatsapp = 'Phone number must be between 9-15 digits';
      }
    }
    if (s === 3) {
      if (data.password.length < 6) errs.password = 'Password must be at least 6 characters';
      if (data.password !== data.password_confirmation) errs.password_confirmation = 'Passwords do not match';
    }
    return errs
  }

  const handleNext = (e) => {
    e.preventDefault(); 
    const errs = validateStep(step)
    if (Object.keys(errs).length > 0) { setLocalErrors(errs); return }
    setLocalErrors({}); 
    if (step < 3) setStep(s => s + 1); 
    else post('/register')
  }

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/[^0-9+]/g, '');
    setData('whatsapp', val);
  }

  // Combined error message from server
  const serverErrorMsg = Object.values(serverErrors)[0];

  return (
    <div style={{ background: C.black, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <style>{`
        @keyframes headlineIn { 0% { opacity: 0; transform: translateY(30px); filter: blur(10px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0px); } }
        @keyframes pulseGlow { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } }
        @keyframes formAreaIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        @keyframes errorFade { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ display: 'flex', flex: 1, paddingTop: 52, overflow: 'hidden' }}>
        <div style={{ flex: '0 0 40%', position: 'relative', background: C.crimson, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 5vw' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1 }} />
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(44px, 7vw, 100px)', color: C.cream, lineHeight: 1.1, textTransform: 'uppercase', margin: 0, zIndex: 2, letterSpacing: '8px', animation: 'headlineIn 1.2s ease forwards, pulseGlow 4s ease-in-out infinite' }}>
            SIGN<br/>UP
          </h1>
        </div>

        <div style={{ flex: '0 0 60%', background: C.darkBg, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: '24px 24px' }} />
          <div style={{ width: '100%', maxWidth: '440px', padding: '2rem', zIndex: 1, animation: 'formAreaIn 0.8s ease-out both' }}>
            
            <StepIndicator current={step} />

            {/* Error Notification Alert */}
            {serverErrorMsg && (
              <div style={{ 
                background: 'rgba(224, 128, 128, 0.15)', 
                border: '1px solid #E08080', 
                padding: '12px', 
                borderRadius: '10px', 
                marginBottom: '20px', 
                animation: 'errorFade 0.4s ease forwards' 
              }}>
                <p style={{ color: '#E08080', fontSize: '13px', margin: 0, textAlign: 'center', fontFamily: "'FamiljenGrotesk', sans-serif" }}>
                  {serverErrorMsg}
                </p>
              </div>
            )}

            <form onSubmit={handleNext}>
              {step === 1 && (
                <>
                  <Field label="Full Name" value={data.name} onChange={e => setData('name', e.target.value)} error={localErrors.name} placeholder="John Doe" />
                  <Field label="E-Mail" type="email" value={data.email} onChange={e => setData('email', e.target.value)} error={localErrors.email || serverErrors.email} placeholder="name@email.com" />
                  <Field label="Institution" value={data.instansi} onChange={e => setData('instansi', e.target.value)} error={localErrors.instansi} placeholder="University Name" />
                </>
              )}
              {step === 2 && (
                <>
                  <Field label="Line ID (Optional)" value={data.line_id} onChange={e => setData('line_id', e.target.value)} placeholder="@username" />
                  <Field label="WhatsApp Number" inputMode="tel" value={data.whatsapp} onChange={handlePhoneChange} error={localErrors.whatsapp} placeholder="08xxxxxxxxx" />
                </>
              )}
              {step === 3 && (
                <>
                  <Field label="Password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} error={localErrors.password} placeholder="••••••••" />
                  <Field label="Confirm Password" type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} error={localErrors.password_confirmation} placeholder="••••••••" />
                </>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                {step > 1 && (
                  <button type="button" onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '14px', background: 'transparent', border: `1.5px solid ${C.cream}`, borderRadius: '50px', color: C.cream, fontFamily: "'Cinzel', serif", fontSize: '13px', cursor: 'pointer' }}>BACK</button>
                )}
                <button type="submit" disabled={processing} style={{ flex: 1, padding: '14px', background: C.cream, color: C.crimson, border: 'none', borderRadius: '50px', fontFamily: "'Cinzel', serif", fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: '0.3s' }}>
                  {processing ? 'SUBMITTING...' : (step < 3 ? 'NEXT' : 'SIGN UP')}
                </button>
              </div>
              <p style={{ color: '#fff', fontSize: '12px', textAlign: 'center', marginTop: '24px', opacity: 0.6, fontFamily: "'FamiljenGrotesk', sans-serif" }}>
                Already have an account? <a href="/login" style={{ color: C.cream }}>Sign in here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}