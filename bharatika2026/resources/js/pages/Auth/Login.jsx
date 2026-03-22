import { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import MainLayout from '../../Layouts/MainLayout'

const C = {
  gold:     '#C8A84B',
  cream:    '#E8D9A0',
  crimson:  '#8B1A1A',
  dark:     '#0F0A05',
  darkCard: '#1A1410',
  darkGreen:'#0E1A10',
}

function useFonts() {
  useEffect(() => {
    if (document.getElementById('login-fonts')) return
    const style = document.createElement('style')
    style.id = 'login-fonts'
    style.textContent = `
      @font-face { font-family: 'CSSalient';      src: url('/fonts/CSSalient-Regular.ttf')    format('truetype'); }
      @font-face { font-family: 'Nord';            src: url('/fonts/NORD-Bold.ttf')             format('truetype'); font-weight: bold; }
      @font-face { font-family: 'FamiljenGrotesk'; src: url('/fonts/FamiljenGrotesk-Variable.ttf') format('truetype'); font-weight: 100 900; }
    `
    document.head.appendChild(style)
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap'
    document.head.appendChild(l)
  }, [])
}

export default function Login({ errors = {} }) {
  useFonts()

  const { data, setData, post, processing } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  const [showPass, setShowPass] = useState(false)
  const [focused, setFocused] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/login')
  }

  const inputStyle = (name) => ({
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: C.cream,
    fontFamily: "'FamiljenGrotesk', sans-serif",
    fontSize: 'clamp(15px, 1.5vw, 18px)',
    padding: 0,
    caretColor: C.gold,
  })

  const fieldWrap = (name) => ({
    width: '100%',
    border: `1.5px solid ${focused === name ? C.gold : 'rgba(200,168,75,0.45)'}`,
    borderRadius: 14,
    padding: '14px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    background: 'rgba(200,168,75,0.04)',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    cursor: 'text',
  })

  return (
    <MainLayout>
      <style>{`
        /* ── Login page ── */
        .login-wrap {
          display: flex;
          min-height: 100vh;
          padding-top: 52px;
        }

        /* Left — crimson panel */
        .login-left {
          width: 44%;
          position: relative;
          overflow: hidden;
          background: ${C.crimson};
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* Right — dark form panel */
        .login-right {
          width: 56%;
          background: ${C.darkGreen};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 5vw;
          position: relative;
        }
        .login-right::before {
          content: '';
          position: absolute;
          inset: 0;
          backgroundImage: url('/images/BITMAP.svg');
          background-size: cover;
          opacity: 0.07;
          pointer-events: none;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .login-wrap  { flex-direction: column; }
          .login-left  { width: 100%; min-height: 40vh; }
          .login-right { width: 100%; padding: 3rem 2rem 4rem; }
        }
        @media (max-width: 540px) {
          .login-left  { min-height: 35vh; }
          .login-right { padding: 2.5rem 1.25rem 3rem; }
        }

        /* Input autofill override */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: ${C.cream};
          -webkit-box-shadow: 0 0 0px 1000px transparent inset;
          transition: background-color 5000s ease-in-out 0s;
        }

        .login-btn {
          width: 100%;
          padding: 16px;
          border-radius: 50px;
          border: none;
          background: ${C.cream};
          color: ${C.crimson};
          font-family: 'Cinzel', serif;
          font-size: clamp(14px, 1.5vw, 18px);
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          margin-top: 0.5rem;
        }
        .login-btn:hover  { background: #d4c98a; transform: translateY(-1px); }
        .login-btn:active { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .login-link {
          color: ${C.cream};
          text-decoration: underline;
          text-underline-offset: 3px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .login-link:hover { color: ${C.gold}; }
      `}</style>

      <div className="login-wrap">

        {/* ══════════ LEFT — crimson + tagline + crown ══════════ */}
        <div className="login-left">

          {/* BG texture */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: "url('/images/BG MERAH.svg')",
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.85, pointerEvents: 'none',
          }} />
          <img src="/images/BITMAP.svg" alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: 0.18, pointerEvents: 'none',
          }} />

          {/* Tagline */}
          <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,4vw,3.5rem) 0' }}>
            <h1 style={{
              fontFamily: "'UnifrakturMaguntia', cursive",
              fontSize: 'clamp(44px, 7vw, 96px)',
              color: C.cream,
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: 1,
              textTransform: 'none',
            }}>
              Get<br />
              Yourself<br />
              Ready to<br />
              Take the<br />
              Throne!
            </h1>
          </div>

          {/* Crown image — pinned to bottom */}
          <div style={{
            position: 'relative', zIndex: 2,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            width: '100%',
            marginTop: 'auto',
          }}>
            <img
              src="/images/MAHKOTA.svg"
              alt="Crown"
              style={{
                width: '100%',
                maxHeight: 'clamp(180px, 28vw, 360px)',
                objectFit: 'contain',
                objectPosition: 'bottom center',
                display: 'block',
              }}
              onError={e => { e.target.style.opacity = '0' }}
            />
          </div>

        </div>

        {/* ══════════ RIGHT — form ══════════ */}
        <div className="login-right">
          <div style={{
            position: 'relative', zIndex: 1,
            width: '100%',
            maxWidth: 520,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '1.75rem',
          }}>

            {/* Title */}
            <h2 style={{
              fontFamily: "'Nord', sans-serif",
              fontSize: 'clamp(36px, 6vw, 80px)',
              color: C.cream,
              margin: '0 0 0.5rem',
              letterSpacing: 10,
              textTransform: 'uppercase',
              fontWeight: 700,
              textAlign: 'center',
            }}>
              Sign In
            </h2>

            {/* ── Email field ── */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div
                style={fieldWrap('email')}
                onClick={() => document.getElementById('login-email').focus()}
              >
                <label style={{
                  fontFamily: "'FamiljenGrotesk', sans-serif",
                  fontSize: 'clamp(10px, 1vw, 12px)',
                  color: focused === 'email' ? C.gold : 'rgba(200,168,75,0.65)',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  fontWeight: 600,
                  transition: 'color 0.2s',
                  cursor: 'text',
                }}>
                  E-Mail
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="h14240000@john.petra.ac.id"
                  style={{
                    ...inputStyle('email'),
                  }}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 13, color: '#E08080', margin: 0, paddingLeft: 4 }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* ── Password field ── */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div
                style={{ ...fieldWrap('password'), flexDirection: 'row', alignItems: 'center', gap: 0 }}
                onClick={() => document.getElementById('login-password').focus()}
              >
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{
                    fontFamily: "'FamiljenGrotesk', sans-serif",
                    fontSize: 'clamp(10px, 1vw, 12px)',
                    color: focused === 'password' ? C.gold : 'rgba(200,168,75,0.65)',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    fontWeight: 600,
                    transition: 'color 0.2s',
                    cursor: 'text',
                  }}>
                    Password
                  </label>
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    style={inputStyle('password')}
                    autoComplete="current-password"
                  />
                </div>
                {/* Show/hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(200,168,75,0.5)', padding: '0 0 0 12px',
                    display: 'flex', alignItems: 'center', flexShrink: 0,
                  }}
                >
                  {showPass ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 13, color: '#E08080', margin: 0, paddingLeft: 4 }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div style={{ width: '100%', textAlign: 'left', marginTop: -8 }}>
              <a
                href="/forgot-password"
                className="login-link"
                style={{
                  fontFamily: "'FamiljenGrotesk', sans-serif",
                  fontSize: 'clamp(13px, 1.2vw, 15px)',
                  color: C.cream,
                  opacity: 0.8,
                }}
              >
                Forgot Password
              </a>
            </div>

            {/* Submit */}
            <button
              className="login-btn"
              onClick={handleSubmit}
              disabled={processing}
            >
              {processing ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Register link */}
            <p style={{
              fontFamily: "'FamiljenGrotesk', sans-serif",
              fontSize: 'clamp(13px, 1.2vw, 15px)',
              color: C.cream,
              opacity: 0.75,
              margin: 0,
              textAlign: 'center',
            }}>
              Don't have any accounts yet?{' '}
              <a href="/register" className="login-link">Sign up here</a>
            </p>

          </div>
        </div>

      </div>
    </MainLayout>
  )
}