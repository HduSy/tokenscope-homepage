import { Reveal } from "./Reveal";

// Default-collapsed FAQ powered by native <details>. No client JS — works
// before hydration, accessible by default, and the rotating "+" icon is a
// pure CSS transform driven by the [open] attribute. Wrapped in one bg-card
// panel so the inter-item dividers register against an opaque background
// instead of the page's ambient grid.

type Faq = { q: string; a: React.ReactNode };

const code = "rounded bg-grid-line px-1.5 py-px font-mono text-[12.5px] text-accent-soft";

const FAQS: Faq[] = [
  {
    q: "Does Tokenscope send any of my data over the network?",
    a: (
      <>
        No. It reads the JSONL logs your Claude CLI already writes to{" "}
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
        Today only Claude CLI&apos;s JSONL format is parsed. Other tools write different shapes —
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

export function Faq() {
  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal as="div" className="mb-11 max-w-[640px]">
          <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)" }}>
            Frequently asked.
          </h2>
          <p className="mt-3.5 text-[17px] leading-[1.55] text-dim">
            The questions that come up before someone runs the brew install.
          </p>
        </Reveal>

        <Reveal
          as="div"
          className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card"
        >
          {FAQS.map((item, i) => (
            <details
              key={i}
              // [&_summary::-webkit-details-marker]:hidden hides the default
              // disclosure triangle (WebKit/Safari). list-none + summary's
              // ::marker rule below cover the rest. group-open rotates the
              // "+" into an "x" without any JS.
              className="group border-t border-border first:border-t-0 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-grid-line">
                <span className="text-[16.5px] font-medium text-text">{item.q}</span>
                <i
                  className="ph ph-plus text-[18px] text-dim transition-transform duration-200 group-open:rotate-45 group-open:text-accent"
                  aria-hidden
                />
              </summary>
              <div className="max-w-[70ch] px-6 pb-5 text-[14.5px] leading-[1.7] text-dim">
                {item.a}
              </div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
