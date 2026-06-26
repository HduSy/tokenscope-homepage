import { DATA, fmtInt, fmtMoney, HEAT, pct } from "@/lib/data";
import { Reveal } from "./Reveal";

// Build donut SVG segments from the (cost-positive) Week models.
function buildDonut() {
  const models = DATA.Week.models.filter((m) => m.cost > 0).sort((a, b) => b.cost - a.cost);
  const total = models.reduce((s, m) => s + m.cost, 0);
  const size = 132;
  const th = 17;
  const cx = size / 2;
  const cy = size / 2;
  const rO = (size - 2) / 2;
  const rI = rO - th;
  const arc = (a0: number, a1: number) => {
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + rO * Math.cos(a0);
    const y0 = cy + rO * Math.sin(a0);
    const x1 = cx + rO * Math.cos(a1);
    const y1 = cy + rO * Math.sin(a1);
    const x2 = cx + rI * Math.cos(a1);
    const y2 = cy + rI * Math.sin(a1);
    const x3 = cx + rI * Math.cos(a0);
    const y3 = cy + rI * Math.sin(a0);
    return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${rO} ${rO} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} A ${rI} ${rI} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)} Z`;
  };
  let a = -Math.PI / 2;
  const segs = models.map((m) => {
    const frac = m.cost / total;
    const a0 = a;
    const a1 = a + frac * 2 * Math.PI;
    a = a1;
    return { d: arc(a0, a1), color: m.color, name: m.name, cost: m.cost };
  });
  return { size, segs, total };
}

// Heatmap layout: weeks across, days down. Levels 0..4 map to opacity ramps.
function buildHeatmap() {
  const rampStops = [0, 0.28, 0.5, 0.74, 1];
  const ramp = (lvl: number) =>
    lvl === 0
      ? "var(--color-grid-line)"
      : `color-mix(in srgb, var(--color-accent) ${Math.round(
          rampStops[lvl] * 100,
        )}%, var(--color-card))`;
  const weeks: ({ date: string; lvl: number } | null)[][] = [];
  HEAT.forEach(([date, lvl]) => {
    const dow = new Date(date + "T00:00:00").getDay();
    if (dow === 0 || weeks.length === 0) weeks.push(new Array(7).fill(null));
    weeks[weeks.length - 1][dow] = { date, lvl };
  });
  return { weeks, ramp };
}

export function Breakdowns() {
  const donut = buildDonut();
  const heat = buildHeatmap();
  const week = DATA.Week;
  const maxModel = Math.max(...week.models.map((m) => m.tokens), 1e-9);
  const totalWk = week.totalTokens || 1;

  return (
    <section id="breakdowns" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal as="div" className="mb-11 max-w-[640px]">
          <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)" }}>
            Three ways to slice your usage.
          </h2>
          <p className="mt-3.5 text-[17px] leading-[1.55] text-dim">
            Tokens by model, by MCP call, by Skill call. Spot which models drain your budget and
            which tools you installed but never touch.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* cost donut */}
          <Reveal
            as="div"
            delayIndex={0}
            className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5.5 md:col-span-5 md:row-span-2"
          >
            <h3 className="mb-1 text-[17px] font-semibold">Cost by model</h3>
            <div className="mb-4 text-[13.5px] leading-[1.5] text-dim">
              Where the dollars actually go, per period.
            </div>
            <div className="flex flex-wrap items-center gap-4.5">
              <div
                className="relative flex-none"
                style={{ width: donut.size, height: donut.size }}
              >
                <svg width={donut.size} height={donut.size} viewBox={`0 0 ${donut.size} ${donut.size}`}>
                  {donut.segs.map((s, i) => (
                    <path key={i} d={s.d} fill={s.color} />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-lg font-semibold text-text">
                    {fmtMoney(donut.total)}
                  </span>
                  <span className="text-[9.5px] tracking-[0.05em] text-faint uppercase">
                    this week
                  </span>
                </div>
              </div>
              <div className="min-w-[140px] flex-1">
                {donut.segs.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-2 py-[3px] text-xs"
                  >
                    <span
                      className="h-2 w-2 flex-none rounded-[2px]"
                      style={{ background: s.color }}
                    />
                    <span className="flex-1 truncate text-text">{s.name}</span>
                    <span className="font-mono text-dim">{fmtMoney(s.cost)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* MCP + Skill */}
          <Reveal
            as="div"
            delayIndex={1}
            className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card-2 p-5.5 md:col-span-7 md:row-span-2"
          >
            <h3 className="mb-1 text-[17px] font-semibold">Tools you actually use</h3>
            <div className="mb-4 text-[13.5px] leading-[1.5] text-dim">
              Only the MCP servers and Skills you installed yourself.
            </div>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <div>
                <div className="mb-2.5 font-sans text-[10px] font-semibold tracking-[0.05em] text-dim uppercase">
                  MCP calls
                </div>
                <ToolBars items={week.mcp ?? []} />
                <div className="mt-3.5 font-mono text-[11px] leading-[1.5] text-faint">
                  Anthropic&apos;s bundled MCP and every built-in tool are filtered out.
                </div>
              </div>
              <div>
                <div className="mb-2.5 font-sans text-[10px] font-semibold tracking-[0.05em] text-dim uppercase">
                  Skill calls
                </div>
                <ToolBars items={week.skills ?? []} />
                <div className="mt-3.5 font-mono text-[11px] leading-[1.5] text-faint">
                  Read from your own{" "}
                  <code className="font-mono text-[11px] text-accent-soft">
                    ~/.claude/skills/
                  </code>{" "}
                  directory.
                </div>
              </div>
            </div>
          </Reveal>

          {/* heatmap */}
          <Reveal
            as="div"
            delayIndex={2}
            className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5.5 md:col-span-12"
          >
            <h3 className="mb-1 text-[17px] font-semibold">A year of activity</h3>
            <div className="mb-4 text-[13.5px] leading-[1.5] text-dim">
              Daily token volume across the last twelve months.
            </div>
            <div>
              <div className="flex gap-0.5">
                {heat.weeks.map((wk, wi) => (
                  <div key={wi} className="flex min-w-0 flex-1 flex-col gap-0.5">
                    {wk.map((d, di) => (
                      <div
                        key={di}
                        className="aspect-square rounded-[2px]"
                        style={{ background: d ? heat.ramp(d.lvl) : "transparent" }}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-2.5 flex items-center justify-end gap-1.5 font-mono text-[9px] text-faint">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((l) => (
                  <span
                    key={l}
                    className="rounded-[2px]"
                    style={{
                      width: 9,
                      height: 9,
                      background: heat.ramp(l),
                    }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </Reveal>

          {/* cache */}
          <Reveal
            as="div"
            delayIndex={3}
            className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5.5 md:col-span-7"
          >
            <h3 className="mb-1 text-[17px] font-semibold">Cache changes everything</h3>
            <div
              className="font-mono font-semibold leading-none tracking-[-0.03em] text-accent"
              style={{ fontSize: "clamp(56px,9vw,84px)" }}
            >
              {pct(week.cache, week.totalTokens)}
              <span className="ml-0.5 text-[0.42em] text-dim">% cached</span>
            </div>
            <div className="mt-4.5 font-mono text-[11px] leading-[1.5] text-faint">
              Heavily cached days show huge token counts but a modest bill. Cache hits are billed
              at their own cheaper rate, not as fresh input.
            </div>
          </Reveal>

          {/* tokens by model */}
          <Reveal
            as="div"
            delayIndex={4}
            className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5.5 md:col-span-5"
          >
            <h3 className="mb-1 text-[17px] font-semibold">Tokens by model</h3>
            <div className="mb-4 text-[13.5px] leading-[1.5] text-dim">
              Share of total tokens this week.
            </div>
            <div>
              {week.models.map((m) => (
                <div key={m.name} className="flex items-center gap-2.5 py-1">
                  <span
                    className="h-[7px] w-[7px] flex-none rounded-[2px]"
                    style={{ background: m.color }}
                  />
                  <span className="w-32 truncate text-[11.5px] font-medium text-text">
                    {m.name}
                  </span>
                  <span className="h-[5px] flex-1 overflow-hidden rounded bg-grid-line">
                    <i
                      className="block h-full rounded"
                      style={{
                        width: `${((m.tokens / maxModel) * 100).toFixed(1)}%`,
                        background: m.color,
                      }}
                    />
                  </span>
                  <span className="w-[42px] text-right font-mono text-[10.5px] font-medium text-dim">
                    {pct(m.tokens, totalWk)}%
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ToolBars({ items }: { items: { name: string; count: number }[] }) {
  if (items.length === 0) {
    return <div className="text-[11.5px] text-faint">No calls this week.</div>;
  }
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div>
      {items.map((it) => (
        <div key={it.name} className="flex items-center gap-2.5 py-1">
          <span className="flex-none text-[11.5px] font-medium text-text">{it.name}</span>
          <span className="h-[5px] flex-1 overflow-hidden rounded bg-grid-line">
            <i
              className="block h-full rounded bg-accent"
              style={{ width: `${(it.count / max) * 100}%` }}
            />
          </span>
          <span className="w-[42px] text-right font-mono text-[10.5px] font-semibold text-text">
            {fmtInt(it.count)}
          </span>
        </div>
      ))}
    </div>
  );
}
