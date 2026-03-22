import { useState, useEffect } from 'react'
import { useForm, usePage, router } from '@inertiajs/react'
import { navigateWithTransition } from '../hooks/usePageTransition'
import MainLayout from '../Layouts/MainLayout'

const C = {
  gold:     '#C8A84B',
  goldLight:'#E8C96A',
  cream:    '#E8D9A0',
  parchment:'#D4C48A',
  crimson:  '#8B1A1A',
  dark:     '#0F0A05',
  darkCard: '#1A1410',
  ink:      '#140C06',
  green:    '#7ECBA1',
  red:      '#E08080',
}

function useFonts() {
  useEffect(() => {
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
    document.head.appendChild(l)
    if (document.getElementById('cssalient-font')) return
    const s = document.createElement('style')
    s.id = 'cssalient-font'
    s.textContent = `
      @font-face { font-family:'FamiljenGrotesk'; src:url('/fonts/FamiljenGrotesk-Variable.ttf') format('truetype'); font-weight:100 900; }
      @font-face { font-family:'Nord'; src:url('/fonts/NORD-Bold.ttf') format('truetype'); font-weight:bold; }
    `
    document.head.appendChild(s)
  }, [])
}

function OrnamentDivider({ color = C.gold, opacity = 0.35 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${color})` }} />
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path d="M7 0L8.5 5H14L9.5 8L11 14L7 11L3 14L4.5 8L0 5H5.5Z" fill={color} />
      </svg>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  )
}

// ── Avatar initials ──
function AvatarCrest({ name }) {
  const initials = name
    ? name.split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('')
    : '?'
  return (
    <div style={{
      width: 96, height: 96, borderRadius: '50%',
      background: `radial-gradient(circle at 35% 35%, ${C.crimson}dd, ${C.crimson}88)`,
      border: `2px solid ${C.gold}60`,
      boxShadow: `0 0 0 4px ${C.dark}, 0 0 0 5px ${C.gold}30, 0 8px 24px rgba(0,0,0,0.5)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, position: 'relative',
    }}>
      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 32, color: C.cream, fontWeight: 700, letterSpacing: 2 }}>
        {initials}
      </span>
      {/* ring */}
      <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: `1px solid ${C.gold}30` }} />
    </div>
  )
}

// ── Info row ──
function InfoRow({ label, value, mono = false }) {
  return (
    <div style={{
      display: 'flex', gap: '1.5rem', padding: '0.65rem 0',
      borderBottom: '1px solid rgba(200,168,75,0.07)', alignItems: 'baseline',
    }}>
      <p style={{
        fontFamily: "'Cinzel', serif", fontSize: 8, color: C.gold,
        opacity: 0.5, letterSpacing: 2, textTransform: 'uppercase',
        margin: 0, minWidth: 90, flexShrink: 0,
      }}>{label}</p>
      <p style={{
        fontFamily: mono ? "'Cinzel', serif" : "'EB Garamond', serif",
        fontSize: mono ? 14 : 17, color: C.cream,
        margin: 0, opacity: value ? 0.85 : 0.3,
        letterSpacing: mono ? 1 : 0,
      }}>{value || '—'}</p>
    </div>
  )
}

// ── Editable field ──
function EditField({ label, name, value, onChange, type = 'text', placeholder, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontFamily: "'Cinzel', serif", fontSize: 8, color: focused ? C.gold : 'rgba(200,168,75,0.5)',
        letterSpacing: 2, textTransform: 'uppercase', transition: 'color 0.2s',
      }}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: 'rgba(200,168,75,0.04)',
          border: `1.5px solid ${focused ? C.gold : error ? C.red : 'rgba(200,168,75,0.2)'}`,
          borderRadius: 10,
          padding: '11px 14px',
          color: C.cream,
          fontFamily: "'EB Garamond', serif",
          fontSize: 16,
          outline: 'none',
          transition: 'border-color 0.2s',
          caretColor: C.gold,
        }}
      />
      {error && <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 12, color: C.red, margin: 0 }}>{error}</p>}
    </div>
  )
}

export default function Profile({ user, stats = {}, flash = {} }) {
  useFonts()

  const [activeTab, setActiveTab] = useState('info')       // 'info' | 'edit' | 'password' | 'danger'
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Edit profile form
  const editForm = useForm({
    name:      user?.name || '',
    instansi:  user?.instansi || '',
    whatsapp:  user?.whatsapp || '',
    line_id:   user?.line_id || '',
  })

  // Change password form
  const passForm = useForm({
    current_password:      '',
    password:              '',
    password_confirmation: '',
  })

  const handleEditSubmit = (e) => {
    e.preventDefault()
    editForm.put('/profile', { preserveScroll: true })
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    passForm.put('/profile/password', {
      preserveScroll: true,
      onSuccess: () => passForm.reset(),
    })
  }

  const handleLogout = () => {
    router.post('/logout')
  }

  const tabs = [
    { key: 'info',     label: 'Profil',    icon: '👤' },
    { key: 'edit',     label: 'Edit',      icon: '✏️' },
    { key: 'password', label: 'Password',  icon: '🔒' },
    { key: 'danger',   label: 'Akun',      icon: '⚠️' },
  ]

  return (
    <MainLayout>
      <style>{`
        .profile-tab {
          padding: 10px 20px;
          font-family: 'Cinzel', serif;
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          background: transparent;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          border-bottom: 2px solid transparent;
        }
        .profile-tab.active {
          color: ${C.gold};
          border-bottom-color: ${C.gold};
        }
        .profile-tab:not(.active) {
          color: ${C.cream};
          opacity: 0.45;
        }
        .profile-tab:not(.active):hover {
          opacity: 0.8;
        }
        .pf-btn {
          padding: 13px 28px;
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          border-radius: 4px;
        }
        .pf-btn-gold {
          background: linear-gradient(135deg, ${C.gold}, #B8941E);
          color: ${C.dark};
          font-weight: 700;
        }
        .pf-btn-gold:hover { opacity: 0.9; transform: translateY(-1px); }
        .pf-btn-outline {
          background: transparent;
          border: 1px solid rgba(200,168,75,0.35);
          color: ${C.cream};
          opacity: 0.65;
        }
        .pf-btn-outline:hover { opacity: 1; border-color: ${C.gold}; }
        .pf-btn-red {
          background: rgba(139,26,26,0.5);
          border: 1px solid rgba(224,128,128,0.35);
          color: ${C.red};
        }
        .pf-btn-red:hover { background: rgba(139,26,26,0.8); border-color: ${C.red}; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: ${C.cream};
          -webkit-box-shadow: 0 0 0px 1000px transparent inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.dark, position: 'relative', overflow: 'hidden' }}>
        {/* Subtle bg */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, #2A0808 0%, #0F0A05 55%)', pointerEvents: 'none' }} />
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.06, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '100px 2rem 6rem' }}>

          {/* ── Hero header ── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <AvatarCrest name={user?.name} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 4, color: C.gold, opacity: 0.55, textTransform: 'uppercase', margin: '0 0 0.35rem' }}>
                Peserta Bharatika 2026
              </p>
              <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(22px, 4vw, 38px)', color: C.cream, margin: '0 0 0.3rem', fontWeight: 700, lineHeight: 1.1 }}>
                {user?.name}
              </h1>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: C.cream, opacity: 0.45, margin: 0 }}>
                {user?.email}
              </p>
            </div>

            {/* Stat pills */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Lomba', value: stats.total ?? 0, color: C.cream },
                { label: 'Valid',  value: stats.approved ?? 0, color: C.green },
                { label: 'Proses', value: stats.pending ?? 0,  color: C.gold },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center', background: 'rgba(200,168,75,0.05)', border: '1px solid rgba(200,168,75,0.12)', padding: '10px 18px' }}>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color, margin: 0, fontWeight: 700, lineHeight: 1 }}>{value}</p>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 7, color, opacity: 0.55, margin: '4px 0 0', letterSpacing: 2, textTransform: 'uppercase' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <OrnamentDivider color={C.gold} opacity={0.3} />

          {/* ── Flash ── */}
          {flash.success && (
            <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}40`, borderLeft: `3px solid ${C.green}`, padding: '0.85rem 1.25rem', marginTop: '1.25rem' }}>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.green, margin: 0 }}>{flash.success}</p>
            </div>
          )}
          {flash.error && (
            <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}40`, borderLeft: `3px solid ${C.red}`, padding: '0.85rem 1.25rem', marginTop: '1.25rem' }}>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.red, margin: 0 }}>{flash.error}</p>
            </div>
          )}

          {/* ── Tabs ── */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(200,168,75,0.15)', marginTop: '1.75rem', overflowX: 'auto' }}>
            {tabs.map(t => (
              <button key={t.key} className={`profile-tab${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key)}>
                <span style={{ fontSize: 13 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Tab: Info ── */}
          {activeTab === 'info' && (
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>

              <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(200,168,75,0.12)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 3, height: 18, background: C.gold }} />
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.gold, letterSpacing: 3, textTransform: 'uppercase', margin: 0 }}>Data Pribadi</p>
                </div>
                <InfoRow label="Nama"     value={user?.name} />
                <InfoRow label="Email"    value={user?.email} mono />
                <InfoRow label="Instansi" value={user?.instansi} />
                <InfoRow label="WhatsApp" value={user?.whatsapp} mono />
                <InfoRow label="Line ID"  value={user?.line_id} mono />
                <InfoRow label="Bergabung" value={user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
              </div>

              {/* Quick actions */}
              <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(200,168,75,0.12)', borderTop: 'none', padding: '1.25rem 1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="pf-btn pf-btn-outline" onClick={() => navigateWithTransition('/history')}>
                  ✦ Riwayat Lomba
                </button>
                <button className="pf-btn pf-btn-outline" onClick={() => navigateWithTransition('/competitions')}>
                  ✦ Daftar Lomba
                </button>
                <button className="pf-btn pf-btn-outline" onClick={() => setActiveTab('edit')}>
                  ✏️ Edit Profil
                </button>
              </div>
            </div>
          )}

          {/* ── Tab: Edit ── */}
          {activeTab === 'edit' && (
            <form onSubmit={handleEditSubmit} style={{ marginTop: '1.5rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(200,168,75,0.12)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: 3, height: 18, background: C.gold }} />
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.gold, letterSpacing: 3, textTransform: 'uppercase', margin: 0 }}>Edit Data Diri</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <EditField
                      label="Nama Lengkap"
                      name="name"
                      value={editForm.data.name}
                      onChange={e => editForm.setData('name', e.target.value)}
                      error={editForm.errors.name}
                    />
                  </div>
                  <EditField
                    label="Instansi"
                    name="instansi"
                    value={editForm.data.instansi}
                    onChange={e => editForm.setData('instansi', e.target.value)}
                    error={editForm.errors.instansi}
                  />
                  <EditField
                    label="WhatsApp"
                    name="whatsapp"
                    value={editForm.data.whatsapp}
                    onChange={e => editForm.setData('whatsapp', e.target.value)}
                    error={editForm.errors.whatsapp}
                  />
                  <EditField
                    label="Line ID (opsional)"
                    name="line_id"
                    value={editForm.data.line_id}
                    onChange={e => editForm.setData('line_id', e.target.value)}
                    error={editForm.errors.line_id}
                  />
                </div>

                {/* Email — read only */}
                <div style={{ padding: '10px 14px', background: 'rgba(200,168,75,0.02)', border: '1px solid rgba(200,168,75,0.1)', borderRadius: 10 }}>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color: C.gold, opacity: 0.4, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 4px' }}>Email (tidak dapat diubah)</p>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: C.cream, opacity: 0.4, margin: 0 }}>{user?.email}</p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                  <button type="button" className="pf-btn pf-btn-outline" onClick={() => setActiveTab('info')}>Batal</button>
                  <button type="submit" className="pf-btn pf-btn-gold" disabled={editForm.processing}>
                    {editForm.processing ? 'Menyimpan...' : '✦ Simpan Perubahan'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── Tab: Password ── */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} style={{ marginTop: '1.5rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(200,168,75,0.12)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: 3, height: 18, background: C.gold }} />
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.gold, letterSpacing: 3, textTransform: 'uppercase', margin: 0 }}>Ubah Password</p>
                </div>

                <EditField
                  label="Password Saat Ini"
                  name="current_password"
                  type="password"
                  value={passForm.data.current_password}
                  onChange={e => passForm.setData('current_password', e.target.value)}
                  placeholder="••••••••"
                  error={passForm.errors.current_password}
                />
                <EditField
                  label="Password Baru"
                  name="password"
                  type="password"
                  value={passForm.data.password}
                  onChange={e => passForm.setData('password', e.target.value)}
                  placeholder="Min. 6 karakter"
                  error={passForm.errors.password}
                />
                <EditField
                  label="Konfirmasi Password Baru"
                  name="password_confirmation"
                  type="password"
                  value={passForm.data.password_confirmation}
                  onChange={e => passForm.setData('password_confirmation', e.target.value)}
                  placeholder="••••••••"
                  error={passForm.errors.password_confirmation}
                />

                {/* Password rules hint */}
                <div style={{ padding: '10px 14px', background: 'rgba(200,168,75,0.03)', border: '1px solid rgba(200,168,75,0.08)', borderRadius: 8 }}>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: C.cream, opacity: 0.4, margin: 0, lineHeight: 1.6 }}>
                    Password minimal 6 karakter. Gunakan kombinasi huruf dan angka untuk keamanan lebih baik.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="pf-btn pf-btn-outline" onClick={() => passForm.reset()}>Reset</button>
                  <button type="submit" className="pf-btn pf-btn-gold" disabled={passForm.processing}>
                    {passForm.processing ? 'Menyimpan...' : '🔒 Update Password'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── Tab: Danger Zone ── */}
          {activeTab === 'danger' && (
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>

              {/* Logout */}
              <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(200,168,75,0.12)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <div style={{ width: 3, height: 18, background: C.gold }} />
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.gold, letterSpacing: 3, textTransform: 'uppercase', margin: 0 }}>Keluar dari Akun</p>
                </div>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.cream, opacity: 0.6, margin: '0 0 1.25rem', lineHeight: 1.6 }}>
                  Sesi Anda akan diakhiri dan Anda akan diarahkan ke halaman login.
                  Pastikan semua pekerjaan tersimpan sebelum keluar.
                </p>

                {!logoutConfirm ? (
                  <button className="pf-btn pf-btn-outline" onClick={() => setLogoutConfirm(true)}>
                    ← Logout dari Bharatika
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.7, margin: 0 }}>Yakin ingin logout?</p>
                    <button className="pf-btn pf-btn-red" onClick={handleLogout}>Ya, Logout</button>
                    <button className="pf-btn pf-btn-outline" onClick={() => setLogoutConfirm(false)}>Batal</button>
                  </div>
                )}
              </div>

              {/* Danger zone */}
              <div style={{ background: 'rgba(139,26,26,0.06)', border: '1px solid rgba(224,128,128,0.15)', borderTop: 'none', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <div style={{ width: 3, height: 18, background: C.red }} />
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.red, letterSpacing: 3, textTransform: 'uppercase', margin: 0 }}>Zona Bahaya</p>
                </div>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.cream, opacity: 0.6, margin: '0 0 1.25rem', lineHeight: 1.6 }}>
                  Menghapus akun bersifat <strong style={{ color: C.red }}>permanen</strong> dan tidak dapat dibatalkan.
                  Seluruh data pendaftaran dan riwayat lomba Anda akan terhapus selamanya.
                </p>

                {!deleteConfirm ? (
                  <button className="pf-btn pf-btn-red" onClick={() => setDeleteConfirm(true)}>
                    Hapus Akun Saya
                  </button>
                ) : (
                  <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}40`, padding: '1rem 1.25rem', borderRadius: 4 }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: C.red, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 0.75rem' }}>
                      ⚠️ Konfirmasi Penghapusan
                    </p>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.7, margin: '0 0 1rem', lineHeight: 1.5 }}>
                      Tindakan ini tidak dapat dibatalkan. Ketik <strong style={{ color: C.red }}>nama Anda</strong> untuk konfirmasi, lalu hubungi admin Bharatika untuk proses penghapusan akun.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button className="pf-btn pf-btn-outline" onClick={() => setDeleteConfirm(false)}>Batal, Jangan Hapus</button>
                      <a
                        href="https://wa.me/6283871738520?text=Halo+Admin+Bharatika%2C+saya+ingin+menghapus+akun+saya."
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          padding: '13px 28px',
                          fontFamily: "'Cinzel', serif",
                          fontSize: 10,
                          letterSpacing: 3,
                          textTransform: 'uppercase',
                          background: 'rgba(139,26,26,0.7)',
                          border: `1px solid ${C.red}50`,
                          color: C.red,
                          textDecoration: 'none',
                          borderRadius: 4,
                          transition: 'all 0.2s',
                        }}
                      >
                        Hubungi Admin
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  )
}