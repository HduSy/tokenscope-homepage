import { Install } from "./Install";
import { Reveal } from "./Reveal";
import { getDict, type Locale } from "@/lib/i18n";

export function InstallSection({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const dd = t.install.directDownload;
  return (
    <section id="install" className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal as="div" className="mb-11 max-w-[640px]">
          <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)" }}>
            {t.install.h2}
          </h2>
          <p className="mt-3.5 text-[17px] leading-[1.55] text-dim">
            {t.install.intro}
          </p>
        </Reveal>

        <Reveal as="div">
          <Install locale={locale} />
        </Reveal>

        <Reveal as="p" className="mt-5.5 max-w-[70ch] text-[14px] leading-[1.6] text-dim">
          {dd.lead}{" "}
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
            {dd.linkText}
          </a>
          {dd.tail}
        </Reveal>
      </div>
    </section>
  );
}
