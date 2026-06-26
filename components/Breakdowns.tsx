"use client";

// The Breakdowns bento renders each tile with the real Tokenscope chart
// components from components/tokenscope/charts.tsx — no homemade re-skin.
// Data comes from the same DEMO_DASHBOARD snapshot the hero panel uses, so
// the numbers in the bento always match the panel.

import {
  BarList,
  CostDonut,
  Heatmap,
  MiniStat,
  Sparkline,
} from "./tokenscope/charts";
import { DEMO_DASHBOARD, fmtInt, pct, TH, type Theme } from "@/lib/tokenscope-data";
import { Reveal } from "./Reveal";
import { useTheme } from "./useTheme";

// Panel-style uppercase mini label, inline-styled so it matches the rest of
// the embedded chart typography (which is all inline-styled too).
function PanelLabel({ t, children }: { t: Theme; children: React.ReactNode }) {
  return (
    <span
      style={{
        font: `600 10px ${t.ui}`,
        color: t.dim,
        letterSpacing: ".05em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

// "<bold N> · <faint N installed>" right-side total used as the panel's
// header for MCP / Skill sections.
function ListTotal({ t, calls, count, unit }: { t: Theme; calls: number; count: number; unit: string }) {
  return (
    <span
      style={{
        font: `500 10px ${t.mono}`,
        color: t.faint,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: t.text, fontWeight: 600 }}>{fmtInt(calls)}</span> · {count} {unit}
    </span>
  );
}

export function Breakdowns() {
  const { dark } = useTheme();
  const t = TH[dark ? "dark" : "light"];
  const week = DEMO_DASHBOARD.week;
  const M = week.metrics;
  const costModels = week.models.filter((m) => m.cost > 0);
  const cacheShare = pct(M.cacheTokens, M.totalTokens);

  return (
    <section id="breakdowns" className="pb-16 sm:pb-24">
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
          {/* Cost by model — donut + Requests/Cost-trend mini-stats. */}
          <Reveal
            as="div"
            delayIndex={0}
            className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5.5 md:col-span-5"
          >
            <h3 className="mb-1 text-[17px] font-semibold">Cost by model</h3>
            <div className="mb-5 text-[13.5px] leading-[1.5] text-dim">
              Where the dollars actually go, per period.
            </div>
            <CostDonut models={costModels} theme={t} size={132} thickness={18} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 18,
              }}
            >
              <MiniStat
                label="Requests"
                value={fmtInt(M.requests)}
                sub={`${M.sessions} sessions`}
                theme={t}
              >
                <Sparkline values={week.reqTrend} theme={t} width={52} height={20} accent={t.accent} />
              </MiniStat>
              <MiniStat
                label="Cost trend"
                value={`$${M.cost.toFixed(2)}`}
                sub="this week"
                theme={t}
                accent={t.accent}
              >
                <Sparkline values={week.costTrend} theme={t} width={52} height={20} accent={t.accent} />
              </MiniStat>
            </div>
          </Reveal>

          {/* MCP + Skill — two BarLists with X · N totals in their headers. */}
          <Reveal
            as="div"
            delayIndex={1}
            className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5.5 md:col-span-7"
          >
            <h3 className="mb-1 text-[17px] font-semibold">Tools you actually use</h3>
            <div className="mb-5 text-[13.5px] leading-[1.5] text-dim">
              Only the MCP servers and Skills you installed yourself.
            </div>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <PanelLabel t={t}>MCP calls</PanelLabel>
                  <ListTotal t={t} calls={M.mcpCalls} count={M.servers} unit="servers" />
                </div>
                {week.mcp.length > 0 ? (
                  <BarList items={week.mcp} theme={t} accent={t.accent} />
                ) : (
                  <div style={{ font: `500 11px ${t.mono}`, color: t.faint, padding: "2px 0" }}>
                    No MCP calls this week
                  </div>
                )}
                <div className="mt-3.5 font-mono text-[11px] leading-[1.5] text-faint">
                  Anthropic&apos;s bundled MCP and every built-in tool are filtered out.
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <PanelLabel t={t}>Skill calls</PanelLabel>
                  <ListTotal t={t} calls={M.skillCalls} count={M.skills} unit="skills" />
                </div>
                {week.skills.length > 0 ? (
                  <BarList items={week.skills} theme={t} accent={t.accent} />
                ) : (
                  <div style={{ font: `500 11px ${t.mono}`, color: t.faint, padding: "2px 0" }}>
                    No skill calls this week
                  </div>
                )}
                <div className="mt-3.5 font-mono text-[11px] leading-[1.5] text-faint">
                  Read from your own{" "}
                  <code className="font-mono text-[11px] text-accent">
                    ~/.claude/skills/
                  </code>{" "}
                  directory.
                </div>
              </div>
            </div>
          </Reveal>

          {/* A year of activity — heatmap takes 7 cols of the second row. */}
          <Reveal
            as="div"
            delayIndex={2}
            className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5.5 md:col-span-7"
          >
            <h3 className="mb-1 text-[17px] font-semibold">A year of activity</h3>
            <div className="mb-5 text-[13.5px] leading-[1.5] text-dim">
              Daily token volume across the last twelve months.
            </div>
            <Heatmap days={DEMO_DASHBOARD.heatmap} theme={t} accent={t.accent} />
          </Reveal>

          {/* Cache % — sits next to the heatmap on the same row (5 cols). */}
          <Reveal
            as="div"
            delayIndex={3}
            className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5.5 md:col-span-5"
          >
            <h3 className="mb-1 text-[17px] font-semibold">Cache changes everything</h3>
            <div
              className="font-mono font-semibold leading-none tracking-[-0.03em] text-accent"
              style={{ fontSize: "clamp(56px,9vw,84px)" }}
            >
              {cacheShare}
              <span className="ml-0.5 text-[0.42em] text-dim">% cached</span>
            </div>
            <div className="mt-4.5 font-mono text-[11px] leading-[1.5] text-faint">
              Heavily cached days show huge token counts but a modest bill. Cache hits are billed
              at their own cheaper rate, not as fresh input.
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
