// resources/js/pages/Competitions/Register.jsx
import { useState, useEffect, useRef } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { navigateWithTransition } from '../../hooks/usePageTransition'
import MainLayout from '../../Layouts/MainLayout'

const C = {
  gold: '#C8A84B', cream: '#E8D9A0', parchment: '#D4C48A',
  crimson: '#8B1A1A', black: '#0F0A05', cardBg: '#1A1410',
  border: 'rgba(232,217,160,0.3)',
}

function CustomFileInput({ label, onChange, error, required, fileName }) {
  const fileInputRef = useRef(null)
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px,0.9vw,9px)', letterSpacing: 1.5, color: C.cream, fontWeight: 600, textTransform: 'uppercase', margin: '0 0 0.8rem' }}>
        {label}{required && <span style={{ color: '#FF5555', marginLeft: 4 }}>*</span>}
      </p>
      <div onClick={() => fileInputRef.current.click()}
        style={{ width: '100%', padding: 'clamp(14px,2vw,20px)', background: '#0a0a05', border: `1.5px dashed ${error ? '#FF5555' : (fileName ? C.gold : '#444')}`, borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease', boxSizing: 'border-box' }}
      >
        <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/jpg" onChange={onChange} style={{ display: 'none' }} />
        <div style={{ color: fileName ? C.cream : '#888', fontFamily: "'EB Garamond', serif", fontSize: 'clamp(13px,1.4vw,15px)' }}>
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

function SectionCard({ title, children, accent = C.gold, delay = '0s' }) {
  return (
    <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, padding: 'clamp(1.25rem,2.5vw,2.25rem)', marginBottom: '2rem', borderRadius: '4px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', animation: `contentFadeIn 0.8s cubic-bezier(0.22,1,0.36,1) ${delay} both` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
        <div style={{ width: 4, height: 20, background: accent }} />
        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(13px,1.5vw,15px)', color: C.cream, margin: 0, letterSpacing: 2, fontWeight: 700 }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

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
    const cat = competition?.category?.name?.toUpperCase() || ''
    if (cat.includes('BAYU')) return 'KTP / Tanda Pengenal'
    if (cat.includes('BUANA')) return 'Kartu Pelajar'
    if (cat.includes('TIRTA') || cat.includes('AGNI')) return 'KTM (Kartu Tanda Mahasiswa)'
    return 'KTM / Kartu Pelajar'
  }
  const idLabel = getIDLabel()

  useEffect(() => {
    if (!document.getElementById('bh-fonts')) {
      const l = document.createElement('link')
      l.id = 'bh-fonts'; l.rel = 'stylesheet'
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
    <MainLayout>
      <style>{`
        @keyframes headerFadeIn { from { opacity:0; transform:translateY(20px); filter:blur(8px); } to { opacity:1; transform:translateY(0); filter:blur(0px); } }
        @keyframes contentFadeIn { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes gridFade { from { opacity:0; } to { opacity:0.4; } }
        .cr-wrap { max-width: 720px; margin: 0 auto; padding: clamp(40px,8vw,60px) clamp(1rem,4vw,1.5rem) clamp(3rem,6vw,6rem); position: relative; z-index: 10; }
        .cr-member-box { margin-bottom: 2.5rem; padding: clamp(1rem,2vw,1.5rem); border: 1px solid #333; background: rgba(0,0,0,0.3); }
        @media (max-width: 480px) {
          .cr-wrap { padding-top: 36px; }
        }
      `}</style>
      <div style={{ background: '#0F0A05', minHeight: 'calc(100vh - 52px)', paddingTop: 52, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', backgroundPosition: 'center', animation: 'gridFade 1.5s ease-out forwards', opacity: 0 }} />
        <div className="cr-wrap">
          <header style={{ textAlign: 'center', marginBottom: 'clamp(2rem,5vw,3.5rem)', animation: 'headerFadeIn 1s cubic-bezier(0.22,1,0.36,1) both' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px,1vw,10px)', letterSpacing: 4, color: C.gold, fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Formulir Pendaftaran</p>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(20px,3.5vw,42px)', fontWeight: 700, color: C.cream, margin: '0 0 0.75rem', lineHeight: 1.3, letterSpacing: '2px', textTransform: 'uppercase' }}>
              {competition?.category?.name || 'Kategori'} - {competition?.name}
            </h1>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(15px,1.8vw,18px)', color: C.cream, opacity: 0.8, margin: 0, fontStyle: 'italic' }}>
              {competition?.min_participants === competition?.max_participants
                ? `${competition?.min_participants} Anggota per Tim`
                : `${competition?.min_participants}–${competition?.max_participants} Anggota per Tim`}
            </p>
          </header>

          <form onSubmit={submit}>
            <SectionCard title="Data Ketua Tim" delay="0.2s">
              <div style={{ background: '#0F0A05', padding: 'clamp(1rem,2vw,1.5rem)', marginBottom: '1.5rem', border: '1px solid #333' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(14px,1.6vw,16px)', color: C.gold, margin: '0 0 1rem', fontWeight: 700 }}>{auth?.user?.name}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {[
                    { label: 'Email', value: auth?.user?.email },
                    { label: 'WhatsApp', value: auth?.user?.whatsapp },
                    { label: 'ID Line', value: auth?.user?.line_id },
                    { label: 'Instansi', value: auth?.user?.instansi },
                  ].map(({ label, value }) => value ? (
                    <div key={label} style={{ display: 'flex', borderBottom: '1px solid #222', paddingBottom: '4px', flexWrap: 'wrap', gap: '0.25rem' }}>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px,0.9vw,9px)', letterSpacing: 1, color: C.cream, opacity: 0.5, textTransform: 'uppercase', minWidth: '80px' }}>{label}</span>
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(13px,1.5vw,15px)', color: C.cream, fontWeight: 500 }}>{value}</span>
                    </div>
                  ) : null)}
                </div>
              </div>
              <CustomFileInput label={`Unggah ${idLabel} Ketua`} required fileName={data.leader_ktm?.name} onChange={e => setData('leader_ktm', e.target.files[0])} error={errors.leader_ktm} />
            </SectionCard>

            {competition?.max_participants > 1 && (
              <SectionCard title="Anggota Tim" delay="0.4s">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', background: '#0F0A05', padding: 'clamp(0.75rem,1.5vw,1rem)', border: '1px solid #333', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(14px,1.6vw,16px)', color: C.cream, fontWeight: 600, margin: 0 }}>{memberCount} Anggota Tambahan</p>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(11px,1.2vw,12px)', color: C.cream, opacity: 0.5, margin: 0 }}>Maksimal {maxMembers} slot tersedia.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => setMemberCount(Math.max(minMembers, memberCount - 1))} style={{ width: 36, height: 36, background: '#1A1410', border: `1px solid ${C.gold}`, color: C.gold, cursor: 'pointer', fontSize: 20, opacity: memberCount === minMembers ? 0.3 : 1 }} disabled={memberCount === minMembers}>−</button>
                    <button type="button" onClick={() => setMemberCount(Math.min(maxMembers, memberCount + 1))} style={{ width: 36, height: 36, background: C.gold, border: `1px solid ${C.gold}`, color: '#000', cursor: 'pointer', fontSize: 20, opacity: memberCount === maxMembers ? 0.3 : 1 }} disabled={memberCount === maxMembers}>+</button>
                  </div>
                </div>
                {memberCount > 0 ? Array(memberCount).fill(null).map((_, i) => (
                  <div key={i} className="cr-member-box">
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px,1vw,10px)', letterSpacing: 2, color: C.gold, fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem' }}>Anggota {i + 1}</p>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(8px,0.9vw,9px)', color: C.cream, opacity: 0.7, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Nama Lengkap Anggota</p>
                      <input type="text" value={data.members[i]?.name || ''} onChange={e => updateMember(i, 'name', e.target.value)} placeholder="Masukkan nama lengkap..." style={{ width: '100%', padding: 'clamp(9px,1.2vw,12px)', boxSizing: 'border-box', background: '#0F0A05', border: '1px solid #333', color: '#fff', fontFamily: "'EB Garamond', serif", fontSize: 'clamp(13px,1.5vw,16px)', outline: 'none' }} />
                    </div>
                    <CustomFileInput label={`Unggah ${idLabel} Anggota`} fileName={data.members[i]?.ktm?.name} onChange={e => updateMember(i, 'ktm', e.target.files[0])} />
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed #444' }}>
                    <p style={{ fontFamily: "'EB Garamond', serif", color: C.cream, opacity: 0.6, margin: 0, fontSize: 'clamp(13px,1.4vw,15px)' }}>Lomba ini mendukung tim. Klik tombol (+) jika ingin menambah anggota.</p>
                  </div>
                )}
              </SectionCard>
            )}

            <SectionCard title="Bukti Pembayaran" accent="#AA0000" delay="0.6s">
              <div style={{ background: '#220000', border: '1px solid #440000', padding: 'clamp(1rem,2vw,1.5rem)', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(14px,1.6vw,16px)', color: '#FFD700', margin: 0, lineHeight: 1.6 }}>
                  Silakan transfer ke rekening:<br />
                  <strong>BCA 1234567890</strong><br />
                  a.n. <strong>Bharatika 2026</strong>
                </p>
              </div>
              <CustomFileInput label="Foto Bukti Transfer" required fileName={data.payment?.name} onChange={e => setData('payment', e.target.files[0])} error={errors.payment} />
            </SectionCard>

            <button type="submit" disabled={processing} style={{ width: '100%', padding: 'clamp(14px,2vw,20px)', border: 'none', background: processing ? '#333' : C.gold, color: '#000', fontFamily: "'Cinzel', serif", fontSize: 'clamp(11px,1.2vw,13px)', fontWeight: 800, letterSpacing: '4px', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s ease' }}>
              {processing ? 'Mendaftarkan...' : 'Kirim Pendaftaran'}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}