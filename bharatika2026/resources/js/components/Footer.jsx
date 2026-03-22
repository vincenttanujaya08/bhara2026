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
      padding: '3.5rem 5vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
      flexWrap: 'wrap',
      position: 'relative',
      zIndex: 5,
    }}>
      {/* Left — BHRTK FOOTER.svg */}
      <div>
        <img
          src="/images/BHRTK FOOTER.svg"
          alt="bharatika"
          style={{
            height: 'clamp(60px, 8vw, 110px)',
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* Right — Social icons + copyright */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1.25rem' }}>
        {/* Social icons — no border, raw SVG files */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {socialIcons.map(({ label, src, size }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                flexShrink: 0,
                opacity: 0.9,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.9'}
            >
              <img
                src={src}
                alt={label}
                style={{ width: size, height: size, objectFit: 'contain' }}
              />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(10px, 1vw, 13px)',
          color: C.cream,
          opacity: 0.55,
          margin: 0,
          textAlign: 'right',
          lineHeight: 1.8,
          letterSpacing: 0.5,
        }}>
          © Bharatika Creative Design Festival 2026.<br />
          All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}