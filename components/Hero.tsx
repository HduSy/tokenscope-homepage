import { InstallCtas } from "./InstallCtas";
import { PanelPreview } from "./PanelPreview";

// Hero: copy on the left, live panel preview on the right. Wrapped in a
// relative container so the accent glow ::before sits behind both.

export function Hero() {
  return (
    <header id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "var(--accent-glow)" }}
      />
      <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 pt-18 pb-20 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:pt-21 md:pb-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-dim">
            <span className="h-[7px] w-[7px] rounded-[2px] bg-accent" />
            macOS menu-bar app for Claude CLI
          </span>
          <h1
            className="mt-5.5 max-w-[13ch] font-display font-semibold"
            style={{ fontSize: "clamp(40px,6vw,64px)" }}
          >
            See what your Claude CLI <em className="not-italic text-accent">actually costs</em>.
          </h1>
          <p className="mt-5 max-w-[50ch] text-[18px] leading-[1.55] text-dim">
            A menu-bar app showing daily token count, estimated cost, and per-model, MCP, and
            Skill breakdown. Read-only, zero intrusion.
          </p>
          <InstallCtas className="mt-7" />
        </div>
        <PanelPreview />
      </div>
    </header>
  );
}
