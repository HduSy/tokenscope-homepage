import { Install } from "./Install";
import { Reveal } from "./Reveal";

export function InstallSection() {
  return (
    <section id="install" className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal as="div" className="mb-11 max-w-[640px]">
          <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)" }}>
            Install in one line.
          </h2>
          <p className="mt-3.5 text-[17px] leading-[1.55] text-dim">
            Homebrew clears the quarantine flag for you, so it opens on first launch. After that
            it runs in your menu bar on every boot.
          </p>
        </Reveal>

        <Reveal as="div">
          <Install />
        </Reveal>

        <Reveal as="p" className="mt-5.5 max-w-[70ch] text-[14px] leading-[1.6] text-dim">
          Prefer a direct download? Grab the universal{" "}
          <a
            href="https://github.com/HduSy/tokenscope/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent"
            style={{
              borderBottom:
                "1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)",
            }}
          >
            .dmg from GitHub Releases
          </a>
          . It is an unsigned build, so on first launch right-click the app and choose Open, or
          run <code className="rounded bg-grid-line px-1.5 py-px font-mono text-[12.5px] text-accent">xattr -cr /Applications/Tokenscope.app</code> once.
        </Reveal>
      </div>
    </section>
  );
}
