import Script from "next/script";

// VibeLoft Web Telemetry. Rendered from the shared HtmlShell so a visitor on
// either / or /zh gets exactly one load per response.
//
// afterInteractive: loads client-side after hydration, so it never blocks
// first paint — same rationale as GoogleAnalytics.tsx. The loader script
// reads its config from the data-vl-* attributes and reports events to
// https://api.vibeloft.ai; events are only accepted from the registered
// production origin (https://tokenscope.app), so dev/preview traffic is
// silently rejected upstream — no env gating needed here.

const VL_PRODUCT_ID = "ccf4904a-2b24-41f4-8986-86df8a62b05d";
const VL_AUTH_KEY = "vl_web.8OP1GPD4hFrkAw1ygKvtc7oO4tnqvKF6PkeqnVt8API";

export function VibeLoftTelemetry() {
  return (
    <Script
      src="https://vibeloft.ai/telemetry/v1.js"
      strategy="afterInteractive"
      data-vl-product-id={VL_PRODUCT_ID}
      data-vl-auth-key={VL_AUTH_KEY}
    />
  );
}
