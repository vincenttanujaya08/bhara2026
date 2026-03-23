// resources/js/pages/Profile.jsx
import { useState, useEffect } from 'react'
import { useForm, router } from '@inertiajs/react'
import { navigateWithTransition } from '../hooks/usePageTransition'
import MainLayout from '../Layouts/MainLayout'

const C = {
    gold:     '#C8A84B',
    cream:    '#E8D9A0',
    crimson:  '#8B1A1A',
    dark:     '#0F0A05',
    darkCard: '#1A1410',
    green:    '#7ECBA1',
    red:      '#E08080',
}

// ─── Font Loader ───────────────────────────────────────────────────────────────

function useFonts() {
    useEffect(() => {
        if (!document.getElementById('bh-fonts')) {
            const link = document.createElement('link')
            link.id   = 'bh-fonts'
            link.rel  = 'stylesheet'
            link.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
            document.head.appendChild(link)
        }
        if (!document.getElementById('bh-local-fonts')) {
            const style = document.createElement('style')
            style.id = 'bh-local-fonts'
            style.textContent = `
                @font-face {
                    font-family: 'FamiljenGrotesk';
                    src: url('/fonts/FamiljenGrotesk-Variable.ttf') format('truetype');
                    font-weight: 100 900;
                }
                @font-face {
                    font-family: 'Nord';
                    src: url('/fonts/NORD-Bold.ttf') format('truetype');
                    font-weight: bold;
                }
            `
            document.head.appendChild(style)
        }
    }, [])
}

// ─── Global CSS ────────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
    .pf-wrap {
        position: relative; z-index: 1;
        max-width: 760px; margin: 0 auto;
        padding: clamp(72px,10vw,100px) clamp(1rem,4vw,2rem) clamp(3rem,6vw,6rem);
    }
    .pf-hero {
        display: flex; align-items: flex-end;
        gap: clamp(1rem,2.5vw,1.75rem);
        margin-bottom: clamp(1.5rem,3vw,2.5rem);
        flex-wrap: wrap;
    }
    .pf-stat-pills { display: flex; gap: clamp(0.5rem,1.5vw,1rem); flex-wrap: wrap; }
    .pf-tabs {
        display: flex;
        border-bottom: 1px solid rgba(200,168,75,0.15);
        margin-top: clamp(1.25rem,2.5vw,1.75rem);
        overflow-x: auto; -webkit-overflow-scrolling: touch;
    }
    .pf-edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }

    /* Tab buttons */
    .pf-tab {
        padding: clamp(8px,1.2vw,10px) clamp(14px,2vw,22px);
        font-family: 'Cinzel', serif;
        font-size: clamp(9px,1vw,10px);
        font-weight: 600;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        cursor: pointer;
        border: none;
        border-bottom: 2px solid transparent;
        background: transparent;
        color: #E8D9A0;
        opacity: 0.4;
        white-space: nowrap;
        flex-shrink: 0;
        transition: opacity 0.18s, color 0.18s, border-color 0.18s, transform 0.1s;
        outline: none;
        user-select: none;
    }
    .pf-tab:hover            { opacity: 0.75; }
    .pf-tab:active           { opacity: 1; transform: translateY(1px); }
    .pf-tab.active           { color: #C8A84B; border-bottom-color: #C8A84B; opacity: 1; font-weight: 700; }
    .pf-tab.active:hover     { opacity: 1; }

    /* Action buttons — base */
    .pf-btn {
        display: inline-flex; align-items: center; justify-content: center;
        padding: clamp(10px,1.5vw,13px) clamp(18px,2.5vw,28px);
        font-family: 'Cinzel', serif;
        font-size: clamp(9px,1vw,10px);
        font-weight: 700;
        letter-spacing: 3px;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 4px;
        text-decoration: none;
        transition: opacity 0.15s, transform 0.12s, background 0.15s, border-color 0.15s, box-shadow 0.15s;
        outline: none;
        user-select: none;
        white-space: nowrap;
        -webkit-tap-highlight-color: transparent;
    }
    .pf-btn:disabled,
    .pf-btn[disabled] { cursor: not-allowed; opacity: 0.4 !important; transform: none !important; pointer-events: none; }

    /* Outline variant */
    .pf-btn-outline {
        background: transparent;
        border: 1px solid rgba(200,168,75,0.3);
        color: #E8D9A0;
        opacity: 0.65;
    }
    .pf-btn-outline:hover  { opacity: 1; border-color: #C8A84B; background: rgba(200,168,75,0.05); }
    .pf-btn-outline:active { opacity: 1; transform: scale(0.96); background: rgba(200,168,75,0.08); }
    .pf-btn-outline:focus-visible { outline: 1px solid #C8A84B; outline-offset: 2px; }

    /* Gold variant */
    .pf-btn-gold {
        background: linear-gradient(135deg, #C8A84B, #B8941E);
        border: none;
        color: #0F0A05;
        opacity: 1;
        box-shadow: 0 2px 8px rgba(200,168,75,0.15);
    }
    .pf-btn-gold:hover  { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(200,168,75,0.25); }
    .pf-btn-gold:active { opacity: 1; transform: scale(0.96) translateY(0); box-shadow: none; }
    .pf-btn-gold:focus-visible { outline: 1px solid #E8C96A; outline-offset: 2px; }

    /* Red variant */
    .pf-btn-red {
        background: rgba(139,26,26,0.45);
        border: 1px solid rgba(224,128,128,0.3);
        color: #E08080;
        opacity: 0.85;
    }
    .pf-btn-red:hover  { opacity: 1; background: rgba(139,26,26,0.75); border-color: #E08080; }
    .pf-btn-red:active { opacity: 1; transform: scale(0.96); }
    .pf-btn-red:focus-visible { outline: 1px solid #E08080; outline-offset: 2px; }

    /* Autofill override */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
        -webkit-text-fill-color: #E8D9A0;
        -webkit-box-shadow: 0 0 0px 1000px transparent inset;
        transition: background-color 5000s ease-in-out 0s;
    }

    @media (max-width: 600px) {
        .pf-edit-grid { grid-template-columns: 1fr; }
        .pf-hero { align-items: center; justify-content: center; text-align: center; }
    }
    @media (max-width: 480px) {
        .pf-stat-pills { justify-content: center; }
        .pf-stat-pills > * { flex: 1; min-width: 70px; }
    }
`

// ─── Ornament Divider ──────────────────────────────────────────────────────────

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

// ─── Avatar Crest ──────────────────────────────────────────────────────────────

function AvatarCrest({ name }) {
    const initials = name
        ? name.split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('')
        : '?'
    return (
        <div style={{
            width: 'clamp(72px,10vw,96px)', height: 'clamp(72px,10vw,96px)',
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${C.crimson}dd, ${C.crimson}88)`,
            border: `2px solid ${C.gold}60`,
            boxShadow: `0 0 0 4px ${C.dark}, 0 0 0 5px ${C.gold}30, 0 8px 24px rgba(0,0,0,0.5)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, position: 'relative',
        }}>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(22px,4vw,32px)', color: C.cream, fontWeight: 700, letterSpacing: 2 }}>
                {initials}
            </span>
            <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: `1px solid ${C.gold}30` }} />
        </div>
    )
}

// ─── Stat Pill ─────────────────────────────────────────────────────────────────

function StatPill({ label, value, color }) {
    return (
        <div style={{
            textAlign: 'center',
            background: 'rgba(200,168,75,0.05)',
            border: '1px solid rgba(200,168,75,0.12)',
            padding: 'clamp(7px,1.2vw,10px) clamp(12px,2vw,18px)',
        }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(18px,3vw,24px)', color, margin: 0, fontWeight: 700, lineHeight: 1, letterSpacing: 1 }}>
                {value}
            </p>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color, opacity: 0.6, margin: '5px 0 0', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
                {label}
            </p>
        </div>
    )
}

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({ label, accentColor = C.gold }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 3, height: 20, background: accentColor, borderRadius: 2 }} />
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: accentColor, letterSpacing: 3, textTransform: 'uppercase', margin: 0, fontWeight: 700 }}>
                {label}
            </p>
        </div>
    )
}

// ─── Flash Message ─────────────────────────────────────────────────────────────

function FlashMessage({ type, message }) {
    if (!message) return null
    const color = type === 'success' ? C.green : C.red
    return (
        <div style={{ background: `${color}10`, border: `1px solid ${color}40`, borderLeft: `3px solid ${color}`, padding: '0.85rem 1.25rem', marginTop: '1.25rem' }}>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, fontWeight: 600, color, margin: 0 }}>
                {message}
            </p>
        </div>
    )
}

// ─── Info Row ──────────────────────────────────────────────────────────────────

function InfoRow({ label, value, mono = false }) {
    return (
        <div style={{ display: 'flex', gap: '1rem', padding: '0.65rem 0', borderBottom: '1px solid rgba(200,168,75,0.07)', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: C.gold, opacity: 0.6, letterSpacing: 2, textTransform: 'uppercase', margin: 0, minWidth: 90, flexShrink: 0, fontWeight: 600 }}>
                {label}
            </p>
            <p style={{ fontFamily: mono ? "'Cinzel', serif" : "'EB Garamond', serif", fontSize: mono ? 15 : 18, color: C.cream, margin: 0, opacity: value ? 0.9 : 0.3, letterSpacing: mono ? 1 : 0, wordBreak: 'break-word', fontWeight: mono ? 600 : 400 }}>
                {value || '—'}
            </p>
        </div>
    )
}

// ─── Edit Field ────────────────────────────────────────────────────────────────

function EditField({ label, name, value, onChange, type = 'text', placeholder, error }) {
    const [focused, setFocused] = useState(false)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: focused ? C.gold : 'rgba(200,168,75,0.55)', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, transition: 'color 0.2s' }}>
                {label}
            </label>
            <input
                type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                style={{
                    background: 'rgba(200,168,75,0.04)',
                    border: `1.5px solid ${focused ? C.gold : error ? C.red : 'rgba(200,168,75,0.2)'}`,
                    borderRadius: 10,
                    padding: 'clamp(9px,1.2vw,11px) 14px',
                    color: C.cream,
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 17,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    caretColor: C.gold,
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            />
            {error && <p style={{ fontFamily: "'FamiljenGrotesk', sans-serif", fontSize: 13, fontWeight: 600, color: C.red, margin: 0 }}>{error}</p>}
        </div>
    )
}

// ─── Btn ───────────────────────────────────────────────────────────────────────

function Btn({ children, variant = 'outline', onClick, type = 'button', disabled = false }) {
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`pf-btn pf-btn-${variant}`}>
            {children}
        </button>
    )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function Profile({ user, stats = {}, flash = {} }) {
    useFonts()

    const [activeTab,     setActiveTab]     = useState('info')
    const [logoutConfirm, setLogoutConfirm] = useState(false)

    const editForm = useForm({
        name:     user?.name     || '',
        instansi: user?.instansi || '',
        whatsapp: user?.whatsapp || '',
        line_id:  user?.line_id  || '',
    })

    const passForm = useForm({
        current_password:      '',
        password:              '',
        password_confirmation: '',
    })

    const handleEditSubmit     = (e) => { e.preventDefault(); editForm.put('/profile', { preserveScroll: true }) }
    const handlePasswordSubmit = (e) => { e.preventDefault(); passForm.put('/profile/password', { preserveScroll: true, onSuccess: () => passForm.reset() }) }
    const handleLogout         = ()  => { router.post('/logout') }

    const TABS = [
        { key: 'info',     label: 'Profil'   },
        { key: 'edit',     label: 'Edit'     },
        { key: 'password', label: 'Password' },
        { key: 'danger',   label: 'Akun'     },
    ]

    const cardStyle = {
        background: 'rgba(0,0,0,0.35)',
        border: '1px solid rgba(200,168,75,0.12)',
        padding: 'clamp(1rem,2vw,1.5rem)',
    }

    const joinedAt = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : null

    return (
        <MainLayout>
            <style>{GLOBAL_STYLES}</style>

            <div style={{ minHeight: '100vh', background: C.dark, position: 'relative', overflow: 'hidden' }}>

                {/* Background */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, #2A0808 0%, #0F0A05 55%)', pointerEvents: 'none' }} />
                <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.06, pointerEvents: 'none' }} />

                <div className="pf-wrap">

                    {/* ── Hero ── */}
                    <div className="pf-hero">
                        <AvatarCrest name={user?.name} />
                        <div style={{ flex: 1, minWidth: 180 }}>
                            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 4, color: C.gold, opacity: 0.6, textTransform: 'uppercase', margin: '0 0 0.35rem', fontWeight: 700 }}>
                                Peserta Bharatika 2026
                            </p>
                            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(18px,3.5vw,38px)', color: C.cream, margin: '0 0 0.3rem', fontWeight: 700, lineHeight: 1.1 }}>
                                {user?.name}
                            </h1>
                            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(13px,1.5vw,16px)', color: C.cream, opacity: 0.5, margin: 0, wordBreak: 'break-word' }}>
                                {user?.email}
                            </p>
                        </div>
                        <div className="pf-stat-pills">
                            <StatPill label="Lomba"  value={stats.total    ?? 0} color={C.cream} />
                            <StatPill label="Valid"   value={stats.approved ?? 0} color={C.green} />
                            <StatPill label="Proses"  value={stats.pending  ?? 0} color={C.gold}  />
                        </div>
                    </div>

                    <OrnamentDivider color={C.gold} opacity={0.3} />

                    {/* ── Flash ── */}
                    <FlashMessage type="success" message={flash.success} />
                    <FlashMessage type="error"   message={flash.error}   />

                    {/* ── Tabs ── */}
                    <div className="pf-tabs">
                        {TABS.map(t => (
                            <button
                                key={t.key}
                                className={`pf-tab${activeTab === t.key ? ' active' : ''}`}
                                onClick={() => setActiveTab(t.key)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* ══ Tab: Info ══════════════════════════════════════════════ */}
                    {activeTab === 'info' && (
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={cardStyle}>
                                <SectionHeader label="Data Pribadi" />
                                <InfoRow label="Nama"      value={user?.name} />
                                <InfoRow label="Email"     value={user?.email}    mono />
                                <InfoRow label="Instansi"  value={user?.instansi} />
                                <InfoRow label="WhatsApp"  value={user?.whatsapp} mono />
                                <InfoRow label="Line ID"   value={user?.line_id}  mono />
                                <InfoRow label="Bergabung" value={joinedAt} />
                            </div>
                            <div style={{ ...cardStyle, borderTop: 'none', display: 'flex', gap: 'clamp(0.5rem,1.5vw,0.75rem)', flexWrap: 'wrap', padding: 'clamp(0.75rem,1.5vw,1.25rem) clamp(1rem,2vw,1.5rem)' }}>
                                <Btn onClick={() => navigateWithTransition('/history')}>Riwayat Lomba</Btn>
                                <Btn onClick={() => navigateWithTransition('/competitions')}>Daftar Lomba</Btn>
                                <Btn onClick={() => setActiveTab('edit')}>Edit Profil</Btn>
                            </div>
                        </div>
                    )}

                    {/* ══ Tab: Edit ══════════════════════════════════════════════ */}
                    {activeTab === 'edit' && (
                        <form onSubmit={handleEditSubmit} style={{ marginTop: '1.5rem' }}>
                            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <SectionHeader label="Edit Data Diri" />
                                <div className="pf-edit-grid">
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <EditField label="Nama Lengkap" name="name"
                                            value={editForm.data.name}
                                            onChange={e => editForm.setData('name', e.target.value)}
                                            error={editForm.errors.name} />
                                    </div>
                                    <EditField label="Instansi" name="instansi"
                                        value={editForm.data.instansi}
                                        onChange={e => editForm.setData('instansi', e.target.value)}
                                        error={editForm.errors.instansi} />
                                    <EditField label="WhatsApp" name="whatsapp"
                                        value={editForm.data.whatsapp}
                                        onChange={e => editForm.setData('whatsapp', e.target.value)}
                                        error={editForm.errors.whatsapp} />
                                    <EditField label="Line ID (opsional)" name="line_id"
                                        value={editForm.data.line_id}
                                        onChange={e => editForm.setData('line_id', e.target.value)}
                                        error={editForm.errors.line_id} />
                                </div>

                                <div style={{ padding: 'clamp(8px,1.2vw,10px) 14px', background: 'rgba(200,168,75,0.02)', border: '1px solid rgba(200,168,75,0.1)', borderRadius: 10 }}>
                                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.gold, opacity: 0.45, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 4px', fontWeight: 700 }}>
                                        Email — tidak dapat diubah
                                    </p>
                                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: C.cream, opacity: 0.4, margin: 0, wordBreak: 'break-word' }}>
                                        {user?.email}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                                    <Btn onClick={() => setActiveTab('info')}>Batal</Btn>
                                    <Btn type="submit" variant="gold" disabled={editForm.processing}>
                                        {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Btn>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* ══ Tab: Password ══════════════════════════════════════════ */}
                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordSubmit} style={{ marginTop: '1.5rem' }}>
                            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <SectionHeader label="Ubah Password" />
                                <EditField label="Password Saat Ini" name="current_password" type="password"
                                    value={passForm.data.current_password}
                                    onChange={e => passForm.setData('current_password', e.target.value)}
                                    placeholder="••••••••"
                                    error={passForm.errors.current_password} />
                                <EditField label="Password Baru" name="password" type="password"
                                    value={passForm.data.password}
                                    onChange={e => passForm.setData('password', e.target.value)}
                                    placeholder="Min. 6 karakter"
                                    error={passForm.errors.password} />
                                <EditField label="Konfirmasi Password Baru" name="password_confirmation" type="password"
                                    value={passForm.data.password_confirmation}
                                    onChange={e => passForm.setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    error={passForm.errors.password_confirmation} />
                                <div style={{ padding: 'clamp(8px,1.2vw,10px) 14px', background: 'rgba(200,168,75,0.03)', border: '1px solid rgba(200,168,75,0.08)', borderRadius: 8 }}>
                                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.45, margin: 0, lineHeight: 1.6 }}>
                                        Password minimal 6 karakter.
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                    <Btn onClick={() => passForm.reset()}>Reset</Btn>
                                    <Btn type="submit" variant="gold" disabled={passForm.processing}>
                                        {passForm.processing ? 'Menyimpan...' : 'Update Password'}
                                    </Btn>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* ══ Tab: Akun (Logout only) ════════════════════════════════ */}
                    {activeTab === 'danger' && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={cardStyle}>
                                <SectionHeader label="Keluar dari Akun" />
                                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(13px,1.5vw,16px)', color: C.cream, opacity: 0.6, margin: '0 0 1.5rem', lineHeight: 1.7 }}>
                                    Sesi Anda akan diakhiri dan Anda akan diarahkan ke halaman login.
                                </p>
                                {!logoutConfirm ? (
                                    <Btn onClick={() => setLogoutConfirm(true)}>Logout dari Bharatika</Btn>
                                ) : (
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.cream, opacity: 0.75, margin: 0, fontWeight: 600 }}>
                                            Yakin ingin logout?
                                        </p>
                                        <Btn variant="red" onClick={handleLogout}>Ya, Logout</Btn>
                                        <Btn onClick={() => setLogoutConfirm(false)}>Batal</Btn>
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