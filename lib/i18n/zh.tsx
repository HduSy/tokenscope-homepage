// Chinese (Simplified) dictionary. Conforms to the `Dict` type derived from
// en.tsx — TypeScript flags any missing key or shape mismatch.
//
// Translation register: 口语化偏技术, mirrors the English tone — direct, no
// hedging, occasional accent. Brand names (Tokenscope, Claude Code, Anthropic,
// MCP, Skill, models.dev, LiteLLM, Homebrew, GLM-5.2, ccusage) stay in Latin;
// "Token" stays as "Token" since that's how Chinese developers write it.

import type { Dict, FaqItem } from "./en";

const code =
  "rounded bg-grid-line px-1.5 py-px font-mono text-[12.5px] text-accent";

const linkBorder = {
  borderBottom:
    "1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)",
};

export const zh: Dict = {
  site: {
    tagline: "Claude Code Token 费用，全在你的 macOS 菜单栏",
    description:
      "一个 macOS 菜单栏小工具，实时显示你的 Claude Code Token 费用：每日花销、按模型拆分、MCP 与 Skill 调用次数。只读，无需 API key。",
    ogDescription:
      "看清你的 Claude Code 到底花了多少钱。每日 Token 费用、按模型拆分、MCP 和 Skill 调用次数，全在你的菜单栏。",
    ogAlt: "Tokenscope — Claude Code Token 费用，全在你的 macOS 菜单栏",
  },

  jsonLd: {
    description:
      "一个 macOS 菜单栏小工具，实时显示你的 Claude Code Token 费用：每日花销、按模型拆分、MCP 与 Skill 调用次数。只读，无需 API key。",
    features: [
      "在 macOS 菜单栏中查看每日、每周、每月的 Claude Code Token 费用",
      "按四种 Token 类型（输入、缓存写入、缓存读取、输出）分别计价，价格来自 models.dev 与 LiteLLM",
      "按模型拆分的 Token 与费用明细",
      "MCP 服务与 Skill 调用次数统计",
      "GitHub 风格的每日活动热力图",
      "只读：直接解析本地 JSONL 日志，无需 API key，无遥测",
    ],
  },

  nav: {
    breakdowns: "明细",
    how: "工作原理",
    pricing: "费用算法",
    faq: "常见问题",
    github: "在 GitHub 上查看",
    share: "分享",
    themeToggle: "切换主题",
    backToTop: "回到顶部",
    langSwitchLabel: "切换语言",
    en: "EN",
    zh: "中",
  },

  hero: {
    pill: "Claude Code 的 macOS 菜单栏小工具",
    h1Lead: "看清你的 Claude Code",
    h1Accent: "到底花了多少钱",
    sub: "一个常驻菜单栏的小工具，显示每日 Token 费用、按模型拆分、MCP 与 Skill 调用次数。只读，零打扰。",
  },

  cta: {
    install: "用 Homebrew 安装",
    github: "在 GitHub 上查看",
  },

  pipeline: {
    h2: "天生只读 —— 无遥测，无需 API key。",
    intro:
      "Tokenscope 直接读取 Claude Code 写在你磁盘里的 JSONL 日志。不需要 API key，不调用 Anthropic 接口，所有数据都留在你的 Mac 上。",
    steps: {
      read: {
        title: "读取",
        body: (
          <>
            扫描 <code className={code}>~/.claude/projects/**/*.jsonl</code>，把每一条 assistant 消息、它的 usage、模型与工具调用都解析出来。
          </>
        ),
      },
      dedupe: {
        title: "去重",
        body: (
          <>
            按 <code className={code}>message.id</code> 折叠流式重试，合并多段消息，确保每一轮只统计一次。
          </>
        ),
      },
      price: {
        title: "计价",
        body: (
          <>
            优先匹配 models.dev，其次 LiteLLM，最后兜底使用内置的价格快照。本地缓存 24 小时，离线也能用。
          </>
        ),
      },
      show: {
        title: "展示",
        body: (
          <>
            菜单栏上实时显示今日总额，点开就是完整看板，后台自动刷新。
          </>
        ),
      },
    },
  },

  breakdowns: {
    h2: "日、周、月 Token 费用明细。",
    intro:
      "Token 按模型拆，调用按 MCP / Skill 拆。一眼看出哪些模型在烧钱、哪些工具你装了但根本没用。",
    costByModel: {
      title: "按模型看费用",
      sub: "看清这段时间钱到底花在了哪。",
    },
    tools: {
      title: "你真正在用的工具",
      sub: "只统计你自己装的 MCP 服务和 Skill。",
    },
    year: {
      title: "全年活动",
      sub: "过去十二个月，每天的 Token 用量。",
    },
    cache: {
      title: "缓存改变一切",
      pctSuffix: "% 命中缓存",
      footnote:
        "缓存命中高的日子，Token 数巨大但账单依然不高 —— 缓存读取走的是它自己的便宜单价，并不是按新输入计费的。",
    },
    requests: "请求数",
    sessionsSuffix: "次会话",
    costTrend: "费用趋势",
    thisWeek: "本周",
    mcpCalls: "MCP 调用",
    skillCalls: "Skill 调用",
    servers: "个服务",
    skills: "个 Skill",
    emptyMcp: "本周没有 MCP 调用",
    emptySkills: "本周没有 Skill 调用",
    mcpFootnote: "Anthropic 自带的 MCP 和所有内置工具已被过滤掉。",
    skillFootnotePrefix: "从你自己的",
    skillFootnotePath: "~/.claude/skills/",
    skillFootnoteSuffix: "目录读取。",
  },

  tokenMath: {
    h2: "你的 Claude Code Token 费用是怎么算出来的。",
    intro:
      "每条 JSONL 请求都记录了四种 Token 数。Tokenscope 按会话累加，每种 Token 各自乘以对应单价，四项相加 —— 整个引擎就这么简单。",
    codeComment: "一次编码会话",
    rowTypes: {
      input: "输入",
      cacheWrite: "缓存写入",
      cacheRead: "缓存读取",
      output: "输出",
    },
    ledger: {
      type: "类型",
      tokensRate: "Token × $/M",
      cost: "费用",
      totalLabel: "总计 · 单次会话",
    },
    closingRates:
      "单价优先取自 models.dev，其次 LiteLLM，离线时兜底使用内置快照，本地缓存 24 小时。面板里把缓存折进“In”只是显示口径；计费始终走上面这四项各自的单价。",
    closingExample: {
      lead: "注意",
      cacheTokens: "240 万 个缓存读取 Token",
      cacheCost: "只花了 $0.72。",
      mid: "同一次会话的",
      outputTokens: "32 万 个输出 Token",
      outputCost:
        "却花了 $4.80 —— Token 数少了一大截，费用却高出六倍。账单从来不由 Token 总数决定，而是看每种类型各自的单价。",
    },
  },

  install: {
    h2: "一行 Homebrew 就能装好。",
    intro:
      "Homebrew 会替你清掉隔离标记，所以第一次就能直接打开。装好以后，每次开机都会自动起在菜单栏里。",
    copyBtn: "复制",
    toastCopied: "已复制安装命令",
    toastFallback: "请手动选中并复制",
    directDownload: {
      lead: "想直接下载？去 GitHub Releases 拿通用版的",
      linkText: ".dmg",
      tail: (
        <>
          。它是未签名构建，所以首次打开时要右键 → 打开，或者一次性运行{" "}
          <code className={code}>
            xattr -cr /Applications/Tokenscope.app
          </code>
          。
        </>
      ),
    },
  },

  faq: {
    h2: "常见问题。",
    intro: "运行 brew install 之前，开发者们最常问到的几个问题。",
    items: [
      {
        q: "Tokenscope 会不会把我的数据传到网络上？",
        aPlain:
          "不会。Tokenscope 只读取 Claude Code 已经写在 ~/.claude/projects/ 里的 JSONL 日志，按本地缓存的 models.dev 和 LiteLLM 价格快照计费，结果显示在菜单栏里。无遥测、无账号、无 API key。",
        a: (
          <>
            不会。它只读取 Claude Code 已经写在{" "}
            <code className={code}>~/.claude/projects/</code> 里的 JSONL 日志，按本地缓存的 models.dev / LiteLLM 价格快照计费，结果显示在你的菜单栏。无遥测、无账号、无 API key。
          </>
        ),
      },
      {
        q: ".dmg 提示来自未认证的开发者，怎么办？",
        aPlain:
          "这个 cask 还没走 Apple Developer 公证。Homebrew 会替你清掉隔离标记，所以 brew 安装方式第一次就能直接打开。如果是直接下载的 .dmg，第一次右键 → 打开，或者一次性运行 xattr -cr /Applications/Tokenscope.app 即可。",
        a: (
          <>
            这个 cask 暂时还没走 Apple Developer 的公证。Homebrew 会替你清掉隔离标记，所以 brew 那条路第一次就能正常打开。如果你是直接下载{" "}
            <code className={code}>.dmg</code>，第一次右键 → 打开，或者一次性运行{" "}
            <code className={code}>
              xattr -cr /Applications/Tokenscope.app
            </code>{" "}
            即可。
          </>
        ),
      },
      {
        q: "费用数字准不准？",
        aPlain:
          "四种 Token 类型（输入、缓存写入、缓存读取、输出）各自按自己的单价计算，价格优先取自 models.dev，其次 LiteLLM，离线时兜底使用内置快照。本地缓存 24 小时。对于有公开报价的 Claude 模型，数字和 Anthropic 的账单精确到分；没有公开定价的模型会在面板里标为 “unpriced”。",
        a: (
          <>
            四种 Token 类型 —— 输入、缓存写入、缓存读取、输出 —— 各自按自己的单价计算，价格优先取自 models.dev，其次 LiteLLM，离线时兜底使用内置快照。本地缓存 24 小时。对于有公开报价的 Claude 模型，数字和 Anthropic 的账单精确到分；没有公开定价的模型会在面板里标记为 &ldquo;unpriced&rdquo;。
          </>
        ),
      },
      {
        q: "Tokenscope 和 ccusage 有什么不同？",
        aPlain:
          "ccusage（github.com/ryoppippi/ccusage）是一个命令行工具，读的是同一份 JSONL：跑 npx ccusage，在终端里看到一次性汇总。Tokenscope 读同样的日志、用同样的 models.dev / LiteLLM 价格表，但呈现形式是菜单栏 GUI：今天的 Token 费用一直挂在屏幕上，面板里还有柱状图、热力图和截图分享。需要可脚本化的命令行用 ccusage；想要不打字就能持续感知的，用 Tokenscope。",
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
            是一个命令行工具，读的是同一份 JSONL。跑{" "}
            <code className={code}>npx ccusage</code> 就能在终端里看到一次性汇总。Tokenscope 读同样的日志、用同样的 models.dev / LiteLLM 价格表，但呈现形式是菜单栏 GUI：今天的 Token 费用一直挂在屏幕上，面板里还有柱状图、热力图和截图分享。需要可脚本化的命令行用 ccusage；想要不打字就能持续感知的，用 Tokenscope。
          </>
        ),
      },
      {
        q: "会不会拖慢我的 Mac？",
        aPlain:
          "不会。菜单栏进程监听项目目录的文件变化，只重新解析 mtime 改动过的文件。空闲时 CPU 基本为零，内存稳定在几十 MB。刷新面板时只过一遍上次读取后新增的 JSONL 字节。",
        a: (
          <>
            菜单栏进程会监听项目目录的文件变化，只重新解析{" "}
            <code className={code}>mtime</code> 改动过的文件。空闲时 CPU 基本为零，内存稳定在几十 MB。刷新面板就是从上次位置往后扫一遍新增的 JSONL 字节。
          </>
        ),
      },
      {
        q: "支持 Cursor、Codex CLI 或者其他终端工具吗？",
        aPlain:
          "目前只解析 Claude Code 的 JSONL 格式。其他工具的日志格式不一样。如果你想加一个，去 GitHub repo 上提个 issue，附上脱敏过的日志样例，我会写一个 parser。",
        a: (
          <>
            目前只解析 Claude Code 的 JSONL 格式。其他工具的日志格式不一样 —— 如果你想加一个，去{" "}
            <a
              href="https://github.com/HduSy/tokenscope/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              repo
            </a>{" "}
            上提个 issue，附上脱敏过的日志样例，我会写一个 parser。
          </>
        ),
      },
      {
        q: "真的完全免费吗？",
        aPlain:
          "是。MIT 协议，没有付费版本，也没有遥测数据可卖。源代码在 github.com/HduSy/tokenscope。",
        a: (
          <>
            是。MIT 协议，没有付费版本，也没有遥测数据可卖。源代码在{" "}
            <a
              href="https://github.com/HduSy/tokenscope"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              github.com/HduSy/tokenscope
            </a>
            。
          </>
        ),
      },
    ] satisfies FaqItem[],
  },

  testimonials: {
    h2: "正在追踪 Claude Code 费用的开发者怎么说。",
    intro: "几位开发者装上 Tokenscope 之后就没卸过 —— 他们的反馈。",
    role: "全栈（前端）工程师",
    ariaPrefix: "在 X 上查看",
    ariaSuffix: "",
    quotes: [
      "用起来挺有意思 —— 每次用量越过下一个 1 亿 Token，Tokenscope 都会放一个小烟花动画 🎉。莫名有点上瘾，确实让你觉得自己干了点儿什么。",
      "Token 数字非常准。我对着 GLM-5.2 跑了一段时间，把 Tokenscope 和 Coding-Plan 后台对了一下，两个数字完全对得上。当然，金额是估算的。",
      "Tokenscope 有个很实用的场景：看清在一个刷新周期内，各家 Coding-Plan 和订阅档位实际能用到多少 Token。智谱 Lite 的 5h Coding-Plan 大概 2000 万；字节火山方舟 Pro 5h 大概 7000 万。",
      "Tokenscope 的「按模型看 Token / 费用」一眼就能对比出不同模型有多贵。同样的用量，GLM-5.2 大概只要 Claude-Opus-4-8 的七分之一。",
      "Tokenscope 同时给你日、周、月三种维度的拆分，周和月的视图还能让你看清自己使用 AI 的习惯和规律，挺有意思的。再加上一个 GitHub 风格的 commit 热力图，能完整看到自己在 AI 上投了多少时间。",
      "Tokenscope 的截图功能也很方便 —— 一键就能分享到社交平台，大家可以一起对比一下，晒晒「成绩单」。",
    ],
  },

  finalCta: {
    h2: "开始追踪你的 Token。",
    sub: "免费、MIT 协议，常驻你的菜单栏。",
  },

  footer: {
    caption: "在 macOS 菜单栏中追踪你的 Claude Code Token 费用。",
    columns: {
      product: "产品",
      resources: "资源",
      install: "安装",
    },
    links: {
      breakdowns: "明细",
      how: "工作原理",
      pricing: "费用算法",
      faq: "常见问题",
      github: "GitHub",
      releases: "Releases",
      modelsDev: "models.dev",
      bugLog: "Bug 日志",
      homebrew: "Homebrew",
      dmg: ".dmg 下载",
    },
    copyright: "© 2026 HduSy · MIT License",
    builtWith: "Tauri · Rust + React 构建",
  },

  panel: {
    day: "日",
    week: "周",
    month: "月",
    totalTokens: "Total tokens",
    estCost: "Est. cost",
    inputShort: "In",
    inputLong: "Input",
    outputShort: "Out",
    outputLong: "Output",
    cachedSuffix: "cached",
    tokensByModel: "Tokens by model",
    costByModel: "Cost by model",
    emptyUsage: "这段时间没有用量",
    emptyMcp: "这段时间没有 MCP 调用",
    emptySkill: "这段时间没有 Skill 调用",
    requests: "Requests",
    sessionsSuffix: "次会话",
    costTrend: "Cost trend",
    trendSub: { Day: "今日 24h", Week: "本周", Month: "本月" },
    mcpCalls: "MCP calls",
    skillCalls: "Skill calls",
    servers: "个服务",
    skills: "个 Skill",
    dailyActivity: "Daily activity",
    unpriced: {
      singularSuffix: "个模型没有定价数据（不计费用）：",
      pluralSuffix: "个模型没有定价数据（不计费用）：",
    },
    footerEstimate: "价格来自 models.dev / LiteLLM · 估算",
    screenshot: "截图",
    themeLight: "切换到浅色",
    themeDark: "切换到深色",
    themeToggleAria: "切换主题",
    tooltipNoTokens: "无 Token",
    tooltipNoCalls: "无调用",
    tooltipTokensSuffix: "tokens",
    heatLess: "少",
    heatMore: "多",
    barListMore: "更多",
    barListLess: "收起",
  },

  dashboard: {
    weekdaysShort: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    weekdaysLong: [
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
      "星期日",
    ],
    dayPrefix: "第",
    vendorLocal: "本地",
    months: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
  },
};

// Make TS unhappy if zh.tsx drifts from the en.tsx shape.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: Dict = zh;
