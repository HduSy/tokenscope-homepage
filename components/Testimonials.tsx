import { Reveal } from "./Reveal";

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
const AUTHOR = {
  name: "alifeiliu",
  role: "Full-stack (Frontend) Engineer",
  avatar:
    "https://pbs.twimg.com/profile_images/1818868279135313920/R_t7Z5mr_400x400.jpg",
};

const REVIEWS: Review[] = [
  {
    ...AUTHOR,
    quote:
      "Genuinely fun to use - every time your usage ticks past another 100M tokens, Tokenscope sets off this little fireworks animation 🎉. Weirdly satisfying, and it actually makes you feel like you've accomplished something.",
  },
  {
    ...AUTHOR,
    quote:
      "The token count is spot-on. I ran Tokenscope against GLM-5.2 for a while and cross-checked with the Coding-Plan dashboard - the two lined right up. The dollar figure is an estimate, of course.",
  },
  {
    ...AUTHOR,
    quote:
      "One thing Tokenscope is great for: seeing how many tokens you actually get out of the various Coding-Plan and subscription tiers within a refresh window. Zhipu Lite's 5h Coding-Plan comes to about 20M; ByteDance Volcano Ark's Pro 5h plan, roughly 70M.",
  },
  {
    ...AUTHOR,
    quote:
      "Tokenscope's Tokens/Cost by Model view makes it dead easy to compare how pricey different models are. Same token usage, GLM-5.2 runs about a seventh of what Claude-Opus-4-8 costs.",
  },
  {
    ...AUTHOR,
    quote:
      "Tokenscope gives you daily, weekly, and monthly breakdowns - the weekly and monthly views even reveal your own AI-usage habits and patterns, which is pretty cool. Plus there's a GitHub-style commit heatmap that shows the full picture of how much you've poured into AI.",
  },
  {
    ...AUTHOR,
    quote:
      "Tokenscope's screenshot feature is really handy too - easy to share straight to your socials, so everyone can compare notes and show off their 'report cards'.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Highlights every "Tokenscope" mention in the theme accent green so the
// product name pops inside each review.
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

export function Testimonials() {
  // Duplicate the set so the track can translate -50% for a seamless loop.
  const loop = [...REVIEWS, ...REVIEWS];

  return (
    <section className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal as="div" className="mb-11 max-w-[640px]">
          <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)" }}>
            From the people running it daily.
          </h2>
          <p className="mt-3.5 text-[17px] leading-[1.55] text-dim">
            A few notes from developers who installed Tokenscope and kept it.
          </p>
        </Reveal>
      </div>

      <div className="marquee">
        <div className="marquee-track">
          {loop.map((r, i) => (
            <a
              key={i}
              href={`https://x.com/${r.name}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View @${r.name} on X`}
              className="inline-flex rounded-[var(--radius-lg)] outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Card r={r} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
