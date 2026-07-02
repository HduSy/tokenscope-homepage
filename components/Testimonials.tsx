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

type Review = { name: string; role?: string; avatar?: string; quote: string; link: string };

// A quote entry is normally just the quote text (string) — it inherits the
// default author (@alifeiliu), role, avatar, and profile link. An object
// entry overrides any of those per-card, used when a review comes from a
// different person or points at a specific tweet.
type QuoteEntry = string | {
  quote: string;
  name?: string;
  role?: string;
  avatar?: string;
  link?: string;
};

// Real user reviews. @alifeiliu shared separate takes on the tool - each one
// becomes its own card, all under the same handle, role, and avatar.
// The author identity (name, handle, avatar URL) stays locale-invariant;
// the role label and the quote text come from the dict.
const AUTHOR_NAME = "alifeiliu";
// Avatar served from /public — was originally pbs.twimg.com 400×400 (~24KB),
// now /avatars/alifeiliu.jpg 88×88 jpg (~5KB, perfect for 2× retina at 44px
// display). Local serving also drops the cross-origin DNS lookup + the
// referrer-policy dance that twimg.com requires.
const AUTHOR_AVATAR = "/avatars/alifeiliu.jpg";
const AUTHOR_LINK = "https://x.com/alifeiliu";

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
// Hoisted to module scope — per `js-hoist-regexp`, a literal in a function
// body recompiles on every call.
const BRAND_SPLIT_RE = /(Tokenscope)/gi;
const BRAND_TEST_RE = /tokenscope/i;

function Quote({ text }: { text: string }) {
  const parts = text.split(BRAND_SPLIT_RE);
  return (
    <>
      {parts.map((part, i) =>
        BRAND_TEST_RE.test(part) ? (
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
          // Decorative - the name + role sit beside it. Explicit width+height
          // attrs reserve the 44×44 box before bytes arrive (no CLS), and we
          // skip referrerPolicy because the image is now same-origin.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r.avatar}
            alt=""
            width={88}
            height={88}
            className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-border"
            loading="lazy"
            decoding="async"
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
  const REVIEWS: Review[] = t.testimonials.quotes.map((q: QuoteEntry) => ({
    name: AUTHOR_NAME,
    role: t.testimonials.role,
    avatar: AUTHOR_AVATAR,
    link: AUTHOR_LINK,
    ...(typeof q === "string" ? { quote: q } : q),
  }));
  // Duplicate the set so the track can translate -50% for a seamless loop.
  const loop = [...REVIEWS, ...REVIEWS];

  return (
    <section className="cv-auto pb-16 sm:pb-24">
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
        <div
          className="marquee-track"
          // Per-locale card count → CSS var drives a count-proportional
          // animation duration in globals.css, so locales with different
          // review counts scroll at the same visual speed.
          style={{ "--marquee-count": REVIEWS.length } as React.CSSProperties}
        >
          {loop.map((r, i) => {
            // Chinese aria is "在 X 上查看 @name", English is "View @name on X".
            // Join with single spaces and trim any empty suffix.
            const aria = `${t.testimonials.ariaPrefix} @${r.name} ${t.testimonials.ariaSuffix}`.trim();
            return (
              <a
                key={i}
                href={r.link}
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
