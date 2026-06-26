// Synthesised dashboard built from the design-canvas mock at
// /Users/rayonreal/DEV/Claude-Design/tokens-analysis-for-mac/data.jsx.
// Design uses a 2-bucket (input + output) token model; Tokenscope's app
// uses 3-bucket (input + cache + output). We re-interpret 85% of design's
// "input" as the prompt-cache bucket and keep 15% as fresh input. Total
// tokens per period are unchanged; the inner split shifts to make the
// "% cached" marketing message land.

import type {
  Dashboard,
  HeatDay,
  Metrics,
  ModelStat,
  NamedCount,
  PeriodReport,
  SeriesPoint,
} from "./tokenscope-data";

// Of design's "input" field, how much becomes cache vs real input.
const CACHE_SHARE = 0.85;
const INPUT_SHARE = 1 - CACHE_SHARE;

// ── Models (week baselines) ─────────────────────────────────────
// Same five entries as design's MODELS const. Cost==0 for the local Llama
// is intentional — it's a free model, not an unpriced one.
const DESIGN_MODELS: Omit<ModelStat, "priced">[] = [
  { name: "Claude Sonnet 4.5", vendor: "Anthropic", tokens: 5.82, cost: 18.4, color: "#1f9d63" },
  { name: "Claude Opus 4.1", vendor: "Anthropic", tokens: 3.07, cost: 19.1, color: "#34c27e" },
  { name: "GPT-5", vendor: "OpenAI", tokens: 1.94, cost: 6.2, color: "#6ad0a0" },
  { name: "Gemini 2.5 Pro", vendor: "Google", tokens: 0.91, cost: 2.4, color: "#a7e3c5" },
  { name: "Llama 3.3 70B", vendor: "Local", tokens: 0.66, cost: 0.0, color: "#4b5a52" },
];
const WEEK_TOKENS = DESIGN_MODELS.reduce((s, m) => s + m.tokens, 0); // 12.40
const WEEK_COST = DESIGN_MODELS.reduce((s, m) => s + m.cost, 0); // 46.10

// Scale the week-baseline distribution to a period's total tokens / cost.
function scaleModels(totalTokens: number, totalCost: number): ModelStat[] {
  const rt = totalTokens / WEEK_TOKENS;
  const rc = totalCost / WEEK_COST;
  return DESIGN_MODELS.map((m) => ({
    name: m.name,
    vendor: m.vendor,
    tokens: +(m.tokens * rt).toFixed(2),
    cost: +(m.cost * rc).toFixed(2),
    color: m.color,
    priced: true, // every model in this mock has known pricing
  }));
}

// ── Per-period raw series (input/output only; cache derived below) ─
type RawPt = { label: string; full: string; input: number; output: number };

// Week: full day names.
const WEEK_RAW: RawPt[] = [
  { label: "Mon", full: "Monday", input: 0.92, output: 0.48 },
  { label: "Tue", full: "Tuesday", input: 1.36, output: 0.74 },
  { label: "Wed", full: "Wednesday", input: 1.18, output: 0.62 },
  { label: "Thu", full: "Thursday", input: 1.71, output: 0.89 },
  { label: "Fri", full: "Friday", input: 1.52, output: 0.78 },
  { label: "Sat", full: "Saturday", input: 0.58, output: 0.31 },
  { label: "Sun", full: "Sunday", input: 0.86, output: 0.44 },
];

// Day: 24 hourly buckets — low overnight, peak afternoon. Same shape as
// design's IIFE.
const DAY_SHAPE = [
  0.05, 0.03, 0.02, 0.02, 0.03, 0.06, 0.12, 0.28,
  0.46, 0.62, 0.74, 0.81, 0.69, 0.58, 0.83, 0.92,
  0.78, 0.64, 0.49, 0.38, 0.31, 0.22, 0.14, 0.08,
];
const DAY_RAW: RawPt[] = DAY_SHAPE.map((v, h) => ({
  label: h % 6 === 0 ? String(h).padStart(2, "0") : "",
  full: `${String(h).padStart(2, "0")}:00`,
  input: +(v * 0.11).toFixed(3),
  output: +(v * 0.058).toFixed(3),
}));

// Month: 30 daily buckets, weekly rhythm (weekends lower), label every 5 days.
const MONTH_RAW: RawPt[] = Array.from({ length: 30 }, (_, i) => {
  const d = i + 1;
  const dow = (d - 1) % 7;
  const weekend = dow === 5 || dow === 6;
  const base = weekend ? 0.42 : 0.92;
  const wobble = 0.78 + 0.44 * Math.abs(Math.sin(d * 1.7));
  const v = base * wobble;
  return {
    label: d === 1 || d % 5 === 0 ? String(d) : "",
    full: `Day ${d}`,
    input: +(v * 0.62).toFixed(3),
    output: +(v * 0.32).toFixed(3),
  };
});

// Apply the cache split to every point in a raw series.
const splitSeries = (raw: RawPt[]): SeriesPoint[] =>
  raw.map((r) => ({
    label: r.label,
    full: r.full,
    input: +(r.input * INPUT_SHARE).toFixed(4),
    cache: +(r.input * CACHE_SHARE).toFixed(4),
    output: r.output,
  }));

// ── MCP / Skill base lists (week totals); scale by period.mcpCalls etc. ─
// Top 5 only — a real Claude CLI user invokes each tool a handful of times
// per week, not hundreds. Numbers scale up for Month / down for Day via
// scaleCalls below.
//
// MCP server names match the identifiers from each project's official MCP
// server, as they'd appear in a user's claude config:
//   github         — github.com/github/github-mcp-server
//   playwright     — Microsoft's @playwright/mcp
//   figma-dev-mode — Figma's Dev Mode MCP Server
//   context7       — Upstash's @upstash/context7-mcp
//   firecrawl      — Mendable's firecrawl-mcp-server
const MCP_BASE: NamedCount[] = [
  { name: "github", count: 9 },
  { name: "playwright", count: 8 },
  { name: "figma-dev-mode", count: 7 },
  { name: "context7", count: 6 },
  { name: "firecrawl", count: 5 },
];
const SKILL_BASE: NamedCount[] = [
  { name: "pdf-reader", count: 10 },
  { name: "deck-builder", count: 8 },
  { name: "image-gen", count: 7 },
  { name: "web-search", count: 6 },
  { name: "code-runner", count: 5 },
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
  // Realistic Claude CLI daily activity: ~1-2 invocations of a couple of
  // tools, a handful of skill calls. Same 5 servers / skills are installed
  // every period — the user's setup doesn't grow within a day.
  mcpCalls: 7, skillCalls: 8, requests: 441, sessions: 23,
  deltaTokens: -0.18, deltaCost: -0.12, servers: 5, skills: 5,
};
const WEEK_DM: DesignMetrics = {
  totalTokens: 12.4, inputTokens: 8.13, outputTokens: 4.27, cost: 46.1,
  // Matches the sum of MCP_BASE / SKILL_BASE so the list bars and the
  // header total agree.
  mcpCalls: 35, skillCalls: 36, requests: 2847, sessions: 143,
  deltaTokens: 0.14, deltaCost: -0.06, servers: 5, skills: 5,
};
const MONTH_DM: DesignMetrics = {
  totalTokens: 27.5, inputTokens: 18.1, outputTokens: 9.4, cost: 101.3,
  // ~4× the weekly baseline.
  mcpCalls: 142, skillCalls: 148, requests: 11680, sessions: 602,
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
): PeriodReport {
  return {
    metrics: splitMetrics(dm),
    series,
    models: scaleModels(dm.totalTokens, dm.cost),
    mcp: scaleCalls(MCP_BASE, dm.mcpCalls),
    skills: scaleCalls(SKILL_BASE, dm.skillCalls),
    reqTrend: trends.req,
    costTrend: trends.cost,
  };
}

export const DEMO_DASHBOARD: Dashboard = {
  day: buildPeriod(splitSeries(DAY_RAW), DAY_DM, TRENDS.Day),
  week: buildPeriod(splitSeries(WEEK_RAW), WEEK_DM, TRENDS.Week),
  month: buildPeriod(splitSeries(MONTH_RAW), MONTH_DM, TRENDS.Month),
  heatmap: buildHeatmap(),
  todayTokens: DAY_DM.totalTokens,
  generatedAt: "2026-06-05T00:00:00Z",
};
