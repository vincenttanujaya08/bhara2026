import { useState, useEffect } from 'react'
import { useForm, Link } from '@inertiajs/react'

const C = {
  gold: '#C8A84B',
  cream: '#E8D9A0',
  crimson: '#8B1A1A',
  dark: '#0F0A05',
  card: '#1A1410',
  surface: '#161210',
  border: 'rgba(200,168,75,0.15)',
}

const STATUS = {
  pending:  { label: 'Menunggu', color: '#C8A84B', bg: 'rgba(200,168,75,0.1)',  border: 'rgba(200,168,75,0.3)' },
  approved: { label: 'Diterima', color: '#7ECBA1', bg: 'rgba(126,203,161,0.1)', border: 'rgba(126,203,161,0.3)' },
  rejected: { label: 'Ditolak',  color: '#E08080', bg: 'rgba(224,128,128,0.1)', border: 'rgba(224,128,128,0.3)' },
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

function AdminNav() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,7,3,0.97)', height: 58,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2.5rem', borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 17, color: C.gold }}>bharatika</span>
        </Link>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          {[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Pendaftaran', href: '/admin/registrations' }].map(({ label, href }) => (
            <Link key={label} href={href} style={{
              fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2,
              color: C.cream, textDecoration: 'none', textTransform: 'uppercase', opacity: 0.55,
            }}
              onMouseEnter={e => { e.target.style.color = C.gold; e.target.style.opacity = 1 }}
              onMouseLeave={e => { e.target.style.color = C.cream; e.target.style.opacity = 0.55 }}
            >{label}</Link>
          ))}
        </nav>
      </div>
      <Link href="/logout" method="post" as="button" style={{
        background: 'transparent', border: `1px solid rgba(200,168,75,0.2)`,
        color: C.cream, fontFamily: "'Cinzel', serif", fontSize: 9,
        letterSpacing: 2, padding: '5px 16px', cursor: 'pointer',
        textTransform: 'uppercase', opacity: 0.5,
      }}>Logout</Link>
    </div>
  )
}

function StatusBadge({ status }) {
  const s = STATUS[status] ?? STATUS.pending
  return (
    <span style={{
      fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2,
      textTransform: 'uppercase', padding: '6px 16px',
      border: `1px solid ${s.border}`, color: s.color, background: s.bg,
    }}>{s.label}</span>
  )
}

function SectionCard({ title, accentColor = C.gold, children }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: '1.75rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: `1px solid rgba(200,168,75,0.08)` }}>
        <div style={{ width: 3, height: 22, background: accentColor, flexShrink: 0 }} />
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.cream, margin: 0, letterSpacing: 1, fontWeight: 600 }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '0.55rem 0', borderBottom: `1px solid rgba(200,168,75,0.05)` }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.cream, opacity: 0.35, textTransform: 'uppercase', margin: 0, minWidth: 110, flexShrink: 0 }}>{label}</p>
      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.8, margin: 0 }}>{value ?? '—'}</p>
    </div>
  )
}

export default function AdminRegistrationShow({ registration, flash = {} }) {
  useFonts()
  const [confirmAction, setConfirmAction] = useState(null)

  const { data, setData, post, processing } = useForm({ status: '', notes: '' })

  const handleAction = (status) => {
    setData('status', status)
    setConfirmAction(status)
  }

  const submitVerify = (e) => {
    e.preventDefault()
    post(`/admin/registrations/${registration.id}/verify`, {
      onSuccess: () => setConfirmAction(null),
    })
  }

  const storageUrl = (path) => `/storage/${path}`

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div style={{ background: C.dark, minHeight: '100vh', fontFamily: "'Cinzel', serif" }}>
      <AdminNav />

      <div style={{ paddingTop: 58 }}>
        {/* Page header */}
        <div style={{ padding: '2.5rem 3rem 2rem', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          <Link href="/admin/registrations" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2,
            color: C.gold, textDecoration: 'none', textTransform: 'uppercase',
            opacity: 0.65, marginBottom: '1rem', transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.65}
          >← Kembali ke Daftar</Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.gold, opacity: 0.6, textTransform: 'uppercase', margin: '0 0 0.4rem' }}>
                #{registration.id} · {registration.competition?.name}
              </p>
              <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: 'clamp(32px, 5vw, 52px)', color: C.cream, margin: 0, lineHeight: 1 }}>
                {registration.user?.name}
              </h1>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <StatusBadge status={registration.payment_status} />
              {registration.participant_code && (
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: C.gold, margin: 0, fontWeight: 600 }}>{registration.participant_code}</p>
              )}
            </div>
          </div>
        </div>

        {/* Body: 2 column layout */}
        <div style={{ padding: '2rem 3rem 6rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', maxWidth: 1200 }}>

          {/* Left: detail */}
          <div>
            {/* Flash */}
            {flash.success && (
              <div style={{ padding: '12px 16px', marginBottom: '1.25rem', border: `1px solid rgba(126,203,161,0.3)`, background: 'rgba(126,203,161,0.06)' }}>
                <p style={{ color: '#7ECBA1', fontSize: 14, margin: 0, fontFamily: "'EB Garamond', serif" }}>{flash.success}</p>
              </div>
            )}

            {/* Registrant info */}
            <SectionCard title="Data Pendaftar">
              <InfoRow label="Nama" value={registration.user?.name} />
              <InfoRow label="Email" value={registration.user?.email} />
              <InfoRow label="Instansi" value={registration.user?.instansi} />
              <InfoRow label="WhatsApp" value={registration.user?.whatsapp} />
              <InfoRow label="Line ID" value={registration.user?.line_id} />
            </SectionCard>

            {/* Team members */}
            <SectionCard title="Anggota Tim">
              {registration.members?.length === 0 && (
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.35, margin: 0 }}>Tidak ada anggota</p>
              )}
              {registration.members?.map((member, i) => (
                <div key={member.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 1rem', marginBottom: '0.5rem',
                  background: 'rgba(200,168,75,0.03)', border: `1px solid rgba(200,168,75,0.08)`,
                }}>
                  <div>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.gold, opacity: 0.5, textTransform: 'uppercase', margin: '0 0 0.2rem' }}>
                      {i === 0 ? 'Ketua Tim' : `Anggota ${i}`}
                    </p>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.cream, margin: 0 }}>{member.name}</p>
                  </div>
                  {member.ktm_file && (
                    <a href={storageUrl(member.ktm_file)} target="_blank" rel="noopener noreferrer" style={{
                      fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2,
                      color: C.gold, textDecoration: 'none', textTransform: 'uppercase',
                      border: `1px solid rgba(200,168,75,0.3)`, padding: '5px 14px',
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,168,75,0.1)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    >Lihat KTM ↗</a>
                  )}
                </div>
              ))}
            </SectionCard>

            {/* Payment proof */}
            <SectionCard title="Bukti Pembayaran" accentColor={C.crimson}>
              {registration.payment_proof ? (
                <div>
                  <img
                    src={storageUrl(registration.payment_proof)}
                    alt="Bukti pembayaran"
                    style={{ maxWidth: '100%', maxHeight: 420, objectFit: 'contain', border: `1px solid ${C.border}`, display: 'block', marginBottom: '0.75rem' }}
                  />
                  <a href={storageUrl(registration.payment_proof)} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-block', fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2,
                    color: C.gold, textDecoration: 'none', textTransform: 'uppercase',
                    border: `1px solid rgba(200,168,75,0.3)`, padding: '6px 16px',
                  }}>Buka Fullscreen ↗</a>
                </div>
              ) : (
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.35, margin: 0 }}>Bukti pembayaran tidak tersedia</p>
              )}
            </SectionCard>

            {/* Log history */}
            <SectionCard title="Riwayat Status">
              {registration.logs?.length === 0 && (
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.35, margin: 0 }}>Belum ada riwayat</p>
              )}
              {registration.logs?.map(log => {
                const s = STATUS[log.status] ?? STATUS.pending
                return (
                  <div key={log.id} style={{
                    borderLeft: `2px solid ${s.color}`,
                    paddingLeft: '1rem', marginBottom: '1rem',
                  }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 2, color: s.color, textTransform: 'uppercase' }}>{s.label}</span>
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 12, color: C.cream, opacity: 0.3 }}>{formatDate(log.created_at)}</span>
                    </div>
                    {log.notes && (
                      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.6, margin: 0, lineHeight: 1.6 }}>{log.notes}</p>
                    )}
                  </div>
                )
              })}
            </SectionCard>
          </div>

          {/* Right: verify panel */}
          <div style={{ position: 'sticky', top: 72, alignSelf: 'flex-start' }}>
            {registration.payment_status === 'pending' ? (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid rgba(200,168,75,0.08)` }}>
                  <div style={{ width: 3, height: 22, background: C.gold }} />
                  <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.cream, margin: 0, letterSpacing: 1 }}>Verifikasi</h2>
                </div>

                {confirmAction ? (
                  /* Confirm form */
                  <form onSubmit={submitVerify}>
                    <div style={{
                      padding: '0.85rem 1rem', marginBottom: '1.25rem',
                      background: confirmAction === 'approved' ? 'rgba(126,203,161,0.07)' : 'rgba(224,128,128,0.07)',
                      border: `1px solid ${confirmAction === 'approved' ? 'rgba(126,203,161,0.25)' : 'rgba(224,128,128,0.25)'}`,
                    }}>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 1, color: confirmAction === 'approved' ? '#7ECBA1' : '#E08080', margin: '0 0 0.25rem', textTransform: 'uppercase' }}>
                        Konfirmasi {confirmAction === 'approved' ? 'Terima' : 'Tolak'}
                      </p>
                      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, color: C.cream, opacity: 0.6, margin: 0 }}>
                        {confirmAction === 'approved'
                          ? 'Kode peserta akan diterbitkan otomatis.'
                          : 'Peserta akan diminta memperbarui dokumen.'}
                      </p>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 2, color: C.gold, opacity: 0.65, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        Catatan (opsional)
                      </label>
                      <textarea
                        rows={3}
                        value={data.notes}
                        onChange={e => setData('notes', e.target.value)}
                        placeholder={confirmAction === 'approved' ? 'Pesan tambahan untuk peserta...' : 'Alasan penolakan...'}
                        style={{
                          width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                          background: 'rgba(200,168,75,0.04)', border: `1px solid rgba(200,168,75,0.2)`,
                          color: C.cream, fontFamily: "'EB Garamond', serif",
                          fontSize: 14, outline: 'none', resize: 'vertical',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button type="submit" disabled={processing} style={{
                        flex: 1, padding: '11px',
                        background: confirmAction === 'approved' ? '#2D5E44' : C.crimson,
                        color: C.cream, border: 'none', cursor: processing ? 'not-allowed' : 'pointer',
                        fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
                        opacity: processing ? 0.6 : 1, transition: 'opacity 0.2s',
                      }}>
                        {processing ? '...' : 'Konfirmasi'}
                      </button>
                      <button type="button" onClick={() => setConfirmAction(null)} style={{
                        padding: '11px 16px', background: 'transparent',
                        border: `1px solid rgba(200,168,75,0.2)`,
                        color: C.cream, cursor: 'pointer',
                        fontFamily: "'Cinzel', serif", fontSize: 9, opacity: 0.55,
                        transition: 'opacity 0.2s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0.55}
                      >Batal</button>
                    </div>
                  </form>
                ) : (
                  /* Action buttons */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button onClick={() => handleAction('approved')} style={{
                      width: '100%', padding: '13px',
                      background: 'rgba(45,94,68,0.6)',
                      border: `1px solid rgba(126,203,161,0.3)`,
                      color: '#7ECBA1', cursor: 'pointer',
                      fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
                      transition: 'background 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(45,94,68,0.9)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(45,94,68,0.6)'}
                    >✓ &nbsp; Terima</button>
                    <button onClick={() => handleAction('rejected')} style={{
                      width: '100%', padding: '13px',
                      background: 'rgba(139,26,26,0.3)',
                      border: `1px solid rgba(224,128,128,0.3)`,
                      color: '#E08080', cursor: 'pointer',
                      fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
                      transition: 'background 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,26,26,0.6)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,26,26,0.3)'}
                    >✕ &nbsp; Tolak</button>
                  </div>
                )}
              </div>
            ) : (
              /* Already verified */
              <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: '1.75rem', textAlign: 'center' }}>
                <StatusBadge status={registration.payment_status} />
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: C.cream, opacity: 0.4, margin: '1rem 0 0' }}>
                  Pendaftaran ini sudah diverifikasi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
