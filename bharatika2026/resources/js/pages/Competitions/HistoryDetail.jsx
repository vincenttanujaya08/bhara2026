import { useEffect, useState } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import MainLayout from '../../Layouts/MainLayout'

const C = {
  gold: '#C8A84B',
  cream: '#E8D9A0',
  crimson: '#8B1A1A',
  white: '#FFFFFF',
  red: '#FF5555',
  green: '#7ECBA1',
  border: 'rgba(232, 217, 160, 0.4)',
  black: '#000000'
}

const STATUS_THEME = {
  pending:  { label: 'MENUNGGU VERIFIKASI', color: C.gold },
  approved: { label: 'PENDAFTARAN VALID',  color: C.green },
  rejected: { label: 'PERLU REVISI',    color: C.red },
}

export default function HistoryDetail({ registration, flash = {} }) {
  const updateForm = useForm({ 
    payment: null, 
    members: registration.members?.reduce((acc, m) => ({
      ...acc, [m.id]: { name: m.name, ktm: null }
    }), {}) 
  })

  const workForm = useForm({ 
    submission_title: registration.submission_title || '', 
    submission_description: registration.submission_description || '', 
    submission_file: null 
  })

  const [workFileName, setWorkFileName] = useState('')
  const [paymentFileName, setPaymentFileName] = useState('')

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
  const currentStatus = STATUS_THEME[registration.payment_status] || STATUS_THEME.pending

  return (
    <MainLayout>
      <Head title="Dashboard Detail" />

      <main style={{ minHeight: '100vh', background: C.crimson, position: 'relative' }}>
        {/* Background Texture & Dark Overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/BG MERAH.svg')", backgroundSize: 'cover', opacity: 0.9, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.6)', pointerEvents: 'none', zIndex: 1 }} />
        <img src="/images/BITMAP.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 2 }} />
        
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '140px 1.5rem 8rem', position: 'relative', zIndex: 10 }}>
          
          {/* HEADER SECTION */}
          <div style={{ borderBottom: `4px solid ${C.gold}`, paddingBottom: '2.5rem', marginBottom: '4rem' }}>
            <Link href="/history" style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.cream, textDecoration: 'none', letterSpacing: 3, display: 'block', marginBottom: '2.5rem', fontWeight: 900 }}>
              ← KEMBALI KE RIWAYAT
            </Link>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(40px, 7vw, 72px)', color: C.white, margin: 0, fontWeight: 900, letterSpacing: '4px', lineHeight: 0.9 }}>
                        DASHBOARD<br/>DETAIL
                    </h1>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, color: C.gold, margin: '15px 0 0', fontStyle: 'italic', fontWeight: 700 }}>
                        {registration.competition?.name}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: C.gold, letterSpacing: 4, margin: '0 0 5px', fontWeight: 900 }}>ID PESERTA</p>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 48, color: C.white, margin: 0, fontWeight: 900, textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>{registration.participant_code || '---'}</p>
                </div>
            </div>
          </div>

          {/* STATUS SECTION */}
          <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
             <p style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: currentStatus.color, letterSpacing: 5, fontWeight: 900, margin: '0 0 15px' }}>STATUS SAAT INI</p>
             <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(32px, 5vw, 44px)', color: C.white, margin: 0, fontWeight: 900, textShadow: '0 2px 15px rgba(0,0,0,0.4)' }}>{currentStatus.label}</h2>
             
             {isRejected && (
                <div style={{ marginTop: '3rem', padding: '2.5rem', border: `2px solid ${C.red}`, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: C.red, margin: '0 0 12px', letterSpacing: 3, fontWeight: 900 }}>CATATAN PANITIA</p>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 22, color: C.white, margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                        "{registration.logs?.find(l => l.status === 'rejected')?.notes ?? 'Mohon periksa kembali dokumen Anda.'}"
                    </p>
                </div>
             )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
            
            {/* 1. TEAM SECTION */}
            <section>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: C.gold, letterSpacing: 4, borderBottom: `3px solid ${C.gold}`, paddingBottom: '15px', marginBottom: '3rem', fontWeight: 900 }}>DATA TIM & DOKUMEN</h3>
              
              <form onSubmit={submitUpdate}>
                {registration.members?.map((member, i) => (
                  <div key={member.id} style={{ marginBottom: '4rem', paddingBottom: '2.5rem', borderBottom: i < registration.members.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '15px' }}>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: C.gold, margin: 0, fontWeight: 900, letterSpacing: 2 }}>
                        {i === 0 ? 'KETUA TIM' : `ANGGOTA ${i}`}
                      </p>
                      {!isRejected && member.ktm_file && (
                        <a href={storageUrl(member.ktm_file)} target="_blank" style={{ color: C.white, fontSize: 12, fontWeight: 900, textDecoration: 'none', background: 'rgba(0,0,0,0.4)', padding: '8px 18px', border: `1px solid ${C.gold}` }}>LIHAT KTM ↗</a>
                      )}
                    </div>

                    <div style={{ marginBottom: isRejected ? '2.5rem' : '0' }}>
                      <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 11, color: C.white, opacity: 0.6, marginBottom: '8px', fontWeight: 900 }}>NAMA LENGKAP</label>
                      {isRejected ? (
                        <input 
                          type="text" 
                          defaultValue={member.name}
                          onChange={e => updateForm.setData('members', { 
                            ...updateForm.data.members, 
                            [member.id]: { ...updateForm.data.members[member.id], name: e.target.value } 
                          })}
                          style={{ width: '100%', padding: '18px', background: 'rgba(0,0,0,0.3)', border: `2px solid ${C.gold}`, color: C.white, outline: 'none', fontSize: 20, fontWeight: 900, fontFamily: "'EB Garamond', serif" }}
                        />
                      ) : (
                        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, color: C.white, margin: 0, fontWeight: 900 }}>{member.name.toUpperCase()}</p>
                      )}
                    </div>

                    {isRejected && (
                      <div style={{ marginTop: '2.5rem' }}>
                        <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 11, color: C.red, marginBottom: '15px', fontWeight: 900, letterSpacing: 1 }}>REVISI FOTO KTM (PNG/JPG)</label>
                        <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                          {member.ktm_file && (
                            <div style={{ flex: '0 0 160px' }}>
                                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color: C.cream, opacity: 0.6, margin: '0 0 8px', fontWeight: 900 }}>FILE LAMA</p>
                                <img src={storageUrl(member.ktm_file)} alt="Lama" style={{ width: '160px', height: '110px', objectFit: 'cover', border: `2px solid rgba(255,255,255,0.2)` }} />
                            </div>
                          )}
                          <div style={{ flex: 1, paddingTop: '20px' }}>
                            <label style={{ display: 'inline-block', padding: '15px 30px', background: C.white, color: C.black, fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 900, cursor: 'pointer', letterSpacing: 1 }}>
                              UNGGAH KTM BARU (OPTIONAL)
                              <input type="file" onChange={e => updateForm.setData('members', { ...updateForm.data.members, [member.id]: { ...updateForm.data.members[member.id], ktm: e.target.files[0] } })} style={{ display: 'none' }} />
                            </label>
                            <p style={{ fontSize: 13, color: C.white, opacity: 0.7, marginTop: '10px', fontFamily: "'EB Garamond', serif", fontWeight: 600 }}>Maks 2MB. Kosongkan jika sudah benar.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div style={{ marginTop: '3rem', padding: '3rem', background: 'rgba(0,0,0,0.4)', border: `2px solid ${C.border}` }}>
                   <p style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: C.gold, margin: '0 0 20px', fontWeight: 900, letterSpacing: 2 }}>BUKTI PEMBAYARAN</p>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                         {registration.payment_proof && <img src={storageUrl(registration.payment_proof)} alt="Payment" style={{ width: '100px', height: '70px', objectFit: 'cover', border: `1px solid rgba(255,255,255,0.2)` }} />}
                         <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 24, color: C.white, margin: 0, fontWeight: 800 }}>Dokumen Terlampir</p>
                      </div>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <a href={storageUrl(registration.payment_proof)} target="_blank" style={{ color: C.gold, fontSize: 14, fontWeight: 900, textDecoration: 'none', borderBottom: `2px solid ${C.gold}` }}>LIHAT FULL ↗</a>
                        {isRejected && (
                          <label style={{ padding: '12px 25px', background: C.white, color: C.black, fontFamily: "'Cinzel', serif", fontSize: 11, fontWeight: 900, cursor: 'pointer' }}>
                            UPLOAD BARU
                            <input type="file" onChange={e => { updateForm.setData('payment', e.target.files[0]); setPaymentFileName(e.target.files[0]?.name); }} style={{ display: 'none' }} />
                          </label>
                        )}
                      </div>
                   </div>
                   {paymentFileName && <p style={{ color: C.gold, fontSize: 13, marginTop: '15px', fontWeight: 900 }}>TERPILIH: {paymentFileName.toUpperCase()}</p>}
                </div>

                {isRejected && (
                  <button type="submit" disabled={updateForm.processing} style={{ width: '100%', marginTop: '4rem', padding: '24px', background: C.gold, color: C.black, border: 'none', fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 18, cursor: 'pointer', letterSpacing: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                    {updateForm.processing ? 'MENYIMPAN...' : 'SIMPAN & AJUKAN REVISI'}
                  </button>
                )}
              </form>
            </section>

            {/* 2. SUBMISSION SECTION */}
            {isApproved && (
              <section>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: C.green, letterSpacing: 4, borderBottom: `3px solid ${C.green}`, paddingBottom: '15px', marginBottom: '3rem', fontWeight: 900 }}>PENGUMPULAN KARYA</h3>
                {registration.submission_file ? (
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '3rem', borderLeft: `8px solid ${C.green}` }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: C.gold, margin: '0 0 10px', fontWeight: 900 }}>JUDUL KARYA</p>
                        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 36, color: C.white, margin: 0, fontWeight: 900 }}>{registration.submission_title}</p>
                    </div>
                    <div style={{ marginBottom: '3.5rem' }}>
                        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: C.gold, margin: '0 0 10px', fontWeight: 900 }}>DESKRIPSI</p>
                        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 22, color: C.white, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{registration.submission_description}</p>
                    </div>
                    <a href={storageUrl(registration.submission_file)} target="_blank" style={{ padding: '20px 45px', background: C.gold, color: C.black, textDecoration: 'none', fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 14, letterSpacing: 2 }}>DOWNLOAD ZIP ↗</a>
                  </div>
                ) : (
                  <form onSubmit={submitWork} style={{ maxWidth: '750px' }}>
                    <div style={{ marginBottom: '3rem' }}>
                      <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 14, color: C.white, marginBottom: '15px', fontWeight: 900 }}>JUDUL KARYA</label>
                      <input type="text" value={workForm.data.submission_title} onChange={e => workForm.setData('submission_title', e.target.value)}
                        style={{ width: '100%', padding: '20px', background: 'rgba(0,0,0,0.3)', border: `2px solid ${C.gold}`, color: C.white, outline: 'none', fontSize: 20, fontWeight: 900, fontFamily: "'EB Garamond', serif" }}
                      />
                    </div>
                    <div style={{ marginBottom: '3rem' }}>
                      <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 14, color: C.white, marginBottom: '15px', fontWeight: 900 }}>DESKRIPSI KARYA</label>
                      <textarea rows={6} value={workForm.data.submission_description} onChange={e => workForm.setData('submission_description', e.target.value)}
                        style={{ width: '100%', padding: '20px', background: 'rgba(0,0,0,0.3)', border: `2px solid ${C.gold}`, color: C.white, outline: 'none', fontSize: 20, fontWeight: 900, fontFamily: "'EB Garamond', serif" }}
                      />
                    </div>
                    <div style={{ marginBottom: '4rem' }}>
                      <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 14, color: C.white, marginBottom: '15px', fontWeight: 900 }}>FILE KARYA (.ZIP/.RAR)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <label style={{ padding: '18px 35px', background: C.white, color: C.black, fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 900, cursor: 'pointer' }}>
                          CHOOSE FILE
                          <input type="file" onChange={e => { workForm.setData('submission_file', e.target.files[0]); setWorkFileName(e.target.files[0]?.name || ''); }} style={{ display: 'none' }} />
                        </label>
                        <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, color: C.white, fontWeight: 800 }}>{workFileName || 'Belum ada file terpilih'}</span>
                      </div>
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '24px', background: C.green, color: C.black, border: 'none', fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 18, cursor: 'pointer', letterSpacing: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>UNGGAH KARYA SEKARANG</button>
                  </form>
                )}
              </section>
            )}

            {/* 3. LOG SECTION */}
            <section>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: C.white, letterSpacing: 4, borderBottom: `3px solid ${C.white}`, paddingBottom: '15px', marginBottom: '3rem', fontWeight: 900 }}>HISTORY LOG</h3>
                {registration.logs?.map((log) => (
                    <div key={log.id} style={{ marginBottom: '3rem', display: 'flex', gap: '3rem', borderLeft: `5px solid ${C.gold}`, paddingLeft: '2.5rem' }}>
                        <div style={{ minWidth: '160px', fontFamily: "'Cinzel', serif", fontSize: 14, color: C.gold, fontWeight: 900 }}>{formatDate(log.created_at)}</div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: C.white, margin: '0 0 10px', fontWeight: 900, letterSpacing: 1 }}>{log.status.toUpperCase()}</p>
                            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, color: C.white, fontWeight: 600, margin: 0, lineHeight: 1.4 }}>{log.notes || 'Pendaftaran sedang diproses.'}</p>
                        </div>
                    </div>
                ))}
            </section>
          </div>
        </div>
      </main>
    </MainLayout>
  )
}