"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { DATA, fmtMoney, fmtTokens, pct, type Period } from "@/lib/data";

// The faithful in-page render of the app's menu-bar panel. Switching
// Day/Week/Month is the only interaction — everything else is static.

const PERIODS: Period[] = ["Day", "Week", "Month"];

// Easing animator that counts a number up from 0. Mirrors useCountUp in the
// app. Honours prefers-reduced-motion.
function useCountUp(target: number, duration = 850) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (typeof window === "undefined") {
      setValue(target);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function PanelPreview() {
  const [period, setPeriod] = useState<Period>("Week");
  const d = DATA[period];
  const total = useCountUp(d.totalTokens);
  const inM = d.input + d.cache;

  // Stacked bar chart — accent stack (input+cache) below, accent-soft (output)
  // above. Computed inline because the chart is tiny and re-renders cheap.
  const chart = useMemo(() => {
    const W = 322;
    const H = 84;
    const labelH = 14;
    const n = d.series.length;
    const innerH = H - labelH;
    const gap = Math.max(0.8, Math.min(6, 32 / n));
    const max = Math.max(...d.series.map((s) => s.in + s.ca + s.out), 1e-9);
    const bw = (100 - gap * (n - 1)) / n;
    const xAt = (i: number) => i * (bw + gap);
    const grid = [0.25, 0.5, 0.75, 1].map((g, i) => (
      <line
        key={i}
        x1={0}
        x2={W}
        y1={(innerH * (1 - g)).toFixed(1)}
        y2={(innerH * (1 - g)).toFixed(1)}
        stroke="var(--color-grid-line)"
        strokeWidth={1}
      />
    ));
    const r = n > 16 ? 1 : 2;
    const bars = d.series.flatMap((s, i) => {
      const hI = ((s.in + s.ca) / max) * innerH;
      const hO = (s.out / max) * innerH;
      const x = xAt(i);
      const out: React.ReactNode[] = [
        <rect
          key={`i${i}`}
          x={x.toFixed(2)}
          y={(innerH - hI).toFixed(2)}
          width={bw.toFixed(2)}
          height={hI.toFixed(2)}
          rx={r}
          fill="var(--color-accent)"
        />,
      ];
      if (hO > 0.1) {
        out.push(
          <rect
            key={`o${i}`}
            x={x.toFixed(2)}
            y={(innerH - hI - hO).toFixed(2)}
            width={bw.toFixed(2)}
            height={hO.toFixed(2)}
            rx={r}
            fill="var(--color-accent-soft)"
          />,
        );
      }
      return out;
    });
    return { W, H, grid, bars };
  }, [d.series]);

  // Top-4 model rows under the chart.
  const maxModel = Math.max(...d.models.map((m) => m.tokens), 1e-9);
  const topModels = d.models.slice(0, 4);

  return (
    <div
      role="figure"
      aria-label="Tokenscope panel preview"
      className="w-full max-w-[384px] justify-self-center overflow-hidden rounded-md border border-border-strong bg-card font-sans shadow-[var(--shadow-panel)]"
    >
      {/* head: title + segmented control */}
      <div className="flex items-center justify-between border-b border-grid-line px-4 pt-3.5 pb-3">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.01em]">
          <BrandMark size={16} />
          Tokenscope
        </span>
        <div
          role="tablist"
          aria-label="Period"
          className="inline-flex gap-0.5 rounded-lg border border-border bg-grid-line p-0.5"
        >
          {PERIODS.map((p) => {
            const on = p === period;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                role="tab"
                aria-selected={on}
                className={`cursor-pointer rounded-md border-0 px-2.5 py-1 font-sans text-[11px] font-semibold tracking-[0.02em] transition-[color,background,box-shadow] ${
                  on
                    ? "bg-card text-text shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                    : "bg-transparent text-dim"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4">
        {/* hero numbers */}
        <div className="mb-3 flex items-end justify-between">
          <div>
            <div className="text-[10px] font-medium tracking-[0.04em] text-dim uppercase">
              Total tokens
            </div>
            <div className="mt-1 font-mono text-[30px] leading-none font-semibold tracking-[-0.01em]">
              {total.toFixed(2)}
              <span className="ml-0.5 text-[15px] font-medium text-dim">M</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-medium text-dim">Est. cost</div>
            <div className="mt-0.5 font-mono text-lg font-semibold text-accent">
              {fmtMoney(d.cost)}
            </div>
          </div>
        </div>

        {/* split bar */}
        <div className="flex h-[7px] overflow-hidden rounded bg-grid-line">
          <div style={{ flexGrow: Math.max(inM, 0.001) }} className="bg-accent" />
          <div style={{ flexGrow: Math.max(d.output, 0.001) }} className="bg-accent-soft" />
        </div>

        {/* legend */}
        <div className="my-1.5 mb-3.5 flex flex-wrap gap-3.5 font-mono text-[10px] text-dim">
          <span className="text-accent">
            <span className="inline-block">●</span> Input {inM.toFixed(2)}M
          </span>
          <span className="text-accent-soft">
            <span className="inline-block">●</span> Output {d.output.toFixed(2)}M
          </span>
          <span className="text-faint">{pct(d.cache, d.totalTokens)}% cached</span>
        </div>

        {/* chart */}
        <svg
          viewBox={`0 0 ${chart.W} ${chart.H}`}
          width="100%"
          preserveAspectRatio="none"
          style={{ display: "block", overflow: "visible" }}
        >
          {chart.grid}
          {chart.bars}
        </svg>

        <div className="my-3 h-px bg-grid-line" />

        <div className="mb-1.5 font-sans text-[10px] font-semibold tracking-[0.05em] text-dim uppercase">
          Tokens by model
        </div>
        <div>
          {topModels.map((m) => (
            <div key={m.name} className="flex items-center gap-2.5 py-1.5">
              <span
                className="h-[7px] w-[7px] flex-none rounded-[2px]"
                style={{ background: m.color }}
              />
              <span className="w-32 truncate text-[11.5px] font-medium text-text">{m.name}</span>
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
                {fmtTokens(m.tokens)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
