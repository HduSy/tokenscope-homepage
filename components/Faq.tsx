"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { getDict, type Locale } from "@/lib/i18n";
import type { FaqItem } from "@/lib/i18n/en";

// Default-collapsed FAQ. Single-open accordion: parent owns the openIndex,
// each item is a controlled child — clicking another row closes whatever
// was open. Animation uses the grid-template-rows 0fr ↔ 1fr trick.

function FaqRow({
  q,
  a,
  first,
  open,
  onOpen,
}: { q: string; a: React.ReactNode; first: boolean; open: boolean; onOpen: () => void }) {
  return (
    // Hover-to-open: pointing at the row sets the parent's openIndex; the
    // mouseleave on the surrounding panel collapses everything when the
    // cursor exits. The click handler is kept so keyboard / touch users
    // still get a toggle that works without hover.
    <div
      className={first ? "" : "border-t border-border"}
      onMouseEnter={onOpen}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-grid-line"
      >
        <span className="text-[16.5px] font-medium text-text">{q}</span>
        <Icon
          name="plus"
          size={18}
          className={`transition-[transform,color] duration-300 ease-out ${
            open ? "rotate-45 text-accent" : "text-dim"
          }`}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="max-w-[70ch] px-6 pt-3 pb-5 text-[14.5px] leading-[1.7] text-dim">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Faq({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const items: FaqItem[] = t.faq.items;
  // Parent owns which row is open so hovering one auto-closes the rest.
  // null = all collapsed (the default and the state once the cursor leaves
  // the panel entirely).
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal as="div" className="mb-11 max-w-[640px]">
          <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)" }}>
            {t.faq.h2}
          </h2>
          <p className="mt-3.5 text-[17px] leading-[1.55] text-dim">
            {t.faq.intro}
          </p>
        </Reveal>

        <Reveal as="div">
          <div
            className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card"
            onMouseLeave={() => setOpenIndex(null)}
          >
            {items.map((item, i) => (
              <FaqRow
                key={i}
                q={item.q}
                a={item.a}
                first={i === 0}
                open={openIndex === i}
                onOpen={() => setOpenIndex(i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
