import { Reveal } from "./Reveal";
import { CostLedger } from "./CostLedger";
import { fmtInt } from "@/lib/tokenscope-data";
import { getDict, type Locale } from "@/lib/i18n";

// The cost engine, made literal. Tokenscope's pricing is one Rust function
// (app src-tauri/src/pricing.rs::cost): for every JSONL request it reads four
// token counts out of the `usage` object, looks up the model's per-million
// rates, multiplies each count by its own rate, and sums the four. This
// section walks that exact pipeline on one coding session, instead of only
// listing the rate ratios.
//
// The rates below are the real published Anthropic per-million prices for
// claude-sonnet-4-6 ($3 / $15 / $3.75 / $0.30), which is also the built-in
// backstop in pricing.rs. The token counts are an illustrative coding session.
// Row TYPE labels come from the dict; the key/count/rate stay locale-invariant.

type Row = { type: string; key: string; count: number; rate: number; cls: string };

const MODEL = "claude-sonnet-4-6";

export function TokenTypes({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const tm = t.tokenMath;
  const ROWS: Row[] = [
    { type: tm.rowTypes.input, key: "input_tokens", count: 88000, rate: 3.0, cls: "text-accent" },
    {
      type: tm.rowTypes.cacheWrite,
      key: "cache_creation_input_tokens",
      count: 1120000,
      rate: 3.75,
      cls: "text-accent-soft",
    },
    {
      type: tm.rowTypes.cacheRead,
      key: "cache_read_input_tokens",
      count: 2400000,
      rate: 0.3,
      cls: "text-accent opacity-60",
    },
    { type: tm.rowTypes.output, key: "output_tokens", count: 320000, rate: 15.0, cls: "text-delta-up" },
  ];
  const KEY_W = Math.max(...ROWS.map((r) => r.key.length));
  const TOTAL = ROWS.reduce((s, r) => s + (r.count * r.rate) / 1e6, 0);

  return (
    <section id="pricing" className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal as="div" className="mb-11 max-w-[640px]">
          <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)" }}>
            {tm.h2}
          </h2>
          <p className="mt-3.5 text-[17px] leading-[1.55] text-dim">
            {tm.intro}
          </p>
        </Reveal>

        <Reveal
          as="div"
          delayIndex={1}
          className="grid grid-cols-1 gap-7 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:p-8 lg:grid-cols-2 lg:gap-10"
        >
          {/* The session: the four token totals, same fields the JSONL logs. */}
          <div className="min-w-0">
            <pre className="overflow-x-auto rounded-[var(--radius-md)] border border-border bg-card-2 p-4 font-mono text-[12.5px] leading-[1.9] text-text">
              <span className="text-faint">{"// " + MODEL + " · " + tm.codeComment}</span>
              {"\n"}
              <span className="text-dim">{"tokens: {"}</span>
              {"\n"}
              {ROWS.map((r) => (
                <span key={r.key}>
                  {"  "}
                  <span className="text-dim">{r.key.padEnd(KEY_W)}</span>
                  {": "}
                  <span className={r.cls}>{fmtInt(r.count)}</span>
                  {"\n"}
                </span>
              ))}
              <span className="text-dim">{"}"}</span>
            </pre>
          </div>

          {/* The cost: each count × its per-million rate, summed. Animated in
              by <CostLedger/> — rows light up in sequence, then the total
              counts from 0. */}
          <CostLedger rows={ROWS} total={TOTAL} labels={tm.ledger} />
        </Reveal>

        <Reveal as="p" delayIndex={2} className="mt-6 max-w-[68ch] text-[14px] leading-[1.6] text-dim">
          {tm.closingRates}
        </Reveal>

        <Reveal as="p" delayIndex={3} className="mt-3 max-w-[68ch] text-[15px] leading-[1.55] text-text">
          {tm.closingExample.lead}{" "}
          <span className="font-medium text-accent opacity-80">
            {tm.closingExample.cacheTokens}
          </span>{" "}
          {tm.closingExample.cacheCost} {tm.closingExample.mid}{" "}
          <span className="font-medium text-delta-up">
            {tm.closingExample.outputTokens}
          </span>{" "}
          {tm.closingExample.outputCost}
        </Reveal>
      </div>
    </section>
  );
}
