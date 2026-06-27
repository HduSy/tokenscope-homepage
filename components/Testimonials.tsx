import { Reveal } from "./Reveal";
import { getDict, type Locale } from "@/lib/i18n";

// Auto-looping testimonial marquee. A row of short developer notes scrolls
// continuously, pauses on hover, and freezes (becomes manually scrollable)
// under prefers-reduced-motion. Pure CSS animation — no JS — so it keeps
// moving even with JavaScript disabled, and the section header uses <Reveal>
// which already no-JS-renders visible.
//
// The marquee band is intentionally full-bleed (edge-faded) rather than boxed
// to max-w-[1200px]: it's a distinct layout family from the boxed sections
// above and below it, so the page rhythm doesn't repeat.

type Review = { name: string; role?: string; avatar?: string; quote: string };

// Real user reviews. @alifeiliu shared separate takes on the tool - each one
// becomes its own card, all under the same handle, role, and avatar.
// The author identity (name, handle, avatar URL) stays locale-invariant;
// the role label and the quote text come from the dict.
const AUTHOR_NAME = "alifeiliu";
const AUTHOR_AVATAR =
  "https://pbs.twimg.com/profile_images/1818868279135313920/R_t7Z5mr_400x400.jpg";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Highlights every "Tokenscope" mention in the theme accent green so the
// product name pops inside each review. The split regex matches the brand
// name in both locale strings (it's kept English in the Chinese translations).
function Quote({ text }: { text: string }) {
  const parts = text.split(/(Tokenscope)/gi);
  return (
    <>
      {parts.map((part, i) =>
        /tokenscope/i.test(part) ? (
          <span key={i} className="font-medium text-accent">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Card({ r }: { r: Review }) {
  return (
    <figure className="mx-3 flex w-[400px] shrink-0 flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5 transition-colors hover:border-accent sm:w-[460px]">
      {/* Decorative opening quote, top-left. */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none text-accent"
        style={{ fontSize: "72px", lineHeight: "0.55" }}
      >
        {"“"}
      </span>
      <blockquote className="-mt-4 text-[15px] leading-[1.6] text-dim">
        <Quote text={r.quote} />
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        {r.avatar ? (
          // Decorative - the name + role sit beside it.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r.avatar}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-border"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-mono text-[15px] font-medium text-accent ring-1 ring-border"
            style={{
              background:
                "color-mix(in srgb, var(--color-accent) 14%, transparent)",
            }}
          >
            {initials(r.name)}
          </span>
        )}
        <span className="leading-tight">
          <span className="block text-[15px] font-semibold text-text">
            {r.name}
          </span>
          {r.role && (
            <span className="block text-[13px] text-dim">{r.role}</span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const REVIEWS: Review[] = t.testimonials.quotes.map((q) => ({
    name: AUTHOR_NAME,
    role: t.testimonials.role,
    avatar: AUTHOR_AVATAR,
    quote: q,
  }));
  // Duplicate the set so the track can translate -50% for a seamless loop.
  const loop = [...REVIEWS, ...REVIEWS];

  return (
    <section className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal as="div" className="mb-11 max-w-[640px]">
          <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)" }}>
            {t.testimonials.h2}
          </h2>
          <p className="mt-3.5 text-[17px] leading-[1.55] text-dim">
            {t.testimonials.intro}
          </p>
        </Reveal>
      </div>

      <div className="marquee">
        <div className="marquee-track">
          {loop.map((r, i) => {
            // Chinese aria is "在 X 上查看 @name", English is "View @name on X".
            // Join with single spaces and trim any empty suffix.
            const aria = `${t.testimonials.ariaPrefix} @${r.name} ${t.testimonials.ariaSuffix}`.trim();
            return (
              <a
                key={i}
                href={`https://x.com/${r.name}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={aria}
                className="inline-flex rounded-[var(--radius-lg)] outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Card r={r} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
