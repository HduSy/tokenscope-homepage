"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon, type IconName } from "./Icon";
import { showToast } from "./Toast";
import { SITE_URL } from "@/lib/site";
import { getDict, type Locale } from "@/lib/i18n";

// Share menu in the nav. Locale-aware platform list:
//
//   EN: X / Reddit / Facebook / Telegram / WhatsApp — every platform has a
//       web share-intent URL, so each row is a plain <a target="_blank">.
//
//   ZH: 微信 / 朋友圈 / 小红书 / 微博 / QQ / QQ空间 — Weibo/QQ/QQ空间 have
//       web share URLs and behave like the English ones. WeChat / Moments /
//       Xiaohongshu have no public share intent, so:
//         • on mobile (navigator.share present), we trigger the system share
//           sheet — Chinese mobiles include WeChat / Moments / Xiaohongshu in
//           it natively, no JSSDK / signed account required.
//         • on desktop (no navigator.share), we open a QR-code modal so the
//           visitor can scan with their phone and share from inside the app.
//
// All share URLs (and the QR-code text) use window.location.href so preview
// deploys share the right link; SITE_URL is only a safety fallback for the
// brief moment before the popover knows the URL.
//
// The QR generator (`qrcode`) is dynamically imported the first time a
// QR-required row is clicked — keeps it out of the initial bundle.

const enc = encodeURIComponent;

type EnPlatformKey = "X" | "Reddit" | "Facebook" | "Telegram" | "WhatsApp";

type EnPlatform = {
  key: EnPlatformKey;
  icon: IconName;
  href: (url: string, text: string) => string;
};

const EN_PLATFORMS: EnPlatform[] = [
  {
    key: "X",
    icon: "x-logo",
    href: (u, t) => `https://twitter.com/intent/tweet?url=${enc(u)}&text=${enc(t)}`,
  },
  {
    key: "Reddit",
    icon: "reddit-logo",
    href: (u, t) => `https://www.reddit.com/submit?url=${enc(u)}&title=${enc(t)}`,
  },
  {
    key: "Facebook",
    icon: "facebook-logo",
    href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}`,
  },
  {
    key: "Telegram",
    icon: "telegram-logo",
    href: (u, t) => `https://t.me/share/url?url=${enc(u)}&text=${enc(t)}`,
  },
  {
    key: "WhatsApp",
    icon: "whatsapp-logo",
    href: (u, t) => `https://wa.me/?text=${enc(`${t} ${u}`)}`,
  },
];

type ZhPlatformKey =
  | "wechat"
  | "wechatMoments"
  | "xiaohongshu"
  | "weibo"
  | "qq"
  | "qzone";

type ZhPlatform = {
  key: ZhPlatformKey;
  icon: IconName;
  // tint applied to the icon — brand colors give the row visual weight that
  // the monochrome English entries don't need (the English icons are full-bleed
  // glyphs, the Simple Icons ones are negative-space marks that read better
  // tinted).
  tint: string;
  // kind === "url" → plain external link, just like the English rows.
  // kind === "qr"  → no share intent, opens QR modal (desktop) or triggers
  //                  navigator.share (mobile, if available).
} & (
  | { kind: "url"; href: (url: string, title: string) => string }
  | { kind: "qr" }
);

const ZH_PLATFORMS: ZhPlatform[] = [
  { key: "wechat", icon: "wechat-logo", tint: "#07C160", kind: "qr" },
  // 朋友圈 shares WeChat's glyph (it's the same app) but uses Moments' sunshine
  // orange to distinguish at a glance. Real-world Chinese share menus do the
  // same — disambiguation is via label + color, not a unique icon.
  { key: "wechatMoments", icon: "wechat-logo", tint: "#FF9A1F", kind: "qr" },
  { key: "xiaohongshu", icon: "xiaohongshu-logo", tint: "#FF2442", kind: "qr" },
  {
    key: "weibo",
    icon: "weibo-logo",
    tint: "#E6162D",
    kind: "url",
    href: (u, t) =>
      `https://service.weibo.com/share/share.php?url=${enc(u)}&title=${enc(t)}`,
  },
  {
    key: "qq",
    icon: "qq-logo",
    tint: "#12B7F5",
    kind: "url",
    href: (u, t) =>
      `https://connect.qq.com/widget/shareqq/index.html?url=${enc(u)}&title=${enc(t)}&desc=${enc(t)}`,
  },
  // QQ空间 reuses the QQ glyph in Qzone's signature yellow. Tencent's two
  // products share visual lineage; the label + tint is enough to tell them
  // apart in a 6-row menu.
  {
    key: "qzone",
    icon: "qq-logo",
    tint: "#FFC60A",
    kind: "url",
    href: (u, t) =>
      `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${enc(u)}&title=${enc(t)}&desc=${enc(t)}`,
  },
];

// Whether to prefer the system share sheet for QR-only platforms. We only
// route through it when both (a) navigator.share is available and (b) the
// device looks like a phone — desktop Safari/Edge also expose navigator.share
// but their share sheet won't list WeChat / Moments / Xiaohongshu, so the
// QR modal is the better path there.
function shouldUseWebShare(): boolean {
  if (typeof navigator === "undefined") return false;
  if (typeof navigator.share !== "function") return false;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function ShareMenu({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const [open, setOpen] = useState(false);
  const [qrFor, setQrFor] = useState<ZhPlatformKey | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // window.location.href so the preview deploys share the correct URL; the
  // SITE_URL fallback only matters during SSR (the popover never renders
  // server-side — it's behind the `open` gate).
  const url = typeof window !== "undefined" ? window.location.href : SITE_URL;

  const onCopyLink = () => {
    navigator.clipboard
      ?.writeText(url)
      .then(() => showToast(dict.nav.linkCopied))
      .catch(() => showToast(dict.nav.linkCopyFailed));
    setOpen(false);
  };

  const onZhQrPlatform = async (key: ZhPlatformKey) => {
    setOpen(false);
    // Prefer the system share sheet on devices that have one — on Chinese
    // mobiles it surfaces WeChat / Moments / Xiaohongshu natively.
    if (shouldUseWebShare()) {
      try {
        await navigator.share({ title: dict.site.tagline, url });
        return;
      } catch {
        // User dismissed the sheet, or the platform refused — fall through
        // to the QR modal so they still have a path.
      }
    }
    setQrFor(key);
  };

  // Build the dropdown rows depending on locale. EN and ZH menus share the
  // shell (button, popover, copy-link row, divider) but differ in body.
  const isZh = locale === "zh";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={dict.nav.share}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-dim transition-[color,border-color] hover:text-text hover:border-border-strong"
      >
        <Icon name="share-network" size={17} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute top-11 z-50 w-44 right-0 min-[1440px]:left-0 min-[1440px]:right-auto overflow-hidden rounded-[var(--radius-md)] border border-border bg-card p-1.5 shadow-[var(--shadow-card)]"
        >
          {/* Copy link — first row in both locales. */}
          <button
            type="button"
            role="menuitem"
            onClick={onCopyLink}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-[8px] px-3 py-2 text-left text-[13.5px] font-medium text-dim transition-colors hover:bg-grid-line hover:text-text"
          >
            <Icon name="copy" size={17} />
            {dict.nav.copyLink}
          </button>
          <div role="separator" className="my-1 border-t border-border" />

          {isZh
            ? ZH_PLATFORMS.map((p) =>
                p.kind === "url" ? (
                  <a
                    key={p.key}
                    role="menuitem"
                    href={p.href(url, dict.site.tagline)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex cursor-pointer items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13.5px] font-medium text-dim transition-colors hover:bg-grid-line hover:text-text"
                  >
                    <Icon name={p.icon} size={17} style={{ color: p.tint }} />
                    {dict.nav.sharePlatforms[p.key]}
                  </a>
                ) : (
                  <button
                    key={p.key}
                    type="button"
                    role="menuitem"
                    onClick={() => onZhQrPlatform(p.key)}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-[8px] px-3 py-2 text-left text-[13.5px] font-medium text-dim transition-colors hover:bg-grid-line hover:text-text"
                  >
                    <Icon name={p.icon} size={17} style={{ color: p.tint }} />
                    {dict.nav.sharePlatforms[p.key]}
                  </button>
                ),
              )
            : EN_PLATFORMS.map((p) => (
                <a
                  key={p.key}
                  role="menuitem"
                  href={p.href(url, dict.site.tagline)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13.5px] font-medium text-dim transition-colors hover:bg-grid-line hover:text-text"
                >
                  <Icon name={p.icon} size={17} />
                  {p.key}
                </a>
              ))}
        </div>
      )}
      {qrFor && (
        <QrModal
          platform={qrFor}
          url={url}
          locale={locale}
          onClose={() => setQrFor(null)}
        />
      )}
    </div>
  );
}

// QR modal — renders into document.body via a portal so the popover-clip and
// nav z-index can't trap it. Loads the qrcode lib lazily and renders the
// generated data URL into an <img>. Backdrop click and Escape both dismiss.
//
// SSR safety: `createPortal` requires `document`, which doesn't exist on the
// server. ShareMenu is a "use client" component AND the modal is mounted only
// after user interaction (`qrFor` starts null), so we're always client-side
// by the time this renders — but we still guard with `typeof document` so a
// future change can't silently break SSR.

function QrModal({
  platform,
  url,
  locale,
  onClose,
}: {
  platform: ZhPlatformKey;
  url: string;
  locale: Locale;
  onClose: () => void;
}) {
  const dict = getDict(locale);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Lazy import so the qrcode lib stays out of the initial bundle.
    import("qrcode")
      .then((mod) =>
        mod.toDataURL(url, {
          width: 240,
          margin: 1,
          errorCorrectionLevel: "M",
          color: { dark: "#0d0f12", light: "#ffffff" },
        }),
      )
      .then((d) => {
        if (!cancelled) setDataUrl(d);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  const platformLabel = dict.nav.sharePlatforms[platform];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={dict.nav.qrScanWith(platformLabel)}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[320px] rounded-[var(--radius-lg)] border border-border bg-card p-6 text-center shadow-[var(--shadow-card)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={dict.nav.qrModalClose}
          className="absolute right-3 top-3 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-dim transition-colors hover:bg-grid-line hover:text-text"
        >
          <Icon name="x" size={14} />
        </button>
        <h3 className="font-display text-[17px] font-semibold text-text">
          {dict.nav.qrScanWith(platformLabel)}
        </h3>
        <p className="mt-1.5 text-[13.5px] leading-[1.5] text-dim">
          {dict.nav.qrInstruction}
        </p>
        <div className="mx-auto mt-4 flex h-[240px] w-[240px] items-center justify-center rounded-[var(--radius-md)] bg-white">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dataUrl}
              alt={dict.nav.qrScanWith(platformLabel)}
              width={240}
              height={240}
            />
          ) : failed ? (
            <span className="px-4 text-[12.5px] text-[#0d0f12]">
              {dict.nav.linkCopyFailed}
            </span>
          ) : (
            // Placeholder while the qrcode lib is downloading + encoding.
            <span className="text-[12.5px] text-[#0d0f12] opacity-50">…</span>
          )}
        </div>
        <p
          className="mt-3 break-all font-mono text-[11px] leading-[1.4] text-faint"
          aria-hidden
        >
          {url}
        </p>
      </div>
    </div>,
    document.body,
  );
}
