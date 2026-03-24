// resources/js/pages/Competitions/HistoryDetail.jsx
// ─── Changes: Added ConfirmModal for submit-work & resubmit ─────────

import { useEffect, useState } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { navigateWithTransition } from '../../hooks/usePageTransition'
import MainLayout from '../../Layouts/MainLayout'
import ConfirmModal from '../../components/ConfirmModal'

const C = {
  gold: '#C8A84B', goldLight: '#E8C96A', cream: '#E8D9A0',
  parchment: '#D4C48A', crimson: '#8B1A1A', dark: '#0F0A05',
  white: '#FFFFFF', green: '#7ECBA1', red: '#E08080',
}

const STATUS_MAP = {
  pending:  { label: 'MENUNGGU VERIFIKASI', color: C.gold,  icon: '⏳' },
  approved: { label: 'PENDAFTARAN VALID',   color: C.green, icon: '✦' },
  rejected: { label: 'PERLU REVISI',        color: C.red,   icon: '✕' },
}

const CATEGORY_COLOR = {
  TIRTA: '#4A7FA5', BAYU: '#8B6914', AGNI: '#A03020', BUANA: '#4A6B3A',
}

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024
const MAX_FILE_SIZE_LABEL = '50 MB'

function useFonts() {
  useEffect(() => {
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;700;900&family=EB+Garamond:wght@400;700;800&display=swap'
    document.head.appendChild(l)
  }, [])
}

function FilePreviewCard({ label, url, isNew = false, color = C.gold, fileObject = null }) {
  const [previewUrl, setPreviewUrl] = useState(url)
  useEffect(() => {
    if (isNew && fileObject) {
      const objectUrl = URL.createObjectURL(fileObject)
      setPreviewUrl(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [fileObject, isNew])
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `2px solid ${isNew ? C.green : color}40`, padding: '12px', display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '8px', flex: 1, minWidth: '280px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', background: '#000', border: `1px solid ${isNew ? C.green : color}60`, flexShrink: 0 }}>
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📄</div>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <p style={{ fontSize: '9px', fontWeight: 900, color: isNew ? C.green : color, margin: 0, letterSpacing: 1.5 }}>
          {isNew ? '✨ DOKUMEN BARU' : `DOKUMEN LAMA (${label})`}
        </p>
        <p style={{ fontSize: '13px', color: C.white, fontWeight: 700, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {isNew ? fileObject?.name : 'Sudah terunggah'}
        </p>
        {url && <a href={url} target="_blank" rel="noopener noreferrer" style={{ color, textDecoration: 'none', fontWeight: 900, fontSize: '10px', marginTop: '4px', display: 'inline-block' }}>PERBESAR ↗</a>}
      </div>
    </div>
  )
}

function ScrollSection({ title, color = C.gold, children }) {
  return (
    <div style={{ marginBottom: '6px' }}>
      <div style={{ background: color, padding: '14px 20px' }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: C.dark, letterSpacing: 3, textTransform: 'uppercase', margin: 0, fontWeight: 900 }}>{title}</p>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.6)', border: `2px solid ${color}40`, borderTop: 'none', padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
        {children}
      </div>
    </div>
  )
}

export default function HistoryDetail({ registration, flash = {} }) {
  useFonts()

  const [workFileName,   setWorkFileName]   = useState('')
  const [fileSizeError,  setFileSizeError]  = useState('')

  // ── Modal states ─────────────────────────────────────────────────
  const [modal, setModal] = useState({
    open:    false,
    type:    null,   // 'submitWork' | 'resubmit'
    loading: false,
  })

  const categoryName = registration.competition?.category?.name?.toUpperCase() || ''
  const getIdLabel = () => {
    if (categoryName === 'BAYU')  return 'KTP'
    if (categoryName === 'BUANA') return 'KARTU PELAJAR'
    return 'KTM'
  }
  const idLabel = getIdLabel()

  const updateForm = useForm({
    payment: null,
    members: registration.members?.reduce((acc, m) => ({ ...acc, [m.id]: { name: m.name, ktm: null } }), {})
  })

  const workForm = useForm({
    submission_title:       registration.submission_title || '',
    submission_description: registration.submission_description || '',
    submission_file: null,
  })

  const isRejected = registration.payment_status === 'rejected'
  const isApproved = registration.payment_status === 'approved'
  const currentStatus = STATUS_MAP[registration.payment_status] || STATUS_MAP.pending
  const catColor = CATEGORY_COLOR[categoryName] || C.crimson
  const storageUrl = p => p ? `/storage/${p}` : null

  // ── Validate work form before showing modal ───────────────────
  const handleWorkSubmitClick = (e) => {
    e.preventDefault()

    workForm.clearErrors()
    setFileSizeError('')

    let hasError = false
    if (!workForm.data.submission_title.trim()) {
      workForm.setError('submission_title', 'Judul karya wajib diisi.')
      hasError = true
    }
    if (!workForm.data.submission_description.trim()) {
      workForm.setError('submission_description', 'Deskripsi karya wajib diisi.')
      hasError = true
    }
    if (!workForm.data.submission_file) {
      workForm.setError('submission_file', 'File karya wajib diunggah.')
      hasError = true
    }
    if (workForm.data.submission_file && workForm.data.submission_file.size > MAX_FILE_SIZE_BYTES) {
      const mb = (workForm.data.submission_file.size / 1024 / 1024).toFixed(1)
      setFileSizeError(`Ukuran file terlalu besar (${mb} MB). Maksimum ${MAX_FILE_SIZE_LABEL}.`)
      hasError = true
    }

    if (hasError) return
    setModal({ open: true, type: 'submitWork', loading: false })
  }

  // ── Validate resubmit before showing modal ────────────────────
  const handleResubmitClick = (e) => {
    e.preventDefault()
    setModal({ open: true, type: 'resubmit', loading: false })
  }

  // ── Confirmed actions ─────────────────────────────────────────
  const handleConfirm = () => {
    if (modal.type === 'submitWork') {
      setModal(m => ({ ...m, loading: true }))
      workForm.post(`/history/${registration.id}/submit-work`, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => setModal({ open: false, type: null, loading: false }),
        onError:   () => setModal(m => ({ ...m, loading: false })),
      })
    }
    if (modal.type === 'resubmit') {
      setModal(m => ({ ...m, loading: true }))
      updateForm.transform((d) => ({ ...d, _method: 'put' }))
      updateForm.post(`/history/${registration.id}/update`, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => setModal({ open: false, type: null, loading: false }),
        onError:   () => setModal(m => ({ ...m, loading: false })),
      })
    }
  }

  const closeModal = () => setModal({ open: false, type: null, loading: false })

  // ── Modal config per type ─────────────────────────────────────
  const MODAL_CONFIG = {
    submitWork: {
      title:        'Kirim Karya',
      description:  `Karya "${workForm.data.submission_title || '—'}" akan dikirim untuk lomba ${registration.competition?.name}.`,
      detail:       'Pastikan file sudah benar. Pengiriman karya tidak dapat dibatalkan.',
      confirmLabel: 'Ya, Kirim Karya',
      cancelLabel:  'Periksa Lagi',
      variant:      'primary',
      icon:         'flame',
    },
    resubmit: {
      title:        'Ajukan Ulang Validasi',
      description:  'Data pendaftaran yang diperbarui akan dikirim ulang ke panitia untuk diperiksa kembali.',
      detail:       'Status pendaftaran akan kembali menjadi "Menunggu Verifikasi".',
      confirmLabel: 'Simpan & Kirim Ulang',
      cancelLabel:  'Batal',
      variant:      'warning',
      icon:         'scroll',
    },
  }

  const currentModalCfg = MODAL_CONFIG[modal.type] || {}

  const handleWorkFileChange = e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1)
      setFileSizeError(`Ukuran file terlalu besar (${mb} MB). Maksimum ${MAX_FILE_SIZE_LABEL}.`)
      e.target.value = ''
      setWorkFileName('')
      workForm.setData('submission_file', null)
    } else {
      setFileSizeError('')
      workForm.setData('submission_file', file)
      setWorkFileName(file.name)
    }
  }

  const inputStyle = {
    width: '100%', padding: '16px', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.07)', border: `2px solid ${C.gold}50`,
    color: C.white, fontFamily: "'EB Garamond', serif", fontSize: 20, fontWeight: 700, outline: 'none',
  }

  return (
    <MainLayout>
      <Head title={`${registration.competition?.name} — Detail`} />

      {/* ── Confirmation Modal ── */}
      <ConfirmModal
        isOpen={modal.open}
        loading={modal.loading}
        onConfirm={handleConfirm}
        onCancel={closeModal}
        title={currentModalCfg.title}
        description={currentModalCfg.description}
        detail={currentModalCfg.detail}
        confirmLabel={currentModalCfg.confirmLabel}
        cancelLabel={currentModalCfg.cancelLabel}
        variant={currentModalCfg.variant}
        icon={currentModalCfg.icon}
      />

      <div style={{ minHeight: '100vh', background: C.dark, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% -10%, #4A0808 0%, #0F0A05 60%)' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto', padding: '140px 1.5rem 6rem' }}>

          <button onClick={() => navigateWithTransition('/history')}
            style={{ background: 'none', border: 'none', color: C.gold, fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 900, letterSpacing: 3, cursor: 'pointer', marginBottom: '3rem' }}>
            ← KEMBALI KE DASHBOARD
          </button>

          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: catColor, letterSpacing: 6, fontWeight: 900, margin: '0 0 1rem' }}>{categoryName}</h3>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(32px, 6vw, 64px)', color: C.white, margin: '0 0 2rem', fontWeight: 900, letterSpacing: '2px', lineHeight: 1.1 }}>
              {registration.competition?.name.toUpperCase()}
            </h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ background: `${currentStatus.color}25`, border: `3px solid ${currentStatus.color}`, padding: '15px 30px' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: currentStatus.color, fontWeight: 900, margin: 0, letterSpacing: 2 }}>
                  {currentStatus.icon} {currentStatus.label}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 10, color: C.gold, fontWeight: 900, letterSpacing: 3, margin: 0 }}>ID PESERTA</p>
                <p style={{ fontSize: 36, fontWeight: 900, color: C.white, margin: 0, fontFamily: "'Cinzel', serif", letterSpacing: 4 }}>
                  {registration.participant_code || '--- ---'}
                </p>
              </div>
            </div>
          </div>

          {/* Revisi alert */}
          {isRejected && (
            <div style={{ background: C.red, padding: '25px', marginBottom: '3rem', borderLeft: '12px solid #000' }}>
              <p style={{ fontSize: 11, fontWeight: 900, color: C.dark, margin: '0 0 8px', letterSpacing: 2 }}>CATATAN REVISI PANITIA:</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: C.dark, margin: 0, lineHeight: 1.4 }}>
                "{registration.logs?.find(l => l.status === 'rejected')?.notes || 'Data tidak sesuai standar.'}"
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>

            {/* ── Identitas ── */}
            <ScrollSection title={`DOKUMEN IDENTITAS (${idLabel})`}>
              {registration.members?.map((member, i) => (
                <div key={member.id} style={{ marginBottom: '3rem', paddingBottom: '2.5rem', borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '15px' }}>
                    <p style={{ fontSize: 11, color: C.gold, fontWeight: 900, letterSpacing: 2, margin: 0 }}>
                      {i === 0 ? `KETUA TIM (${idLabel})` : `ANGGOTA ${i} (${idLabel})`}
                    </p>
                    {isRejected && <span style={{ fontSize: '10px', color: C.red, fontWeight: 900 }}>* OPSIONAL: GANTI JIKA SALAH</span>}
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    {isRejected ? (
                      <input type="text" defaultValue={member.name}
                        onChange={e => updateForm.setData('members', { ...updateForm.data.members, [member.id]: { ...updateForm.data.members[member.id], name: e.target.value } })}
                        style={inputStyle} />
                    ) : (
                      <p style={{ fontSize: 26, color: C.white, fontWeight: 800, margin: 0 }}>{member.name}</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <FilePreviewCard label={idLabel} url={storageUrl(member.ktm_file)} color={C.gold} />
                    {isRejected && updateForm.data.members[member.id]?.ktm && (
                      <FilePreviewCard isNew={true} fileObject={updateForm.data.members[member.id].ktm} color={C.green} />
                    )}
                  </div>
                  {isRejected && (
                    <div style={{ marginTop: '15px' }}>
                      <input type="file" id={`id-${member.id}`} accept="image/*"
                        onChange={e => updateForm.setData('members', { ...updateForm.data.members, [member.id]: { ...updateForm.data.members[member.id], ktm: e.target.files[0] } })}
                        style={{ display: 'none' }} />
                      <label htmlFor={`id-${member.id}`} style={{ cursor: 'pointer', background: C.white, color: C.dark, padding: '12px 20px', fontSize: 10, fontWeight: 900, letterSpacing: 2, display: 'inline-block' }}>
                        PILIH FOTO BARU
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </ScrollSection>

            {/* ── Pembayaran ── */}
            <ScrollSection title="BUKTI PEMBAYARAN">
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <FilePreviewCard label="PEMBAYARAN" url={storageUrl(registration.payment_proof)} color={C.gold} />
                {isRejected && updateForm.data.payment && (
                  <FilePreviewCard isNew={true} fileObject={updateForm.data.payment} color={C.green} />
                )}
              </div>
              {isRejected && (
                <>
                  <input type="file" id="pay-new" accept="image/*"
                    onChange={e => updateForm.setData('payment', e.target.files[0])}
                    style={{ display: 'none' }} />
                  <label htmlFor="pay-new" style={{ cursor: 'pointer', background: C.white, color: C.dark, padding: '12px 24px', fontSize: 10, fontWeight: 900, display: 'inline-block' }}>
                    UPLOAD BUKTI BARU
                  </label>
                </>
              )}
              {/* ── Resubmit button — opens modal ── */}
              {isRejected && (
                <button onClick={handleResubmitClick} disabled={updateForm.processing}
                  style={{ width: '100%', marginTop: '4rem', padding: '24px', background: C.gold, color: C.dark, border: 'none', fontWeight: 900, fontSize: 13, letterSpacing: 4, cursor: 'pointer' }}>
                  {updateForm.processing ? 'SEDANG MENYIMPAN...' : '✦ TINJAU & AJUKAN ULANG'}
                </button>
              )}
            </ScrollSection>

            {/* ── Submit Karya ── */}
            {isApproved && (
              <ScrollSection title="PENGUMPULAN KARYA" color={C.green}>
                {registration.submission_file ? (
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <p style={{ fontSize: 11, color: C.green, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>JUDUL KARYA</p>
                      <p style={{ fontSize: 22, color: C.white, margin: 0, fontWeight: 700 }}>{registration.submission_title}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <p style={{ fontSize: 11, color: C.green, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>DESKRIPSI KARYA</p>
                      <p style={{ fontSize: 20, color: C.white, margin: 0, fontWeight: 700, lineHeight: 1.5 }}>{registration.submission_description}</p>
                    </div>
                    <div style={{ marginTop: '2.5rem' }}>
                      <a href={storageUrl(registration.submission_file)} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '12px 24px', border: `2px solid ${C.green}`, color: C.green, fontFamily: "'Cinzel', serif", fontSize: 11, fontWeight: 900, letterSpacing: 2, textDecoration: 'none' }}>UNDUH KARYA ↗</a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleWorkSubmitClick}>
                    {/* Judul */}
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ fontSize: 11, fontWeight: 900, color: C.green, letterSpacing: 2, display: 'block', marginBottom: '10px' }}>
                        JUDUL KARYA <span style={{ color: C.red }}>*</span>
                      </label>
                      <input type="text" value={workForm.data.submission_title}
                        onChange={e => { workForm.setData('submission_title', e.target.value); if (workForm.errors.submission_title) workForm.clearErrors('submission_title') }}
                        style={{ ...inputStyle, border: `2px solid ${workForm.errors.submission_title ? C.red : `${C.gold}50`}` }}
                        placeholder="Masukkan judul karya Anda..." />
                      {workForm.errors.submission_title && (
                        <p style={{ color: C.red, fontSize: 12, fontWeight: 700, margin: '6px 0 0' }}>⚠ {workForm.errors.submission_title}</p>
                      )}
                    </div>

                    {/* Deskripsi */}
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ fontSize: 11, fontWeight: 900, color: C.green, letterSpacing: 2, display: 'block', marginBottom: '10px' }}>
                        DESKRIPSI KARYA <span style={{ color: C.red }}>*</span>
                      </label>
                      <textarea rows={6} value={workForm.data.submission_description}
                        onChange={e => { workForm.setData('submission_description', e.target.value); if (workForm.errors.submission_description) workForm.clearErrors('submission_description') }}
                        style={{ ...inputStyle, resize: 'vertical', border: `2px solid ${workForm.errors.submission_description ? C.red : `${C.gold}50`}` }}
                        placeholder="Jelaskan secara singkat mengenai karya yang dikumpulkan..." />
                      {workForm.errors.submission_description && (
                        <p style={{ color: C.red, fontSize: 12, fontWeight: 700, margin: '6px 0 0' }}>⚠ {workForm.errors.submission_description}</p>
                      )}
                    </div>

                    {/* File */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <p style={{ fontSize: 11, fontWeight: 900, color: C.green, letterSpacing: 2, margin: 0 }}>
                          FILE KARYA (.ZIP / .RAR) <span style={{ color: C.red }}>*</span>
                        </p>
                        <p style={{ fontSize: 10, fontWeight: 700, color: `${C.white}60`, margin: 0 }}>MAKS. {MAX_FILE_SIZE_LABEL}</p>
                      </div>
                      {workFileName && !fileSizeError && (
                        <div style={{ background: 'rgba(126,203,161,0.1)', border: `1px solid ${C.green}40`, padding: '15px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '20px' }}>📦</span>
                          <div>
                            <span style={{ fontSize: '14px', color: C.white, fontWeight: 700, display: 'block' }}>{workFileName}</span>
                            {workForm.data.submission_file && (
                              <span style={{ fontSize: '11px', color: `${C.green}99`, fontWeight: 700 }}>
                                {(workForm.data.submission_file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {fileSizeError && (
                        <div style={{ background: `${C.red}20`, border: `2px solid ${C.red}`, padding: '15px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '20px' }}>⚠️</span>
                          <p style={{ color: C.red, fontSize: 13, fontWeight: 700, margin: 0 }}>{fileSizeError}</p>
                        </div>
                      )}
                      <input type="file" id="work-file" accept=".zip,.rar" onChange={handleWorkFileChange} style={{ display: 'none' }} />
                      <label htmlFor="work-file" style={{ cursor: 'pointer', background: 'transparent', border: `3px dashed ${fileSizeError || workForm.errors.submission_file ? C.red : C.green}`, color: fileSizeError || workForm.errors.submission_file ? C.red : C.green, padding: '20px 40px', display: 'inline-block', fontWeight: 900, fontSize: 12, textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                        {workFileName && !fileSizeError ? 'GANTI FILE KARYA' : 'KLIK UNTUK MEMILIH FILE (.ZIP / .RAR)'}
                      </label>
                      {workForm.errors.submission_file && !fileSizeError && (
                        <p style={{ color: C.red, fontSize: 12, fontWeight: 700, margin: '6px 0 0' }}>⚠ {workForm.errors.submission_file}</p>
                      )}
                    </div>

                    {/* ── Submit button — opens modal ── */}
                    <button type="submit" disabled={workForm.processing}
                      style={{ width: '100%', padding: '24px', background: C.green, color: C.dark, border: 'none', fontWeight: 900, fontSize: 13, letterSpacing: 4, cursor: workForm.processing ? 'not-allowed' : 'pointer', opacity: workForm.processing ? 0.6 : 1 }}>
                      {workForm.processing ? 'SEDANG MENGUNGGAH...' : '✦ TINJAU & KIRIM KARYA'}
                    </button>
                  </form>
                )}
              </ScrollSection>
            )}

            {/* ── Timeline ── */}
            <ScrollSection title="TIMELINE PROSES">
              <div style={{ position: 'relative', paddingLeft: '25px' }}>
                <div style={{ position: 'absolute', left: '6px', top: '10px', bottom: '10px', width: '5px', background: `linear-gradient(to bottom, ${C.gold}, transparent)`, opacity: 0.3 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  {registration.logs?.map((log) => {
                    const s = STATUS_MAP[log.status] || STATUS_MAP.pending
                    return (
                      <div key={log.id} style={{ position: 'relative', display: 'flex', gap: '2.5rem' }}>
                        <div style={{ position: 'absolute', left: '-25px', top: '8px', width: '22px', height: '22px', borderRadius: '50%', background: s.color, boxShadow: `0 0 20px ${s.color}`, zIndex: 2, border: '5px solid #000' }} />
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '25px', border: `1px solid ${s.color}30` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: 12, color: s.color, fontWeight: 900, letterSpacing: 2, background: `${s.color}20`, padding: '6px 15px' }}>{s.label}</span>
                            <span style={{ fontSize: 12, color: C.white, opacity: 0.4, fontWeight: 900 }}>{new Date(log.created_at).toLocaleString('id-ID')}</span>
                          </div>
                          <p style={{ fontSize: 20, color: C.white, margin: 0, fontWeight: 700, lineHeight: 1.5 }}>{log.notes || 'Status diperbarui.'}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </ScrollSection>

          </div>
        </div>
      </div>
    </MainLayout>
  )
}