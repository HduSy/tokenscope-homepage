import type Lenis from "lenis";

// The Lenis instance is created inside <SmoothScroll/> and lives for the
// page's lifetime, but other components (LogoLink, BackToTop) need to drive
// it too. We keep it in a module-level slot here rather than on `window`.
//
// Why this exists: calling window.scrollTo({behavior:"smooth"}) races with
// Lenis's own rAF scroll loop — Lenis keeps writing the scroll position each
// frame from its internal target, so the native smooth scroll it triggers can
// be cancelled on the next frame. That's the "click the logo twice before it
// actually goes to the top" bug when you've only scrolled a little. Routing
// through lenis.scrollTo() instead animates inside Lenis's own loop, so one
// click always lands.

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function scrollToTop(smooth = true) {
  if (typeof window === "undefined") return;
  if (instance) {
    instance.scrollTo(0, {
      immediate: !smooth,
      // Override the instance default (easeOutExpo, 1.1s): that curve blasts
      // ~75% of the distance in the first few frames, so back-to-top feels
      // like a jolt. easeOutCubic starts off gently and the longer 2s duration
      // takes the edge off — a slower, softer glide instead of a snap. Only
      // applies here; wheel/touch scrolling keeps the snappier instance curve.
      duration: 2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
    return;
  }
  // Lenis isn't active (reduced-motion mode, or pre-hydration) → fall back to
  // the native API.
  window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
}

// Same-page hash anchors (the header + footer section links). Routed through
// Lenis for the same reason scrollToTop is: a native hash jump races Lenis's
// rAF scroll loop and can be cancelled on the next frame, so the click lands
// late, short, or not at all. `offset` clears the sticky nav — it mirrors the
// scroll-padding-top (5rem) in globals.css so the section's title lands below
// the nav, matching the native / no-JS path exactly.
const NAV_OFFSET = -80;

export function scrollToHash(hash: string, smooth = true) {
  if (typeof window === "undefined") return;
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const el = id ? document.getElementById(id) : null;
  if (!el) return;
  if (instance) {
    instance.scrollTo(el, { offset: NAV_OFFSET, immediate: !smooth });
    return;
  }
  // No Lenis (reduced-motion / pre-hydration) → native, which already honors
  // scroll-padding-top for the offset.
  el.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
}
