"use client";

import { Button } from "./Button";
import { Icon } from "./Icon";
import { getDict, type Locale } from "@/lib/i18n";

// CTA pair used inside the hero and the final CTA card. "Install with
// Homebrew" just smooth-scrolls to the install section — the brew command
// there has its own copy button, so we don't copy or toast from here.

function scrollToInstall() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById("install")
    ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}

export function InstallCtas({ locale, className = "" }: { locale: Locale; className?: string }) {
  const t = getDict(locale);
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Button onClick={scrollToInstall}>
        <Icon name="download-simple" size={18} />
        {t.cta.install}
      </Button>
      <Button
        as="a"
        href="https://github.com/HduSy/tokenscope"
        target="_blank"
        rel="noopener noreferrer"
        variant="ghost"
      >
        <Icon name="github-logo" size={18} />
        {t.cta.github}
      </Button>
    </div>
  );
}
