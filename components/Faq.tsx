"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

// Default-collapsed FAQ. Single-open accordion: parent owns the openIndex,
// each item is a controlled child — clicking another row closes whatever
// was open. Animation uses the grid-template-rows 0fr ↔ 1fr trick.

type Faq = { q: string; a: React.ReactNode };

const code =
  "rounded bg-grid-line px-1.5 py-px font-mono text-[12.5px] text-accent";

const FAQS: Faq[] = [
  {
    q: "Does Tokenscope send any of my data over the network?",
    a: (
      <>
        No. It reads the JSONL logs your Claude Code already writes to{" "}
        <code className={code}>~/.claude/projects/</code>, prices them against a locally cached
        snapshot of models.dev / LiteLLM, and renders the result in your menu bar. No telemetry,
        no account, no API key.
      </>
    ),
  },
  {
    q: "Why does the .dmg warn about an unidentified developer?",
    a: (
      <>
        The cask isn&apos;t notarized through the Apple Developer program yet. Homebrew clears the
        quarantine flag for you, so the brew route opens on first launch. For a direct{" "}
        <code className={code}>.dmg</code> download, right-click → Open the first time, or run{" "}
        <code className={code}>xattr -cr /Applications/Tokenscope.app</code> once.
      </>
    ),
  },
  {
    q: "How accurate are the cost numbers?",
    a: (
      <>
        Each of the four token buckets — input, cache write, cache read, output — is priced by its
        own rate, pulled from models.dev first, LiteLLM as a fallback, then a built-in snapshot if
        you&apos;re offline. Rates cache for 24 hours on disk. Numbers track Anthropic&apos;s
        billing to the cent for priced Claude models; any model with no published pricing is
        flagged as &ldquo;unpriced&rdquo; in the panel.
      </>
    ),
  },
  {
    q: "How does Tokenscope compare to ccusage?",
    a: (
      <>
        <a
          href="https://github.com/ryoppippi/ccusage"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent"
          style={{
            borderBottom: "1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)",
          }}
        >
          ccusage
        </a>{" "}
        is a terminal CLI over the same JSONL files. Run{" "}
        <code className={code}>npx ccusage</code> and you get a one-shot summary in the shell.
        Tokenscope reads the same logs and uses the same models.dev / LiteLLM rate tables, but as a
        menu-bar GUI: today&apos;s token cost is always visible, the panel adds bar charts, a
        heatmap, and screenshot sharing. Reach for ccusage when you want a scriptable terminal
        command; reach for Tokenscope when you want ambient awareness without typing one.
      </>
    ),
  },
  {
    q: "Will it slow down my Mac?",
    a: (
      <>
        The menu-bar process watches the projects directory for file changes and only re-parses
        files whose <code className={code}>mtime</code> moved. Idle CPU is essentially zero;
        memory hovers in the low tens of MB. Refreshing the panel is a single pass over the new
        JSONL bytes since the last read.
      </>
    ),
  },
  {
    q: "What about Cursor, Codex CLI, or other terminals?",
    a: (
      <>
        Today only Claude Code&apos;s JSONL format is parsed. Other tools write different shapes —
        if you want one supported, open an issue on{" "}
        <a
          href="https://github.com/HduSy/tokenscope/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent"
          style={{
            borderBottom: "1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)",
          }}
        >
          the repo
        </a>{" "}
        with a redacted log sample and it&apos;ll get a parser.
      </>
    ),
  },
  {
    q: "Is it really free?",
    a: (
      <>
        Yes. MIT licensed, no paid tier, no telemetry to sell. The repo is at{" "}
        <a
          href="https://github.com/HduSy/tokenscope"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent"
          style={{
            borderBottom: "1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)",
          }}
        >
          github.com/HduSy/tokenscope
        </a>
        .
      </>
    ),
  },
];

function FaqItem({
  q,
  a,
  first,
  open,
  onOpen,
}: Faq & { first: boolean; open: boolean; onOpen: () => void }) {
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

export function Faq() {
  // Parent owns which row is open so hovering one auto-closes the rest.
  // null = all collapsed (the default and the state once the cursor leaves
  // the panel entirely).
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal as="div" className="mb-11 max-w-[640px]">
          <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)" }}>
            Frequently asked.
          </h2>
          <p className="mt-3.5 text-[17px] leading-[1.55] text-dim">
            The questions that come up before someone runs the brew install.
          </p>
        </Reveal>

        <Reveal as="div">
          <div
            className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card"
            onMouseLeave={() => setOpenIndex(null)}
          >
            {FAQS.map((item, i) => (
              <FaqItem
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
