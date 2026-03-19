import { useState, useEffect } from 'react'
import { useForm, Link } from '@inertiajs/react'

const C = {
  gold: '#C8A84B',
  cream: '#F0E8CC',
  parchment: '#E8DDB8',
  crimson: '#8B1A1A',
  dark: '#1A1410',
  black: '#0F0A05',
  muted: '#9A8F7A',
  border: '#D4C9A8',
}

function useFonts() {
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.background = C.cream
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
    document.head.appendChild(l)
  }, [])
}

/* ─── Navbar ─── */
function Navbar() {
  const links = ['Home', 'Events', 'Competitions', 'About']
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: C.cream, borderBottom: `1px solid ${C.border}`,
      padding: '0 2.5rem', height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 16, color: C.dark }}>bharatika</span>
      </Link>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {links.map(l => (
          <Link key={l} href={l === 'Home' ? '/' : `/${l.toLowerCase()}`} style={{
            fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2,
            color: C.dark, textDecoration: 'none', textTransform: 'uppercase', opacity: 0.65,
          }}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0.65}
          >{l}</Link>
        ))}
      </div>
    </nav>
  )
}

/* ─── Step indicator ─── */
function StepIndicator({ current, total = 3 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: '2rem' }}>
      {Array(total).fill(null).map((_, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: active || done ? C.dark : 'transparent',
              border: `2px solid ${active || done ? C.dark : C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s',
            }}>
              {done ? (
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <polyline points="2,6 5,9 10,3" stroke={C.cream} strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              ) : (
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: active ? C.cream : C.muted, fontWeight: 600 }}>{step}</span>
              )}
            </div>
            {i < total - 1 && (
              <div style={{ width: 48, height: 2, background: done ? C.dark : C.border, transition: 'background 0.3s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Regular input field ─── */
function Field({ label, id, type = 'text', value, onChange, error, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label htmlFor={id} style={{
          display: 'block', fontFamily: "'Cinzel', serif",
          fontSize: 8, letterSpacing: 2, color: C.muted,
          textTransform: 'uppercase', marginBottom: '0.3rem',
        }}>{label}</label>
      )}
      <input
        id={id} type={type} value={value}
        onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '10px 14px', boxSizing: 'border-box',
          background: focused ? '#FFF8E8' : C.parchment,
          border: `1px solid ${error ? C.crimson : focused ? C.dark : C.border}`,
          borderRadius: 4, color: C.dark,
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: 15, outline: 'none', transition: 'all 0.2s',
        }}
      />
      {error && <p style={{ color: C.crimson, fontSize: 11, margin: '0.3rem 0 0', fontFamily: "'EB Garamond', serif" }}>{error}</p>}
    </div>
  )
}

/* ─── Phone field — hanya angka & + ─── */
function PhoneField({ label, id, value, onChange, error, placeholder }) {
  const [focused, setFocused] = useState(false)

  const handleKeyDown = (e) => {
    // Izinkan: angka, +, navigation keys, backspace, delete
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End']
    if (allowed.includes(e.key)) return
    if (/^[0-9+]$/.test(e.key)) return
    // Blokir semua huruf dan karakter lain
    e.preventDefault()
  }

  const handleChange = (e) => {
    // Bersihkan jika ada karakter aneh yang masuk lewat paste
    const cleaned = e.target.value.replace(/[^0-9+]/g, '')
    onChange({ target: { value: cleaned } })
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={id} style={{
        display: 'block', fontFamily: "'Cinzel', serif",
        fontSize: 8, letterSpacing: 2, color: C.muted,
        textTransform: 'uppercase', marginBottom: '0.3rem',
      }}>{label}</label>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '10px 14px', boxSizing: 'border-box',
          background: focused ? '#FFF8E8' : C.parchment,
          border: `1px solid ${error ? C.crimson : focused ? C.dark : C.border}`,
          borderRadius: 4, color: C.dark,
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: 15, outline: 'none', transition: 'all 0.2s',
        }}
      />
      {error && <p style={{ color: C.crimson, fontSize: 11, margin: '0.3rem 0 0', fontFamily: "'EB Garamond', serif" }}>{error}</p>}
    </div>
  )
}

/* ─── Validasi per step ─── */
function validateStep(step, data) {
  const errs = {}

  if (step === 1) {
    if (!data.name.trim())
      errs.name = 'Nama lengkap wajib diisi.'
    if (!data.email.trim())
      errs.email = 'Email wajib diisi.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errs.email = 'Format email tidak valid.'
    if (!data.instansi.trim())
      errs.instansi = 'Asal instansi wajib diisi.'
  }

  if (step === 2) {
    if (!data.whatsapp.trim())
      errs.whatsapp = 'Nomor WhatsApp wajib diisi.'
    else if (data.whatsapp.replace(/[^0-9]/g, '').length < 9)
      errs.whatsapp = 'Nomor telepon minimal 9 digit.'
    else if (data.whatsapp.replace(/[^0-9]/g, '').length > 15)
      errs.whatsapp = 'Nomor telepon maksimal 15 digit.'
  }

  if (step === 3) {
    if (!data.password)
      errs.password = 'Password wajib diisi.'
    else if (data.password.length < 6)
      errs.password = 'Password minimal 6 karakter.'
    if (!data.password_confirmation)
      errs.password_confirmation = 'Konfirmasi password wajib diisi.'
    else if (data.password !== data.password_confirmation)
      errs.password_confirmation = 'Password tidak cocok.'
  }

  return errs
}

/* ─── STEP 1 ─── */
function Step1({ data, setData, localErrors }) {
  return (
    <>
      <Field label="Nama Lengkap" id="name" value={data.name}
        onChange={e => setData('name', e.target.value)}
        error={localErrors.name} placeholder="Alexandra Adi Abigail" />
      <Field label="Email" id="email" type="email" value={data.email}
        onChange={e => setData('email', e.target.value)}
        error={localErrors.email} placeholder="nama@email.com" />
      <Field label="Asal Instansi" id="instansi" value={data.instansi}
        onChange={e => setData('instansi', e.target.value)}
        error={localErrors.instansi} placeholder="Petra Christian University" />
    </>
  )
}

/* ─── STEP 2 ─── */
function Step2({ data, setData, localErrors }) {
  return (
    <>
      <PhoneField label="Nomor WhatsApp" id="whatsapp" value={data.whatsapp}
        onChange={e => setData('whatsapp', e.target.value)}
        error={localErrors.whatsapp} placeholder="08xxxxxxxxxx" />
      <Field label="ID Line (Opsional)" id="line_id" value={data.line_id}
        onChange={e => setData('line_id', e.target.value)}
        error={localErrors.line_id} placeholder="line_id_kamu" />
    </>
  )
}

/* ─── STEP 3 ─── */
function Step3({ data, setData, localErrors, serverErrors }) {
  return (
    <>
      <Field label="Password" id="password" type="password" value={data.password}
        onChange={e => setData('password', e.target.value)}
        error={localErrors.password || serverErrors.password}
        placeholder="Min. 6 karakter" />
      <Field label="Konfirmasi Password" id="password_confirmation" type="password"
        value={data.password_confirmation}
        onChange={e => setData('password_confirmation', e.target.value)}
        error={localErrors.password_confirmation || serverErrors.password_confirmation}
        placeholder="Ulangi password" />
    </>
  )
}

/* ─── MAIN ─── */
export default function Register() {
  useFonts()
  const [step, setStep] = useState(1)
  const [localErrors, setLocalErrors] = useState({})

  const { data, setData, post, processing, errors: serverErrors } = useForm({
    name: '',
    email: '',
    instansi: '',
    whatsapp: '',
    line_id: '',
    password: '',
    password_confirmation: '',
  })

  const next = () => {
    const errs = validateStep(step, data)
    if (Object.keys(errs).length > 0) {
      setLocalErrors(errs)
      return
    }
    setLocalErrors({})
    setStep(s => s + 1)
  }

  const prev = () => {
    setLocalErrors({})
    setStep(s => s - 1)
  }

  const submit = (e) => {
    e.preventDefault()
    if (step < 3) { next(); return }
    const errs = validateStep(3, data)
    if (Object.keys(errs).length > 0) {
      setLocalErrors(errs)
      return
    }
    setLocalErrors({})
    post('/register')
  }

  const stepTitles = ['Informasi Pribadi', 'Informasi Kontak', 'Keamanan Akun']

  return (
    <div style={{ minHeight: '100vh', background: C.cream }}>
      <Navbar />

      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 1.5rem 3rem',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontFamily: "'Cinzel', serif", fontSize: 26,
              color: C.dark, fontWeight: 600, margin: '0 0 0.25rem', letterSpacing: 1,
            }}>Register</h1>
            <div style={{ width: '100%', height: 1, background: C.border, marginTop: '0.75rem' }} />
          </div>

          {/* Step indicator */}
          <StepIndicator current={step} total={3} />

          {/* Step label */}
          <p style={{
            fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3,
            color: C.muted, textTransform: 'uppercase', textAlign: 'center',
            margin: '-1rem 0 1.5rem',
          }}>{stepTitles[step - 1]}</p>

          {/* Server error dari Laravel (misal email sudah dipakai) */}
          {serverErrors.email && step === 1 && (
            <div style={{
              padding: '10px 14px', marginBottom: '1rem',
              background: 'rgba(139,26,26,0.07)',
              border: `1px solid rgba(139,26,26,0.2)`,
              borderRadius: 4,
            }}>
              <p style={{ color: C.crimson, fontSize: 13, margin: 0, fontFamily: "'EB Garamond', serif" }}>
                {serverErrors.email}
              </p>
            </div>
          )}

          <form onSubmit={submit}>
            {step === 1 && <Step1 data={data} setData={setData} localErrors={localErrors} />}
            {step === 2 && <Step2 data={data} setData={setData} localErrors={localErrors} />}
            {step === 3 && <Step3 data={data} setData={setData} localErrors={localErrors} serverErrors={serverErrors} />}

            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: C.muted, margin: '0.75rem 0 1rem' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: C.dark, fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: step > 1 ? 'space-between' : 'flex-end' }}>
              {step > 1 && (
                <button type="button" onClick={prev} style={{
                  padding: '10px 28px', background: 'transparent',
                  border: `1.5px solid ${C.dark}`, color: C.dark,
                  cursor: 'pointer', fontFamily: "'Cinzel', serif",
                  fontSize: 11, letterSpacing: 2, borderRadius: 4, transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.dark; e.currentTarget.style.color = C.cream }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.dark }}
                >Previous</button>
              )}

              {step < 3 ? (
                <button type="submit" style={{
                  padding: '10px 28px', background: C.dark, color: C.cream,
                  border: 'none', cursor: 'pointer', fontFamily: "'Cinzel', serif",
                  fontSize: 11, letterSpacing: 2, borderRadius: 4, transition: 'opacity 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >Next &gt;</button>
              ) : (
                <button type="submit" disabled={processing} style={{
                  flex: 1, padding: '12px', background: C.dark, color: C.cream,
                  border: 'none', cursor: processing ? 'not-allowed' : 'pointer',
                  fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 2,
                  borderRadius: 4, opacity: processing ? 0.6 : 1, transition: 'opacity 0.2s',
                }}>
                  {processing ? 'Memproses...' : 'Create an Account'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}