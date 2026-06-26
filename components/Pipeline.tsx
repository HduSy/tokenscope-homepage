import { Reveal } from "./Reveal";

// Four-step read-only pipeline. Wrapped in a single bg-card panel so the
// internal cross-dividers register against an opaque background rather than
// fighting the page-wide grid. Steps stack vertically on mobile, 2x2 on md+.

const steps = [
  {
    icon: "ph-database",
    title: "Read",
    body: (
      <>
        Scans <code className="rounded bg-grid-line px-1.5 py-px font-mono text-[12.5px] text-accent-soft">~/.claude/projects/**/*.jsonl</code> for every assistant
        message, its usage, model, and tool calls.
      </>
    ),
  },
  {
    icon: "ph-funnel",
    title: "Dedupe",
    body: (
      <>
        Collapses streaming retries by <code className="rounded bg-grid-line px-1.5 py-px font-mono text-[12.5px] text-accent-soft">message.id</code> and merges
        multi-line messages, so each turn is counted exactly once.
      </>
    ),
  },
  {
    icon: "ph-currency-dollar",
    title: "Price",
    body: <>Matches models.dev first, then LiteLLM, then a built-in snapshot. Cached for 24 hours with an offline fallback.</>,
  },
  {
    icon: "ph-chart-bar",
    title: "Show",
    body: <>Renders today&apos;s total in the menu bar and the full dashboard a click away, refreshed in the background.</>,
  },
];

export function Pipeline() {
  return (
    <section id="how" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal as="div" className="mb-11 max-w-[640px]">
          <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)" }}>
            Read-only by design.
          </h2>
          <p className="mt-3.5 text-[17px] leading-[1.55] text-dim">
            Tokenscope reads the JSONL logs your Claude CLI already writes to disk. No API keys.
            No calls to Anthropic. Nothing leaves your Mac.
          </p>
        </Reveal>

        <Reveal
          as="div"
          className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {steps.map((s, i) => {
              const inLeftCol = i % 2 === 0; // i=0, 2
              const inTopRow = i < 2; // i=0, 1
              const cellClasses = [
                "flex items-start gap-4 p-6 sm:p-7",
                // Mobile: divider between adjacent rows (skip last).
                i < steps.length - 1 ? "border-b border-border" : "",
                // md+: drop the mobile bottom border, then re-apply only on
                // the top row → forms the horizontal mid-line of the cross.
                "md:border-b-0",
                inTopRow ? "md:border-b md:border-border" : "",
                // md+: left-col cells get the vertical mid-line.
                inLeftCol ? "md:border-r md:border-border" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div key={s.title} className={cellClasses}>
                  <span
                    className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-[10px] text-accent"
                    style={{
                      background: "color-mix(in srgb, var(--color-accent) 12%, var(--color-card))",
                      border:
                        "1px solid color-mix(in srgb, var(--color-accent) 24%, transparent)",
                    }}
                  >
                    <i className={`ph ${s.icon} text-[19px]`} aria-hidden />
                  </span>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">{s.title}</h3>
                    <p className="text-[14.5px] text-dim">{s.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
