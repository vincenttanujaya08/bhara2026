import { useState, useEffect } from 'react'
import { useForm, Link } from '@inertiajs/react'

const C = {
  gold: '#C8A84B', cream: '#E8D9A0', crimson: '#8B1A1A',
  dark: '#0F0A05', card: '#1A1410', border: 'rgba(200,168,75,0.15)',
}

const STATUS = {
  pending:  { label: 'Menunggu Validasi', color: '#C8A84B', bg: 'rgba(200,168,75,0.1)',  border: 'rgba(200,168,75,0.3)' },
  approved: { label: 'Valid / Lunas',     color: '#7ECBA1', bg: 'rgba(126,203,161,0.1)', border: 'rgba(126,203,161,0.3)' },
  rejected: { label: 'Ditolak',           color: '#E08080', bg: 'rgba(224,128,128,0.1)', border: 'rgba(224,128,128,0.3)' },
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

function StatusBadge({ status }) {
  const s = STATUS[status] ?? STATUS.pending
  return <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', padding: '6px 16px', border: `1px solid ${s.border}`, color: s.color, background: s.bg }}>{s.label}</span>
}

function SectionCard({ title, accent = C.gold, children }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: '1.75rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: `1px solid rgba(200,168,75,0.08)` }}>
        <div style={{ width: 3, height: 22, background: accent }} />
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.cream, margin: 0, letterSpacing: 1 }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function HistoryDetail({ registration, flash = {} }) {
  useFonts()

  // Form untuk update dokumen (jika rejected)
  const updateForm = useForm({ payment: null, members: {} })

  // Form untuk submit karya
  const workForm = useForm({ submission_title: '', submission_description: '', submission_file: null })

  const submitUpdate = (e) => {
    e.preventDefault()
    updateForm.post(`/history/${registration.id}/update`, { forceFormData: true })
  }

  const submitWork = (e) => {
    e.preventDefault()
    workForm.post(`/history/${registration.id}/submit-work`, { forceFormData: true })
  }

  const storageUrl = (path) => `/storage/${path}`
  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const isRejected = registration.payment_status === 'rejected'
  const isApproved = registration.payment_status === 'approved'

  return (
    <div style={{ background: C.dark, minHeight: '100vh', fontFamily: "'Cinzel', serif" }}>
      {/* Navbar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.75rem', background: 'rgba(15,10,5,0.96)', borderBottom: `1px solid ${C.border}` }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 17, color: C.cream }}>bharatika</span>
        </Link>
        <Link href="/history" style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, color: C.gold, textDecoration: 'none', textTransform: 'uppercase', opacity: 0.75 }}>← Riwayat</Link>
      </div>

      <div style={{ paddingTop: 52, maxWidth: 800, margin: '0 auto', padding: '80px 2rem 6rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.gold, opacity: 0.6, textTransform: 'uppercase', margin: '0 0 0.4rem' }}>{registration.competition?.name}</p>
            <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 'clamp(36px, 6vw, 56px)', color: C.cream, margin: 0, lineHeight: 1.1 }}>Detail Pendaftaran</h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <StatusBadge status={registration.payment_status} />
            {registration.participant_code && (
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: C.gold, margin: 0, fontWeight: 600 }}>{registration.participant_code}</p>
            )}
          </div>
        </div>

        {/* Flash messages */}
        {flash.success && (
          <div style={{ padding: '12px 16px', border: `1px solid rgba(126,203,161,0.3)`, background: 'rgba(126,203,161,0.06)', marginBottom: '1.5rem' }}>
            <p style={{ color: '#7ECBA1', fontSize: 14, margin: 0, fontFamily: "'EB Garamond', serif" }}>{flash.success}</p>
          </div>
        )}

        {/* Rejection alert */}
        {isRejected && (
          <div style={{ padding: '1rem 1.25rem', border: `1px solid rgba(224,128,128,0.3)`, background: 'rgba(224,128,128,0.06)', marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: '#E08080', margin: '0 0 0.4rem', letterSpacing: 1, textTransform: 'uppercase' }}>Pendaftaran Ditolak</p>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.7, margin: 0 }}>
              {registration.logs?.find(l => l.status === 'rejected')?.notes ?? 'Terdapat data yang tidak valid. Silakan periksa kembali.'}
            </p>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: C.cream, opacity: 0.45, margin: '0.5rem 0 0' }}>
              Upload ulang dokumen yang salah pada form di bawah ini.
            </p>
          </div>
        )}

        {/* Team members */}
        <SectionCard title="Tim & Anggota">
          <form onSubmit={submitUpdate}>
            {registration.members?.map((member, i) => (
              <div key={member.id} style={{ marginBottom: i < registration.members.length - 1 ? '1.5rem' : 0, paddingBottom: i < registration.members.length - 1 ? '1.5rem' : 0, borderBottom: i < registration.members.length - 1 ? `1px solid rgba(200,168,75,0.07)` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.gold, opacity: 0.5, textTransform: 'uppercase', margin: '0 0 0.2rem' }}>{i === 0 ? 'Ketua Tim' : `Anggota ${i}`}</p>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.cream, margin: 0 }}>{member.name}</p>
                  </div>
                  {member.ktm_file && (
                    <a href={storageUrl(member.ktm_file)} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.gold, textDecoration: 'none', textTransform: 'uppercase', border: `1px solid rgba(200,168,75,0.3)`, padding: '5px 12px' }}>
                      Lihat KTM ↗
                    </a>
                  )}
                </div>
                {isRejected && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: '#E08080', opacity: 0.8, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      Upload KTM Baru (opsional)
                    </label>
                    <input type="file" accept="image/jpeg,image/png,image/jpg"
                      onChange={e => updateForm.setData('members', { ...updateForm.data.members, [member.id]: { ktm: e.target.files[0] } })}
                      style={{ width: '100%', padding: '7px 12px', background: 'rgba(200,168,75,0.04)', border: `1px solid rgba(200,168,75,0.2)`, color: C.cream, fontFamily: "'EB Garamond', serif", fontSize: 13, outline: 'none', cursor: 'pointer' }}
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Payment proof */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid rgba(200,168,75,0.07)` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.cream, opacity: 0.4, textTransform: 'uppercase', margin: 0 }}>Bukti Pembayaran</p>
                {registration.payment_proof && (
                  <a href={storageUrl(registration.payment_proof)} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.gold, textDecoration: 'none', textTransform: 'uppercase', border: `1px solid rgba(200,168,75,0.3)`, padding: '5px 12px' }}>
                    Lihat Bukti ↗
                  </a>
                )}
              </div>
              {isRejected && (
                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: '#E08080', opacity: 0.8, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Upload Bukti Baru (opsional)
                  </label>
                  <input type="file" accept="image/jpeg,image/png,image/jpg"
                    onChange={e => updateForm.setData('payment', e.target.files[0])}
                    style={{ width: '100%', padding: '7px 12px', background: 'rgba(200,168,75,0.04)', border: `1px solid rgba(200,168,75,0.2)`, color: C.cream, fontFamily: "'EB Garamond', serif", fontSize: 13, outline: 'none', cursor: 'pointer' }}
                  />
                </div>
              )}
            </div>

            {isRejected && (
              <button type="submit" disabled={updateForm.processing} style={{
                width: '100%', marginTop: '1.5rem', padding: '13px',
                background: updateForm.processing ? 'rgba(200,168,75,0.4)' : C.gold,
                color: C.dark, border: 'none', cursor: updateForm.processing ? 'not-allowed' : 'pointer',
                fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600,
              }}>
                {updateForm.processing ? 'Menyimpan...' : 'Simpan & Ajukan Ulang Validasi'}
              </button>
            )}
          </form>
        </SectionCard>

        {/* Submit karya (hanya jika approved) */}
        {isApproved && (
          <SectionCard title="Pengumpulan Karya" accent="#3B82F6">
            {registration.submission_file ? (
              <div>
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(59,130,246,0.07)', border: `1px solid rgba(59,130,246,0.2)`, marginBottom: '1rem' }}>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: '#7EB3E0', margin: '0 0 0.2rem', letterSpacing: 1, textTransform: 'uppercase' }}>Karya Berhasil Dikumpulkan</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.cream, opacity: 0.35, textTransform: 'uppercase', margin: 0, minWidth: 100 }}>Judul</p>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.cream, margin: 0 }}>{registration.submission_title}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.cream, opacity: 0.35, textTransform: 'uppercase', margin: 0, minWidth: 100 }}>Deskripsi</p>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.cream, opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{registration.submission_description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.cream, opacity: 0.35, textTransform: 'uppercase', margin: 0, minWidth: 100 }}>File</p>
                    <a href={storageUrl(registration.submission_file)} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, color: C.gold, textDecoration: 'none', textTransform: 'uppercase', border: `1px solid rgba(200,168,75,0.3)`, padding: '5px 14px' }}>
                      Download ZIP ↗
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={submitWork}>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.6, margin: '0 0 1.5rem', lineHeight: 1.7 }}>
                  Upload karya dalam format <strong style={{ color: C.gold }}>ZIP</strong> atau <strong style={{ color: C.gold }}>RAR</strong> (Maks 20MB).
                </p>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.gold, opacity: 0.75, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Judul Karya *</label>
                  <input type="text" value={workForm.data.submission_title}
                    onChange={e => workForm.setData('submission_title', e.target.value)}
                    placeholder="Judul karya kamu"
                    style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', background: 'rgba(200,168,75,0.04)', border: `1px solid ${workForm.errors.submission_title ? C.crimson : 'rgba(200,168,75,0.2)'}`, color: C.cream, fontFamily: "'EB Garamond', serif", fontSize: 15, outline: 'none' }}
                  />
                  {workForm.errors.submission_title && <p style={{ color: C.crimson, fontSize: 11, margin: '0.3rem 0 0' }}>{workForm.errors.submission_title}</p>}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.gold, opacity: 0.75, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Deskripsi (Maks 100 kata) *</label>
                  <textarea value={workForm.data.submission_description}
                    onChange={e => workForm.setData('submission_description', e.target.value)}
                    rows={4} placeholder="Jelaskan karya kamu secara singkat..."
                    style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', background: 'rgba(200,168,75,0.04)', border: `1px solid ${workForm.errors.submission_description ? C.crimson : 'rgba(200,168,75,0.2)'}`, color: C.cream, fontFamily: "'EB Garamond', serif", fontSize: 15, outline: 'none', resize: 'vertical' }}
                  />
                  {workForm.errors.submission_description && <p style={{ color: C.crimson, fontSize: 11, margin: '0.3rem 0 0' }}>{workForm.errors.submission_description}</p>}
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.gold, opacity: 0.75, textTransform: 'uppercase', marginBottom: '0.4rem' }}>File Karya (ZIP/RAR) *</label>
                  <input type="file" accept=".zip,.rar"
                    onChange={e => workForm.setData('submission_file', e.target.files[0])}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(200,168,75,0.04)', border: `1px solid rgba(200,168,75,0.2)`, color: C.cream, fontFamily: "'EB Garamond', serif", fontSize: 13, outline: 'none', cursor: 'pointer' }}
                  />
                  {workForm.errors.submission_file && <p style={{ color: C.crimson, fontSize: 11, margin: '0.3rem 0 0' }}>{workForm.errors.submission_file}</p>}
                </div>
                <button type="submit" disabled={workForm.processing} style={{
                  width: '100%', padding: '13px', background: workForm.processing ? 'rgba(59,130,246,0.4)' : '#2563EB',
                  color: '#fff', border: 'none', cursor: workForm.processing ? 'not-allowed' : 'pointer',
                  fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600,
                }}>
                  {workForm.processing ? 'Mengunggah...' : 'Unggah Karya Sekarang'}
                </button>
              </form>
            )}
          </SectionCard>
        )}

        {/* Log history */}
        <SectionCard title="Log Status Pendaftaran">
          {registration.logs?.map(log => {
            const s = STATUS[log.status] ?? STATUS.pending
            return (
              <div key={log.id} style={{ borderLeft: `2px solid ${s.color}`, paddingLeft: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, color: s.color, textTransform: 'uppercase' }}>{s.label}</span>
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 12, color: C.cream, opacity: 0.3 }}>{formatDate(log.created_at)}</span>
                </div>
                {log.notes && <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.6, margin: 0, lineHeight: 1.6 }}>{log.notes}</p>}
              </div>
            )
          })}
        </SectionCard>
      </div>
    </div>
  )
}
