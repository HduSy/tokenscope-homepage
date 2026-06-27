"use client";

// The Breakdowns bento renders each tile with the real Tokenscope chart
// components from components/tokenscope/charts.tsx — no homemade re-skin.
// Data comes from the same dashboard snapshot the hero panel uses, so the
// numbers in the bento always match the panel.

import {
  BarList,
  CostDonut,
  Heatmap,
  MiniStat,
  Sparkline,
} from "./tokenscope/charts";
import { buildDemoDashboard, fmtInt, TH, type Theme } from "@/lib/tokenscope-data";
import { Reveal } from "./Reveal";
import { useCountUp } from "./useCountUp";
import { useInView } from "./useInView";
import { useTheme } from "./useTheme";
import { getDict, type Locale } from "@/lib/i18n";

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

export function Breakdowns({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const labels = dict.breakdowns;
  const panelLabels = dict.panel;
  const { dark } = useTheme();
  const t = TH[dark ? "dark" : "light"];
  const dash = buildDemoDashboard(locale);
  const week = dash.week;
  const M = week.metrics;
  const costModels = week.models.filter((m) => m.cost > 0);
  // Count the cache % up from 0 when its tile scrolls into view.
  const cachePctNum = Math.round((M.cacheTokens / M.totalTokens) * 100);
  const { ref: cacheRef, inView: cacheInView } = useInView<HTMLDivElement>();
  const cacheCount = useCountUp(cachePctNum, cacheInView);

  return (
    <section id="breakdowns" className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal as="div" className="mb-11 max-w-[640px]">
          <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)" }}>
            {labels.h2}
          </h2>
          <p className="mt-3.5 text-[17px] leading-[1.55] text-dim">
            {labels.intro}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Cost by model — donut + Requests/Cost-trend mini-stats. */}
          <Reveal
            as="div"
            delayIndex={0}
            className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5.5 md:col-span-5"
          >
            <h3 className="mb-1 text-[17px] font-semibold">{labels.costByModel.title}</h3>
            <div className="mb-5 text-[13.5px] leading-[1.5] text-dim">
              {labels.costByModel.sub}
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
                label={labels.requests}
                value={fmtInt(M.requests)}
                sub={`${M.sessions} ${labels.sessionsSuffix}`}
                theme={t}
              >
                <Sparkline values={week.reqTrend} theme={t} width={52} height={20} accent={t.accent} />
              </MiniStat>
              <MiniStat
                label={labels.costTrend}
                value={`$${M.cost.toFixed(2)}`}
                sub={labels.thisWeek}
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
            <h3 className="mb-1 text-[17px] font-semibold">{labels.tools.title}</h3>
            <div className="mb-5 text-[13.5px] leading-[1.5] text-dim">
              {labels.tools.sub}
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
                  <PanelLabel t={t}>{labels.mcpCalls}</PanelLabel>
                  <ListTotal t={t} calls={M.mcpCalls} count={M.servers} unit={labels.servers} />
                </div>
                {week.mcp.length > 0 ? (
                  <BarList items={week.mcp} theme={t} accent={t.accent} animate labels={panelLabels} />
                ) : (
                  <div style={{ font: `500 11px ${t.mono}`, color: t.faint, padding: "2px 0" }}>
                    {labels.emptyMcp}
                  </div>
                )}
                <div className="mt-3.5 font-mono text-[11px] leading-[1.5] text-faint">
                  {labels.mcpFootnote}
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
                  <PanelLabel t={t}>{labels.skillCalls}</PanelLabel>
                  <ListTotal t={t} calls={M.skillCalls} count={M.skills} unit={labels.skills} />
                </div>
                {week.skills.length > 0 ? (
                  <BarList items={week.skills} theme={t} accent={t.accent} animate labels={panelLabels} />
                ) : (
                  <div style={{ font: `500 11px ${t.mono}`, color: t.faint, padding: "2px 0" }}>
                    {labels.emptySkills}
                  </div>
                )}
                <div className="mt-3.5 font-mono text-[11px] leading-[1.5] text-faint">
                  {labels.skillFootnotePrefix}{" "}
                  <code className="font-mono text-[11px] text-accent">
                    {labels.skillFootnotePath}
                  </code>{" "}
                  {labels.skillFootnoteSuffix}
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
            <h3 className="mb-1 text-[17px] font-semibold">{labels.year.title}</h3>
            <div className="mb-5 text-[13.5px] leading-[1.5] text-dim">
              {labels.year.sub}
            </div>
            <Heatmap days={dash.heatmap} theme={t} accent={t.accent} animate labels={panelLabels} months={dict.dashboard.months} />
          </Reveal>

          {/* Cache % — sits next to the heatmap on the same row (5 cols). */}
          <Reveal
            as="div"
            delayIndex={3}
            className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5.5 md:col-span-5"
          >
            <div ref={cacheRef}>
              <h3 className="mb-1 text-[17px] font-semibold">{labels.cache.title}</h3>
              <div
                className="font-mono font-semibold leading-none tracking-[-0.03em] text-accent"
                style={{ fontSize: "clamp(56px,9vw,84px)" }}
              >
                {Math.round(cacheCount)}
                <span className="ml-0.5 text-[0.42em] text-dim">{labels.cache.pctSuffix}</span>
              </div>
              <div className="mt-4.5 font-mono text-[11px] leading-[1.5] text-faint">
                {labels.cache.footnote}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
