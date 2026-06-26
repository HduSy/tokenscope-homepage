// Real data snapshot from public/dev-dashboard.json + formatters ported from
// the app's src/data.ts. Keep this in sync with the live app when the numbers
// change.

export type Period = "Day" | "Week" | "Month";

export type SeriesPoint = {
  l: string;
  in: number;
  ca: number;
  out: number;
};

export type ModelRow = {
  name: string;
  tokens: number;
  cost: number;
  color: string;
  priced: boolean;
};

export type ToolRow = { name: string; count: number };

export type PeriodData = {
  totalTokens: number;
  input: number;
  cache: number;
  output: number;
  cost: number;
  requests: number;
  sessions: number;
  delta: number;
  series: SeriesPoint[];
  models: ModelRow[];
  mcp?: ToolRow[];
  skills?: ToolRow[];
  servers?: number;
  skillsInstalled?: number;
};

export const DATA: Record<Period, PeriodData> = {
  Day: {
    totalTokens: 13.9,
    input: 0.06,
    cache: 13.8,
    output: 0.04,
    cost: 12.56,
    requests: 51,
    sessions: 2,
    delta: -92.67,
    series: [
      { l: "00", in: 0.0, ca: 11.73, out: 0.018 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "04", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "08", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0.063, ca: 1.6, out: 0.02 },
      { l: "", in: 0.0001, ca: 0.46, out: 0.0003 },
      { l: "12", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "16", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "20", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
    ],
    models: [
      { name: "claude-opus-4-8", tokens: 13.14, cost: 12.46, color: "#1f9d63", priced: true },
      { name: "glm-5.1", tokens: 0.67, cost: 0.1, color: "#34c27e", priced: true },
      { name: "glm-4.5-air", tokens: 0.09, cost: 0.0, color: "#6ad0a0", priced: true },
    ],
  },
  Week: {
    totalTokens: 319.01,
    input: 0.92,
    cache: 317.22,
    output: 0.88,
    cost: 213.37,
    requests: 1476,
    sessions: 24,
    delta: -26.13,
    series: [
      { l: "Mon", in: 0.0, ca: 0.0, out: 0.0 },
      { l: "Tue", in: 0.31, ca: 4.39, out: 0.04 },
      { l: "Wed", in: 0.02, ca: 1.06, out: 0.02 },
      { l: "Thu", in: 0.02, ca: 1.4, out: 0.01 },
      { l: "Fri", in: 0.05, ca: 107.82, out: 0.31 },
      { l: "Sat", in: 0.45, ca: 188.76, out: 0.45 },
      { l: "Sun", in: 0.06, ca: 13.8, out: 0.04 },
    ],
    models: [
      { name: "claude-opus-4-8", tokens: 302.53, cost: 209.61, color: "#1f9d63", priced: true },
      { name: "glm-5.1", tokens: 7.76, cost: 0.68, color: "#34c27e", priced: true },
      { name: "glm-4.5-air", tokens: 5.8, cost: 0.05, color: "#6ad0a0", priced: true },
      { name: "claude-opus-4-7", tokens: 2.61, cost: 3.01, color: "#a7e3c5", priced: true },
      { name: "claude-haiku-4-5", tokens: 0.3, cost: 0.03, color: "#4b5a52", priced: true },
    ],
    mcp: [{ name: "context7", count: 2 }],
    skills: [
      { name: "skill-creator", count: 1 },
      { name: "find-skills", count: 1 },
    ],
    servers: 2,
    skillsInstalled: 6,
  },
  Month: {
    totalTokens: 319.01,
    input: 0.92,
    cache: 317.22,
    output: 0.88,
    cost: 213.37,
    requests: 1476,
    sessions: 24,
    delta: -63.56,
    series: [
      { l: "1", in: 0, ca: 0, out: 0 },
      { l: "", in: 0.31, ca: 4.39, out: 0.04 },
      { l: "", in: 0.02, ca: 1.06, out: 0.02 },
      { l: "", in: 0.02, ca: 1.4, out: 0.01 },
      { l: "5", in: 0.05, ca: 107.82, out: 0.31 },
      { l: "", in: 0.45, ca: 188.76, out: 0.45 },
      { l: "", in: 0.06, ca: 13.8, out: 0.04 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "10", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "15", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "20", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "25", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "", in: 0, ca: 0, out: 0 },
      { l: "30", in: 0, ca: 0, out: 0 },
    ],
    models: [
      { name: "claude-opus-4-8", tokens: 302.53, cost: 209.61, color: "#1f9d63", priced: true },
      { name: "glm-5.1", tokens: 7.76, cost: 0.68, color: "#34c27e", priced: true },
      { name: "glm-4.5-air", tokens: 5.8, cost: 0.05, color: "#6ad0a0", priced: true },
      { name: "claude-opus-4-7", tokens: 2.61, cost: 3.01, color: "#a7e3c5", priced: true },
      { name: "claude-haiku-4-5", tokens: 0.3, cost: 0.03, color: "#4b5a52", priced: true },
    ],
  },
};

// Year-long heatmap: [date, level 0..4].
export const HEAT: [string, number][] = [
  ["2025-12-14", 0], ["2025-12-15", 0], ["2025-12-16", 0], ["2025-12-17", 0], ["2025-12-18", 0], ["2025-12-19", 0],
  ["2025-12-20", 0], ["2025-12-21", 0], ["2025-12-22", 0], ["2025-12-23", 0], ["2025-12-24", 0], ["2025-12-25", 0],
  ["2025-12-26", 0], ["2025-12-27", 0], ["2025-12-28", 0], ["2025-12-29", 0], ["2025-12-30", 0], ["2025-12-31", 0],
  ["2026-01-01", 0], ["2026-01-02", 0], ["2026-01-03", 0], ["2026-01-04", 0], ["2026-01-05", 0], ["2026-01-06", 0],
  ["2026-01-07", 0], ["2026-01-08", 0], ["2026-01-09", 0], ["2026-01-10", 0], ["2026-01-11", 0], ["2026-01-12", 0],
  ["2026-01-13", 0], ["2026-01-14", 0], ["2026-01-15", 0], ["2026-01-16", 0], ["2026-01-17", 0], ["2026-01-18", 0],
  ["2026-01-19", 0], ["2026-01-20", 0], ["2026-01-21", 0], ["2026-01-22", 0], ["2026-01-23", 0], ["2026-01-24", 0],
  ["2026-01-25", 0], ["2026-01-26", 0], ["2026-01-27", 0], ["2026-01-28", 0], ["2026-01-29", 0], ["2026-01-30", 0],
  ["2026-01-31", 0], ["2026-02-01", 0], ["2026-02-02", 0], ["2026-02-03", 0], ["2026-02-04", 0], ["2026-02-05", 0],
  ["2026-02-06", 0], ["2026-02-07", 0], ["2026-02-08", 0], ["2026-02-09", 0], ["2026-02-10", 0], ["2026-02-11", 0],
  ["2026-02-12", 0], ["2026-02-13", 0], ["2026-02-14", 0], ["2026-02-15", 0], ["2026-02-16", 0], ["2026-02-17", 0],
  ["2026-02-18", 0], ["2026-02-19", 0], ["2026-02-20", 0], ["2026-02-21", 0], ["2026-02-22", 0], ["2026-02-23", 0],
  ["2026-02-24", 0], ["2026-02-25", 0], ["2026-02-26", 0], ["2026-02-27", 0], ["2026-02-28", 0], ["2026-03-01", 0],
  ["2026-03-02", 0], ["2026-03-03", 0], ["2026-03-04", 0], ["2026-03-05", 0], ["2026-03-06", 0], ["2026-03-07", 0],
  ["2026-03-08", 0], ["2026-03-09", 0], ["2026-03-10", 0], ["2026-03-11", 0], ["2026-03-12", 0], ["2026-03-13", 0],
  ["2026-03-14", 0], ["2026-03-15", 0], ["2026-03-16", 0], ["2026-03-17", 0], ["2026-03-18", 0], ["2026-03-19", 0],
  ["2026-03-20", 0], ["2026-03-21", 0], ["2026-03-22", 0], ["2026-03-23", 0], ["2026-03-24", 0], ["2026-03-25", 0],
  ["2026-03-26", 0], ["2026-03-27", 0], ["2026-03-28", 0], ["2026-03-29", 0], ["2026-03-30", 0], ["2026-03-31", 0],
  ["2026-04-01", 0], ["2026-04-02", 0], ["2026-04-03", 0], ["2026-04-04", 0], ["2026-04-05", 0], ["2026-04-06", 0],
  ["2026-04-07", 0], ["2026-04-08", 0], ["2026-04-09", 0], ["2026-04-10", 0], ["2026-04-11", 0], ["2026-04-12", 0],
  ["2026-04-13", 0], ["2026-04-14", 0], ["2026-04-15", 0], ["2026-04-16", 0], ["2026-04-17", 0], ["2026-04-18", 0],
  ["2026-04-19", 0], ["2026-04-20", 0], ["2026-04-21", 0], ["2026-04-22", 0], ["2026-04-23", 0], ["2026-04-24", 0],
  ["2026-04-25", 0], ["2026-04-26", 0], ["2026-04-27", 0], ["2026-04-28", 0], ["2026-04-29", 0], ["2026-04-30", 0],
  ["2026-05-01", 0], ["2026-05-02", 0], ["2026-05-03", 0], ["2026-05-04", 0], ["2026-05-05", 0], ["2026-05-06", 0],
  ["2026-05-07", 0], ["2026-05-08", 0], ["2026-05-09", 0], ["2026-05-10", 0], ["2026-05-11", 1], ["2026-05-12", 1],
  ["2026-05-13", 1], ["2026-05-14", 1], ["2026-05-15", 1], ["2026-05-16", 1], ["2026-05-17", 1], ["2026-05-18", 1],
  ["2026-05-19", 2], ["2026-05-20", 1], ["2026-05-21", 1], ["2026-05-22", 1], ["2026-05-23", 2], ["2026-05-24", 4],
  ["2026-05-25", 1], ["2026-05-26", 2], ["2026-05-27", 1], ["2026-05-28", 2], ["2026-05-29", 1], ["2026-05-30", 4],
  ["2026-05-31", 1], ["2026-06-01", 0], ["2026-06-02", 1], ["2026-06-03", 1], ["2026-06-04", 1], ["2026-06-05", 3],
  ["2026-06-06", 4], ["2026-06-07", 1],
];

export const BREW_CMD = "brew install --cask hdusy/tokenscope/tokenscope";

export const fmtTokens = (m: number) =>
  m >= 1 ? m.toFixed(2) + "M" : Math.round(m * 1000) + "K";

export const fmtInt = (n: number) => n.toLocaleString("en-US");

export const pct = (part: number, whole: number) =>
  whole > 0 ? Math.round((part / whole) * 100) : 0;

export const fmtMoney = (v: number) =>
  "$" +
  v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
