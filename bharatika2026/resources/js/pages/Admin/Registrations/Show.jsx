// resources/js/pages/Admin/Registrations/Show.jsx
import { useState, useEffect } from 'react'
import { useForm, Link, Head } from '@inertiajs/react'
import { AdminNav } from '../Dashboard'   // re-use shared nav

const C = {
  gold: '#C8A84B',
  goldLight: '#E8C96A',
  cream: '#E8D9A0',
  crimson: '#8B1A1A',
  dark: '#0F0A05',
  card: 'rgba(255,255,255,0.03)',
  surface: '#120D0A',
  border: 'rgba(200,168,75,0.2)',
  white: '#FFFFFF',
  green: '#7ECBA1',
  red: '#E08080',
}

const STATUS_MAP = {
  pending:  { label: 'MENUNGGU VERIFIKASI', color: C.gold },
  approved: { label: 'PENDAFTARAN VALID',   color: C.green },
  rejected: { label: 'PERLU REVISI',        color: C.red },
}

function useFonts() {
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.background = C.dark
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=EB+Garamond:wght@400;700;800&display=swap'
    document.head.appendChild(l)
  }, [])
}

function ImagePreview({ src, label }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 11px)', color: C.gold, fontWeight: 900, letterSpacing: 2, marginBottom: '0.75rem' }}>
        {label?.toUpperCase()}
      </p>
      <div style={{ background: '#000', border: `2px solid ${C.border}`, padding: 'clamp(4px, 0.8vw, 10px)' }}>
        {src ? (
          <img src={src} alt={label} style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 800, objectFit: 'contain' }} />
        ) : (
          <div style={{ padding: 'clamp(2rem, 4vw, 4rem)', textAlign: 'center', color: C.white, opacity: 0.2, fontWeight: 900, fontSize: 'clamp(11px, 1.3vw, 14px)' }}>
            DOKUMEN TIDAK TERSEDIA
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminRegistrationShow({ registration, flash = {} }) {
  useFonts()
  const [confirmAction, setConfirmAction] = useState(null)
  const { data, setData, post, processing } = useForm({ status: '', notes: '' })

  const storageUrl = (path) => path ? `/storage/${path}` : null

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

  const s = STATUS_MAP[registration.payment_status] || STATUS_MAP.pending

  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Head title={`Verifikasi: ${registration.user?.name}`} />
      <AdminNav active="registrations" />

      <div style={{ paddingTop: 64 }}>

        {/* ── Header ── */}
        <div style={{ padding: 'clamp(1.5rem, 4vw, 4rem) clamp(1rem, 5vw, 4rem)', background: C.surface, borderBottom: `2px solid ${C.border}` }}>
          <Link href="/admin/registrations"
            style={{ color: C.gold, textDecoration: 'none', fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 12px)', fontWeight: 900, letterSpacing: 2, display: 'block', marginBottom: '1.5rem' }}
          >← KEMBALI KE DAFTAR</Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'clamp(1rem, 2vw, 2rem)' }}>
            <div style={{ minWidth: 0, flex: '1 1 200px' }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.3vw, 14px)', color: C.gold, fontWeight: 900, letterSpacing: 4, margin: '0 0 0.75rem' }}>
                {registration.competition?.category?.name} — {registration.competition?.name}
              </p>
              <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(26px, 5vw, 72px)', color: C.white, margin: 0, fontWeight: 800, lineHeight: 1 }}>
                {registration.user?.name}
              </h1>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ padding: 'clamp(7px, 1vw, 10px) clamp(12px, 2vw, 25px)', border: `3px solid ${s.color}`, color: s.color, fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 12px)', fontWeight: 900, letterSpacing: 2, marginBottom: '0.75rem', display: 'inline-block' }}>
                {s.label}
              </div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(15px, 2vw, 24px)', color: C.white, fontWeight: 900, margin: 0 }}>
                {registration.participant_code || 'BELUM ADA KODE'}
              </p>
            </div>
          </div>
        </div>

        {/* ── 2-col content, stacks on mobile ── */}
        <div style={{
          padding: 'clamp(1.5rem, 4vw, 4rem) clamp(1rem, 5vw, 4rem)',
          maxWidth: 1400, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: 'clamp(1.5rem, 4vw, 4rem)',
          alignItems: 'start',
        }}>

          {/* ── LEFT: Documents ── */}
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(12px, 1.4vw, 18px)', color: C.white, fontWeight: 900, letterSpacing: 3, marginBottom: '2rem', borderBottom: `2px solid ${C.gold}`, paddingBottom: '0.75rem' }}>
              BERKAS PENDAFTARAN
            </h2>

            <ImagePreview src={storageUrl(registration.payment_proof)} label="Bukti Pembayaran" />

            {registration.members?.map((member, i) => (
              <ImagePreview
                key={member.id}
                src={storageUrl(member.ktm_file)}
                label={`Identitas: ${member.name} (${i === 0 ? 'Ketua' : 'Anggota'})`}
              />
            ))}
          </div>

          {/* ── RIGHT: Control panel + identity + log ── */}
          {/* sticky only works meaningfully on desktop; on mobile it just flows */}
          <div style={{ minWidth: 0 }}>
            <div style={{ position: 'sticky', top: 80 }}>

              {/* Verification panel */}
              <div style={{ background: C.card, border: `2px solid ${C.border}`, padding: 'clamp(1.25rem, 2.5vw, 2.5rem)', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 12px)', color: C.gold, fontWeight: 900, letterSpacing: 2, marginBottom: '1.5rem' }}>
                  PANEL KONTROL SISTEM
                </p>

                {registration.payment_status === 'pending' ? (
                  <>
                    {!confirmAction ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button onClick={() => handleAction('approved')}
                          style={{ background: C.green, color: C.dark, border: 'none', padding: 'clamp(14px, 2vw, 20px)', fontFamily: "'Cinzel', serif", fontSize: 'clamp(11px, 1.3vw, 14px)', fontWeight: 900, cursor: 'pointer', letterSpacing: 2 }}
                        >SETUJUI PENDAFTARAN</button>
                        <button onClick={() => handleAction('rejected')}
                          style={{ background: 'transparent', border: `2px solid ${C.red}`, color: C.red, padding: 'clamp(14px, 2vw, 20px)', fontFamily: "'Cinzel', serif", fontSize: 'clamp(11px, 1.3vw, 14px)', fontWeight: 900, cursor: 'pointer', letterSpacing: 2 }}
                        >TOLAK / REVISI</button>
                      </div>
                    ) : (
                      <form onSubmit={submitVerify}>
                        <div style={{ padding: '1.25rem', background: confirmAction === 'approved' ? `${C.green}15` : `${C.red}15`, border: `2px solid ${confirmAction === 'approved' ? C.green : C.red}`, marginBottom: '1.5rem' }}>
                          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, fontWeight: 900, color: confirmAction === 'approved' ? C.green : C.red, margin: '0 0 0.5rem' }}>
                            KONFIRMASI {confirmAction.toUpperCase()}
                          </p>
                          <textarea
                            rows={4} value={data.notes} onChange={e => setData('notes', e.target.value)}
                            placeholder="Tambahkan catatan administrasi..."
                            style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${C.border}`, color: C.white, fontFamily: "'EB Garamond', serif", fontSize: 16, outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button type="submit" disabled={processing}
                            style={{ flex: 1, padding: 'clamp(12px, 1.5vw, 15px)', background: C.white, color: C.dark, border: 'none', fontWeight: 900, fontFamily: "'Cinzel', serif", cursor: 'pointer', fontSize: 12 }}
                          >{processing ? '...' : 'KIRIM'}</button>
                          <button type="button" onClick={() => setConfirmAction(null)}
                            style={{ padding: 'clamp(12px, 1.5vw, 15px) 1rem', background: 'transparent', border: `2px solid ${C.border}`, color: C.white, fontWeight: 900, fontFamily: "'Cinzel', serif", cursor: 'pointer', fontSize: 12 }}
                          >BATAL</button>
                        </div>
                      </form>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, color: C.white, opacity: 0.5 }}>Status pendaftaran ini sudah final.</p>
                  </div>
                )}
              </div>

              {/* Identity */}
              <div style={{ padding: 'clamp(1.25rem, 2.5vw, 2.5rem)', border: `2px solid ${C.border}`, background: 'rgba(255,255,255,0.02)', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: C.gold, fontWeight: 900, letterSpacing: 3, marginBottom: '1.5rem', borderBottom: `1px solid ${C.border}`, paddingBottom: '0.6rem' }}>
                  IDENTITAS KETUA
                </p>
                {[
                  { key: 'INSTANSI',  val: registration.user?.instansi },
                  { key: 'WHATSAPP', val: registration.user?.whatsapp },
                  { key: 'LINE ID',  val: registration.user?.line_id || '—' },
                  { key: 'EMAIL',    val: registration.user?.email },
                ].map(({ key, val }) => (
                  <div key={key} style={{ marginBottom: '1.25rem' }}>
                    <p style={{ fontSize: 9, color: C.gold, opacity: 0.6, fontWeight: 900, margin: '0 0 4px' }}>{key}</p>
                    <p style={{ color: C.white, fontSize: 'clamp(14px, 1.8vw, 18px)', fontWeight: 800, margin: 0, fontFamily: "'EB Garamond', serif", wordBreak: 'break-word' }}>{val}</p>
                  </div>
                ))}
              </div>

              {/* Activity log */}
              <div style={{ padding: 'clamp(1.25rem, 2.5vw, 2.5rem)', border: `2px solid ${C.border}`, background: 'rgba(0,0,0,0.2)' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: C.gold, fontWeight: 900, letterSpacing: 3, marginBottom: '1.5rem', borderBottom: `1px solid ${C.border}`, paddingBottom: '0.6rem' }}>
                  RIWAYAT AKTIVITAS
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {registration.logs?.map((log) => {
                    const ls = STATUS_MAP[log.status] || STATUS_MAP.pending
                    return (
                      <div key={log.id} style={{ position: 'relative', paddingLeft: 20, borderLeft: `2px solid ${ls.color}` }}>
                        <div style={{ position: 'absolute', left: -6, top: 0, width: 10, height: 10, borderRadius: '50%', background: ls.color }} />
                        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: ls.color, fontWeight: 900, margin: '0 0 4px' }}>{ls.label}</p>
                        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: C.white, fontWeight: 700, margin: '0 0 4px', lineHeight: 1.4 }}>{log.notes}</p>
                        <p style={{ fontSize: 10, color: C.white, opacity: 0.4, fontWeight: 700, margin: 0 }}>
                          {new Date(log.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}