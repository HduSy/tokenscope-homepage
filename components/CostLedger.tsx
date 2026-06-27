"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "./useInView";
import { fmtInt } from "@/lib/tokenscope-data";

// The right-hand ledger of the Token-math card. Rows light up one by one
// (faded → full) top to bottom, then the total counts from 0 to its target.
// Motivated motion: it acts out the additive computation the section is
// explaining instead of just decorating it.
//
// SSR / no-JS safety mirrors useCountUp: the server renders the final state
// (all rows lit, total at target) so the ledger reads correctly without
// JavaScript. On the client, a layout effect drops to the pre-animation state
// before paint (no flash of the final numbers), then useInView kicks the
// sequence off when the card is scrolled into view. Collapses to the final
// state instantly under prefers-reduced-motion.

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type LedgerRow = {
  type: string;
  count: number;
  rate: number; // USD per 1M tokens
  cls: string; // colour class once lit
};

const ROW_STAGGER = 380; // ms between rows lighting
const ROW_FADE_MS = 500; // per-row opacity fade
const TOTAL_DELAY = 90; // pause after the last row before the count starts
const TOTAL_DURATION = 1000; // 0 → target sweep

const FADE = `opacity ${ROW_FADE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
const money = (v: number, d = 2) => "$" + v.toFixed(d);
const costOf = (r: LedgerRow) => (r.count * r.rate) / 1e6;

export function CostLedger({ rows, total }: { rows: LedgerRow[]; total: number }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 });
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [lit, setLit] = useState(rows.length); // SSR: all lit
  const [totalVal, setTotalVal] = useState(total); // SSR: final
  const [totalOn, setTotalOn] = useState(true); // SSR: lit
  const rafRef = useRef(0);

  // Arm to the pre-animation state before the first paint (JS + motion only).
  useIsoLayoutEffect(() => {
    if (reduce) return;
    setLit(0);
    setTotalVal(0);
    setTotalOn(false);
  }, [reduce]);

  // Play: light rows in sequence, then sweep the total 0 → target.
  useEffect(() => {
    if (!inView || reduce) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    rows.forEach((_, i) => {
      timers.push(setTimeout(() => setLit(i + 1), i * ROW_STAGGER));
    });
    timers.push(
      setTimeout(() => {
        setTotalOn(true);
        const start = performance.now();
        const ease = (t: number) => 1 - Math.pow(2, -10 * t); // easeOutExpo
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / TOTAL_DURATION);
          setTotalVal(total * ease(t));
          if (t < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      }, rows.length * ROW_STAGGER + TOTAL_DELAY),
    );
    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [inView, reduce, rows, total]);

  const cols = "grid grid-cols-[minmax(5.5rem,1fr)_auto_auto] items-baseline gap-x-4";

  return (
    <div ref={ref} className="min-w-0 self-center font-mono text-[12px] tabular-nums sm:text-[13px]">
      <div className={`${cols} pb-1.5 text-[10.5px] uppercase tracking-[0.06em] text-faint`}>
        <span>type</span>
        <span className="text-right">tokens × $/M</span>
        <span className="text-right">cost</span>
      </div>
      {rows.map((r, i) => (
        <div key={r.type} className={`${cols} py-1.5`} style={{ opacity: lit > i ? 1 : 0.4, transition: FADE }}>
          <span className={r.cls}>{r.type}</span>
          <span className="whitespace-nowrap text-right text-text">
            {fmtInt(r.count)} <span className="text-dim">× {money(r.rate)}</span>
          </span>
          <span className="whitespace-nowrap text-right text-text">{money(costOf(r), 4)}</span>
        </div>
      ))}
      <div className={`${cols} mt-1 border-t border-border pt-2.5`} style={{ opacity: totalOn ? 1 : 0.4, transition: FADE }}>
        <span className="text-dim">total · one session</span>
        <span />
        <span className="whitespace-nowrap text-right text-[15px] font-semibold text-accent">
          {money(totalVal)}
        </span>
      </div>
    </div>
  );
}
