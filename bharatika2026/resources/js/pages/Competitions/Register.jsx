import { useState, useEffect, useRef } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { navigateWithTransition } from '../../hooks/usePageTransition'

const C = {
  gold: '#C8A84B',
  cream: '#E8D9A0',
  parchment: '#D4C48A',
  crimson: '#8B1A1A',
  black: '#0F0A05',
  cardBg: '#1A1410', 
  border: 'rgba(232, 217, 160, 0.3)',
}

/* ─── Navbar Component (Identik dengan Home) ─── */
function Navbar() {
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
        @keyframes nordOut { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }
        @keyframes nordIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes cssalientIn { 0% { opacity: 0; transform: translateY(-50%) scaleX(1.1); filter: blur(6px); } 100% { opacity: 1; transform: translateY(-50%) scaleX(1); filter: blur(0px); } }
        @keyframes cssalientOut { 0% { opacity: 1; transform: translateY(-50%) scaleX(1); filter: blur(0px); } 100% { opacity: 0; transform: translateY(-40%) scaleX(1.1); filter: blur(6px); } }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: 52,
        display: 'flex', alignItems: 'center', justifyContent: menuOpen ? 'flex-end' : 'space-between',
        padding: '0 1.75rem',
        background: menuOpen ? 'transparent' : (scrolled ? 'rgba(235,217,157,0.98)' : 'rgba(235,217,157,0.85)'),
        backdropFilter: menuOpen ? 'none' : 'blur(6px)',
        borderBottom: (!menuOpen && scrolled) ? '1px solid rgba(139,26,26,0.25)' : 'none',
        transition: 'background 0.35s, border 0.35s',
      }}>
        {!menuOpen && (
          <div onClick={() => handleNav('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img src="/images/BHRTK MERAH 1.png" alt="bharatika" style={{ height: 32 }} />
          </div>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', gap: menuOpen ? '1rem' : '0.75rem',
          background: menuOpen ? C.parchment : 'transparent',
          borderRadius: 50, padding: menuOpen ? '10px 20px' : '0', transition: 'all 0.35s',
        }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.crimson} strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            ) : (
              <img src="/images/BURGER.png" alt="menu" style={{ height: 16, width: 'auto', objectFit: 'contain' }} />
            )}
          </button>
          <div onClick={() => handleNav(auth?.user ? '/history' : '/login')} style={{ cursor: 'pointer', opacity: menuOpen ? 1 : 0.75 }}>
            <img src="/images/Group 3.png" alt="profile" style={{ height: menuOpen ? 26 : 20, width: 'auto', objectFit: 'contain', transition: 'height 0.35s' }} />
          </div>
        </div>
      </nav>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 250, background: C.crimson,
        animation: menuOpen ? 'overlayIn 0.65s cubic-bezier(0.22,1,0.36,1) forwards' : 'overlayOut 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        pointerEvents: menuOpen ? 'all' : 'none', overflow: 'hidden',
      }}>
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '0 8vw' }}>
          {navLinks.map((link, i) => (
            <div key={link.label} onClick={() => handleNav(link.href)} onMouseEnter={() => setHoveredLink(i)} onMouseLeave={() => setHoveredLink(null)}
              style={{ position: 'relative', cursor: 'pointer', lineHeight: 1.1, animation: menuOpen ? `navItemIn 0.6s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.08}s both` : 'none', transform: hoveredLink === i ? 'translateX(12px)' : 'translateX(0)', transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
              <span style={{ fontFamily: "'Nord', sans-serif", fontSize: 'clamp(44px, 7vw, 90px)', fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: 2, display: 'block', lineHeight: 1.6, animation: hoveredLink === i ? 'nordOut 0.35s forwards' : 'nordIn 0.35s forwards' }}>{link.label}</span>
              <span style={{ fontFamily: "'CSSalient', sans-serif", fontSize: 'clamp(80px, 14vw, 180px)', fontWeight: 400, color: C.parchment, textTransform: 'uppercase', letterSpacing: 4, display: 'block', position: 'absolute', top: '50%', left: 0, animation: hoveredLink === i ? 'cssalientIn 0.4s forwards' : 'cssalientOut 0.3s forwards', transformOrigin: 'left center', whiteSpace: 'nowrap' }}>{link.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function Footer() {
  return (
    <footer style={{ background: C.black, padding: '2.5rem 2rem 1.75rem', borderTop: `1px solid ${C.border}`, position: 'relative', zIndex: 5 }}>
      <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 26, color: C.cream, margin: '0 0 2px' }}>bharatika</p>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.cream, opacity: 0.4, letterSpacing: 2, textTransform: 'uppercase' }}>Creative Design Festival 2026</p>
    </footer>
  )
}

/* ─── Modern Drop Zone File Input ─── */
function CustomFileInput({ label, onChange, error, required, fileName }) {
  const fileInputRef = useRef(null);
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 1.5, color: C.cream, fontWeight: 600, textTransform: 'uppercase', margin: '0 0 0.8rem' }}>
        {label}{required && <span style={{ color: '#FF5555', marginLeft: 4 }}>*</span>}
      </p>
      <div 
        onClick={() => fileInputRef.current.click()}
        style={{
          width: '100%', padding: '20px', background: '#0a0a05',
          border: `1.5px dashed ${error ? '#FF5555' : (fileName ? C.gold : '#444')}`,
          borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease',
        }}
      >
        <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/jpg" onChange={onChange} style={{ display: 'none' }} />
        <div style={{ color: fileName ? C.cream : '#888', fontFamily: "'EB Garamond', serif", fontSize: 15 }}>
          {fileName ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
               <span style={{ color: C.gold, fontWeight: 'bold' }}>✓</span> {fileName}
            </div>
          ) : (
            <>
              <span style={{ display: 'block', fontSize: '20px', marginBottom: '4px' }}>↑</span>
              Klik untuk unggah berkas <span style={{ opacity: 0.5, fontSize: 13 }}>(JPG, PNG)</span>
            </>
          )}
        </div>
      </div>
      {error && <p style={{ color: '#FF5555', fontSize: 13, fontWeight: 'bold', margin: '0.6rem 0 0', fontFamily: "'EB Garamond', serif" }}>{error}</p>}
    </div>
  )
}

function SectionCard({ title, children, accent = C.gold, delay = "0s" }) {
  return (
    <div style={{ 
      background: C.cardBg, border: `1px solid ${C.border}`, padding: '2.25rem', marginBottom: '2rem',
      borderRadius: '4px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      animation: `contentFadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay} both`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: `1px solid #333` }}>
        <div style={{ width: 4, height: 20, background: accent }} />
        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '15px', color: C.cream, margin: 0, letterSpacing: 2, fontWeight: 700 }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

/* ─── Main Component ─── */
export default function CompetitionRegister({ competition }) {
  const { auth } = usePage().props
  const maxMembers = (competition?.max_participants ?? 1) - 1
  const minMembers = Math.max(0, (competition?.min_participants ?? 1) - 1)
  const [memberCount, setMemberCount] = useState(minMembers)

  const { data, setData, post, processing, errors } = useForm({
    leader_ktm: null,
    payment: null,
    members: Array(maxMembers).fill(null).map(() => ({ name: '', ktm: null })),
  })

  const getIDLabel = () => {
    const cat = competition?.category?.name?.toUpperCase() || '';
    if (cat.includes('BAYU')) return 'KTP / Tanda Pengenal';
    if (cat.includes('BUANA')) return 'Kartu Pelajar';
    if (cat.includes('TIRTA') || cat.includes('AGNI')) return 'KTM (Kartu Tanda Mahasiswa)';
    return 'KTM / Kartu Pelajar';
  }

  const idLabel = getIDLabel();

  useEffect(() => {
    if (!document.getElementById('bh-fonts')) {
        const l = document.createElement('link')
        l.id = 'bh-fonts'; l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=FamiljenGrotesk:wght@400;700&display=swap'
        document.head.appendChild(l)
    }
  }, [])

  const updateMember = (i, field, value) => {
    const updated = [...data.members]
    updated[i] = { ...updated[i], [field]: value }
    setData('members', updated)
  }

  const submit = (e) => {
    e.preventDefault()
    post(`/competitions/${competition.id}/register`, { forceFormData: true })
  }

  return (
    <div style={{ background: '#0F0A05', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <style>{`
        @keyframes headerFadeIn { from { opacity: 0; transform: translateY(20px); filter: blur(8px); } to { opacity: 1; transform: translateY(0); filter: blur(0px); } }
        @keyframes contentFadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gridFade { from { opacity: 0; } to { opacity: 0.4; } }
      `}</style>

      <main style={{ flex: 1, position: 'relative' }}>
        <div style={{ 
          position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", 
          backgroundSize: 'cover', backgroundPosition: 'center', 
          animation: 'gridFade 1.5s ease-out forwards', opacity: 0
        }} />
        
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '100px 1.5rem 6rem', position: 'relative', zIndex: 10 }}>
          
          <header style={{ 
            textAlign: 'center', marginBottom: '3.5rem',
            animation: 'headerFadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) both' 
          }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 4, color: C.gold, fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Formulir Pendaftaran</p>
            <h1 style={{ 
              fontFamily: "'Cinzel', serif", fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 700, color: C.cream, 
              margin: '0 0 0.75rem', lineHeight: 1.3, letterSpacing: '2px', textTransform: 'uppercase'
            }}>
               {competition?.category?.name || 'Kategori'} - {competition?.name}
            </h1>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, color: C.cream, opacity: 0.8, margin: 0, fontStyle: 'italic' }}>
              {competition?.min_participants === competition?.max_participants
                ? `${competition?.min_participants} Anggota per Tim`
                : `${competition?.min_participants}–${competition?.max_participants} Anggota per Tim`}
            </p>
          </header>

          <form onSubmit={submit}>
            <SectionCard title="Data Ketua Tim" delay="0.2s">
              <div style={{ background: '#0F0A05', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #333' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: C.gold, margin: '0 0 1rem', fontWeight: 700 }}>{auth?.user?.name}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {[
                    { label: 'Email', value: auth?.user?.email },
                    { label: 'WhatsApp', value: auth?.user?.whatsapp },
                    { label: 'ID Line', value: auth?.user?.line_id },
                    { label: 'Instansi', value: auth?.user?.instansi },
                  ].map(({ label, value }) => value ? (
                    <div key={label} style={{ display: 'flex', borderBottom: '1px solid #222', paddingBottom: '4px' }}>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 1, color: C.cream, opacity: 0.5, textTransform: 'uppercase', minWidth: '100px' }}>{label}</span>
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.cream, fontWeight: 500 }}>{value}</span>
                    </div>
                  ) : null)}
                </div>
              </div>
              <CustomFileInput label={`Unggah ${idLabel} Ketua`} required fileName={data.leader_ktm?.name} onChange={e => setData('leader_ktm', e.target.files[0])} error={errors.leader_ktm} />
            </SectionCard>

            {competition?.max_participants > 1 && (
              <SectionCard title="Anggota Tim" delay="0.4s">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', background: '#0F0A05', padding: '1rem', border: '1px solid #333' }}>
                  <div>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: C.cream, fontWeight: 600, margin: 0 }}>{memberCount} Anggota Tambahan</p>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 12, color: C.cream, opacity: 0.5, margin: 0 }}>Maksimal {maxMembers} slot tersedia.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => setMemberCount(Math.max(minMembers, memberCount - 1))}
                      style={{ width: 36, height: 36, background: '#1A1410', border: `1px solid ${C.gold}`, color: C.gold, cursor: 'pointer', fontSize: 20, opacity: memberCount === minMembers ? 0.3 : 1 }}
                      disabled={memberCount === minMembers}>−</button>
                    <button type="button" onClick={() => setMemberCount(Math.min(maxMembers, memberCount + 1))}
                      style={{ width: 36, height: 36, background: C.gold, border: `1px solid ${C.gold}`, color: '#000', cursor: 'pointer', fontSize: 20, opacity: memberCount === maxMembers ? 0.3 : 1 }}
                      disabled={memberCount === maxMembers}>+</button>
                  </div>
                </div>

                {memberCount > 0 ? Array(memberCount).fill(null).map((_, i) => (
                  <div key={i} style={{ marginBottom: '2.5rem', padding: '1.5rem', border: '1px solid #333', background: 'rgba(0,0,0,0.3)' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2, color: C.gold, fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem' }}>Anggota {i + 1}</p>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.cream, opacity: 0.7, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Nama Lengkap Anggota</p>
                      <input type="text" value={data.members[i]?.name || ''} onChange={e => updateMember(i, 'name', e.target.value)} placeholder="Masukkan nama lengkap..."
                        style={{ width: '100%', padding: '12px', boxSizing: 'border-box', background: '#0F0A05', border: '1px solid #333', color: '#fff', fontFamily: "'EB Garamond', serif", fontSize: 16, outline: 'none' }} />
                    </div>
                    <CustomFileInput label={`Unggah ${idLabel} Anggota`} fileName={data.members[i]?.ktm?.name} onChange={e => updateMember(i, 'ktm', e.target.files[0])} />
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed #444' }}>
                    <p style={{ fontFamily: "'EB Garamond', serif", color: C.cream, opacity: 0.6, margin: 0 }}>Lomba ini mendukung tim. Klik tombol (+) jika ingin menambah anggota.</p>
                  </div>
                )}
              </SectionCard>
            )}

            <SectionCard title="Bukti Pembayaran" accent="#AA0000" delay="0.6s">
              <div style={{ background: '#220000', border: `1px solid #440000`, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: '#FFD700', margin: 0, lineHeight: 1.6 }}>
                  Silakan transfer ke rekening:<br />
                  <strong>BCA 1234567890</strong><br />
                  a.n. <strong>Bharatika 2026</strong>
                </p>
              </div>
              <CustomFileInput label="Foto Bukti Transfer" required fileName={data.payment?.name} onChange={e => setData('payment', e.target.files[0])} error={errors.payment} />
            </SectionCard>

            <button type="submit" disabled={processing} 
              style={{
                width: '100%', padding: '20px', border: 'none', background: processing ? '#333' : C.gold,
                color: '#000', fontFamily: "'Cinzel', serif", fontSize: '13px', fontWeight: 800, letterSpacing: '4px', cursor: 'pointer',
                textTransform: 'uppercase', transition: 'all 0.2s ease', animation: 'contentFadeIn 0.8s ease-out 0.8s both'
              }}
            >
              {processing ? 'Mendaftarkan...' : 'Kirim Pendaftaran'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}