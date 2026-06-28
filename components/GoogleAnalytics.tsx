import Script from "next/script";

// Google Analytics 4 (gtag.js). Rendered from the shared HtmlShell so a
// visitor on either / or /zh gets exactly one load per response.
//
// afterInteractive (the default for analytics/tag-manager per the next/script
// guide): loads client-side after hydration, so it never blocks first paint.
// GA4's built-in pageview measurement also fires on client-side route changes
// — it listens to the History API — so no manual route-change hook is needed
// for in-app navigations.
//
// Named GoogleAnalytics to avoid colliding with the <Analytics/> component
// from @vercel/analytics (Vercel Web Analytics), which keeps its package's own
// name.

const GA_MEASUREMENT_ID = "G-JYTDCR5YRF";

export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
