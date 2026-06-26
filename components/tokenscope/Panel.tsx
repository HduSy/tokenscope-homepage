"use client";

// Ported from the Tokenscope app's src/App.tsx — only the visual Panel and
// its small helpers. The Tauri orchestration in App.tsx is replaced by the
// homepage's static snapshot import.

import { useLayoutEffect, useRef, useState } from "react";
import {
  Dashboard,
  PeriodReport,
  ModelStat,
  Theme,
  TH,
  fmtInt,
  fmtTokens,
  pct,
} from "@/lib/tokenscope-data";
import {
  TokenGlyph,
  Segmented,
  BarChart,
  Sparkline,
  CostDonut,
  BarList,
  Heatmap,
  ModelRow,
  MiniStat,
} from "./charts";

// Count up to `target`. Restarts from 0 whenever `resetKey` changes (popover
// open / period switch); on a live value change it eases from the current
// value to the new one instead of snapping back to 0.
function useCountUp(target: number, resetKey: string, active: boolean, duration = 850): number {
  const [val, setVal] = useState(0);
  const valRef = useRef(0);
  const keyRef = useRef<string | null>(null);
  const rafRef = useRef(0);
  useLayoutEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const set = (v: number) => { valRef.current = v; setVal(v); };
    if (!active) { keyRef.current = null; set(0); return; }
    const reset = keyRef.current !== resetKey;
    keyRef.current = resetKey;
    let from = valRef.current;
    if (reset) { from = 0; set(0); }
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      set(from + (target - from) * ease(p));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [resetKey, target, active, duration]);
  return val;
}

function Delta({ v, theme }: { v: number; theme: Theme }) {
  const up = v >= 0;
  const col = up ? "#e0795f" : theme.accent;
  return (
    <span style={{ font: `600 10px ${theme.mono}`, color: col, display: "inline-flex", alignItems: "center", gap: 2,
      padding: "1.5px 5px", borderRadius: 5, background: up ? "rgba(224,121,95,0.16)" : "rgba(39,176,110,0.14)" }}>
      {up ? "▲" : "▼"}{Math.abs(Math.round(v))}%
    </span>
  );
}

// Round each value's share to 1 decimal (%) via largest-remainder apportionment,
// so the displayed percentages sum to exactly 100.0% (plain rounding wouldn't).
function sharePcts(values: number[]): number[] {
  const total = values.reduce((s, v) => s + v, 0);
  if (total <= 0) return values.map(() => 0);
  const UNITS = 1000;
  const raw = values.map((v) => (v / total) * UNITS);
  const units = raw.map(Math.floor);
  const left = Math.round(UNITS - units.reduce((s, f) => s + f, 0));
  raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac)
    .slice(0, left)
    .forEach(({ i }) => (units[i] += 1));
  return units.map((u) => u / 10);
}

function SplitLegend({ t, inputM, outputM, cachedPct }:
  { t: Theme; inputM: number; outputM: number; cachedPct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const key = `${inputM}|${outputM}|${cachedPct}`;
  useLayoutEffect(() => { setCompact(false); }, [key]);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && !compact && el.scrollWidth > el.clientWidth + 1) setCompact(true);
  });
  return (
    <div ref={ref} style={{
      display: "flex", alignItems: "center", gap: 14,
      font: `500 10px ${t.mono}`, color: t.dim, marginBottom: 14, whiteSpace: "nowrap", overflow: "hidden",
    }}>
      <span><span style={{ color: t.accent }}>●</span> {compact ? "In" : "Input"} {inputM.toFixed(2)}M</span>
      <span><span style={{ color: t.accentSoft }}>●</span> {compact ? "Out" : "Output"} {outputM.toFixed(2)}M</span>
      <span style={{ color: t.faint }}>{cachedPct}% cached</span>
    </div>
  );
}

const SectionRule = ({ t, m = "12px 0 10px" }: { t: Theme; m?: string }) => (
  <div style={{ height: 1, background: t.gridLine, margin: m }} />
);
const Label = ({ t, children }: { t: Theme; children: React.ReactNode }) => (
  <span style={{ font: `600 10px ${t.ui}`, color: t.dim, letterSpacing: ".05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>
);

function PanelThemeToggle({ dark, theme, onToggle }: { dark: boolean; theme: Theme; onToggle: () => void }) {
  const t = theme;
  return (
    <button onClick={onToggle} title={dark ? "Switch to light" : "Switch to dark"} aria-label="toggle theme" style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 26, height: 26, borderRadius: 7, cursor: "pointer", padding: 0,
      background: t.segBg, border: `1px solid ${t.segBorder}`, color: t.dim,
    }}>
      {dark ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill={t.dim} stroke="none">
          <path d="M21 12.9A9 9 0 1 1 11.1 3a7.2 7.2 0 0 0 9.9 9.9z" />
        </svg>
      )}
    </button>
  );
}

export function Panel({ dash, dark, onToggleTheme, openGen, active, compact = false }:
  { dash: Dashboard; dark: boolean; onToggleTheme: () => void; openGen: number; active: boolean; compact?: boolean }) {
  const t = TH[dark ? "dark" : "light"];
  const [period, setPeriod] = useState<"Day" | "Week" | "Month">("Week");
  const P: PeriodReport = period === "Day" ? dash.day : period === "Month" ? dash.month : dash.week;
  const M = P.metrics;
  const animTotal = useCountUp(M.totalTokens, `${period}:${openGen}`, active);
  const models = P.models;
  const tokenModels = models.filter(
    (m) => Math.round((m.tokens / (M.totalTokens || 1)) * 1000) / 10 >= 0.1
  );
  const costModels = models.filter((m) => m.cost > 0);
  const unpricedModels = models.filter((m) => !m.priced && m.tokens > 0);
  const maxM = Math.max(...tokenModels.map((m) => m.tokens), 1e-9);
  const tokenShares = sharePcts(tokenModels.map((m) => m.tokens));
  const trendSub = { Day: "today 24h", Week: "this week", Month: "this month" }[period];

  return (
    // Embedded version: the outer 100vh scroller from the app is replaced
    // with a fixed-height card sized to fit the hero column. The inner card
    // markup is otherwise identical. `compact` truncates the panel after
    // "Tokens by model" — matches the original landing.html hero scope.
    <div style={{ width: "100%", maxWidth: 384, justifySelf: "center", fontFamily: t.ui }}>
      <div className="om-scroll" style={{
        width: "100%",
        // overflow is the trigger that lets border-radius clip the sticky
        // header's top corners and the last child's bottom corners. Non-compact
        // keeps overflow-y auto so the panel matches the app exactly; compact
        // doesn't need scrolling but still needs the clipping → overflow:hidden.
        ...(compact ? { overflow: "hidden" as const } : { maxHeight: 640, overflowY: "auto" as const }),
        borderRadius: 12, background: dark ? "#1f2226" : "#ffffff",
        border: `1px solid ${dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
        padding: 0, color: t.text,
        boxShadow: dark
          ? "0 1px 0 rgba(255,255,255,0.04) inset, 0 40px 90px -36px rgba(0,0,0,0.8)"
          : "0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 70px -34px rgba(15,22,18,0.26)",
      }}>
        <div style={{
          position: "sticky", top: 0, zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "15px 15px 12px",
          background: dark ? "#1f2226" : "#ffffff",
          borderBottom: `1px solid ${t.gridLine}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TokenGlyph color={t.accent} size={16} />
            <span style={{ font: `600 13px ${t.ui}`, color: t.text, letterSpacing: ".01em" }}>Tokenscope</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Segmented value={period} theme={t} onSelect={(v) => setPeriod(v as "Day" | "Week" | "Month")} />
            {/* Hide the panel-internal theme toggle in compact mode — the page
                nav already has one, and the original landing.html panel didn't
                include this control. */}
            {!compact && <PanelThemeToggle dark={dark} theme={t} onToggle={onToggleTheme} />}
          </div>
        </div>
        <div style={{ padding: "14px 15px 15px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ font: `500 10px ${t.ui}`, color: t.dim, letterSpacing: ".04em", textTransform: "uppercase" }}>Total tokens</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 3 }}>
                <span style={{ font: `600 30px ${t.mono}`, color: t.text, letterSpacing: "-.01em" }}>{animTotal.toFixed(2)}<span style={{ font: `500 15px ${t.mono}`, color: t.dim, marginLeft: 2 }}>M</span></span>
                {Math.round(M.deltaTokens) !== 0 && <Delta v={M.deltaTokens} theme={t} />}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ font: `500 10px ${t.ui}`, color: t.dim }}>Est. cost</div>
              <div style={{ font: `600 18px ${t.mono}`, color: t.accent, marginTop: 2 }}>${M.cost.toFixed(2)}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 0, height: 7, borderRadius: 4, overflow: "hidden", marginBottom: 5, background: t.gridLine }}>
            {M.totalTokens > 0 && <>
              <div style={{ flexGrow: Math.max(M.inputTokens + M.cacheTokens, 1e-6), flexBasis: 0, minWidth: 4, background: t.accent }} />
              <div style={{ flexGrow: Math.max(M.outputTokens, 1e-6), flexBasis: 0, minWidth: 4, background: t.accentSoft }} />
            </>}
          </div>
          <SplitLegend t={t} inputM={M.inputTokens + M.cacheTokens} outputM={M.outputTokens} cachedPct={pct(M.cacheTokens, M.totalTokens)} />
          <BarChart data={P.series} theme={t} height={84} />
          <SectionRule t={t} m="14px 0 10px" />
          <div style={{ marginBottom: 4 }}><Label t={t}>Tokens by model</Label></div>
          {tokenModels.length === 0 && <div style={{ font: `500 10.5px ${t.mono}`, color: t.faint, padding: "4px 0" }}>No usage in this period</div>}
          {tokenModels.map((m, i) => <ModelRow key={i} m={m} max={maxM} theme={t} share={tokenShares[i]} />)}
          {!compact && <>
            <SectionRule t={t} m="10px 0 10px" />
            <div style={{ marginBottom: 8 }}><Label t={t}>Cost by model</Label></div>
            {costModels.length > 0
              ? <CostDonut models={costModels} theme={t} size={100} thickness={15} />
              : <div style={{ font: `500 10.5px ${t.mono}`, color: t.faint }}>—</div>}
            {unpricedModels.length > 0 && (
              <div style={{ marginTop: 9, font: `500 9.5px/1.5 ${t.mono}`, color: t.faint }}>
                {unpricedModels.length} model{unpricedModels.length > 1 ? "s" : ""} without pricing data (cost not counted):{" "}
                <span style={{ color: t.dim }}>{unpricedModels.map((m) => m.name).join(", ")}</span>
              </div>
            )}
            <SectionRule t={t} m="12px 0 12px" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <MiniStat label="Requests" value={fmtInt(M.requests)} sub={`${M.sessions} sessions`} theme={t}>
                <Sparkline values={P.reqTrend.length ? P.reqTrend : [0, 0]} theme={t} width={52} height={20} accent={t.accent} />
              </MiniStat>
              <MiniStat label="Cost trend" value={`$${M.cost.toFixed(2)}`} sub={trendSub} theme={t} accent={t.accent}>
                <Sparkline values={P.costTrend.length ? P.costTrend : [0, 0]} theme={t} width={52} height={20} accent={t.accent} />
              </MiniStat>
            </div>
            {M.servers > 0 && (
              <>
                <SectionRule t={t} />
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 7 }}>
                  <Label t={t}>MCP calls</Label>
                  <span style={{ font: `500 10px ${t.mono}`, color: t.faint, whiteSpace: "nowrap" }}><span style={{ color: t.text, fontWeight: 600 }}>{fmtInt(M.mcpCalls)}</span> · {M.servers} servers</span>
                </div>
                {P.mcp.length > 0
                  ? <BarList key={period} items={P.mcp} theme={t} accent={t.accent} />
                  : <div style={{ font: `500 10px ${t.mono}`, color: t.faint, padding: "2px 0" }}>No MCP calls in this period</div>}
              </>
            )}
            {M.skills > 0 && (
              <>
                <SectionRule t={t} />
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 7 }}>
                  <Label t={t}>Skill calls</Label>
                  <span style={{ font: `500 10px ${t.mono}`, color: t.faint, whiteSpace: "nowrap" }}><span style={{ color: t.text, fontWeight: 600 }}>{fmtInt(M.skillCalls)}</span> · {M.skills} skills</span>
                </div>
                {P.skills.length > 0
                  ? <BarList key={period} items={P.skills} theme={t} accent={t.accent} />
                  : <div style={{ font: `500 10px ${t.mono}`, color: t.faint, padding: "2px 0" }}>No skill calls in this period</div>}
              </>
            )}
            <SectionRule t={t} />
            <div style={{ marginBottom: 9 }}><Label t={t}>Daily activity</Label></div>
            <Heatmap days={dash.heatmap} theme={t} accent={t.accent} />
            <div style={{ marginTop: 12, font: `500 8.5px ${t.mono}`, color: t.faint, textAlign: "center" }}>
              Est. cost via models.dev / LiteLLM · estimate
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}
