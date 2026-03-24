// resources/js/components/ConfirmModal.jsx
// ─────────────────────────────────────────────────────────────────
//  Bharatika 2026 — Reusable Confirmation Modal
//  Aesthetic: Medieval gothic, crimson/gold/cream palette
//
//  Usage:
//    <ConfirmModal
//      isOpen={showModal}
//      onConfirm={() => { /* action */ }}
//      onCancel={() => setShowModal(false)}
//      title="Konfirmasi Perubahan Password"
//      description="Tindakan ini akan mengganti password akun Anda sekarang juga."
//      confirmLabel="Ya, Ganti Password"
//      variant="danger"   // "danger" | "primary" | "warning"
//      icon="shield"      // "shield" | "crown" | "sword" | "scroll" | "flame"
//    />
// ─────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react'

const C = {
  gold:       '#C8A84B',
  goldLight:  '#E8C96A',
  cream:      '#E8D9A0',
  parchment:  '#D4C48A',
  crimson:    '#8B1A1A',
  crimsonDark:'#5A0E0E',
  dark:       '#0F0A05',
  darkCard:   '#1A1208',
  surface:    '#120D08',
  border:     'rgba(200,168,75,0.25)',
  borderGlow: 'rgba(200,168,75,0.6)',
  overlay:    'rgba(8, 4, 2, 0.88)',
}

const VARIANT_CONFIG = {
  danger: {
    confirmBg:    C.crimson,
    confirmHover: C.crimsonDark,
    confirmColor: C.cream,
    accentColor:  '#E08080',
    accentBg:     'rgba(224,128,128,0.08)',
    accentBorder: 'rgba(224,128,128,0.3)',
    runeColor:    '#E08080',
    glow:         'rgba(139,26,26,0.5)',
  },
  primary: {
    confirmBg:    C.gold,
    confirmHover: C.goldLight,
    confirmColor: C.dark,
    accentColor:  C.gold,
    accentBg:     'rgba(200,168,75,0.08)',
    accentBorder: 'rgba(200,168,75,0.3)',
    runeColor:    C.gold,
    glow:         'rgba(200,168,75,0.4)',
  },
  warning: {
    confirmBg:    '#8B6914',
    confirmHover: '#A07C1A',
    confirmColor: C.cream,
    accentColor:  '#E8A82A',
    accentBg:     'rgba(232,168,42,0.08)',
    accentBorder: 'rgba(232,168,42,0.3)',
    runeColor:    '#E8A82A',
    glow:         'rgba(139,105,20,0.5)',
  },
}

// ── SVG Heraldic Icons ──────────────────────────────────────────────
const ICONS = {
  shield: ({ color }) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 6V12C3 16.5 7 20.7 12 22C17 20.7 21 16.5 21 12V6L12 2Z"
        stroke={color} strokeWidth="1.5" fill={`${color}20`} strokeLinejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  crown: ({ color }) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
      <path d="M3 18L5 10L9 14L12 7L15 14L19 10L21 18H3Z"
        stroke={color} strokeWidth="1.5" fill={`${color}20`} strokeLinejoin="round"/>
      <circle cx="3" cy="10" r="1.5" fill={color}/>
      <circle cx="12" cy="7" r="1.5" fill={color}/>
      <circle cx="21" cy="10" r="1.5" fill={color}/>
      <line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  sword: ({ color }) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
      <line x1="5" y1="19" x2="19" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M19 5L19 9L15 5Z" fill={color}/>
      <path d="M9 14L7 16L5 14L7 12Z" stroke={color} strokeWidth="1" fill={`${color}40`}/>
      <circle cx="5.5" cy="18.5" r="1.2" fill={color}/>
    </svg>
  ),
  scroll: ({ color }) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
      <path d="M7 3C5.9 3 5 3.9 5 5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V5C19 3.9 18.1 3 17 3H7Z"
        stroke={color} strokeWidth="1.5" fill={`${color}15`}/>
      <line x1="9" y1="8" x2="15" y2="8" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="9" y1="11" x2="15" y2="11" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="9" y1="14" x2="13" y2="14" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M5 5C5 3.9 4.1 3 3 3S1 3.9 1 5V6C1 7.1 1.9 8 3 8H5" stroke={color} strokeWidth="1.5"/>
      <path d="M19 5C19 3.9 19.9 3 21 3S23 3.9 23 5V6C23 7.1 22.1 8 21 8H19" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  flame: ({ color }) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 8 7 8 12C8 14.2 9.8 16 12 16C14.2 16 16 14.2 16 12C16 10 15 8 13 7C13 7 14 9 12 10C10 9 11 5 12 2Z"
        stroke={color} strokeWidth="1.2" fill={`${color}25`} strokeLinejoin="round"/>
      <path d="M12 22C9 22 6 20 6 16C6 14 7 12 8 11C8 13 10 14 12 14C14 14 16 13 16 11C17 12 18 14 18 16C18 20 15 22 12 22Z"
        stroke={color} strokeWidth="1.2" fill={`${color}20`} strokeLinejoin="round"/>
    </svg>
  ),
}

// ── Ornamental Separator ────────────────────────────────────────────
function OrnamentLine({ color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5, margin: '1rem 0' }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${color})` }} />
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path d="M5 0L6.2 3.8H10L7 6.2L8.1 10L5 7.6L1.9 10L3 6.2L0 3.8H3.8Z" fill={color}/>
      </svg>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  )
}

// ── Corner Rune ─────────────────────────────────────────────────────
function CornerRune({ position, color }) {
  const isRight = position.includes('right')
  const isBottom = position.includes('bottom')
  return (
    <svg
      width="28" height="28" viewBox="0 0 28 28"
      style={{
        position: 'absolute',
        [isBottom ? 'bottom' : 'top']: 10,
        [isRight ? 'right' : 'left']: 10,
        opacity: 0.35,
        transform: `rotate(${isRight && !isBottom ? 90 : isRight && isBottom ? 180 : isBottom ? 270 : 0}deg)`,
      }}
    >
      <path d="M0 0 L28 0 L28 8" fill="none" stroke={color} strokeWidth="1.5"/>
      <path d="M0 0 L0 28" fill="none" stroke={color} strokeWidth="1"/>
      <circle cx="3" cy="3" r="1.5" fill={color}/>
    </svg>
  )
}

// ── Main Modal Component ────────────────────────────────────────────
export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title        = 'Konfirmasi Tindakan',
  description  = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel  = 'Batal',
  variant      = 'primary',
  icon         = 'scroll',
  loading      = false,
  detail       = null,
}) {
  const v          = VARIANT_CONFIG[variant] || VARIANT_CONFIG.primary
  const IconComp   = ICONS[icon] || ICONS.scroll
  const overlayRef = useRef(null)
  const modalRef   = useRef(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen && !loading) onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, loading, onCancel])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current && !loading) onCancel()
  }

  return (
    <>
      <style>{`
        @keyframes bhModalOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bhModalIn {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        @keyframes bhIconPulse {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%      { transform: scale(1.08); opacity: 0.85; }
        }
        @keyframes bhSealIn {
          from { transform: scale(0.5) rotate(-20deg); opacity: 0; }
          to   { transform: scale(1)   rotate(0deg);  opacity: 1; }
        }
        @keyframes bhGlowPulse {
          0%, 100% { box-shadow: 0 0 30px ${v.glow}, 0 0 0 1px ${C.border}; }
          50%      { box-shadow: 0 0 50px ${v.glow}, 0 0 0 1px ${C.borderGlow}; }
        }
        .bh-modal-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: ${C.overlay};
          backdrop-filter: blur(6px) saturate(0.8);
          display: flex; align-items: center; justify-content: center;
          padding: 1.25rem;
          animation: bhModalOverlayIn 0.25s ease forwards;
        }
        .bh-modal-box {
          position: relative;
          background: linear-gradient(145deg, ${C.darkCard} 0%, ${C.surface} 60%, #0F0A05 100%);
          border: 1px solid ${C.border};
          width: 100%;
          max-width: 460px;
          padding: clamp(1.75rem, 4vw, 2.5rem);
          animation: bhModalIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards,
                     bhGlowPulse 3s ease-in-out 0.4s infinite;
          overflow: hidden;
        }
        .bh-modal-box::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(to right, transparent, ${v.accentColor}, transparent);
          opacity: 0.8;
        }
        .bh-modal-icon-wrap {
          width: 68px; height: 68px;
          border-radius: 50%;
          background: ${v.accentBg};
          border: 1.5px solid ${v.accentBorder};
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
          animation: bhSealIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
          position: relative;
        }
        .bh-modal-icon-wrap::after {
          content: '';
          position: absolute; inset: -4px;
          border-radius: 50%;
          border: 1px solid ${v.accentColor};
          opacity: 0.2;
        }
        .bh-modal-icon-inner {
          animation: bhIconPulse 3s ease-in-out infinite;
        }
        .bh-modal-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(16px, 2.5vw, 20px);
          font-weight: 700;
          color: ${C.cream};
          text-align: center;
          letter-spacing: 1.5px;
          margin: 0 0 0.6rem;
          text-transform: uppercase;
        }
        .bh-modal-desc {
          font-family: 'EB Garamond', serif;
          font-size: clamp(15px, 2vw, 17px);
          color: ${C.cream};
          opacity: 0.75;
          text-align: center;
          line-height: 1.6;
          margin: 0;
        }
        .bh-modal-detail {
          background: ${v.accentBg};
          border: 1px solid ${v.accentBorder};
          border-left: 3px solid ${v.accentColor};
          padding: 0.75rem 1rem;
          margin-top: 1rem;
        }
        .bh-modal-detail p {
          font-family: 'EB Garamond', serif;
          font-size: 15px;
          color: ${v.accentColor};
          margin: 0;
          line-height: 1.5;
          opacity: 0.9;
        }
        .bh-modal-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.75rem;
        }
        .bh-btn-cancel {
          flex: 1;
          padding: clamp(11px, 1.5vw, 14px);
          background: transparent;
          border: 1px solid rgba(232,217,160,0.2);
          color: ${C.cream};
          font-family: 'Cinzel', serif;
          font-size: clamp(10px, 1.1vw, 11px);
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          opacity: 0.65;
          transition: opacity 0.2s, border-color 0.2s, background 0.2s, transform 0.12s;
          outline: none;
        }
        .bh-btn-cancel:hover:not(:disabled) {
          opacity: 1;
          border-color: rgba(232,217,160,0.45);
          background: rgba(232,217,160,0.05);
        }
        .bh-btn-cancel:active:not(:disabled) {
          transform: scale(0.97);
        }
        .bh-btn-confirm {
          flex: 1.4;
          padding: clamp(11px, 1.5vw, 14px);
          background: ${v.confirmBg};
          border: none;
          color: ${v.confirmColor};
          font-family: 'Cinzel', serif;
          font-size: clamp(10px, 1.1vw, 11px);
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.2s, transform 0.12s, box-shadow 0.2s, opacity 0.2s;
          outline: none;
        }
        .bh-btn-confirm:hover:not(:disabled) {
          background: ${v.confirmHover};
          box-shadow: 0 4px 20px ${v.glow};
          transform: translateY(-1px);
        }
        .bh-btn-confirm:active:not(:disabled) {
          transform: scale(0.97) translateY(0);
          box-shadow: none;
        }
        .bh-btn-confirm:disabled,
        .bh-btn-cancel:disabled {
          cursor: not-allowed;
          opacity: 0.4;
          transform: none !important;
          pointer-events: none;
        }
        .bh-btn-confirm::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .bh-loading-dots {
          display: inline-flex; gap: 4px; align-items: center;
        }
        .bh-loading-dots span {
          width: 5px; height: 5px; border-radius: 50%;
          background: currentColor;
          animation: bhDotBounce 1.2s ease-in-out infinite;
        }
        .bh-loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .bh-loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bhDotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
        @media (max-width: 480px) {
          .bh-modal-actions { flex-direction: column-reverse; }
          .bh-btn-confirm, .bh-btn-cancel { flex: none; }
        }
      `}</style>

      <div
        ref={overlayRef}
        className="bh-modal-overlay"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bh-modal-title"
      >
        <div ref={modalRef} className="bh-modal-box">

          {/* Corner runes */}
          <CornerRune position="top-left"     color={v.runeColor} />
          <CornerRune position="top-right"    color={v.runeColor} />
          <CornerRune position="bottom-left"  color={v.runeColor} />
          <CornerRune position="bottom-right" color={v.runeColor} />

          {/* Faint background texture pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
            backgroundImage: `url('/images/BITMAP.svg')`,
            backgroundSize: 'cover',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>

            {/* Icon seal */}
            <div className="bh-modal-icon-wrap">
              <div className="bh-modal-icon-inner">
                <IconComp color={v.accentColor} />
              </div>
            </div>

            {/* Title */}
            <h2 id="bh-modal-title" className="bh-modal-title">{title}</h2>

            <OrnamentLine color={v.accentColor} />

            {/* Description */}
            <p className="bh-modal-desc">{description}</p>

            {/* Optional detail box */}
            {detail && (
              <div className="bh-modal-detail">
                <p>{detail}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="bh-modal-actions">
              <button
                className="bh-btn-cancel"
                onClick={onCancel}
                disabled={loading}
              >
                {cancelLabel}
              </button>
              <button
                className="bh-btn-confirm"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <span className="bh-loading-dots">
                    <span /><span /><span />
                  </span>
                ) : confirmLabel}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}