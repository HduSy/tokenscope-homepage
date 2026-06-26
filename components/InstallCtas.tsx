"use client";

import { Button } from "./Button";
import { BREW_CMD } from "@/lib/data";
import { showToast } from "./Toast";

// CTA pair used inside the hero and the final CTA card. Clicking copies the
// brew command and scrolls to the install section.

function copyBrewAndScroll() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  navigator.clipboard?.writeText(BREW_CMD).then(
    () => showToast("Copied brew install"),
    () => {},
  );
  document
    .getElementById("install")
    ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}

export function InstallCtas({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Button onClick={copyBrewAndScroll}>
        <i className="ph ph-download-simple text-lg" aria-hidden />
        Install with Homebrew
      </Button>
      <Button
        as="a"
        href="https://github.com/HduSy/tokenscope"
        target="_blank"
        rel="noopener noreferrer"
        variant="ghost"
      >
        <i className="ph ph-github-logo text-lg" aria-hidden />
        View on GitHub
      </Button>
    </div>
  );
}
