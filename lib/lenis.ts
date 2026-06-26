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
    instance.scrollTo(0, { immediate: !smooth });
    return;
  }
  // Lenis isn't active (reduced-motion mode, or pre-hydration) → fall back to
  // the native API.
  window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
}
