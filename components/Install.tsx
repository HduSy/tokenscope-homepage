"use client";

import { useEffect, useState } from "react";
import { BREW_CMD } from "@/lib/data";
import { showToast } from "./Toast";

// The terminal-styled "$ brew install …" block with a copy button.

export function Install() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  const onCopy = () => {
    navigator.clipboard
      ?.writeText(BREW_CMD)
      .then(() => {
        setCopied(true);
        showToast("Copied brew install");
      })
      .catch(() => showToast("Select and copy"));
  };

  return (
    <div className="overflow-hidden rounded-md border border-border-strong bg-[#0c0e10] font-mono text-[14.5px] shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3.5 py-3">
        <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
      </div>
      <div className="flex items-center justify-between gap-3 px-4.5 py-4">
        <span className="text-[#e6e8e6]">
          <span className="text-[#28c840]">$</span> brew install{" "}
          <span className="text-[#5fcf9c]">--cask hdusy/tokenscope/tokenscope</span>
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[7px] border border-white/10 bg-white/[0.06] px-3 py-1.5 font-mono text-[12.5px] text-[#e6e8e6] transition-colors hover:bg-white/[0.12]"
        >
          <i className="ph ph-copy text-sm" aria-hidden />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
