import React from 'react'

const C = {
  cream: '#E8D9A0',
  black: '#0F0A05',
  border: 'rgba(232, 217, 160, 0.2)',
}

export default function Footer() {
  return (
    <footer style={{ 
      background: C.black, 
      padding: '4rem 2rem 3rem', 
      borderTop: `1px solid ${C.border}`, 
      position: 'relative', 
      zIndex: 5, 
      textAlign: 'center' 
    }}>
      <img src="/images/BHRTK FOOTER.svg" alt="bharatika" style={{ height: 50, marginBottom: '2rem', opacity: 0.8 }} />
      <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 22, color: C.cream, margin: '0 0 4px', letterSpacing: 2 }}>bharatika</p>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: C.cream, opacity: 0.4, letterSpacing: 2, textTransform: 'uppercase', marginBottom: '2.5rem' }}>Creative Design Festival 2026</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Placeholder Social Icons */}
        {['LINE', 'TT', 'IG', 'YT'].map(icon => (
          <div key={icon} style={{ width: 32, height: 32, border: '1px solid rgba(232,217,160,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
            <div style={{ width: 14, height: 14, background: C.cream, opacity: 0.4 }}></div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: "'Cinzel', serif", fontSize: '9px', color: C.cream, opacity: 0.3, letterSpacing: '1.5px' }}>
        © Bharatika Creative Design Festival 2026. All Rights Reserved.
      </p>
    </footer>
  )
}