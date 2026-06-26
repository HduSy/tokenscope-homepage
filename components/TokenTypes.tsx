import { Reveal } from "./Reveal";

// Four-rung ladder explaining how each token type is priced. The colour key:
// t1 accent, t2 accent-soft, t3 accent faded, t4 delta-up (red-ish).

const rungs: { mul: string; name: string; why: string; colorClass: string }[] = [
  { mul: "1×", name: "Input", why: "New prompt tokens sent this turn.", colorClass: "text-accent" },
  {
    mul: "1.25×",
    name: "Cache write",
    why: "Context written into the prompt cache.",
    colorClass: "text-accent-soft",
  },
  {
    mul: "0.1×",
    name: "Cache read",
    why: "Context replayed from cache. The cheap one.",
    colorClass: "text-accent opacity-55",
  },
  {
    mul: "5×",
    name: "Output",
    why: "Tokens the model generates. The priciest.",
    colorClass: "text-delta-up",
  },
];

export function TokenTypes() {
  return (
    <section id="pricing" className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal as="div" className="mb-11 max-w-[640px]">
          <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)" }}>
            Why a cache hit barely costs anything.
          </h2>
          <p className="mt-3.5 text-[17px] leading-[1.55] text-dim">
            Every token is billed by type. The four counts are mutually exclusive, and cached
            reads run roughly one hundred times cheaper than fresh output.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-4">
          {rungs.map((r, i) => (
            <Reveal
              key={r.name}
              as="div"
              // 3× the default stagger: each rung waits ~210ms after the
              // previous (vs the page-wide 70ms cadence) so the four cards
              // visibly cascade in instead of looking near-simultaneous.
              delayIndex={i * 3}
              className="rounded-[var(--radius-lg)] border border-border bg-card p-6"
            >
              <div
                className={`font-mono text-[44px] leading-none font-semibold tracking-[-0.02em] ${r.colorClass}`}
              >
                {r.mul}
              </div>
              <div className="mt-3.5 font-sans text-[15px] font-semibold">{r.name}</div>
              <div className="mt-1 text-[13.5px] leading-[1.5] text-dim">{r.why}</div>
            </Reveal>
          ))}
        </div>

        <Reveal as="p" className="mt-7 max-w-[70ch] text-[14px] leading-[1.6] text-dim">
          So a day with ninety-nine percent cache reads can log millions of tokens yet cost a few
          dollars. The panel folds cache into &ldquo;In&rdquo; for display only; billing always
          uses the four rates above.
        </Reveal>
      </div>
    </section>
  );
}
