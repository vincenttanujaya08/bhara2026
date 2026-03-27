import { useEffect, useState } from 'react'
import { Link, Head, router } from '@inertiajs/react'
import ConfirmModal from '../../components/ConfirmModal'

const C = {
  gold: '#C8A84B',
  goldLight: '#E8C96A',
  crimson: '#8B1A1A',
  dark: '#0F0A05',
  card: 'rgba(255,255,255,0.03)',
  border: 'rgba(200,168,75,0.2)',
  white: '#FFFFFF',
  green: '#7ECBA1',
  red: '#E08080',
}

function useFonts() {
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.background = C.dark
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=EB+Garamond:wght@400;700;800&display=swap'
    document.head.appendChild(l)
  }, [])
}

// Komponen Navigasi Internal
export function AdminNav({ active = 'dashboard' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = () => {
    setLoggingOut(true)
    router.post('/logout', {}, {
      onFinish: () => {
        setLoggingOut(false)
        setShowLogoutConfirm(false)
      }
    })
  }

  const NAV_ITEMS = [
    { label: 'DASHBOARD',    href: '/admin/dashboard',     key: 'dashboard' },
    { label: 'PENDAFTARAN',  href: '/admin/registrations', key: 'registrations' },
    { label: 'KARYA',        href: '/admin/submissions',   key: 'submissions' },
  ]

  return (
    <>
      <style>{`
        .admin-nav-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 200; background: #000; border-bottom: 2px solid ${C.gold}; }
        .admin-nav-inner { height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(1rem, 4vw, 4rem); gap: 1rem; }
        .admin-nav-left { display: flex; align-items: center; gap: clamp(1rem, 3vw, 4rem); min-width: 0; }
        .admin-nav-logo { font-family: 'Cinzel', serif; font-size: clamp(16px, 2.2vw, 24px); color: ${C.gold}; font-weight: 900; letter-spacing: 3px; text-decoration: none; white-space: nowrap; flex-shrink: 0; }
        .admin-nav-links { display: flex; gap: clamp(1rem, 2vw, 2.5rem); }
        @media (max-width: 700px) { .admin-nav-links { display: none; } }
        .admin-nav-link { font-family: 'Cinzel', serif; font-size: clamp(10px, 1.1vw, 13px); letter-spacing: 2px; text-decoration: none; font-weight: 900; padding-bottom: 6px; transition: all 0.3s ease; }
        .admin-nav-logout-btn { background: ${C.crimson}; border: none; color: ${C.white}; font-family: 'Cinzel', serif; font-size: clamp(9px, 1vw, 12px); letter-spacing: 2px; padding: 8px 20px; cursor: pointer; font-weight: 900; text-transform: uppercase; }
        .admin-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 4px; }
        @media (max-width: 700px) { .admin-hamburger { display: flex; flex-direction: column; gap: 5px; } .admin-nav-logout-btn { display: none; } }
        .admin-hamburger span { display: block; width: 24px; height: 2px; background: ${C.gold}; transition: all 0.3s; }
      `}</style>

      <ConfirmModal 
        isOpen={showLogoutConfirm} loading={loggingOut} onConfirm={handleLogout} onCancel={() => setShowLogoutConfirm(false)}
        title="Logout Admin" description="Akhiri sesi manajemen?" confirmLabel="Logout" variant="danger" icon="shield"
      />

      <div className="admin-nav-bar">
        <div className="admin-nav-inner">
          <div className="admin-nav-left">
            <Link href="/admin/dashboard" className="admin-nav-logo">BHARATIKA</Link>
            <nav className="admin-nav-links">
              {NAV_ITEMS.map(({ label, href, key }) => (
                <Link key={key} href={href} className="admin-nav-link"
                  style={{ color: active === key ? C.white : C.gold, borderBottom: active === key ? `3px solid ${C.gold}` : '3px solid transparent' }}
                >{label}</Link>
              ))}
            </nav>
          </div>
          <button onClick={() => setShowLogoutConfirm(true)} className="admin-nav-logout-btn">LOGOUT</button>
          <button className="admin-hamburger" onClick={() => setMenuOpen(o => !o)}>
            <span style={{ transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} /><span style={{ opacity: menuOpen ? 0 : 1 }} /><span style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: '#000', padding: '1rem 4vw', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: `1px solid ${C.border}` }}>
            {NAV_ITEMS.map(({ label, href, key }) => (
              <Link key={key} href={href} style={{ color: active === key ? C.gold : C.white, textDecoration: 'none', fontFamily: 'Cinzel', fontSize: '14px', padding: '10px 0' }} onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
            <button onClick={() => setShowLogoutConfirm(true)} style={{ background: C.crimson, color: 'white', border: 'none', padding: '12px', fontFamily: 'Cinzel', fontWeight: 900 }}>LOGOUT</button>
          </div>
        )}
      </div>
    </>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: C.card, border: `2px solid ${color}40`, padding: 'clamp(1.25rem, 3vw, 2.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 12px)', letterSpacing: 3, color, fontWeight: 900, margin: '0 0 1rem' }}>{label}</p>
      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(36px, 5vw, 64px)', color: C.white, margin: 0, fontWeight: 800, lineHeight: 1 }}>{value}</p>
    </div>
  )
}

export default function AdminDashboard({ stats = {} }) {
  useFonts()
  const [showResetModal, setShowResetModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  // Menggunakan useState manual agar tidak tergantung useForm
  const [formData, setFormData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const handleUpdatePassword = () => {
    setLoading(true)
    setErrors({})

    // Endpoint dan metode sesuai sistem di Profile.jsx
    router.put('/profile/password', formData, {
      preserveScroll: true,
      onSuccess: () => {
        setShowResetModal(false)
        setFormData({ current_password: '', password: '', password_confirmation: '' })
        alert('Password berhasil diperbarui!')
      },
      onError: (err) => {
        setErrors(err)
      },
      onFinish: () => setLoading(false),
    })
  }

  const cards = [
    { label: 'TOTAL PENDAFTAR',      value: stats.total ?? 0,    color: C.gold },
    { label: 'MENUNGGU VERIFIKASI',  value: stats.pending ?? 0,  color: C.goldLight },
    { label: 'PENDAFTARAN VALID',    value: stats.approved ?? 0, color: C.green },
    { label: 'PENDAFTARAN DITOLAK',  value: stats.rejected ?? 0, color: C.red },
  ]

  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Head title="Admin Dashboard | Bharatika" />
      <AdminNav active="dashboard" />

      <ConfirmModal 
        isOpen={showResetModal} 
        loading={loading} 
        onConfirm={handleUpdatePassword} 
        onCancel={() => setShowResetModal(false)}
        title="Ubah Password Admin" 
        confirmLabel="Simpan" 
        variant="danger"
        icon="shield"
        description={
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
            <style>{`
              .pwd-input { width: 100%; padding: 10px; background: #1A1510; border: 1px solid ${C.border}; color: white; font-family: 'EB Garamond', serif; box-sizing: border-box; }
              .pwd-input:focus { border-color: ${C.gold}; outline: none; }
              .pwd-label { color: ${C.gold}; font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 1px; margin-bottom: 4px; }
              .pwd-err { color: ${C.red}; font-size: 11px; font-family: 'EB Garamond', serif; margin-top: 2px; }
            `}</style>
            <div>
              <div className="pwd-label">Password Saat Ini</div>
              <input type="password" placeholder="••••••••" className="pwd-input" value={formData.current_password} onChange={e => setFormData({...formData, current_password: e.target.value})} />
              {errors.current_password && <div className="pwd-err">{errors.current_password}</div>}
            </div>
            <div>
              <div className="pwd-label">Password Baru</div>
              <input type="password" placeholder="Min. 6 karakter" className="pwd-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              {errors.password && <div className="pwd-err">{errors.password}</div>}
            </div>
            <div>
              <div className="pwd-label">Konfirmasi Password Baru</div>
              <input type="password" placeholder="••••••••" className="pwd-input" value={formData.password_confirmation} onChange={e => setFormData({...formData, password_confirmation: e.target.value})} />
            </div>
          </div>
        }
      />

      <div style={{ paddingTop: 64 }}>
        <div style={{ padding: 'clamp(2rem, 4vw, 3rem) clamp(1rem, 5vw, 4rem)', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: 4, color: C.gold, fontWeight: 900 }}>ADMINISTRATION PANEL</p>
            <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(24px, 4vw, 48px)', color: C.white, margin: 0, fontWeight: 800 }}>Sistem Ringkasan Data</h1>
          </div>
          <button onClick={() => setShowResetModal(true)} style={{ background: 'transparent', color: C.red, border: `1px solid ${C.red}`, padding: '6px 14px', fontSize: '10px', fontFamily: "'Cinzel', serif", fontWeight: 900, cursor: 'pointer' }}>UBAH PASSWORD</button>
        </div>

        <div style={{ padding: 'clamp(1.5rem, 4vw, 4rem) clamp(1rem, 5vw, 4rem)', maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            {cards.map(c => <StatCard key={c.label} {...c} />)}
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '2rem' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '11px', letterSpacing: 3, color: C.gold, fontWeight: 900, marginBottom: '1.5rem' }}>KONTROL MANAJEMEN</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/admin/registrations" style={{ padding: '20px 40px', background: C.white, color: C.dark, fontFamily: "'Cinzel', serif", fontSize: '13px', fontWeight: 900, letterSpacing: 2, textDecoration: 'none', flex: '1 1 auto', textAlign: 'center' }}>KELOLA PENDAFTARAN</Link>
              <Link href="/admin/submissions" style={{ padding: '20px 40px', background: 'transparent', color: C.gold, fontFamily: "'Cinzel', serif", fontSize: '13px', fontWeight: 900, letterSpacing: 2, textDecoration: 'none', border: `2px solid ${C.gold}`, flex: '1 1 auto', textAlign: 'center' }}>GALERI KARYA</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}