// resources/js/components/Footer.jsx
import React from 'react'

const C = {
  cream: '#E8D9A0',
  bg: '#161A16',
}

const socialIcons = [
  { label: 'LINE',       src: '/images/LINE FOOTER.svg',   size: 40 },
  { label: 'TikTok',    src: '/images/TIKTOK FOOTER.svg', size: 40 },
  { label: 'Instagram', src: '/images/IG FOOTER.svg',     size: 45 },
  { label: 'YouTube',   src: '/images/YT FOOTER.svg',     size: 55 },
]

export default function Footer() {
  return (
    <footer style={{
      background: C.bg,
      padding: 'clamp(2rem, 4vw, 3.5rem) 5vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
      flexWrap: 'wrap',
      position: 'relative',
      zIndex: 5,
    }}>
      <style>{`
        .footer-logo img {
          height: clamp(50px, 8vw, 110px);
          width: auto;
          object-fit: contain;
          display: block;
        }
        .footer-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1.25rem;
        }
        .footer-icons {
          display: flex;
          gap: clamp(0.5rem, 1.5vw, 1rem);
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .footer-copy {
          font-family: 'Cinzel', serif;
          font-size: clamp(9px, 1vw, 13px);
          color: ${C.cream};
          opacity: 0.55;
          margin: 0;
          text-align: right;
          line-height: 1.8;
          letter-spacing: 0.5px;
        }
        @media (max-width: 540px) {
          footer {
            flex-direction: column;
            align-items: center;
          }
          .footer-right {
            align-items: center;
          }
          .footer-icons {
            justify-content: center;
          }
          .footer-copy {
            text-align: center;
          }
        }
      `}</style>

      <div className="footer-logo">
        <img src="/images/BHRTK FOOTER.svg" alt="bharatika" />
      </div>

      <div className="footer-right">
        <div className="footer-icons">
          {socialIcons.map(({ label, src, size }) => (
            <a key={label} href="#" aria-label={label}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.9'}
            >
              <img src={src} alt={label} style={{ width: size, height: size, objectFit: 'contain' }} />
            </a>
          ))}
        </div>
        <p className="footer-copy">
          © Bharatika Creative Design Festival 2026.<br />
          All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}