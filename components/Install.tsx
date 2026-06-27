"use client";

import { BREW_CMD } from "@/lib/data";
import { Icon } from "./Icon";
import { showToast } from "./Toast";
import { getDict, type Locale } from "@/lib/i18n";

// The terminal-styled "$ brew install …" block with a copy button.
// Click feedback lives in the toast — the button label stays "Copy" to
// avoid showing "Copied" twice (toast + button) on every click.

export function Install({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const onCopy = () => {
    navigator.clipboard
      ?.writeText(BREW_CMD)
      .then(() => showToast(t.install.toastCopied))
      .catch(() => showToast(t.install.toastFallback));
  };

  return (
    <div
      className="overflow-hidden rounded-md border border-border-strong font-mono text-[14.5px] shadow-[var(--shadow-card)]"
      style={{ background: "var(--terminal-bg)" }}
    >
      <div
        className="flex items-center gap-1.5 px-3.5 py-3"
        style={{ borderBottom: "1px solid var(--terminal-divider)" }}
      >
        {/* macOS traffic-light dots — keep canonical red/amber/green in both
            themes; they're a system convention, not a theming choice. */}
        <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
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
  );
}
