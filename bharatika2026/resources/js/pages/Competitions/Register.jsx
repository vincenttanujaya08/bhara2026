import { useState, useEffect } from 'react'
import { useForm, Link, usePage } from '@inertiajs/react'

const C = {
  gold: '#C8A84B', cream: '#E8D9A0', parchment: '#D4C48A',
  crimson: '#8B1A1A', dark: '#0F0A05', card: '#1A1410',
  border: 'rgba(200,168,75,0.15)', muted: 'rgba(232,217,160,0.45)',
}

function useFonts() {
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.background = C.dark
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap'
    document.head.appendChild(l)
  }, [])
}

function Label({ children, required }) {
  return (
    <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.gold, opacity: 0.75, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
      {children}{required && <span style={{ color: C.crimson, marginLeft: 3 }}>*</span>}
    </label>
  )
}

function FileInput({ name, onChange, error, accept = "image/jpeg,image/png,image/jpg" }) {
  return (
    <div>
      <input type="file" accept={accept} onChange={onChange}
        style={{
          width: '100%', padding: '8px 12px', boxSizing: 'border-box',
          background: 'rgba(200,168,75,0.04)',
          border: `1px solid ${error ? C.crimson : 'rgba(200,168,75,0.2)'}`,
          color: C.cream, fontFamily: "'EB Garamond', serif", fontSize: 13,
          outline: 'none', cursor: 'pointer',
        }}
      />
      {error && <p style={{ color: C.crimson, fontSize: 11, margin: '0.3rem 0 0', fontFamily: "'EB Garamond', serif" }}>{error}</p>}
      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 12, color: C.cream, opacity: 0.35, margin: '0.3rem 0 0' }}>JPG, JPEG, PNG · Maks 2MB</p>
    </div>
  )
}

function SectionCard({ title, accent = C.gold, children }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: '1.75rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid rgba(200,168,75,0.08)` }}>
        <div style={{ width: 3, height: 22, background: accent }} />
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.cream, margin: 0, letterSpacing: 1 }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function CompetitionRegister({ competition, auth }) {
  useFonts()
  const maxMembers = (competition?.max_participants ?? 1) - 1
  const minMembers = Math.max(0, (competition?.min_participants ?? 1) - 1)
  const [memberCount, setMemberCount] = useState(minMembers)

  const { data, setData, post, processing, errors } = useForm({
    leader_ktm: null,
    payment: null,
    members: Array(maxMembers).fill(null).map(() => ({ name: '', ktm: null })),
  })

  const updateMember = (i, field, value) => {
    const updated = [...data.members]
    updated[i] = { ...updated[i], [field]: value }
    setData('members', updated)
  }

  const submit = (e) => {
    e.preventDefault()
    post(`/competitions/${competition.id}`, { forceFormData: true })
  }

  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      {/* Simple top bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.75rem', background: 'rgba(15,10,5,0.96)', borderBottom: `1px solid ${C.border}` }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 17, color: C.cream }}>bharatika</span>
        </Link>
        <Link href="/competitions" style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, color: C.gold, textDecoration: 'none', textTransform: 'uppercase', opacity: 0.75 }}>← Kembali</Link>
      </div>

      <div style={{ paddingTop: 52, maxWidth: 760, margin: '0 auto', padding: '80px 2rem 6rem' }}>
        {/* Page title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 4, color: C.gold, opacity: 0.65, textTransform: 'uppercase', margin: '0 0 0.4rem' }}>Formulir Pendaftaran</p>
          <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 'clamp(36px, 6vw, 60px)', color: C.cream, margin: '0 0 0.5rem', lineHeight: 1.1 }}>{competition?.name}</h1>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.45, margin: 0 }}>
            {competition?.min_participants === competition?.max_participants
              ? `${competition?.min_participants} peserta per tim`
              : `${competition?.min_participants}–${competition?.max_participants} peserta per tim`}
          </p>
        </div>

        <form onSubmit={submit} encType="multipart/form-data">

          {/* Leader section */}
          <SectionCard title="Data Ketua Tim">
            <div style={{ background: 'rgba(200,168,75,0.04)', border: `1px solid rgba(200,168,75,0.1)`, padding: '1rem', marginBottom: '1.25rem' }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: C.gold, margin: '0 0 0.25rem', fontWeight: 600 }}>{auth?.user?.name}</p>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: C.cream, opacity: 0.5, margin: 0 }}>{auth?.user?.email} · {auth?.user?.instansi}</p>
            </div>
            <Label required>KTM Ketua</Label>
            <FileInput onChange={e => setData('leader_ktm', e.target.files[0])} error={errors.leader_ktm} />
          </SectionCard>

          {/* Members section */}
          {maxMembers > 0 && (
            <SectionCard title="Anggota Tim">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.5, margin: 0 }}>
                  {memberCount} anggota tambahan
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button type="button" onClick={() => setMemberCount(Math.max(minMembers, memberCount - 1))}
                    style={{ width: 28, height: 28, background: 'transparent', border: `1px solid rgba(200,168,75,0.3)`, color: C.gold, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.cream, minWidth: 20, textAlign: 'center' }}>{memberCount}</span>
                  <button type="button" onClick={() => setMemberCount(Math.min(maxMembers, memberCount + 1))}
                    style={{ width: 28, height: 28, background: 'transparent', border: `1px solid rgba(200,168,75,0.3)`, color: C.gold, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              </div>

              {Array(memberCount).fill(null).map((_, i) => (
                <div key={i} style={{ marginBottom: i < memberCount - 1 ? '1.75rem' : 0, paddingBottom: i < memberCount - 1 ? '1.75rem' : 0, borderBottom: i < memberCount - 1 ? `1px solid rgba(200,168,75,0.07)` : 'none' }}>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, color: C.cream, opacity: 0.4, textTransform: 'uppercase', margin: '0 0 1rem' }}>Anggota {i + 1}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <Label>Nama Lengkap</Label>
                      <input type="text" value={data.members[i]?.name || ''}
                        onChange={e => updateMember(i, 'name', e.target.value)}
                        placeholder="Nama anggota"
                        style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', background: 'rgba(200,168,75,0.04)', border: `1px solid rgba(200,168,75,0.2)`, color: C.cream, fontFamily: "'EB Garamond', serif", fontSize: 15, outline: 'none' }}
                      />
                    </div>
                    <div>
                      <Label>KTM</Label>
                      <FileInput onChange={e => updateMember(i, 'ktm', e.target.files[0])} />
                    </div>
                  </div>
                </div>
              ))}
            </SectionCard>
          )}

          {/* Payment section */}
          <SectionCard title="Bukti Pembayaran" accent={C.crimson}>
            <div style={{ background: 'rgba(139,26,26,0.07)', border: `1px solid rgba(139,26,26,0.18)`, padding: '1rem', marginBottom: '1.25rem' }}>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.7, margin: 0, lineHeight: 1.6 }}>
                Transfer ke: <strong style={{ color: C.gold }}>BCA 1234567890</strong> a.n. Bharatika 2026<br />
                Upload bukti transfer di bawah ini.
              </p>
            </div>
            <Label required>Foto Bukti Transfer</Label>
            <FileInput onChange={e => setData('payment', e.target.files[0])} error={errors.payment} />
          </SectionCard>

          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div style={{ padding: '1rem', border: `1px solid rgba(224,128,128,0.3)`, background: 'rgba(224,128,128,0.05)', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: '#E08080', margin: '0 0 0.5rem', letterSpacing: 2, textTransform: 'uppercase' }}>Perbaiki kesalahan berikut:</p>
              {Object.values(errors).map((err, i) => (
                <p key={i} style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: '#E08080', margin: '0.2rem 0', opacity: 0.8 }}>· {err}</p>
              ))}
            </div>
          )}

          <button type="submit" disabled={processing} style={{
            width: '100%', padding: '16px',
            background: processing ? 'rgba(200,168,75,0.4)' : C.gold,
            color: C.dark, border: 'none', cursor: processing ? 'not-allowed' : 'pointer',
            fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 4,
            textTransform: 'uppercase', fontWeight: 600,
          }}>
            {processing ? 'Mendaftarkan...' : 'Kirim Pendaftaran'}
          </button>
        </form>
      </div>
    </div>
  )
}
