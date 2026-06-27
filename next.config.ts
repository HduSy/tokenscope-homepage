import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
