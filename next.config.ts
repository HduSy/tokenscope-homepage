import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only: allow this LAN origin so the page hydrates when previewing from
  // a phone on the same WiFi (e.g. http://192.168.5.7:3001). Without it, Next
  // blocks cross-origin dev resources (/_next/webpack-hmr and friends) and the
  // client bundle never hydrates — so every <Reveal> section stays at its
  // pre-paint opacity:0 and the middle of the page renders blank. No effect in
  // production builds. Swap the IP if your machine's LAN address changes.
  allowedDevOrigins: ["192.168.5.7"],

  // Cookie-driven locale routing, handled by Vercel's routing layer at the
  // CDN edge — NOT a middleware function invocation. The `has: cookie`
  // condition is compiled into Vercel's routing config at build time, so
  // matching/redirecting happens before any function runs. This gives the
  // best of both worlds compared to proxy.ts:
  //   - True server-side 307 (no client-side flicker like an inline-script
  //     location.replace would cause).
  //   - Zero Edge Function tax (proxy.ts charged us 20-50ms warm + cold
  //     starts on every / and /zh request).
  //
  // Behaviour matches the deleted proxy.ts:
  //   - locale=zh cookie + visitor on /  → 307 to /zh
  //   - locale=en cookie + visitor on /zh → 307 to /
  //   - No cookie → both routes serve their static HTML straight from CDN.
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "cookie", key: "locale", value: "zh" }],
        destination: "/zh",
        permanent: false,
      },
      {
        source: "/zh",
        has: [{ type: "cookie", key: "locale", value: "en" }],
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
