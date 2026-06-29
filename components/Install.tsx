"use client";

import { BREW_CMD } from "@/lib/data";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { showToast } from "./Toast";
import { getDict, type Locale } from "@/lib/i18n";

// Two-platform install widget. macOS gets the terminal-styled "$ brew install …"
// block with a copy button; Windows gets a direct .exe download (no brew on
// Windows), both framed as matching cards. Click feedback for copy lives in the
// toast — the button label stays "Copy" to avoid showing "Copied" twice.

const RELEASES_URL = "https://github.com/HduSy/tokenscope/releases";

// Small uppercase platform tag shared by both card headers.
const platformTag =
  "font-sans text-[11px] font-semibold tracking-[0.08em] uppercase";

export function Install({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const onCopy = () => {
    navigator.clipboard
      ?.writeText(BREW_CMD)
      .then(() => showToast(t.install.toastCopied))
      .catch(() => showToast(t.install.toastFallback));
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* ── macOS — Homebrew one-liner ── */}
      <div
        className="overflow-hidden rounded-md border border-border-strong font-mono text-[14.5px] shadow-[var(--shadow-card)]"
        style={{ background: "var(--terminal-bg)" }}
      >
        <div
          className="flex items-center justify-between gap-2 px-3.5 py-3"
          style={{ borderBottom: "1px solid var(--terminal-divider)" }}
        >
          {/* macOS traffic-light dots — keep canonical red/amber/green in both
              themes; they're a system convention, not a theming choice. */}
          <div className="flex items-center gap-1.5">
            <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
          </div>
          <span
            className={platformTag}
            style={{ color: "var(--terminal-fg)", opacity: 0.55 }}
          >
            {t.install.macLabel}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 px-4.5 py-4">
          <span style={{ color: "var(--terminal-fg)" }}>
            <span style={{ color: "var(--terminal-prompt)" }}>$</span> brew install{" "}
            <span style={{ color: "var(--terminal-highlight)" }}>--cask hdusy/tokenscope/tokenscope</span>
          </span>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[7px] px-3 py-1.5 font-mono text-[12.5px] transition-colors"
            style={{
              color: "var(--terminal-fg)",
              background: "var(--terminal-btn-bg)",
              border: "1px solid var(--terminal-btn-border)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--terminal-btn-bg-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--terminal-btn-bg)";
            }}
          >
            <Icon name="copy" size={14} />
            {t.install.copyBtn}
          </button>
        </div>
      </div>

      {/* ── Windows — direct installer download ── */}
      <div
        className="flex flex-col overflow-hidden rounded-md border border-border-strong shadow-[var(--shadow-card)]"
        style={{ background: "var(--terminal-bg)" }}
      >
        <div
          className="flex items-center px-3.5 py-3"
          style={{ borderBottom: "1px solid var(--terminal-divider)" }}
        >
          <span
            className={platformTag}
            style={{ color: "var(--terminal-fg)", opacity: 0.55 }}
          >
            {t.install.winLabel}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-start justify-between gap-3 px-4.5 py-4">
          <Button
            as="a"
            href={RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            <Icon name="download-simple" size={16} />
            {t.install.winDownload.btn}
          </Button>
          <p
            className="font-sans text-[12.5px] leading-[1.5]"
            style={{ color: "var(--terminal-fg)", opacity: 0.7 }}
          >
            {t.install.winDownload.note}
          </p>
        </div>
      </div>
    </div>
  );
}
