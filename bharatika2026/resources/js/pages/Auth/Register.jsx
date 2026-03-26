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
        <div key={i} style={{ 
          width: (i + 1) === current ? 24 : 10, 
          height: 10, 
          borderRadius: 10, 
          background: (i + 1) <= current ? C.cream : 'rgba(232,217,160,0.2)', 
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
        }} />
      ))}
    </div>
  )
}

function Field({ label, value, onChange, error, placeholder, type = 'text', inputMode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(10px,1vw,11px)', color: C.cream, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '4px' }}>{label}</label>
      <input type={type} value={value} onChange={onChange} inputMode={inputMode} placeholder={placeholder}
        style={{ 
          width: '100%', padding: 'clamp(12px,1.5vw,14px) 18px', 
          background: 'rgba(232,217,160,0.03)', 
          border: `1.5px solid ${error ? '#E08080' : 'rgba(232,217,160,0.3)'}`, 
          borderRadius: '14px', color: '#fff', 
          fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 'clamp(13px,1.3vw,14px)', 
          outline: 'none', marginTop: '6px', boxSizing: 'border-box',
          transition: 'border-color 0.3s ease'
        }} 
        onFocus={(e) => e.target.style.borderColor = C.gold}
        onBlur={(e) => e.target.style.borderColor = error ? '#E08080' : 'rgba(232,217,160,0.3)'}
      />
      {error && <p style={{ color: '#E08080', fontSize: '11px', marginTop: '6px', marginLeft: '4px', fontFamily: "'FamiljenGrotesk', sans-serif" }}>{error}</p>}
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
      if (!data.line_id.trim()) errs.line_id = 'Line ID is required'
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
        /* --- Ambient Animations --- */
        @keyframes signUpFloat {
          0%, 100% { 
            transform: translateY(0); 
            text-shadow: 0 0 20px rgba(232, 217, 160, 0.4);
          }
          50% { 
            transform: translateY(-12px); 
            text-shadow: 0 0 40px rgba(232, 217, 160, 0.7);
            color: #fff;
          }
        }

        @keyframes crownGlow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(200, 168, 75, 0.2)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 25px rgba(200, 168, 75, 0.5)); transform: scale(1.02); }
        }

        .reg-wrap {
          display: flex;
          min-height: calc(100vh - 52px);
          padding-top: 52px;
        }
        .reg-left {
          flex: 0 0 44%;
          position: relative;
          background: ${C.crimson};
          display: flex;
          align-items: center; 
          justify-content: flex-start; /* Teks ke kiri */
          padding: 0 clamp(2rem, 5vw, 4rem);
          overflow: hidden;
          min-height: 400px;
        }
        .reg-left-bg {
          position: absolute; 
          inset: 0; 
          background-image: url('/images/BG MERAH.svg'); 
          background-size: cover; 
          background-position: center; 
          opacity: 1; /* Menjaga warna asli tanpa dikurangi */
          z-index: 0;
        }
        .reg-right {
          flex: 0 0 56%;
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
          background-image: radial-gradient(circle, rgba(200,168,75,0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .reg-form-inner {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
        }
        .signup-text {
          font-family: 'Cinzel', serif;
          font-size: clamp(50px, 8.5vw, 110px);
          color: ${C.cream};
          line-height: 0.95;
          text-transform: uppercase;
          margin: 0;
          z-index: 2;
          letter-spacing: 12px;
          position: relative;
          text-align: left;
          animation: signUpFloat 5s ease-in-out infinite;
        }

        @media (max-width: 900px) {
          .reg-wrap { flex-direction: column; }
          .reg-left { flex: none; min-height: 40vh; justify-content: center; text-align: center; }
          .signup-text { text-align: center; }
        }
      `}</style>

      <div className="reg-wrap">
        {/* Left Side (Headline & Pure Background) */}
        <div className="reg-left">
          {/* Background Merah Asli - Tanpa Overlay tambahan */}
          <div className="reg-left-bg" />
          
          <h1 className="signup-text">
            SIGN<br />UP
          </h1>

          {/* Mahkota Lurus Melintang di Bawah */}
          <div style={{ 
            position: 'absolute', 
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            pointerEvents: 'none'
          }}>
            <img 
              src="/images/MAHKOTA.svg" 
              alt="Crown" 
              style={{ 
                width: '180%', /* Ukuran pas untuk melintang lurus */
                height: 'auto', 
                opacity: 0.9,
                animation: 'crownGlow 4s ease-in-out infinite',
                transform: 'translateY(25%)' /* Muncul dari dasar */
              }} 
            />
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="reg-right">
          <div className="reg-form-inner">
            <StepIndicator current={step} />

            {serverErrorMsg && (
              <div style={{ background: 'rgba(224,128,128,0.1)', border: '1px solid #E08080', padding: '12px', borderRadius: '12px', marginBottom: '20px' }}>
                <p style={{ color: '#E08080', fontSize: '13px', margin: 0, textAlign: 'center', fontFamily: "'FamiljenGrotesk', sans-serif" }}>{serverErrorMsg}</p>
              </div>
            )}

            <form onSubmit={handleNext}>
              <div style={{ minHeight: '320px' }}>
                {step === 1 && (
                  <div key="step1">
                    <Field label="Full Name" value={data.name} onChange={e => setData('name', e.target.value)} error={localErrors.name} placeholder="John Doe" />
                    <Field label="E-Mail" type="email" value={data.email} onChange={e => setData('email', e.target.value)} error={localErrors.email || serverErrors.email} placeholder="name@email.com" />
                    <Field label="Institution" value={data.instansi} onChange={e => setData('instansi', e.target.value)} error={localErrors.instansi} placeholder="University Name" />
                  </div>
                )}
                {step === 2 && (
                  <div key="step2">
                    <Field label="Line ID" value={data.line_id} onChange={e => setData('line_id', e.target.value)} placeholder="@username" />
                    <Field label="WhatsApp Number" inputMode="tel" value={data.whatsapp} onChange={e => setData('whatsapp', e.target.value.replace(/[^0-9+]/g, ''))} error={localErrors.whatsapp} placeholder="08xxxxxxxxx" />
                  </div>
                )}
                {step === 3 && (
                  <div key="step3">
                    <Field label="Password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} error={localErrors.password} placeholder="••••••••" />
                    <Field label="Confirm Password" type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} error={localErrors.password_confirmation} placeholder="••••••••" />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                {step > 1 && (
                  <button type="button" onClick={() => setStep(s => s - 1)} 
                    style={{ flex: 1, padding: '14px', background: 'transparent', border: `1.5px solid ${C.cream}`, borderRadius: '50px', color: C.cream, fontFamily: "'Cinzel', serif", fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}
                    className="btn-reg">
                    BACK
                  </button>
                )}
                <button type="submit" disabled={processing} 
                  style={{ flex: 2, padding: '14px', background: C.cream, color: C.crimson, border: 'none', borderRadius: '50px', fontFamily: "'Cinzel', serif", fontSize: '12px', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer' }}
                  className="btn-reg">
                  {processing ? 'SUBMITTING...' : (step < 3 ? 'NEXT' : 'CREATE ACCOUNT')}
                </button>
              </div>

              <p style={{ color: '#fff', fontSize: '13px', textAlign: 'center', marginTop: '30px', opacity: 0.7, fontFamily: "'FamiljenGrotesk', sans-serif" }}>
                Already have an account? <a href="/login" style={{ color: C.cream, textDecoration: 'none', fontWeight: 'bold' }}>Sign in here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}