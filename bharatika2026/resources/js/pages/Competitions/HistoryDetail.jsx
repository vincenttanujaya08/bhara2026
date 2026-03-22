import { useEffect, useState } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { navigateWithTransition } from '../../hooks/usePageTransition'
import MainLayout from '../../Layouts/MainLayout'


const C = {
  gold: '#C8A84B',
  goldLight: '#E8C96A',
  cream: '#E8D9A0',
  parchment: '#D4C48A',
  crimson: '#8B1A1A',
  dark: '#0F0A05',
  ink: '#1A1208',
  green: '#7ECBA1',
  red: '#E08080',
}


const STATUS_MAP = {
  pending:  { label: 'Menunggu Verifikasi', color: C.gold,  icon: '⏳' },
  approved: { label: 'Pendaftaran Valid',   color: C.green, icon: '✦' },
  rejected: { label: 'Perlu Revisi',        color: C.red,   icon: '✕' },
}


const CATEGORY_COLOR = {
  TIRTA: '#4A7FA5', BAYU: '#8B6914', AGNI: '#A03020', BUANA: '#4A6B3A',
}


function useFonts() {
  useEffect(() => {
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap'
    document.head.appendChild(l)
  }, [])
}


function OrnamentDivider({ color = C.gold, label, opacity = 0.4 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0', opacity }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${color})` }} />
      {label
        ? <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color, letterSpacing: 4, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</span>
        : <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 0L7.5 4.5L12 4.5L8.5 7L10 12L6 9L2 12L3.5 7L0 4.5L4.5 4.5Z" fill={color} /></svg>
      }
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  )
}


function ScrollSection({ title, color = C.gold, children, accent }) {
  return (
    <div style={{ marginBottom: '2px' }}>
      {/* Section header */}
      <div style={{ background: `linear-gradient(to right, ${color}18, transparent)`, borderLeft: `3px solid ${color}`, padding: '0.6rem 1rem', marginBottom: 0 }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color, letterSpacing: 3, textTransform: 'uppercase', margin: 0, fontWeight: 600 }}>{title}</p>
      </div>
      {/* Content */}
      <div style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid rgba(200,168,75,0.12)`, borderTop: 'none', padding: '1.5rem' }}>
        {children}
      </div>
    </div>
  )
}


function DataField({ label, value, mono = false }) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', padding: '0.55rem 0', borderBottom: '1px solid rgba(200,168,75,0.07)', alignItems: 'baseline' }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color: C.gold, opacity: 0.5, letterSpacing: 2, textTransform: 'uppercase', margin: 0, minWidth: 90, flexShrink: 0 }}>{label}</p>
      <p style={{ fontFamily: mono ? "'Cinzel', serif" : "'EB Garamond', serif", fontSize: mono ? 14 : 16, color: C.cream, margin: 0, opacity: 0.85, letterSpacing: mono ? 1 : 0 }}>{value || '—'}</p>
    </div>
  )
}


function FileButton({ href, label }) {
  const [hov, setHov] = useState(false)
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '7px 16px', background: hov ? 'rgba(200,168,75,0.12)' : 'transparent', border: `1px solid rgba(200,168,75,${hov ? 0.5 : 0.25})`, color: C.gold, fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, textDecoration: 'none', textTransform: 'uppercase', transition: 'all 0.2s', cursor: 'pointer' }}>
      <span>↗</span> {label}
    </a>
  )
}


function UploadField({ label, onChange, color = C.cream, fileName }) {
  const [hov, setHov] = useState(false)
  return (
    <div style={{ marginTop: '0.75rem' }}>
      <label
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px', background: hov ? `${color}18` : 'transparent', border: `1px dashed ${color}50`, color, fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
      >
        ↑ {fileName || label}
        <input type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />
      </label>
    </div>
  )
}


export default function HistoryDetail({ registration, flash = {} }) {
  useFonts()


  const updateForm = useForm({
    payment: null,
    members: registration.members?.reduce((acc, m) => ({ ...acc, [m.id]: { name: m.name, ktm: null } }), {})
  })
  const workForm = useForm({
    submission_title: registration.submission_title || '',
    submission_description: registration.submission_description || '',
    submission_file: null,
  })


  const [workFileName, setWorkFileName] = useState('')
  const [paymentFileName, setPaymentFileName] = useState('')


  const isRejected = registration.payment_status === 'rejected'
  const isApproved = registration.payment_status === 'approved'
  const currentStatus = STATUS_MAP[registration.payment_status] || STATUS_MAP.pending
  const catColor = CATEGORY_COLOR[registration.competition?.category?.name?.toUpperCase()] || C.crimson


  const storageUrl = p => `/storage/${p}`
  const formatDate = d => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })


  const submitUpdate = e => { e.preventDefault(); updateForm.post(`/history/${registration.id}/update`, { forceFormData: true }) }
  const submitWork   = e => { e.preventDefault(); workForm.post(`/history/${registration.id}/submit-work`, { forceFormData: true }) }


  const inputStyle = {
    width: '100%', padding: '10px 14px', boxSizing: 'border-box',
    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(200,168,75,0.25)',
    color: C.cream, fontFamily: "'EB Garamond', serif", fontSize: 16, outline: 'none',
    transition: 'border 0.2s',
  }


  return (
    <MainLayout>
      <Head title={`${registration.competition?.name} — Detail`} />
      <div style={{ minHeight: '100vh', background: C.dark, position: 'relative', overflow: 'hidden' }}>
        {/* Background gradient */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${catColor}25 0%, #0F0A05 55%)`, pointerEvents: 'none' }} />
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.07, pointerEvents: 'none' }} />


        <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto', padding: '100px 2rem 6rem' }}>


          {/* ── Back ── */}
          <div onClick={() => navigateWithTransition('/history')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2.5rem', opacity: 0.5, transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
          >
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.cream, letterSpacing: 2, textTransform: 'uppercase' }}>← Kembali ke Dashboard</span>
          </div>


          {/* ── Hero — Scroll Header ── */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            {/* Category diamond */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: 8, height: 8, background: catColor, transform: 'rotate(45deg)' }} />
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: catColor, letterSpacing: 4, textTransform: 'uppercase' }}>
                {registration.competition?.category?.name}
              </span>
              <div style={{ width: 8, height: 8, background: catColor, transform: 'rotate(45deg)' }} />
            </div>


            {/* Competition name */}
            <h1 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(28px, 5vw, 48px)',
              color: C.cream, margin: '0 0 1.5rem',
              fontWeight: 700, lineHeight: 1.1, letterSpacing: 2,
            }}>
              {registration.competition?.name}
            </h1>


            <OrnamentDivider color={C.gold} opacity={0.5} />


            {/* Status + ID — centered pill row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Status */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: `${currentStatus.color}12`,
                  border: `1px solid ${currentStatus.color}40`,
                  padding: '8px 20px',
                }}>
                  <span style={{ fontSize: 14 }}>{currentStatus.icon}</span>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: currentStatus.color, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
                    {currentStatus.label}
                  </span>
                </div>
              </div>


              {/* Vertical divider */}
              <div style={{ width: 1, height: 36, background: 'rgba(200,168,75,0.2)' }} />


              {/* ID Peserta */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color: C.gold, opacity: 0.5, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 4px' }}>ID Peserta</p>
                <p style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: registration.participant_code ? 28 : 22,
                  color: registration.participant_code ? C.gold : 'rgba(200,168,75,0.2)',
                  margin: 0, fontWeight: 700, letterSpacing: 3,
                  textShadow: registration.participant_code ? `0 0 20px ${C.gold}40` : 'none',
                }}>
                  {registration.participant_code || '— — —'}
                </p>
              </div>
            </div>
          </div>


          {/* ── Flash / rejection note ── */}
          {flash.success && (
            <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}40`, borderLeft: `3px solid ${C.green}`, padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.green, margin: 0 }}>{flash.success}</p>
            </div>
          )}
          {isRejected && (
            <div style={{ background: `${C.red}08`, border: `1px solid ${C.red}35`, borderLeft: `3px solid ${C.red}`, padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color: C.red, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 0.5rem' }}>Catatan Panitia</p>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: C.cream, opacity: 0.8, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                "{registration.logs?.find(l => l.status === 'rejected')?.notes ?? 'Mohon periksa kembali dokumen Anda.'}"
              </p>
            </div>
          )}


          {/* ── Sections ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '2px' }}>


            {/* Team & docs */}
            <ScrollSection title="Data Tim & Dokumen">
              <form onSubmit={submitUpdate}>
                {registration.members?.map((member, i) => (
                  <div key={member.id} style={{ marginBottom: i < registration.members.length - 1 ? '1.5rem' : 0, paddingBottom: i < registration.members.length - 1 ? '1.5rem' : 0, borderBottom: i < registration.members.length - 1 ? '1px solid rgba(200,168,75,0.08)' : 'none' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color: C.gold, opacity: 0.5, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 0.75rem' }}>
                      {i === 0 ? 'Ketua Tim' : `Anggota ${i}`}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      {isRejected ? (
                        <input type="text" defaultValue={member.name}
                          onChange={e => updateForm.setData('members', { ...updateForm.data.members, [member.id]: { ...updateForm.data.members[member.id], name: e.target.value } })}
                          style={{ ...inputStyle, flex: 1, minWidth: 200 }}
                        />
                      ) : (
                        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, color: C.cream, margin: 0, fontWeight: 500 }}>{member.name}</p>
                      )}
                      {member.ktm_file && <FileButton href={storageUrl(member.ktm_file)} label="Lihat KTM" />}
                    </div>
                    {isRejected && (
                      <UploadField label="Upload KTM Baru (opsional)"
                        onChange={e => updateForm.setData('members', { ...updateForm.data.members, [member.id]: { ...updateForm.data.members[member.id], ktm: e.target.files[0] } })}
                        color={C.red}
                        fileName={updateForm.data.members?.[member.id]?.ktm?.name}
                      />
                    )}
                  </div>
                ))}


                {/* Payment */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(200,168,75,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color: C.gold, opacity: 0.5, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 4px' }}>Bukti Pembayaran</p>
                      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.cream, opacity: 0.65, margin: 0, fontStyle: 'italic' }}>
                        {paymentFileName || 'Dokumen terlampir'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {registration.payment_proof && <FileButton href={storageUrl(registration.payment_proof)} label="Lihat Bukti" />}
                      {isRejected && (
                        <UploadField label="Upload Baru"
                          onChange={e => { updateForm.setData('payment', e.target.files[0]); setPaymentFileName(e.target.files[0]?.name || '') }}
                          fileName={paymentFileName}
                        />
                      )}
                    </div>
                  </div>
                </div>


                {isRejected && (
                  <button type="submit" disabled={updateForm.processing}
                    style={{ width: '100%', marginTop: '1.5rem', padding: '13px', background: `linear-gradient(135deg, ${C.gold}, #B8941E)`, color: C.dark, border: 'none', fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 10, letterSpacing: 3, cursor: 'pointer', textTransform: 'uppercase', opacity: updateForm.processing ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                    {updateForm.processing ? 'Menyimpan...' : '✦ Simpan & Ajukan Ulang'}
                  </button>
                )}
              </form>
            </ScrollSection>


            {/* Work submission */}
            {isApproved && (
              <ScrollSection title="Pengumpulan Karya" color={C.green}>
                {registration.submission_file ? (
                  <div>
                    <DataField label="Judul" value={registration.submission_title} />
                    <DataField label="Deskripsi" value={registration.submission_description} />
                    <div style={{ marginTop: '1.25rem' }}>
                      <FileButton href={storageUrl(registration.submission_file)} label="Download File" />
                    </div>
                  </div>
                ) : (
                  <form onSubmit={submitWork}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color: C.cream, opacity: 0.4, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Judul Karya</label>
                      <input type="text" value={workForm.data.submission_title} onChange={e => workForm.setData('submission_title', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(200,168,75,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(200,168,75,0.25)'} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color: C.cream, opacity: 0.4, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Deskripsi</label>
                      <textarea rows={4} value={workForm.data.submission_description} onChange={e => workForm.setData('submission_description', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'rgba(200,168,75,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(200,168,75,0.25)'} />
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <UploadField label="Pilih File (.zip / .rar)" color={C.green}
                        onChange={e => { workForm.setData('submission_file', e.target.files[0]); setWorkFileName(e.target.files[0]?.name || '') }}
                        fileName={workFileName}
                      />
                    </div>
                    <button type="submit" disabled={workForm.processing}
                      style={{ width: '100%', padding: '13px', background: `linear-gradient(135deg, ${C.green}cc, #5CAF81)`, color: C.dark, border: 'none', fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 10, letterSpacing: 3, cursor: 'pointer', textTransform: 'uppercase', opacity: workForm.processing ? 0.6 : 1 }}>
                      {workForm.processing ? 'Mengunggah...' : '✦ Unggah Karya'}
                    </button>
                  </form>
                )}
              </ScrollSection>
            )}


            {/* Log */}
            <ScrollSection title="Riwayat Status">
              {(!registration.logs || registration.logs.length === 0) && (
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.3, margin: 0, fontStyle: 'italic' }}>Belum ada riwayat</p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {registration.logs?.map((log, i) => {
                  const s = STATUS_MAP[log.status] || STATUS_MAP.pending
                  return (
                    <div key={log.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      {/* Timeline dot */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, boxShadow: `0 0 6px ${s.color}60`, flexShrink: 0 }} />
                        {i < registration.logs.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(200,168,75,0.15)', marginTop: 4 }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: i < registration.logs.length - 1 ? '1rem' : 0 }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: s.color, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</span>
                          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 12, color: C.cream, opacity: 0.3 }}>{formatDate(log.created_at)}</span>
                        </div>
                        {log.notes && (
                          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.cream, opacity: 0.65, margin: 0, lineHeight: 1.6 }}>{log.notes}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollSection>


          </div>


          {/* Bottom ornament */}
          <div style={{ marginTop: '3rem' }}>
            <OrnamentDivider color={C.gold} opacity={0.2} />
          </div>


        </div>
      </div>
    </MainLayout>
  )
}

