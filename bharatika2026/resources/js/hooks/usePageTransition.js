// resources/js/hooks/usePageTransition.js
import { router } from '@inertiajs/react'

// ─── Inject CSS ───
export function injectTransitionStyles() {
  if (document.getElementById('page-transition-styles')) return
  const style = document.createElement('style')
  style.id = 'page-transition-styles'
  style.textContent = `
    #page-transition-overlay {
      position: fixed; inset: 0; z-index: 99999;
      pointer-events: none; overflow: hidden;
    }
    .tc-left, .tc-right {
      position: absolute; top: 0; width: 50%; height: 100%;
      background: #0F0A05; will-change: transform;
    }
    .tc-left  { left: 0;  transform: translateX(-105%); border-right: 1px solid rgba(200,168,75,0.3); }
    .tc-right { right: 0; transform: translateX(105%);  border-left:  1px solid rgba(200,168,75,0.3); }
    .tc-seal  {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%,-50%) scale(0);
      opacity: 0; z-index: 2;
    }
    .td-panel {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, #0F0A05 0%, #1A0A05 50%, #0F0A05 100%);
      clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
      will-change: clip-path;
    }
    .td-shimmer {
      position: absolute; top: 0; bottom: 0; width: 3px; left: -3px;
      background: linear-gradient(to bottom, transparent, #C8A84B 30%, #E8D9A0 50%, #C8A84B 70%, transparent);
      opacity: 0; will-change: transform, opacity;
      box-shadow: 0 0 20px rgba(200,168,75,0.8), 0 0 40px rgba(200,168,75,0.4);
    }
    .ts-slat {
      position: absolute; left: 0; right: 0;
      background: #0F0A05; transform: scaleX(0); will-change: transform;
    }
    .tv-vig {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at center, transparent 0%, #0F0A05 100%);
      opacity: 0;
    }
    .tv-dark {
      position: absolute; inset: 0;
      background: #0F0A05; opacity: 0;
    }
  `
  document.head.appendChild(style)
}

// ─── Overlay helpers ───
function getOverlay() {
  let el = document.getElementById('page-transition-overlay')
  if (!el) {
    el = document.createElement('div')
    el.id = 'page-transition-overlay'
    document.body.appendChild(el)
  }
  return el
}

function clearOverlay() {
  const el = document.getElementById('page-transition-overlay')
  if (el) { el.innerHTML = ''; el.style.pointerEvents = 'none' }
  window.__transitioning = false
}

// ─── Route → transition name ───
function transitionForHref(href) {
  if (!href) return 'curtain'
  if (href.includes('/admin'))        return 'slats'
  if (href.includes('/about'))        return 'curtain'
  if (href.includes('/competitions')) return 'diagonal'
  if (href.includes('/login') || href.includes('/register')) return 'vignette'
  if (href.includes('/history'))      return 'slats'
  return 'curtain'
}

// ═══════════════════════════════════════════
// CLOSE animations — call onClosed() when screen is FULLY covered
// ═══════════════════════════════════════════

function closeCurtain(overlay, onClosed) {
  const left  = document.createElement('div'); left.className  = 'tc-left'
  const right = document.createElement('div'); right.className = 'tc-right'
  const seal  = document.createElement('div'); seal.className  = 'tc-seal'
  seal.innerHTML = `<svg width="80" height="80" viewBox="0 0 80 80">
    <circle cx="40" cy="40" r="35" fill="none" stroke="#C8A84B" stroke-width="1" opacity="0.6"/>
    <circle cx="40" cy="40" r="28" fill="none" stroke="#C8A84B" stroke-width="0.5" opacity="0.4"/>
    <polygon points="40,10 45,32 68,32 50,48 57,70 40,56 23,70 30,48 12,32 35,32"
      fill="none" stroke="#C8A84B" stroke-width="1" opacity="0.7"/>
    <circle cx="40" cy="40" r="6" fill="#C8A84B" opacity="0.5"/>
  </svg>`
  overlay.appendChild(left); overlay.appendChild(right); overlay.appendChild(seal)

  const dur = 320, ease = 'cubic-bezier(0.7,0,0.3,1)'
  left.animate([{ transform: 'translateX(-105%)' }, { transform: 'translateX(0)' }], { duration: dur, easing: ease, fill: 'forwards' })
  right.animate([{ transform: 'translateX(105%)' }, { transform: 'translateX(0)' }], { duration: dur, easing: ease, fill: 'forwards' }).onfinish = () => {
    seal.animate([
      { transform: 'translate(-50%,-50%) scale(0)', opacity: 0 },
      { transform: 'translate(-50%,-50%) scale(1.2)', opacity: 1 },
      { transform: 'translate(-50%,-50%) scale(1)',   opacity: 1 }
    ], { duration: 280, easing: 'cubic-bezier(0.34,1.56,0.64,1)', fill: 'forwards' })
    // Wait for seal animation + small pause, THEN call onClosed
    setTimeout(onClosed, 350)
  }
}

function closeDiagonal(overlay, onClosed) {
  const panel   = document.createElement('div'); panel.className   = 'td-panel'
  const shimmer = document.createElement('div'); shimmer.className = 'td-shimmer'
  overlay.appendChild(panel); overlay.appendChild(shimmer)

  const dur = 380, ease = 'cubic-bezier(0.7,0,0.3,1)'
  panel.animate([
    { clipPath: 'polygon(0 0,0 0,0 100%,0 100%)' },
    { clipPath: 'polygon(0 0,120% 0,120% 100%,0 100%)' }
  ], { duration: dur, easing: ease, fill: 'forwards' })
  shimmer.animate([
    { transform: 'translateX(0)',    opacity: 0 },
    { transform: 'translateX(30vw)', opacity: 1, offset: 0.1 },
    { transform: 'translateX(110vw)',opacity: 1, offset: 0.9 },
    { transform: 'translateX(120vw)',opacity: 0 }
  ], { duration: dur, easing: 'linear', fill: 'forwards' }).onfinish = () => {
    setTimeout(onClosed, 350)
  }
}

function closeSlats(overlay, onClosed) {
  const COUNT = 8, h = Math.ceil(100 / COUNT)
  const slats = []
  for (let i = 0; i < COUNT; i++) {
    const s = document.createElement('div'); s.className = 'ts-slat'
    s.style.top    = `${i * h}%`
    s.style.height = `${h + 0.5}%`
    s.style.transformOrigin = i % 2 === 0 ? 'left' : 'right'
    overlay.appendChild(s); slats.push(s)
  }
  slats.forEach((s, i) =>
    s.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: 280, delay: i * 25, easing: 'cubic-bezier(0.7,0,0.3,1)', fill: 'forwards' })
  )
  // Use a fresh animation on the last slat to detect "all closed"
  const last = slats[COUNT - 1]
  last.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
    { duration: 280, delay: (COUNT - 1) * 25, easing: 'cubic-bezier(0.7,0,0.3,1)', fill: 'forwards' }
  ).onfinish = () => setTimeout(onClosed, 350)
}

function closeVignette(overlay, onClosed) {
  const vig  = document.createElement('div'); vig.className  = 'tv-vig'
  const dark = document.createElement('div'); dark.className = 'tv-dark'
  overlay.appendChild(dark); overlay.appendChild(vig)

  vig.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-in', fill: 'forwards' })
  dark.animate([{ opacity: 0 }, { opacity: 0, offset: 0.6 }, { opacity: 1 }],
    { duration: 320, easing: 'ease-in', fill: 'forwards' }
  ).onfinish = () => setTimeout(onClosed, 350)
}

// ═══════════════════════════════════════════
// OPEN animations — called AFTER Inertia has finished rendering new page
// Overlay is still covering the screen when these start
// ═══════════════════════════════════════════

function openCurtain(overlay) {
  const dur = 320, ease = 'cubic-bezier(0.7,0,0.3,1)'
  const left  = overlay.querySelector('.tc-left')
  const right = overlay.querySelector('.tc-right')
  const seal  = overlay.querySelector('.tc-seal')
  if (!left || !right) { clearOverlay(); return }

  seal?.animate([
    { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' },
    { opacity: 0, transform: 'translate(-50%,-50%) scale(0)' }
  ], { duration: 180, fill: 'forwards' })

  left.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-105%)' }], { duration: dur, easing: ease, fill: 'forwards' })
  right.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(105%)' }], { duration: dur, easing: ease, fill: 'forwards' }).onfinish = clearOverlay
}

function openDiagonal(overlay) {
  const dur = 380, ease = 'cubic-bezier(0.7,0,0.3,1)'
  const panel = overlay.querySelector('.td-panel')
  if (!panel) { clearOverlay(); return }
  panel.animate([
    { clipPath: 'polygon(0 0,120% 0,120% 100%,0 100%)' },
    { clipPath: 'polygon(120% 0,120% 0,120% 100%,120% 100%)' }
  ], { duration: dur, easing: ease, fill: 'forwards' }).onfinish = clearOverlay
}

function openSlats(overlay) {
  const slats = Array.from(overlay.querySelectorAll('.ts-slat')).reverse()
  if (!slats.length) { clearOverlay(); return }
  slats.forEach((s, i) =>
    s.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }],
      { duration: 260, delay: i * 22, easing: 'cubic-bezier(0.7,0,0.3,1)', fill: 'forwards' })
  )
  setTimeout(clearOverlay, 260 + slats.length * 22 + 60)
}

function openVignette(overlay) {
  const dark = overlay.querySelector('.tv-dark')
  const vig  = overlay.querySelector('.tv-vig')
  if (!dark) { clearOverlay(); return }
  dark.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, easing: 'ease-out', fill: 'forwards' })
  vig.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, easing: 'ease-out', fill: 'forwards' }).onfinish = clearOverlay
}

// ─── Dispatch close/open by name ───
function doClose(name, overlay, onClosed) {
  switch (name) {
    case 'curtain':  return closeCurtain(overlay, onClosed)
    case 'diagonal': return closeDiagonal(overlay, onClosed)
    case 'slats':    return closeSlats(overlay, onClosed)
    case 'vignette': return closeVignette(overlay, onClosed)
    default:         return closeCurtain(overlay, onClosed)
  }
}

function doOpen(name, overlay) {
  switch (name) {
    case 'curtain':  return openCurtain(overlay)
    case 'diagonal': return openDiagonal(overlay)
    case 'slats':    return openSlats(overlay)
    case 'vignette': return openVignette(overlay)
    default:         return openCurtain(overlay)
  }
}

// ═══════════════════════════════════════════
// MAIN EXPORT
// Flow:
//   1. Animate CLOSE  → screen fully covered
//   2. router.visit() → Inertia fetches new page (hidden under overlay)
//   3. onFinish fires → new page is in DOM, overlay still covering
//   4. Animate OPEN   → reveal new page cleanly — no flash
// ═══════════════════════════════════════════
export function navigateWithTransition(href, options = {}) {
  // Prevent double-trigger
  if (window.__transitioning) return
  window.__transitioning = true

  injectTransitionStyles()

  const overlay = getOverlay()
  overlay.innerHTML = ''               // clear any leftover
  overlay.style.pointerEvents = 'all' // block clicks during transition

  const name = transitionForHref(href)

  doClose(name, overlay, () => {
    // ← Screen is now FULLY covered by the overlay
    // Start Inertia navigation — new page renders silently behind overlay
    router.visit(href, {
      ...options,
      onFinish: () => {
        // ← Inertia is done, new page DOM is ready
        // Now open the overlay to reveal the new page
        requestAnimationFrame(() => {
          doOpen(name, overlay)
        })
      },
    })
  })
}

// ─── Call once after app mounts ───
export function setupTransitions() {
  injectTransitionStyles()
}