// resources/js/pages/Admin/Submissions/Show.jsx
import { useEffect } from 'react'
import { Link, Head } from '@inertiajs/react'

const C = {
  gold: '#C8A84B',
  dark: '#0F0A05',
  card: 'rgba(255,255,255,0.03)',
  border: 'rgba(200,168,75,0.2)',
  white: '#FFFFFF',
  green: '#7ECBA1',
}

function useFonts() {
  useEffect(() => {
    if (document.getElementById('bh-fonts')) return
    const l = document.createElement('link')
    l.id = 'bh-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=EB+Garamond:wght@400;700;800&display=swap'
    document.head.appendChild(l)
  }, [])
}

export default function AdminSubmissionShow({ submission }) {
  useFonts()
  
  // Fungsi untuk generate URL storage Laravel
  const storageUrl = (path) => path ? `/storage/${path}` : null;

  return (
    <div style={{ background: C.dark, minHeight: '100vh' }}>
      <Head title={`Karya: ${submission.submission_title}`} />
      
      <div style={{ paddingTop: 75 }}>
        {/* Header Seksi */}
        <div style={{ padding: 'clamp(2rem, 5vw, 4rem)', background: 'rgba(255,255,255,0.02)', borderBottom: `2px solid ${C.border}` }}>
          <Link href="/admin/submissions" style={{ color: C.gold, textDecoration: 'none', fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 900, marginBottom: '2rem', display: 'block', letterSpacing: 2 }}>
            ← KEMBALI KE DAFTAR KARYA
          </Link>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: C.gold, fontWeight: 900, letterSpacing: 4, margin: '0 0 1rem' }}>
            {submission.competition?.name?.toUpperCase()}
          </p>
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(32px, 5vw, 64px)', color: C.white, margin: 0, fontWeight: 800, lineHeight: 1.1 }}>
            {submission.submission_title}
          </h1>
        </div>

        <div style={{ 
          padding: 'clamp(2rem, 5vw, 4rem)', 
          maxWidth: '1400px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', 
          gap: '4rem' 
        }}>
          
          {/* SISI KIRI: DETAIL KARYA */}
          <div>
            <div style={{ marginBottom: '4rem' }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: C.gold, fontWeight: 900, letterSpacing: 2, marginBottom: '1.5rem', borderBottom: `1px solid ${C.border}`, paddingBottom: '0.5rem' }}>
                DESKRIPSI KONSEP KARYA
              </p>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(18px, 2vw, 22px)', color: C.white, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {submission.submission_description || 'Tidak ada deskripsi.'}
              </p>
            </div>

            {/* BOX UNDUH FILE GENDUT */}
            <div style={{ padding: 'clamp(1.5rem, 3vw, 3rem)', background: 'rgba(126,203,161,0.05)', border: `2px dashed ${C.green}`, textAlign: 'center' }}>
               <p style={{ color: C.green, fontWeight: 900, fontFamily: "'Cinzel', serif", fontSize: 11, marginBottom: '1.5rem', letterSpacing: 2 }}>BERKAS KARYA TERSEDIA (.ZIP / .RAR)</p>
               
               {submission.submission_file ? (
                 <a 
                   href={storageUrl(submission.submission_file)} 
                   download 
                   style={{
                     display: 'inline-block', padding: '24px 50px', background: C.green, color: C.dark,
                     textDecoration: 'none', fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 900, letterSpacing: 3,
                     transition: 'all 0.3s ease', boxShadow: `0 10px 30px rgba(126,203,161,0.2)`
                   }}
                   onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.background = C.white }}
                   onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = C.green }}
                 >
                   UNDUH FILE KARYA ↓
                 </a>
               ) : (
                 <p style={{ color: C.white, opacity: 0.3, fontFamily: "'Cinzel', serif", fontWeight: 900 }}>FILE BELUM DIUNGGAH</p>
               )}
            </div>
          </div>

          {/* SISI KANAN: INFO PENGIRIM (Sticky di Desktop) */}
          <div style={{ height: 'fit-content', position: typeof window !== 'undefined' && window.innerWidth > 1024 ? 'sticky' : 'relative', top: 120 }}>
            <div style={{ background: C.card, border: `2px solid ${C.border}`, padding: '2.5rem' }}>
               <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: C.gold, fontWeight: 900, marginBottom: '2rem', letterSpacing: 2, borderBottom: `1px solid ${C.border}`, paddingBottom: '10px' }}>IDENTITAS PENGIRIM</p>
               
               <div style={{ marginBottom: '2rem' }}>
                  <p style={{ fontSize: 9, color: C.gold, opacity: 0.6, fontWeight: 900, margin: '0 0 5px', letterSpacing: 1 }}>KETUA TIM / PESERTA</p>
                  <p style={{ color: C.white, fontSize: 24, fontWeight: 800, fontFamily: "'EB Garamond', serif", margin: 0 }}>{submission.user?.name}</p>
               </div>

               <div style={{ marginBottom: '2rem' }}>
                  <p style={{ fontSize: 9, color: C.gold, opacity: 0.6, fontWeight: 900, margin: '0 0 5px', letterSpacing: 1 }}>INSTANSI</p>
                  <p style={{ color: C.white, fontSize: 18, fontWeight: 700, fontFamily: "'EB Garamond', serif", margin: 0 }}>{submission.user?.instansi}</p>
               </div>

               <div style={{ marginBottom: '3rem' }}>
                  <p style={{ fontSize: 9, color: C.gold, opacity: 0.6, fontWeight: 900, margin: '0 0 5px', letterSpacing: 1 }}>NOMOR PESERTA</p>
                  <p style={{ color: C.white, fontSize: 20, fontWeight: 900, fontFamily: "'Cinzel', serif", margin: 0, color: C.gold }}>{submission.participant_code || '---'}</p>
               </div>
               
               <Link href={`/admin/registrations/${submission.id}`} style={{
                  display: 'block', padding: '15px', border: `2px solid ${C.gold}`, color: C.gold,
                  textDecoration: 'none', textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 10, fontWeight: 900, letterSpacing: 2,
                  transition: '0.3s'
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
  )
}