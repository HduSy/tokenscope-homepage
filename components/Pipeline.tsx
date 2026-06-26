import { Reveal } from "./Reveal";

// Four-step read-only pipeline. Steps run vertically on mobile, 2-column on
// md+ with vertical dividers between columns.

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
    <section
      id="how"
      className="border-y border-border bg-bg-elev py-16 sm:py-24"
    >
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

        <Reveal as="div" className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
          {steps.map((s, i) => {
            // visual divider rules mirror the source: vertical between cols
            // on md+, horizontal on top of each row.
            const isOddCol = i % 2 === 0;
            const rowClasses =
              "grid grid-cols-[44px_1fr] gap-4.5 items-start border-t border-border py-5.5 last:border-b md:last:border-b-0";
            const sideClasses =
              isOddCol ? "md:border-r md:border-border md:pr-9" : "md:pl-9";
            const lastRowFix =
              i === steps.length - 2 ? "md:border-b-0" : "";
            return (
              <div key={s.title} className={`${rowClasses} ${sideClasses} ${lastRowFix}`}>
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-accent"
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
        </Reveal>
      </div>
    </section>
  );
}
