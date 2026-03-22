// resources/js/pages/Auth/Register.jsx
import { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import MainLayout from '../../Layouts/MainLayout'

const C = {
  gold: '#C8A84B', cream: '#E8D9A0', parchment: '#D4C48A',
  crimson: '#8B1A1A', black: '#0F0A05', darkBg: '#121212',
}

function StepIndicator({ current, total = 3 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: '2.5rem' }}>
      {Array(total).fill(null).map((_, i) => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: (i + 1) <= current ? C.cream : 'rgba(232,217,160,0.2)', transition: '0.4s ease' }} />
      ))}
    </div>
  )
}

function Field({ label, value, onChange, error, placeholder, type = 'text', inputMode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(10px,1vw,11px)', color: '#fff', opacity: 0.7, textTransform: 'capitalize', marginLeft: '4px' }}>{label}</label>
      <input type={type} value={value} onChange={onChange} inputMode={inputMode} placeholder={placeholder}
        style={{ width: '100%', padding: 'clamp(10px,1.5vw,12px) 18px', background: 'transparent', border: `1.5px solid ${error ? '#E08080' : C.cream}`, borderRadius: '14px', color: '#fff', fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(13px,1.3vw,14px)', outline: 'none', marginTop: '6px', boxSizing: 'border-box' }} />
      {error && <p style={{ color: '#E08080', fontSize: '11px', marginTop: '4px', marginLeft: '4px' }}>{error}</p>}
    </div>
  )
}

export default function Register() {
  const [step, setStep] = useState(1)
  const [localErrors, setLocalErrors] = useState({})
  const { data, setData, post, processing, errors: serverErrors } = useForm({
    name: '', email: '', instansi: '', whatsapp: '', line_id: '', password: '', password_confirmation: '',
  })

  useEffect(() => {
    document.body.style.background = C.black
    if (document.getElementById('bh-fonts')) return
    const style = document.createElement('style')
    style.id = 'bh-fonts'
    style.textContent = `
      @font-face { font-family: 'CSSalient'; src: url('/fonts/CSSalient-Regular.ttf') format('truetype'); }
      @font-face { font-family: 'Nord'; src: url('/fonts/NORD-Bold.ttf') format('truetype'); }
      @keyframes headlineIn { 0% { opacity:0; transform:translateY(30px); filter:blur(10px); } 100% { opacity:1; transform:translateY(0); filter:blur(0px); } }
      @keyframes pulseGlow { 0%, 100% { opacity:1; } 50% { opacity:0.85; } }
      @keyframes formAreaIn { from { opacity:0; transform:scale(0.98); } to { opacity:1; transform:scale(1); } }
      @keyframes errorFade { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
    `
    document.head.appendChild(style)
    const l = document.createElement('link')
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=FamiljenGrotesk:wght@400;700&display=swap'
    document.head.appendChild(l)
  }, [])

  const validateStep = (s) => {
    const errs = {}
    if (s === 1) {
      if (!data.name.trim()) errs.name = 'Full Name is required'
      if (!data.email.trim()) errs.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Invalid email format'
      if (!data.instansi.trim()) errs.instansi = 'Institution is required'
    }
    if (s === 2) {
      const phoneDigits = data.whatsapp.replace(/[^0-9]/g, '')
      if (!data.whatsapp.trim()) errs.whatsapp = 'Phone number is required'
      else if (phoneDigits.length < 9 || phoneDigits.length > 15) errs.whatsapp = 'Phone number must be between 9-15 digits'
    }
    if (s === 3) {
      if (data.password.length < 6) errs.password = 'Password must be at least 6 characters'
      if (data.password !== data.password_confirmation) errs.password_confirmation = 'Passwords do not match'
    }
    return errs
  }

  const handleNext = (e) => {
    e.preventDefault()
    const errs = validateStep(step)
    if (Object.keys(errs).length > 0) { setLocalErrors(errs); return }
    setLocalErrors({})
    if (step < 3) setStep(s => s + 1)
    else post('/register')
  }

  const serverErrorMsg = Object.values(serverErrors)[0]

  return (
    <MainLayout>
      <style>{`
        .reg-wrap {
          display: flex;
          min-height: calc(100vh - 52px);
          padding-top: 52px;
        }
        .reg-left {
          flex: 0 0 40%;
          position: relative;
          background: ${C.crimson};
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 clamp(1.5rem, 5vw, 5vw);
          overflow: hidden;
          min-height: 300px;
        }
        .reg-right {
          flex: 0 0 60%;
          background: ${C.darkBg};
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: clamp(2rem, 4vw, 3rem) clamp(1.25rem, 3vw, 2rem);
        }
        .reg-right::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .reg-form-inner {
          width: 100%;
          max-width: 440px;
          padding: clamp(1rem, 2vw, 2rem);
          position: relative;
          z-index: 1;
          animation: formAreaIn 0.8s ease-out both;
        }
        @media (max-width: 768px) {
          .reg-wrap { flex-direction: column; }
          .reg-left { flex: none; min-height: 30vh; padding: clamp(2rem, 5vw, 3rem) clamp(1.5rem, 5vw, 3rem); }
          .reg-right { flex: none; }
        }
        @media (max-width: 480px) {
          .reg-left { min-height: 25vh; }
        }
      `}</style>
      <div className="reg-wrap">
        {/* Left */}
        <div className="reg-left">
          <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1 }} />
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(40px, 7vw, 100px)', color: C.cream, lineHeight: 1.1, textTransform: 'uppercase', margin: 0, zIndex: 2, letterSpacing: '8px', animation: 'headlineIn 1.2s ease forwards, pulseGlow 4s ease-in-out infinite' }}>
            SIGN<br />UP
          </h1>
        </div>
        {/* Right */}
        <div className="reg-right">
          <div className="reg-form-inner">
            <StepIndicator current={step} />
            {serverErrorMsg && (
              <div style={{ background: 'rgba(224,128,128,0.15)', border: '1px solid #E08080', padding: '12px', borderRadius: '10px', marginBottom: '20px', animation: 'errorFade 0.4s ease forwards' }}>
                <p style={{ color: '#E08080', fontSize: '13px', margin: 0, textAlign: 'center', fontFamily: "'FamiljenGrotesk', sans-serif" }}>{serverErrorMsg}</p>
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
                  <Field label="WhatsApp Number" inputMode="tel" value={data.whatsapp} onChange={e => setData('whatsapp', e.target.value.replace(/[^0-9+]/g, ''))} error={localErrors.whatsapp} placeholder="08xxxxxxxxx" />
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
                  <button type="button" onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: 'clamp(11px,1.5vw,14px)', background: 'transparent', border: `1.5px solid ${C.cream}`, borderRadius: '50px', color: C.cream, fontFamily: "'Cinzel', serif", fontSize: 'clamp(11px,1.2vw,13px)', cursor: 'pointer' }}>BACK</button>
                )}
                <button type="submit" disabled={processing} style={{ flex: 1, padding: 'clamp(11px,1.5vw,14px)', background: C.cream, color: C.crimson, border: 'none', borderRadius: '50px', fontFamily: "'Cinzel', serif", fontSize: 'clamp(11px,1.2vw,13px)', fontWeight: 700, cursor: 'pointer', transition: '0.3s' }}>
                  {processing ? 'SUBMITTING...' : (step < 3 ? 'NEXT' : 'SIGN UP')}
                </button>
              </div>
              <p style={{ color: '#fff', fontSize: 'clamp(11px,1.2vw,12px)', textAlign: 'center', marginTop: '24px', opacity: 0.6, fontFamily: "'FamiljenGrotesk', sans-serif" }}>
                Already have an account? <a href="/login" style={{ color: C.cream }}>Sign in here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}