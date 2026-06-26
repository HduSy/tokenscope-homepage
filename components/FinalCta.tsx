import { InstallCtas } from "./InstallCtas";
import { Reveal } from "./Reveal";

// Final card-shaped CTA. The accent-glow ::before is replicated via an
// absolutely positioned div with the same gradient + opacity.

export function FinalCta() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal
          as="div"
          className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-14 text-center"
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "var(--accent-glow)", opacity: 0.7 }}
          />
          <div className="relative">
            <h2
              className="font-display font-semibold"
              style={{ fontSize: "clamp(28px,4vw,40px)" }}
            >
              Start watching your tokens.
            </h2>
            <p className="mt-3 text-base text-dim">
              Free, MIT licensed, and it lives in your menu bar.
            </p>
            <InstallCtas className="mt-6.5 justify-center" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
