import { router } from "@inertiajs/react";

// ─── Inject CSS ───
export function injectTransitionStyles() {
    if (document.getElementById("page-transition-styles")) return;
    const style = document.createElement("style");
    style.id = "page-transition-styles";
    style.textContent = `
    #page-transition-overlay {
      position: fixed; inset: 0; z-index: 999999;
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
      background: #0F0A05;
      clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
      will-change: clip-path;
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
  `;
    document.head.appendChild(style);
}

function getOverlay() {
    let el = document.getElementById("page-transition-overlay");
    if (!el) {
        el = document.createElement("div");
        el.id = "page-transition-overlay";
        document.body.appendChild(el);
    }
    return el;
}

// FIX: clearOverlay tidak perlu argumen — cukup reset state global
function clearOverlay() {
    const el = document.getElementById("page-transition-overlay");
    if (el) {
        el.innerHTML = "";
        el.style.pointerEvents = "none";
    }
    window.__transitioning = false;
}

// FIX: prioritas eksplisit — lebih spesifik di atas, lebih umum di bawah
// Urutan ini PENTING dan sengaja: /admin/competitions → "slats" (admin menang)
function transitionForHref(href) {
    if (!href) return "curtain";
    if (href.includes("/login") || href.includes("/register"))
        return "vignette";
    if (href.includes("/history") || href.includes("/admin")) return "slats";
    if (href.includes("/competitions")) return "diagonal";
    return "curtain";
}

// ─── Close Animations ───

function closeCurtain(overlay, onClosed) {
    overlay.innerHTML =
        '<div class="tc-left"></div><div class="tc-right"></div><div class="tc-seal"></div>';
    const left = overlay.querySelector(".tc-left");
    const right = overlay.querySelector(".tc-right");
    const dur = 400;
    const ease = "cubic-bezier(0.7,0,0.3,1)";
    left.animate(
        [{ transform: "translateX(-105%)" }, { transform: "translateX(0)" }],
        { duration: dur, easing: ease, fill: "forwards" },
    );
    right.animate(
        [{ transform: "translateX(105%)" }, { transform: "translateX(0)" }],
        { duration: dur, easing: ease, fill: "forwards" },
    ).onfinish = onClosed;
}

function closeDiagonal(overlay, onClosed) {
    overlay.innerHTML = '<div class="td-panel"></div>';
    const panel = overlay.querySelector(".td-panel");
    panel.animate(
        [
            { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
            { clipPath: "polygon(0 0, 120% 0, 120% 100%, 0 100%)" },
        ],
        {
            duration: 450,
            easing: "cubic-bezier(0.7,0,0.3,1)",
            fill: "forwards",
        },
    ).onfinish = onClosed;
}

function closeSlats(overlay, onClosed) {
    const COUNT = 10;
    const h = 100 / COUNT;
    overlay.innerHTML = "";
    for (let i = 0; i < COUNT; i++) {
        const s = document.createElement("div");
        s.className = "ts-slat";
        s.style.top = `${i * h}%`;
        s.style.height = `${h + 0.1}%`;
        s.style.transformOrigin = i % 2 === 0 ? "left" : "right";
        overlay.appendChild(s);
        const anim = s.animate(
            [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
            {
                duration: 350,
                delay: i * 30,
                easing: "ease-in-out",
                fill: "forwards",
            },
        );
        if (i === COUNT - 1) anim.onfinish = onClosed;
    }
}

function closeVignette(overlay, onClosed) {
    overlay.innerHTML = '<div class="tv-dark"></div><div class="tv-vig"></div>';
    const dark = overlay.querySelector(".tv-dark");
    dark.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 400,
        fill: "forwards",
    }).onfinish = onClosed;
}

// ─── Open Animations ───
// FIX: setiap openMethod menerima overlay DAN transitionName yang sudah di-lock
// dari saat navigasi dimulai — bukan baca ulang dari global state.

function openCurtain(overlay) {
    const left = overlay.querySelector(".tc-left");
    const right = overlay.querySelector(".tc-right");
    if (!left || !right) {
        clearOverlay();
        return;
    }
    left.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(-105%)" }],
        { duration: 400, easing: "ease-in", fill: "forwards" },
    );
    right.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(105%)" }],
        { duration: 400, easing: "ease-in", fill: "forwards" },
    ).onfinish = clearOverlay;
}

function openDiagonal(overlay) {
    const panel = overlay.querySelector(".td-panel");
    if (!panel) {
        clearOverlay();
        return;
    }
    panel.animate(
        [
            { clipPath: "polygon(0 0, 120% 0, 120% 100%, 0 100%)" },
            { clipPath: "polygon(120% 0, 120% 0, 120% 100%, 120% 100%)" },
        ],
        { duration: 450, easing: "ease-in", fill: "forwards" },
    ).onfinish = clearOverlay;
}

function openSlats(overlay) {
    const slats = Array.from(overlay.querySelectorAll(".ts-slat"));
    if (!slats.length) {
        clearOverlay();
        return;
    }
    slats.forEach((s, i) => {
        const anim = s.animate(
            [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }],
            {
                duration: 350,
                delay: i * 20,
                easing: "ease-in",
                fill: "forwards",
            },
        );
        if (i === slats.length - 1) anim.onfinish = clearOverlay;
    });
}

function openVignette(overlay) {
    const dark = overlay.querySelector(".tv-dark");
    if (!dark) {
        clearOverlay();
        return;
    }
    dark.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 400,
        fill: "forwards",
    }).onfinish = clearOverlay;
}

// ─── Method Maps ───

const CLOSE_METHODS = {
    curtain: closeCurtain,
    diagonal: closeDiagonal,
    slats: closeSlats,
    vignette: closeVignette,
};

const OPEN_METHODS = {
    curtain: openCurtain,
    diagonal: openDiagonal,
    slats: openSlats,
    vignette: openVignette,
};

// ─── Core Logic ───

export function navigateWithTransition(href, options = {}) {
    // FIX #1: guard yang benar — tolak selama transisi berjalan
    if (window.__transitioning) return;
    window.__transitioning = true;

    injectTransitionStyles();
    const overlay = getOverlay();
    overlay.style.pointerEvents = "all";

    // FIX #3: nama transisi di-lock ke variabel lokal (closure), bukan global.
    // Tidak ada yang bisa merusaknya di tengah jalan.
    const transitionName = transitionForHref(href);

    const closeMethod = CLOSE_METHODS[transitionName] ?? closeCurtain;

    closeMethod(overlay, () => {
        // FIX #2: pisahkan onSuccess/onError dari options agar tidak tertimpa spread.
        // Kalau pemanggil mau pakai onSuccess sendiri, tangkap dulu lalu chain.
        const {
            onSuccess: callerOnSuccess,
            onError: callerOnError,
            ...restOptions
        } = options;

        router.visit(href, {
            ...restOptions,
            onSuccess(page) {
                // Jalankan callback pemanggil dulu jika ada
                callerOnSuccess?.(page);

                // FIX #3: pakai transitionName dari closure — dijamin konsisten
                // dengan animasi close yang sudah berjalan, tidak bergantung global.
                setTimeout(() => {
                    const openMethod =
                        OPEN_METHODS[transitionName] ?? openCurtain;
                    openMethod(overlay);
                }, 50);
            },
            onError(errors) {
                // FIX #1 lanjutan: pastikan unlock selalu terjadi saat error
                callerOnError?.(errors);
                clearOverlay();
            },
        });
    });
}

// FIX #6: setupTransitions sekarang punya tujuan lebih jelas —
// inject style sekaligus pastikan overlay element sudah ada di DOM
// sebelum navigasi pertama terjadi (hindari flash saat createElement terlambat).
export function setupTransitions() {
    injectTransitionStyles();
    getOverlay(); // pre-create overlay element
}
