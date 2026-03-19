import { useEffect, useState } from 'react'
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
          borderRadius: 4,
          color: C.dark, fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: 15, outline: 'none', transition: 'all 0.2s',
        }}
      />
      {error && <p style={{ color: C.crimson, fontSize: 11, margin: '0.3rem 0 0', fontFamily: "'EB Garamond', serif" }}>{error}</p>}
    </div>
  )
}

export default function Login({ flash = {} }) {
  useFonts()

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  })

  const submit = (e) => {
    e.preventDefault()
    post('/login')
  }

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
              fontFamily: "'Cinzel', serif",
              fontSize: 26, color: C.dark, fontWeight: 600,
              margin: '0 0 0.75rem', letterSpacing: 1,
            }}>Sign In</h1>
            <div style={{ width: '100%', height: 1, background: C.border }} />
          </div>

          {/* Flash */}
          {flash.success && (
            <div style={{
              padding: '10px 14px', marginBottom: '1.25rem',
              background: 'rgba(100,160,100,0.1)',
              border: `1px solid rgba(100,160,100,0.3)`,
              borderRadius: 4,
            }}>
              <p style={{ color: '#4A8A5A', fontSize: 13, margin: 0, fontFamily: "'EB Garamond', serif" }}>{flash.success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit}>
            <Field
              label="Email" id="email" type="email"
              value={data.email} onChange={e => setData('email', e.target.value)}
              error={errors.email} placeholder="nama@email.com"
            />
            <Field
              label="Password" id="password" type="password"
              value={data.password} onChange={e => setData('password', e.target.value)}
              error={errors.password} placeholder="••••••••"
            />

            {/* Don't have account */}
            <p style={{
              fontFamily: "'EB Garamond', serif", fontSize: 13,
              color: C.muted, margin: '0.75rem 0 1.25rem',
            }}>
              Don't have an account?{' '}
              <Link href="/register" style={{ color: C.dark, fontWeight: 600, textDecoration: 'none' }}>
                Sign Up
              </Link>
            </p>

            {/* Submit */}
            <button type="submit" disabled={processing} style={{
              width: '100%', padding: '12px',
              background: C.dark, color: C.cream,
              border: 'none', cursor: processing ? 'not-allowed' : 'pointer',
              fontFamily: "'Cinzel', serif", fontSize: 11,
              letterSpacing: 3, borderRadius: 4,
              opacity: processing ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => !processing && (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => e.currentTarget.style.opacity = processing ? '0.6' : '1'}
            >
              {processing ? 'Memproses...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}