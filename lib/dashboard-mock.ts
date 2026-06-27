// Synthesised dashboard built from the design-canvas mock at
// /Users/rayonreal/DEV/Claude-Design/tokens-analysis-for-mac/data.jsx.
// Design uses a 2-bucket (input + output) token model; Tokenscope's app
// uses 3-bucket (input + cache + output). We re-interpret 85% of design's
// "input" as the prompt-cache bucket and keep 15% as fresh input. Total
// tokens per period are unchanged; the inner split shifts to make the
// "% cached" marketing message land.
//
// `buildDemoDashboard(locale)` returns a fresh, locale-aware copy: weekday
// short/long labels, the "Day N" tooltip prefix, and the "Local" vendor name
// for the bundled Llama row are all swapped to the matching dict entries.
// Brand/model names, MCP / Skill identifiers, and all numeric values stay
// locale-invariant.

import type {
  Dashboard,
  HeatDay,
  Metrics,
  ModelStat,
  NamedCount,
  PeriodReport,
  SeriesPoint,
} from "./tokenscope-data";
import { getDict, type Locale } from "./i18n";

// Of design's "input" field, how much becomes cache vs real input.
const CACHE_SHARE = 0.85;
const INPUT_SHARE = 1 - CACHE_SHARE;

// ── Models (week baselines) ─────────────────────────────────────
// Same five entries as design's MODELS const. Cost==0 for the local Llama
// is intentional — it's a free model, not an unpriced one. Vendor strings
// for the four named providers stay English; "Local" is locale-aware (set
// per-call from the dict).
type DesignModel = Omit<ModelStat, "priced" | "vendor"> & { vendorKey: "Anthropic" | "OpenAI" | "Google" | "Local" };
const DESIGN_MODELS: DesignModel[] = [
  { name: "Claude Sonnet 4.5", vendorKey: "Anthropic", tokens: 5.82, cost: 18.4, color: "#1f9d63" },
  { name: "Claude Opus 4.1", vendorKey: "Anthropic", tokens: 3.07, cost: 19.1, color: "#34c27e" },
  { name: "GPT-5", vendorKey: "OpenAI", tokens: 1.94, cost: 6.2, color: "#6ad0a0" },
  { name: "Gemini 2.5 Pro", vendorKey: "Google", tokens: 0.91, cost: 2.4, color: "#a7e3c5" },
  { name: "Llama 3.3 70B", vendorKey: "Local", tokens: 0.66, cost: 0.0, color: "#4b5a52" },
];
const WEEK_TOKENS = DESIGN_MODELS.reduce((s, m) => s + m.tokens, 0); // 12.40
const WEEK_COST = DESIGN_MODELS.reduce((s, m) => s + m.cost, 0); // 46.10

// Scale the week-baseline distribution to a period's total tokens / cost.
function scaleModels(totalTokens: number, totalCost: number, localVendor: string): ModelStat[] {
  const rt = totalTokens / WEEK_TOKENS;
  const rc = totalCost / WEEK_COST;
  return DESIGN_MODELS.map((m) => ({
    name: m.name,
    vendor: m.vendorKey === "Local" ? localVendor : m.vendorKey,
    tokens: +(m.tokens * rt).toFixed(2),
    cost: +(m.cost * rc).toFixed(2),
    color: m.color,
    priced: true, // every model in this mock has known pricing
  }));
}

// ── Per-period raw series (input/output only; cache derived below) ─
type RawPt = { labelIdx: number; fullIdx: number; input: number; output: number };

// Week: 7 weekday rows. labelIdx / fullIdx point at the dict arrays so the
// strings come from getDict(locale).dashboard at build-time.
const WEEK_RAW: RawPt[] = [
  { labelIdx: 0, fullIdx: 0, input: 0.92, output: 0.48 },
  { labelIdx: 1, fullIdx: 1, input: 1.36, output: 0.74 },
  { labelIdx: 2, fullIdx: 2, input: 1.18, output: 0.62 },
  { labelIdx: 3, fullIdx: 3, input: 1.71, output: 0.89 },
  { labelIdx: 4, fullIdx: 4, input: 1.52, output: 0.78 },
  { labelIdx: 5, fullIdx: 5, input: 0.58, output: 0.31 },
  { labelIdx: 6, fullIdx: 6, input: 0.86, output: 0.44 },
];

// Day: 24 hourly buckets — low overnight, peak afternoon. Same shape as
// design's IIFE. Labels are "00", "06", "12", "18" — not localized (hours
// are universal); tooltip "HH:00" likewise stays numeric.
const DAY_SHAPE = [
  0.05, 0.03, 0.02, 0.02, 0.03, 0.06, 0.12, 0.28,
  0.46, 0.62, 0.74, 0.81, 0.69, 0.58, 0.83, 0.92,
  0.78, 0.64, 0.49, 0.38, 0.31, 0.22, 0.14, 0.08,
];

// Month: 30 daily buckets, weekly rhythm (weekends lower).
type MonthPt = { day: number; input: number; output: number };
const MONTH_RAW: MonthPt[] = Array.from({ length: 30 }, (_, i) => {
  const d = i + 1;
  const dow = (d - 1) % 7;
  const weekend = dow === 5 || dow === 6;
  const base = weekend ? 0.42 : 0.92;
  const wobble = 0.78 + 0.44 * Math.abs(Math.sin(d * 1.7));
  const v = base * wobble;
  return {
    day: d,
    input: +(v * 0.62).toFixed(3),
    output: +(v * 0.32).toFixed(3),
  };
});

// ── MCP / Skill base lists (week totals); scale by period.mcpCalls etc. ─
// Top 5 only. Each list sums to 10 calls / week — a realistic Claude Code
// hobbyist load. Numbers scale up for Month / down for Day via scaleCalls.
//
// MCP server names match the identifiers from each project's official MCP
// server, as they'd appear in a user's claude config:
//   github         — github.com/github/github-mcp-server
//   playwright     — Microsoft's @playwright/mcp
//   figma-dev-mode — Figma's Dev Mode MCP Server
//   context7       — Upstash's @upstash/context7-mcp
//   firecrawl      — Mendable's firecrawl-mcp-server
const MCP_BASE: NamedCount[] = [
  { name: "github", count: 3 },
  { name: "playwright", count: 2 },
  { name: "figma-dev-mode", count: 2 },
  { name: "context7", count: 2 },
  { name: "firecrawl", count: 1 },
];
const SKILL_BASE: NamedCount[] = [
  { name: "find-skills", count: 4 },
  { name: "skill-creator", count: 3 },
  { name: "design-taste-frontend", count: 2 },
  { name: "seo-audit", count: 2 },
  { name: "vercel-react-best-practices", count: 1 },
];

function scaleCalls(list: NamedCount[], periodTotal: number): NamedCount[] {
  const base = list.reduce((s, x) => s + x.count, 0);
  if (base === 0 || periodTotal === 0) return [];
  const r = periodTotal / base;
  return list
    .map((x) => ({ name: x.name, count: Math.round(x.count * r) }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);
}

// ── Period metrics (design values) — split inputTokens into cache+input.
type DesignMetrics = {
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  mcpCalls: number;
  skillCalls: number;
  requests: number;
  sessions: number;
  /** Fractional delta from design (e.g. 0.14 = +14%). */
  deltaTokens: number;
  deltaCost: number;
  servers: number;
  skills: number;
};

function splitMetrics(m: DesignMetrics): Metrics {
  return {
    totalTokens: m.totalTokens,
    inputTokens: +(m.inputTokens * INPUT_SHARE).toFixed(3),
    cacheTokens: +(m.inputTokens * CACHE_SHARE).toFixed(3),
    outputTokens: m.outputTokens,
    cost: m.cost,
    mcpCalls: m.mcpCalls,
    skillCalls: m.skillCalls,
    requests: m.requests,
    sessions: m.sessions,
    // Panel's <Delta> renders Math.abs(Math.round(v)) + "%" → expects an
    // integer-ish percentage, not a 0..1 fraction. Convert.
    deltaTokens: +(m.deltaTokens * 100).toFixed(0),
    deltaCost: +(m.deltaCost * 100).toFixed(0),
    servers: m.servers,
    skills: m.skills,
  };
}

const DAY_DM: DesignMetrics = {
  totalTokens: 1.94, inputTokens: 1.27, outputTokens: 0.67, cost: 7.2,
  // Realistic Claude Code daily activity: a couple of tool invocations and
  // a couple of skill calls. Skill totals match the SKILL_BASE shape, MCP
  // totals match MCP_BASE — they're intentionally different distributions
  // so the two BarLists don't look like copies of each other.
  mcpCalls: 2, skillCalls: 3, requests: 441, sessions: 23,
  deltaTokens: -0.18, deltaCost: -0.12, servers: 5, skills: 5,
};
const WEEK_DM: DesignMetrics = {
  totalTokens: 12.4, inputTokens: 8.13, outputTokens: 4.27, cost: 46.1,
  // Matches the sum of MCP_BASE (10) / SKILL_BASE (12) so the list bars
  // and the header total agree.
  mcpCalls: 10, skillCalls: 12, requests: 2847, sessions: 143,
  deltaTokens: 0.14, deltaCost: -0.06, servers: 5, skills: 5,
};
const MONTH_DM: DesignMetrics = {
  totalTokens: 27.5, inputTokens: 18.1, outputTokens: 9.4, cost: 101.3,
  // ~4× the weekly baseline.
  mcpCalls: 40, skillCalls: 48, requests: 11680, sessions: 602,
  deltaTokens: 0.11, deltaCost: 0.09, servers: 5, skills: 5,
};

// Trends (sparkline points). Design's numbers, unchanged.
const TRENDS = {
  Day: { req: [12, 41, 58, 92, 74, 61, 38, 19], cost: [0.4, 1.1, 0.9, 1.6, 1.3, 0.8, 0.5, 0.6] },
  Week: { req: [288, 412, 360, 503, 451, 188, 645], cost: [5.2, 7.8, 6.4, 9.1, 8.3, 3.1, 6.2] },
  Month: { req: [1880, 2410, 2050, 3340], cost: [22.4, 28.1, 21.6, 29.2] },
};

// ── Half-year heatmap, same algorithm as design's YEAR_DAILY. Anchored to
// a hardcoded date so the result is identical on server and client (no
// hydration mismatch) and stable across builds.
function buildHeatmap(): HeatDay[] {
  const today = new Date(2026, 5, 5); // June 5, 2026 (local)
  const start = new Date(today);
  start.setDate(start.getDate() - 25 * 7 - today.getDay());
  const raw: { date: string; tokens: number }[] = [];
  for (let i = 0; ; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d.getTime() > today.getTime()) break;
    const dow = d.getDay();
    const weekend = dow === 0 || dow === 6;
    // Seasonal half-year sine + deterministic per-index "noise" + weekend dip.
    const seasonal = 0.55 + 0.45 * Math.sin((i / 182) * Math.PI * 2 + 1);
    const noise = Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);
    let v = (weekend ? 0.35 : 1) * seasonal * (0.4 + noise);
    if (noise < 0.12) v = 0; // idle days
    const tokens = +(v * 2.4).toFixed(2);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    raw.push({ date: `${y}-${m}-${day}`, tokens });
  }
  // Quantile-ish thresholds → discrete levels 0..4 for the cell colour ramp.
  const maxV = Math.max(...raw.map((x) => x.tokens), 1e-9);
  return raw.map((x) => {
    const f = x.tokens / maxV;
    const level = x.tokens === 0 ? 0 : f < 0.25 ? 1 : f < 0.5 ? 2 : f < 0.75 ? 3 : 4;
    return { date: x.date, tokens: x.tokens, level };
  });
}

function buildPeriod(
  series: SeriesPoint[],
  dm: DesignMetrics,
  trends: { req: number[]; cost: number[] },
  localVendor: string,
): PeriodReport {
  return {
    metrics: splitMetrics(dm),
    series,
    models: scaleModels(dm.totalTokens, dm.cost, localVendor),
    mcp: scaleCalls(MCP_BASE, dm.mcpCalls),
    skills: scaleCalls(SKILL_BASE, dm.skillCalls),
    reqTrend: trends.req,
    costTrend: trends.cost,
  };
}

// Apply the cache split + locale labels to a raw series.
function splitWeek(raw: RawPt[], shortLabels: string[], longLabels: string[]): SeriesPoint[] {
  return raw.map((r) => ({
    label: shortLabels[r.labelIdx],
    full: longLabels[r.fullIdx],
    input: +(r.input * INPUT_SHARE).toFixed(4),
    cache: +(r.input * CACHE_SHARE).toFixed(4),
    output: r.output,
  }));
}
function splitDay(): SeriesPoint[] {
  return DAY_SHAPE.map((v, h) => ({
    label: h % 6 === 0 ? String(h).padStart(2, "0") : "",
    full: `${String(h).padStart(2, "0")}:00`,
    input: +(v * 0.11 * INPUT_SHARE).toFixed(4),
    cache: +(v * 0.11 * CACHE_SHARE).toFixed(4),
    output: +(v * 0.058).toFixed(3),
  }));
}
function splitMonth(dayPrefix: string): SeriesPoint[] {
  return MONTH_RAW.map((r) => ({
    label: r.day === 1 || r.day % 5 === 0 ? String(r.day) : "",
    // Chinese reads "第 N 天"; English reads "Day N". Concatenation is
    // good enough since both languages keep the digit at the end.
    full: `${dayPrefix} ${r.day}`,
    input: +(r.input * INPUT_SHARE).toFixed(4),
    cache: +(r.input * CACHE_SHARE).toFixed(4),
    output: r.output,
  }));
}

// Public entry point. Per locale, build the entire Dashboard once and let
// callers cache the result (HeroPanel / Breakdowns each call once per render
// — cheap, and the data is small).
export function buildDemoDashboard(locale: Locale): Dashboard {
  const dict = getDict(locale);
  const { weekdaysShort, weekdaysLong, dayPrefix, vendorLocal } = dict.dashboard;

  return {
    day: buildPeriod(splitDay(), DAY_DM, TRENDS.Day, vendorLocal),
    week: buildPeriod(
      splitWeek(WEEK_RAW, weekdaysShort, weekdaysLong),
      WEEK_DM,
      TRENDS.Week,
      vendorLocal,
    ),
    month: buildPeriod(splitMonth(dayPrefix), MONTH_DM, TRENDS.Month, vendorLocal),
    heatmap: buildHeatmap(),
    todayTokens: DAY_DM.totalTokens,
    generatedAt: "2026-06-05T00:00:00Z",
  };
}
