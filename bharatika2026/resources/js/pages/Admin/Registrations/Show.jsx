// resources/js/pages/Admin/Registrations/Show.jsx
import { useState, useEffect } from 'react'
import { useForm, Link, Head } from '@inertiajs/react'

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
  approved: { label: 'PENDAFTARAN VALID',    color: C.green },
  rejected: { label: 'PERLU REVISI',         color: C.red },
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

function AdminNav({ active = 'registrations' }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#000', height: 75,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(1rem, 5vw, 4rem)', borderBottom: `2px solid ${C.gold}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 3vw, 4rem)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(18px, 2.5vw, 24px)', color: C.gold, fontWeight: 900, letterSpacing: 3 }}>BHARATIKA</span>
        </Link>
        <nav style={{ display: 'flex', gap: 'clamp(1rem, 2vw, 2.5rem)' }}>
          {[
            { label: 'DASHBOARD', href: '/admin/dashboard', key: 'dashboard' },
            { label: 'PENDAFTARAN', href: '/admin/registrations', key: 'registrations' },
            { label: 'KARYA', href: '/admin/submissions', key: 'submissions' },
          ].map(({ label, href, key }) => (
            <Link key={key} href={href} style={{
              fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.2vw, 13px)', letterSpacing: 2,
              color: active === key ? C.white : C.gold, textDecoration: 'none', fontWeight: 900,
              borderBottom: active === key ? `3px solid ${C.gold}` : '3px solid transparent',
              paddingBottom: 6, transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => { if(active !== key) e.currentTarget.style.color = C.white }}
              onMouseLeave={e => { if(active !== key) e.currentTarget.style.color = C.gold }}
            >{label}</Link>
          ))}
        </nav>
      </div>
      <Link href="/logout" method="post" as="button" style={{
        background: C.crimson, border: 'none', color: C.white, fontFamily: "'Cinzel', serif", 
        fontSize: 'clamp(9px, 1vw, 12px)', padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 2vw, 28px)', cursor: 'pointer', fontWeight: 900, textTransform: 'uppercase',
        transition: 'all 0.2s ease',
      }}>LOGOUT</Link>
    </div>
  )
}

function ImagePreview({ src, label }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.2vw, 11px)', color: C.gold, fontWeight: 900, letterSpacing: 2, marginBottom: '1rem' }}>
        {label?.toUpperCase()}
      </p>
      <div style={{ background: '#000', border: `2px solid ${C.border}`, padding: 'clamp(5px, 1vw, 10px)' }}>
        {src ? (
          <img src={src} alt={label} style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '800px', objectFit: 'contain' }} />
        ) : (
          <div style={{ padding: '4rem', textAlign: 'center', color: C.white, opacity: 0.2, fontWeight: 900, fontSize: 'clamp(12px, 1.5vw, 14px)' }}>DOKUMEN TIDAK TERSEDIA</div>
        )}
      </div>
    </div>
  )
}

export default function AdminRegistrationShow({ registration, flash = {} }) {
  useFonts()
  const [confirmAction, setConfirmAction] = useState(null)
  const { data, setData, post, processing } = useForm({ status: '', notes: '' })

  const storageUrl = (path) => path ? `/storage/${path}` : null;

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

  const s = STATUS_MAP[registration.payment_status] || STATUS_MAP.pending;

  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Head title={`Verifikasi: ${registration.user?.name}`} />
      <AdminNav active="registrations" />

      <div style={{ paddingTop: 75 }}>
        {/* Header Seksi & Gendut */}
        <div style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 4rem)', background: C.surface, borderBottom: `2px solid ${C.border}` }}>
          <Link href="/admin/registrations" style={{ color: C.gold, textDecoration: 'none', fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.2vw, 12px)', fontWeight: 900, letterSpacing: 2, display: 'block', marginBottom: '2rem' }}>
            ← KEMBALI KE DAFTAR
          </Link>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(11px, 1.5vw, 14px)', color: C.gold, fontWeight: 900, letterSpacing: 4, margin: '0 0 1rem' }}>
                {registration.competition?.category?.name} — {registration.competition?.name}
              </p>
              <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(32px, 6vw, 72px)', color: C.white, margin: 0, fontWeight: 800, lineHeight: 1 }}>
                {registration.user?.name}
              </h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ padding: 'clamp(8px, 1vw, 10px) clamp(15px, 2vw, 25px)', border: `3px solid ${s.color}`, color: s.color, fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.2vw, 12px)', fontWeight: 900, letterSpacing: 2, marginBottom: '1rem', display: 'inline-block' }}>
                {s.label}
              </div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(18px, 2.5vw, 24px)', color: C.white, fontWeight: 900, margin: 0 }}>
                {registration.participant_code || 'BELUM ADA KODE'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Layout: Berubah dari 2 kolom ke 1 kolom saat layar sempit */}
        <div style={{ 
          padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 4rem)', 
          maxWidth: '1400px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', 
          gap: 'clamp(2rem, 5vw, 4rem)' 
        }}>
          
          {/* SISI KIRI: SEMUA GAMBAR DOKUMEN */}
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(14px, 1.5vw, 18px)', color: C.white, fontWeight: 900, letterSpacing: 3, marginBottom: '3rem', borderBottom: `2px solid ${C.gold}`, paddingBottom: '1rem' }}>
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

          {/* SISI KANAN: PANEL VERIFIKASI & LOG */}
          <div style={{ 
            position: 'relative', 
            height: 'fit-content',
            // Gunakan sticky hanya di layar desktop (lebar > 1024px)
            top: typeof window !== 'undefined' && window.innerWidth > 1024 ? 120 : 0
          }}>
            
            {/* PANEL KONTROL */}
            <div style={{ background: C.card, border: `2px solid ${C.border}`, padding: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '2rem' }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.2vw, 12px)', color: C.gold, fontWeight: 900, letterSpacing: 2, marginBottom: '2rem' }}>
                PANEL KONTROL SISTEM
              </p>

              {registration.payment_status === 'pending' ? (
                <>
                  {!confirmAction ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <button onClick={() => handleAction('approved')} style={{ background: C.green, color: C.dark, border: 'none', padding: '20px', fontFamily: "'Cinzel', serif", fontSize: 'clamp(12px, 1.5vw, 14px)', fontWeight: 900, cursor: 'pointer', letterSpacing: 2 }}>
                        SETUJUI PENDAFTARAN
                      </button>
                      <button onClick={() => handleAction('rejected')} style={{ background: 'transparent', border: `2px solid ${C.red}`, color: C.red, padding: '20px', fontFamily: "'Cinzel', serif", fontSize: 'clamp(12px, 1.5vw, 14px)', fontWeight: 900, cursor: 'pointer', letterSpacing: 2 }}>
                        TOLAK / REVISI
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={submitVerify}>
                      <div style={{ padding: '1.5rem', background: confirmAction === 'approved' ? `${C.green}15` : `${C.red}15`, border: `2px solid ${confirmAction === 'approved' ? C.green : C.red}`, marginBottom: '2rem' }}>
                        <p style={{ fontFamily: "'Cinzel', serif", fontSize: '11px', fontWeight: 900, color: confirmAction === 'approved' ? C.green : C.red, margin: '0 0 0.5rem' }}>
                          KONFIRMASI {confirmAction.toUpperCase()}
                        </p>
                        <textarea 
                          rows={4}
                          value={data.notes}
                          onChange={e => setData('notes', e.target.value)}
                          placeholder="Tambahkan catatan administrasi..."
                          style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${C.border}`, color: C.white, fontFamily: "'EB Garamond', serif", fontSize: '16px', outline: 'none', resize: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" disabled={processing} style={{ flex: 1, padding: '15px', background: C.white, color: C.dark, border: 'none', fontWeight: 900, fontFamily: "'Cinzel', serif", cursor: 'pointer', fontSize: '12px' }}>
                          {processing ? '...' : 'KIRIM'}
                        </button>
                        <button type="button" onClick={() => setConfirmAction(null)} style={{ padding: '15px', background: 'transparent', border: `2px solid ${C.border}`, color: C.white, fontWeight: 900, fontFamily: "'Cinzel', serif", cursor: 'pointer', fontSize: '12px' }}>
                          BATAL
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                   <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '18px', color: C.white, opacity: 0.5 }}>Status pendaftaran ini sudah final.</p>
                </div>
              )}
            </div>

            {/* IDENTITAS KETUA TIM */}
            <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', border: `2px solid ${C.border}`, background: 'rgba(255,255,255,0.02)', marginBottom: '2rem' }}>
               <p style={{ fontFamily: "'Cinzel', serif", fontSize: '11px', color: C.gold, fontWeight: 900, letterSpacing: 3, marginBottom: '2rem', borderBottom: `1px solid ${C.border}`, paddingBottom: '0.8rem' }}>IDENTITAS KETUA</p>
               <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '9px', color: C.gold, opacity: 0.6, fontWeight: 900, margin: '0 0 5px' }}>INSTANSI</p>
                  <p style={{ color: C.white, fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: 800, margin: 0, fontFamily: "'EB Garamond', serif" }}>{registration.user?.instansi}</p>
               </div>
               <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '9px', color: C.gold, opacity: 0.6, fontWeight: 900, margin: '0 0 5px' }}>WHATSAPP</p>
                  <p style={{ color: C.white, fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: 800, margin: 0, fontFamily: "'EB Garamond', serif" }}>{registration.user?.whatsapp}</p>
               </div>
               <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '9px', color: C.gold, opacity: 0.6, fontWeight: 900, margin: '0 0 5px' }}>LINE ID</p>
                  <p style={{ color: C.white, fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: 800, margin: 0, fontFamily: "'EB Garamond', serif" }}>{registration.user?.line_id || '—'}</p>
               </div>
               <div>
                  <p style={{ fontSize: '9px', color: C.gold, opacity: 0.6, fontWeight: 900, margin: '0 0 5px' }}>EMAIL</p>
                  <p style={{ color: C.white, fontSize: 'clamp(14px, 1.8vw, 16px)', fontWeight: 700, margin: 0, opacity: 0.8 }}>{registration.user?.email}</p>
               </div>
            </div>

            {/* TIMELINE LOG */}
            <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', border: `2px solid ${C.border}`, background: 'rgba(0,0,0,0.2)' }}>
               <p style={{ fontFamily: "'Cinzel', serif", fontSize: '11px', color: C.gold, fontWeight: 900, letterSpacing: 3, marginBottom: '2rem', borderBottom: `1px solid ${C.border}`, paddingBottom: '0.8rem' }}>RIWAYAT AKTIVITAS</p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {registration.logs?.map((log) => {
                     const statusStyle = STATUS_MAP[log.status] || STATUS_MAP.pending;
                     return (
                        <div key={log.id} style={{ position: 'relative', paddingLeft: '20px', borderLeft: `2px solid ${statusStyle.color}` }}>
                           <div style={{ position: 'absolute', left: '-6px', top: '0', width: '10px', height: '10px', borderRadius: '50%', background: statusStyle.color }} />
                           <p style={{ fontFamily: "'Cinzel', serif", fontSize: '9px', color: statusStyle.color, fontWeight: 900, margin: '0 0 5px' }}>
                              {statusStyle.label}
                           </p>
                           <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '15px', color: C.white, fontWeight: 700, margin: '0 0 5px', lineHeight: 1.4 }}>
                              {log.notes}
                           </p>
                           <p style={{ fontSize: '10px', color: C.white, opacity: 0.4, fontWeight: 700, margin: 0 }}>
                              {new Date(log.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                           </p>
                        </div>
                     );
                  })}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}