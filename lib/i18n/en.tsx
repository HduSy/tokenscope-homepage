// English dictionary — source of truth for the dict shape. Every translatable
// user-visible string on the site lives here; zh.tsx must mirror this shape
// exactly. New strings: add here first, TypeScript will then flag the missing
// counterpart in zh.tsx.
//
// JSX is allowed in this module: the FAQ entries store both a plain-text
// answer (mirrored into the JSON-LD on the page) and a rich JSX answer
// (rendered by components/Faq.tsx, with inline <code>/<a> spans).
//
// Keep brand strings ("Tokenscope") and model names (Claude Sonnet 4.5, etc.)
// inside the strings as-is — they're proper nouns, not labels to translate.

import type { ReactNode } from "react";

// Inline code-span style used inside FAQ answers, Pipeline body, and the
// InstallSection footnote. Centralised here so the two dicts can't drift.
const code =
  "rounded bg-grid-line px-1.5 py-px font-mono text-[12.5px] text-accent";

// Accent link underline used inside FAQ answers.
const linkBorder = {
  borderBottom:
    "1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)",
};

export type FaqItem = { q: string; aPlain: string; a: ReactNode };

export const en = {
  // ── Site-wide copy referenced from app/layout.tsx, sitemap, OG, etc. ─
  site: {
    tagline: "Claude Code token cost, in your macOS menu bar",
    description:
      "A macOS menu-bar app that shows your Claude Code token cost: daily spend, per-model breakdown, MCP and Skill call counts. Read-only, no API key.",
    ogDescription:
      "See what your Claude Code consumes and spends. Daily token cost, per-model breakdown, MCP and Skill call counts in your macOS menu bar.",
    ogAlt: "Tokenscope — Claude Code token cost, in your macOS menu bar",
  },

  // ── JSON-LD payload — mirrors SoftwareApplication.description + featureList ─
  jsonLd: {
    description:
      "A macOS menu-bar app that shows your Claude Code token cost: daily spend, per-model breakdown, MCP and Skill call counts. Read-only, no API key.",
    features: [
      "Daily, weekly, and monthly Claude Code token cost in the macOS menu bar",
      "Estimated cost priced per token type (input, cache write, cache read, output) from models.dev and LiteLLM rates",
      "Per-model token and cost breakdown",
      "MCP-server and Skill call counts",
      "GitHub-style daily activity heatmap",
      "Read-only: parses local JSONL logs, no API key, no telemetry",
    ],
  },

  // ── Sticky top nav ─
  nav: {
    breakdowns: "Breakdowns",
    how: "How it works",
    pricing: "Token math",
    faq: "FAQ",
    github: "View on GitHub",
    share: "Share",
    themeToggle: "Toggle theme",
    backToTop: "Back to top",
    langSwitchLabel: "Switch language",
    en: "EN",
    zh: "中",
    skipToContent: "Skip to content",
  },

  // ── Hero (top of page) ─
  hero: {
    pill: "macOS menu-bar app for Claude Code",
    h1Lead: "See what your Claude Code",
    h1Accent: "consumes and spends.",
    sub: "A menu-bar dashboard tracking token usage and cost by model — daily, weekly, monthly — plus MCP and Skill call counts. Read-only, zero intrusion.",
  },

  // ── Primary / secondary CTA pair (Hero + FinalCta) ─
  cta: {
    install: "Install with Homebrew",
    github: "View on GitHub",
  },

  // ── Pipeline (Read · Dedupe · Price · Show) ─
  pipeline: {
    h2: "Read-only by design — no telemetry, no API key.",
    intro:
      "Tokenscope reads the JSONL request logs your Claude Code already writes to disk. No uploads. No API keys. No calls to Anthropic. Nothing leaves your Mac. No security or privacy concerns, and no usage data is ever tracked or analyzed.",
    steps: {
      read: {
        title: "Read",
        body: (
          <>
            Scans <code className={code}>~/.claude/projects/**/*.jsonl</code>{" "}
            for every assistant message, its usage, model, and tool calls.
          </>
        ),
      },
      dedupe: {
        title: "Dedupe",
        body: (
          <>
            Collapses streaming retries by{" "}
            <code className={code}>message.id</code> and merges multi-line
            messages, so each turn is counted exactly once.
          </>
        ),
      },
      price: {
        title: "Price",
        body: (
          <>
            Matches{" "}
            <a
              href="https://models.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              models.dev
            </a>{" "}
            first, then{" "}
            <a
              href="https://github.com/BerriAI/litellm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              LiteLLM
            </a>
            , then a built-in snapshot. Cached for 24 hours with an offline
            fallback.
          </>
        ),
      },
      show: {
        title: "Show",
        body: (
          <>
            Renders today&apos;s usage in the menu bar and the full dashboard a
            click away, auto-refreshed every 30s in the background, with
            right-click to refresh on demand.
          </>
        ),
      },
    },
  },

  // ── Breakdowns bento ─
  breakdowns: {
    h2: "Daily, weekly, monthly token usage breakdowns.",
    intro:
      "Stats by model share, plus MCP and Skill call counts. Spot which models burn the most and which tools you actually use.",
    costByModel: {
      title: "Cost by model",
      sub: "Where the dollars actually go, per period.",
    },
    tools: {
      title: "Tools you actually use",
      sub: "Only the MCP servers and Skills you installed yourself.",
    },
    year: {
      title: "Token usage heatmap",
      sub: "Daily token volume across the last twelve months.",
    },
    cache: {
      title: "Cache changes everything",
      pctSuffix: "% cached",
      footnote:
        "Claude Code writes long context into a prompt cache (cache write), and the next time the same context is sent it's replayed from there (cache read) — no need to re-process it. " +
        "Cache writes cost about 25% more than fresh input, but cache hits are priced at roughly 10% of fresh input. " +
        "Inside a running session, the system prompt, project files, and tool descriptions are carried along as context with every turn, so the higher the hit rate, the less the same conversation costs.",
    },
    requests: "Requests",
    sessionsSuffix: "sessions",
    costTrend: "Cost trend",
    thisWeek: "this week",
    mcpCalls: "MCP calls",
    skillCalls: "Skill calls",
    servers: "servers",
    skills: "skills",
    emptyMcp: "No MCP calls this week",
    emptySkills: "No skill calls this week",
    mcpFootnote:
      "Anthropic's bundled MCP and every built-in tool are filtered out.",
    skillFootnotePrefix: "Read from your own",
    skillFootnotePath: "~/.claude/skills/",
    skillFootnoteSuffix: "directory.",
  },

  // ── Token math section (TokenTypes + CostLedger) ─
  tokenMath: {
    h2: "How your Claude Code token cost is calculated.",
    intro:
      "Each JSONL request logs token usage. Tokenscope rolls it up per session, multiplies each type by its own rate, and sums the four to get the request's total cost.",
    codeComment: "one coding session",
    rowTypes: {
      input: "Input",
      cacheWrite: "Cache write",
      cacheRead: "Cache read",
      output: "Output",
    },
    ledger: {
      type: "type",
      tokensRate: "tokens × $/M",
      cost: "cost",
      totalLabel: "total · one session",
    },
    closingExample: {
      // Rendered as: Notice that {cacheTokens} cost just {cacheCost}. While {outputTokens} cost {outputCost}, over six times more on far fewer tokens. Cost is summed from each model's per-type input/output rates — for reference only; your actual bill is authoritative.
      lead: "Notice that",
      cacheTokens: "2.4M cache-read tokens",
      cacheCost: "cost just $0.72.",
      mid: "while",
      outputTokens: "0.32M output tokens",
      outputCost:
        "cost $4.80, over six times more on far fewer tokens. Cost is summed from each model's per-type input/output rates — for reference only; your actual bill is authoritative.",
    },
  },

  // ── Install section ─
  install: {
    h2: "Install in one line of Homebrew.",
    intro:
      "Homebrew clears the quarantine flag for you, so it's ready to use right away. After that it runs in your menu bar on every boot.",
    copyBtn: "Copy",
    toastCopied: "Copied brew install",
    toastFallback: "Select and copy",
    directDownload: {
      lead: "Prefer a direct download? Grab the universal",
      linkText: ".dmg from GitHub Releases",
      tail: (
        <>
          . It is an unsigned build, so on first launch right-click and choose
          Open, or run{" "}
          <code className={code}>
            xattr -cr /Applications/Tokenscope.app
          </code>{" "}
          once in the terminal.
        </>
      ),
    },
  },

  // ── FAQ — both the rich JSX (Faq.tsx) and the plain-text mirror (JSON-LD) ─
  faq: {
    h2: "Frequently asked.",
    intro: "The questions that come up before someone chooses Tokenscope.",
    items: [
      {
        q: "Does Tokenscope send any of my data over the network?",
        aPlain:
          "No. Tokenscope reads the JSONL logs your Claude Code already writes to ~/.claude/projects/, prices them against a locally cached snapshot of models.dev and LiteLLM, and renders the statistics in your dashboard. There is no telemetry, no account, and no API key.",
        a: (
          <>
            No. It reads the JSONL logs your Claude Code already writes to{" "}
            <code className={code}>~/.claude/projects/</code>, prices them
            against a locally cached snapshot of{" "}
            <a
              href="https://models.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              models.dev
            </a>{" "}
            /{" "}
            <a
              href="https://github.com/BerriAI/litellm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              LiteLLM
            </a>
            , and renders the statistics in your dashboard. No telemetry, no
            account, no API key.
          </>
        ),
      },
      {
        q: "Why does the .dmg warn about an unidentified developer?",
        aPlain:
          "The cask is not notarized through the Apple Developer program yet. Homebrew clears the quarantine flag for you, so the brew install is ready to use right away. For a direct .dmg download, right-click and choose Open the first time, or run xattr -cr /Applications/Tokenscope.app and then open it.",
        a: (
          <>
            The cask isn&apos;t notarized through the Apple Developer program
            yet. Homebrew clears the quarantine flag for you, so the brew route
            is ready to use right away. For a direct{" "}
            <code className={code}>.dmg</code> download, right-click → Open the
            first time, or run{" "}
            <code className={code}>
              xattr -cr /Applications/Tokenscope.app
            </code>{" "}
            and then open it.
          </>
        ),
      },
      {
        q: "How is the cost calculated?",
        aPlain:
          "Input/output types (input, cache write, cache read, output) are each priced at their corresponding rate, pulled from models.dev first, LiteLLM as a fallback, then a built-in snapshot when offline. Rate data is cached on disk for 24 hours. The numbers track Anthropic's billing to the cent for priced Claude models; models with no published pricing are temporarily flagged as unpriced in the panel.",
        a: (
          <>
            Input/output types — input, cache write, cache read, output — are
            each priced at their corresponding rate, pulled from{" "}
            <a
              href="https://models.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              models.dev
            </a>{" "}
            first,{" "}
            <a
              href="https://github.com/BerriAI/litellm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              LiteLLM
            </a>{" "}
            as a fallback, then a built-in snapshot if you&apos;re offline. Rate
            data is cached on disk for 24 hours. Numbers track Anthropic&apos;s
            billing to the cent for priced Claude models; any model with no
            published pricing is temporarily flagged as &ldquo;unpriced&rdquo;
            in the panel.
          </>
        ),
      },
      {
        q: "How does Tokenscope compare to ccusage?",
        aPlain:
          "ccusage (github.com/ryoppippi/ccusage) is a terminal CLI over the same JSONL files: run `npx ccusage` and you get a one-shot summary in the shell. Tokenscope reads the same logs and uses the same models.dev and LiteLLM rate tables, but as a menu-bar GUI. Today's token cost is always visible, and the panel adds bar charts, a donut chart, and a heatmap. Reach for ccusage when you want a scriptable terminal command; reach for Tokenscope when you want to visualize usage anytime.",
        a: (
          <>
            <a
              href="https://github.com/ryoppippi/ccusage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              ccusage
            </a>{" "}
            is a terminal CLI over the same JSONL files. Run{" "}
            <code className={code}>npx ccusage</code> and you get a one-shot
            summary in the shell. Tokenscope reads the same logs and uses the
            same{" "}
            <a
              href="https://models.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              models.dev
            </a>{" "}
            /{" "}
            <a
              href="https://github.com/BerriAI/litellm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              LiteLLM
            </a>{" "}
            rate tables, but as a menu-bar GUI: today&apos;s token cost is
            always visible, the panel adds bar charts, a donut chart, and a
            heatmap. Reach for ccusage when you want a scriptable terminal
            command; reach for Tokenscope when you want to visualize usage
            anytime.
          </>
        ),
      },
      {
        q: "Will it slow down my Mac?",
        aPlain:
          "No. The menu-bar process watches the projects directory for file changes and only re-parses files whose mtime moved. Idle CPU is essentially zero and memory holds steady around 40MB. Refreshing the panel is just a single pass over the new JSONL bytes since the last read. Performance is excellent.",
        a: (
          <>
            The menu-bar process watches the projects directory for file
            changes and only re-parses files whose{" "}
            <code className={code}>mtime</code> moved. Idle CPU is essentially
            zero; memory holds steady around 40MB. Refreshing the panel is just
            a single pass over the new JSONL bytes since the last read.
            Performance is excellent.
          </>
        ),
      },
      {
        q: "What about Cursor, Codex CLI, or other terminals?",
        aPlain:
          "Today only Claude Code's JSONL format is parsed. Other tools write different log shapes. Open an issue on the GitHub repo with a redacted log sample and I'll consider adding support.",
        a: (
          <>
            Today only Claude Code&apos;s JSONL format is parsed. Other tools
            write different shapes — if you want one supported, open an issue
            on{" "}
            <a
              href="https://github.com/HduSy/tokenscope/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              the repo
            </a>{" "}
            with a redacted log sample and I&apos;ll consider adding support.
          </>
        ),
      },
      {
        q: "Is it really free?",
        aPlain:
          "Yes. Tokenscope is MIT licensed with no paid tier, and it never sells your data. The source is at github.com/HduSy/tokenscope.",
        a: (
          <>
            Yes. MIT licensed, no paid tier, and it never sells your data. The
            repo is at{" "}
            <a
              href="https://github.com/HduSy/tokenscope"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              github.com/HduSy/tokenscope
            </a>
            .
          </>
        ),
      },
    ] satisfies FaqItem[],
  },

  // ── Testimonials marquee (mock data, all attributed to @alifeiliu) ─
  testimonials: {
    h2: "Reviews from developers tracking their Claude Code cost.",
    intro:
      "A few notes from developers who installed Tokenscope and kept it.",
    role: "Full-stack (Frontend) Engineer",
    ariaPrefix: "View",
    ariaSuffix: "on X",
    quotes: [
      "Genuinely fun to use - every time your usage ticks past another 100M tokens, Tokenscope sets off this little fireworks animation 🎉. Weirdly satisfying, and it actually makes you feel like you've accomplished something.",
      "The token count is spot-on. I ran Tokenscope against GLM-5.2 for a while and cross-checked with the Coding-Plan dashboard - the two lined right up. The dollar figure is an estimate, of course.",
      "One thing Tokenscope is great for: seeing how many tokens you actually get out of the various Coding-Plan and subscription tiers within a refresh window. Zhipu Lite's 5h Coding-Plan comes to about 20M; ByteDance Volcano Ark's Pro 5h plan, roughly 70M.",
      "Tokenscope's Tokens/Cost by Model view makes it dead easy to compare how pricey different models are. Same token usage, GLM-5.2 runs about a seventh of what Claude-Opus-4-8 costs.",
      "Tokenscope gives you daily, weekly, and monthly breakdowns - the weekly and monthly views even reveal your own AI-usage habits and patterns, which is pretty cool. Plus there's a GitHub-style commit heatmap that shows the full picture of how much you've poured into AI.",
      "Tokenscope's screenshot feature is really handy too - easy to share straight to your socials, so everyone can compare notes and show off their 'report cards'.",
    ],
  },

  // ── Final CTA card ─
  finalCta: {
    h2: "Start watching your tokens.",
    sub: "Free, MIT licensed, and it lives in your menu bar.",
  },

  // ── Footer ─
  footer: {
    caption: "Track your Claude Code token cost, in the macOS menu bar.",
    columns: {
      product: "Product",
      resources: "Resources",
      install: "Install",
    },
    links: {
      breakdowns: "Breakdowns",
      how: "How it works",
      pricing: "Token math",
      faq: "FAQ",
      github: "GitHub",
      releases: "Releases",
      modelsDev: "models.dev",
      bugLog: "Bug log",
      homebrew: "Homebrew",
      dmg: ".dmg download",
    },
    copyright: "© 2026 HduSy · MIT License",
    builtWith: "Built with Tauri · Rust + React",
  },

  // ── Embedded Tokenscope demo panel (hero + breakdowns) ─
  panel: {
    day: "Day",
    week: "Week",
    month: "Month",
    totalTokens: "Total tokens",
    estCost: "Est. cost",
    inputShort: "In",
    inputLong: "Input",
    outputShort: "Out",
    outputLong: "Output",
    cachedSuffix: "cached",
    tokensByModel: "Tokens by model",
    costByModel: "Cost by model",
    emptyUsage: "No usage in this period",
    emptyMcp: "No MCP calls in this period",
    emptySkill: "No skill calls in this period",
    requests: "Requests",
    sessionsSuffix: "sessions",
    costTrend: "Cost trend",
    trendSub: { Day: "today 24h", Week: "this week", Month: "this month" },
    mcpCalls: "MCP calls",
    skillCalls: "Skill calls",
    servers: "servers",
    skills: "skills",
    dailyActivity: "Daily activity",
    unpriced: {
      // unpricedModels.length === 1 → singularSuffix, > 1 → pluralSuffix
      singularSuffix: "model without pricing data (cost not counted):",
      pluralSuffix: "models without pricing data (cost not counted):",
    },
    footerEstimate: "Est. cost via models.dev / LiteLLM · estimate",
    screenshot: "Screenshot",
    themeLight: "Switch to light",
    themeDark: "Switch to dark",
    themeToggleAria: "toggle theme",
    tooltipNoTokens: "No tokens",
    tooltipNoCalls: "No calls",
    tooltipTokensSuffix: "tokens",
    heatLess: "Less",
    heatMore: "More",
    barListMore: "more",
    barListLess: "show less",
  },

  // ── Mock-data labels surfaced inside the panel (weekday ticks etc.) ─
  dashboard: {
    weekdaysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weekdaysLong: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    dayPrefix: "Day",
    vendorLocal: "Local",
    months: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
};

export type Dict = typeof en;
