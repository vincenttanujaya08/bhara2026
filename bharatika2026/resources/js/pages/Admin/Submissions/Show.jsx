// resources/js/pages/Admin/Submissions/Show.jsx
import { useEffect } from 'react'
import { Link, Head } from '@inertiajs/react'
import { AdminNav } from '../Dashboard'   // re-use shared nav

const C = {
  gold: '#C8A84B',
  dark: '#0F0A05',
  card: 'rgba(255,255,255,0.03)',
  border: 'rgba(200,168,75,0.2)',
  white: '#FFFFFF',
  green: '#7ECBA1',
  crimson: '#8B1A1A',
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

export default function AdminSubmissionShow({ submission }) {
  useFonts()

  const storageUrl = (path) => path ? `/storage/${path}` : null

  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Head title={`Karya: ${submission.submission_title}`} />
      <AdminNav active="submissions" />

      <div style={{ paddingTop: 64 }}>

        {/* ── Header ── */}
        <div style={{ padding: 'clamp(1.5rem, 4vw, 4rem) clamp(1rem, 5vw, 4rem)', background: 'rgba(255,255,255,0.02)', borderBottom: `2px solid ${C.border}` }}>
          <Link href="/admin/submissions"
            style={{ color: C.gold, textDecoration: 'none', fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 12px)', fontWeight: 900, marginBottom: '1.5rem', display: 'block', letterSpacing: 2 }}
          >← KEMBALI KE DAFTAR KARYA</Link>

          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.3vw, 14px)', color: C.gold, fontWeight: 900, letterSpacing: 4, margin: '0 0 0.75rem' }}>
            {submission.competition?.name?.toUpperCase()}
          </p>
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(26px, 5vw, 64px)', color: C.white, margin: 0, fontWeight: 800, lineHeight: 1.1 }}>
            {submission.submission_title}
          </h1>
        </div>

        {/* ── 2-col, stacks on mobile ── */}
        <div style={{
          padding: 'clamp(1.5rem, 4vw, 4rem) clamp(1rem, 5vw, 4rem)',
          maxWidth: 1400, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: 'clamp(1.5rem, 4vw, 4rem)',
          alignItems: 'start',
        }}>

          {/* ── LEFT: Description + file download ── */}
          <div>
            <div style={{ marginBottom: 'clamp(2rem, 4vw, 4rem)' }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 11px)', color: C.gold, fontWeight: 900, letterSpacing: 2, marginBottom: '1.25rem', borderBottom: `1px solid ${C.border}`, paddingBottom: '0.5rem' }}>
                DESKRIPSI KONSEP KARYA
              </p>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(16px, 2vw, 22px)', color: C.white, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {submission.submission_description || 'Tidak ada deskripsi.'}
              </p>
            </div>

            {/* Download box */}
            <div style={{ padding: 'clamp(1.25rem, 3vw, 3rem)', background: 'rgba(126,203,161,0.05)', border: `2px dashed ${C.green}`, textAlign: 'center' }}>
              <p style={{ color: C.green, fontWeight: 900, fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 11px)', marginBottom: '1.25rem', letterSpacing: 2 }}>
                BERKAS KARYA TERSEDIA (.ZIP / .RAR)
              </p>
              {submission.submission_file ? (
                <a
                  href={storageUrl(submission.submission_file)}
                  download
                  style={{
                    display: 'inline-block',
                    padding: 'clamp(14px, 2vw, 24px) clamp(24px, 4vw, 50px)',
                    background: C.green, color: C.dark,
                    textDecoration: 'none', fontFamily: "'Cinzel', serif",
                    fontSize: 'clamp(11px, 1.3vw, 14px)', fontWeight: 900, letterSpacing: 3,
                    transition: 'all 0.3s ease', boxShadow: `0 10px 30px rgba(126,203,161,0.2)`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.background = C.white }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = C.green }}
                >
                  UNDUH FILE KARYA ↓
                </a>
              ) : (
                <p style={{ color: C.white, opacity: 0.3, fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 'clamp(10px,1.1vw,12px)' }}>
                  FILE BELUM DIUNGGAH
                </p>
              )}
            </div>
          </div>

          {/* ── RIGHT: Sender identity (sticky on desktop) ── */}
          <div style={{ minWidth: 0 }}>
            <div style={{ position: 'sticky', top: 80 }}>
              <div style={{ background: C.card, border: `2px solid ${C.border}`, padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 10px)', color: C.gold, fontWeight: 900, marginBottom: '1.5rem', letterSpacing: 2, borderBottom: `1px solid ${C.border}`, paddingBottom: '0.6rem' }}>
                  IDENTITAS PENGIRIM
                </p>

                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: 9, color: C.gold, opacity: 0.6, fontWeight: 900, margin: '0 0 4px', letterSpacing: 1 }}>KETUA TIM / PESERTA</p>
                  <p style={{ color: C.white, fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: 800, fontFamily: "'EB Garamond', serif", margin: 0 }}>{submission.user?.name}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: 9, color: C.gold, opacity: 0.6, fontWeight: 900, margin: '0 0 4px', letterSpacing: 1 }}>INSTANSI</p>
                  <p style={{ color: C.white, fontSize: 'clamp(16px, 1.8vw, 18px)', fontWeight: 700, fontFamily: "'EB Garamond', serif", margin: 0 }}>{submission.user?.instansi}</p>
                </div>

                <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 3rem)' }}>
                  <p style={{ fontSize: 9, color: C.gold, opacity: 0.6, fontWeight: 900, margin: '0 0 4px', letterSpacing: 1 }}>NOMOR PESERTA</p>
                  <p style={{ color: C.gold, fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 900, fontFamily: "'Cinzel', serif", margin: 0 }}>{submission.participant_code || '---'}</p>
                </div>

                <Link href={`/admin/registrations/${submission.id}`}
                  style={{
                    display: 'block', padding: 'clamp(12px, 1.5vw, 15px)',
                    border: `2px solid ${C.gold}`, color: C.gold,
                    textDecoration: 'none', textAlign: 'center',
                    fontFamily: "'Cinzel', serif", fontSize: 'clamp(9px, 1vw, 10px)', fontWeight: 900, letterSpacing: 2,
                    transition: '0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.dark }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gold }}
                >
                  DETAIL PENDAFTARAN (KTM/BUKTI)
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}