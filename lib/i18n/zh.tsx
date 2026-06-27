// Chinese (Simplified) dictionary. Conforms to the `Dict` type derived from
// en.tsx — TypeScript flags any missing key or shape mismatch.
//
// Brand names (Tokenscope, Claude Code, Anthropic, MCP, Skill, models.dev,
// LiteLLM, Homebrew, GLM-5.2, ccusage) stay in Latin; "Token" stays as
// "Token" since that's how Chinese developers write it.

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
      "一款 macOS 菜单栏应用，显示你的 Claude Code Token 费用：每日花销、按模型拆分、MCP 与 Skill 调用次数。只读，无需 API key。",
    ogDescription:
      "随时查看你的 Claude Code 消耗了多少、花了多少钱。每日 Token 费用、按模型拆分、MCP 和 Skill 调用次数，全在你的 macOS 菜单栏。",
    ogAlt: "Tokenscope — Claude Code Token 费用，全在你的 macOS 菜单栏",
  },

  jsonLd: {
    description:
      "一款 macOS 菜单栏应用，显示你的 Claude Code Token 费用：每日花销、按模型拆分、MCP 与 Skill 调用次数。只读，无需 API key。",
    features: [
      "在 macOS 菜单栏中按日、周、月查看 Claude Code Token 费用",
      "按四种 Token 类型（输入、缓存写入、缓存读取、输出）分别估算费用，价格来自 models.dev 与 LiteLLM",
      "按模型拆分的 Token 与费用明细",
      "MCP 服务与 Skill 调用次数统计",
      "GitHub 风格的每日活动热力图",
      "只读：直接解析本地 JSONL 日志，无需 API key，无遥测",
    ],
  },

  nav: {
    breakdowns: "面板明细",
    how: "工作原理",
    pricing: "费用计算",
    faq: "常见问题",
    github: "在 GitHub 上查看",
    share: "分享",
    themeToggle: "切换主题",
    backToTop: "回到顶部",
    langSwitchLabel: "切换语言",
    en: "EN",
    zh: "中",
    skipToContent: "跳到主要内容",
    copyLink: "复制链接",
    linkCopied: "链接已复制",
    linkCopyFailed: "复制失败，请手动复制 URL",
    qrModalClose: "关闭",
    qrScanWith: (platform: string) => `使用「${platform}」扫一扫`,
    qrInstruction: "在 App 中打开后即可分享。",
    linkCopiedPasteIn: (platform: string) => `链接已复制，请在「${platform}」中粘贴分享`,
    sharePlatforms: {
      wechat: "微信",
      wechatMoments: "朋友圈",
      xiaohongshu: "小红书",
      weibo: "微博",
      qq: "QQ",
      qzone: "QQ空间",
    },
  },

  hero: {
    pill: "适用于 Claude Code 的 macOS 菜单栏小工具",
    h1Lead: "随时查看你的 Claude Code",
    h1Accent: "消耗了多少 Token，花了多少钱。",
    sub: "一个常驻菜单栏的 dashboard，以模型维度统计每日/周/月 Token 消耗量与费用，以及 MCP 与 Skill 调用次数。只读，零侵入。",
  },

  cta: {
    install: "通过 Homebrew 安装",
    github: "在 GitHub 上查看",
  },

  pipeline: {
    h2: "只读、不上传数据，也不需要 API key。",
    intro:
      "Tokenscope 直接读取 Claude Code 写到磁盘中的 JSONL 请求日志文件。不上传，不需要 API key，也不调用 Anthropic 接口，所有数据都留在你的 Mac 上。不存在安全隐私问题，也不追踪分析使用数据。",
    steps: {
      read: {
        title: "读取",
        body: (
          <>
            扫描{" "}
            <code className={code}>~/.claude/projects/**/*.jsonl</code>，解析每一条
            assistant 消息的 usage、模型和工具调用。
          </>
        ),
      },
      dedupe: {
        title: "去重",
        body: (
          <>
            按 <code className={code}>message.id</code>{" "}
            去重，合并多段消息，每轮只统计一次。
          </>
        ),
      },
      price: {
        title: "计价",
        body: (
          <>
            优先从{" "}
            <a
              href="https://models.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              models.dev
            </a>{" "}
            获取，其次{" "}
            <a
              href="https://github.com/BerriAI/litellm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              LiteLLM
            </a>
            ，兜底使用内置快照。本地缓存有效期 24 小时，保证离线下可用。
          </>
        ),
      },
      show: {
        title: "展示",
        body: (
          <>
            菜单栏实时显示用量，点开查看完整看板，后台每 30s 自动刷新，并支持右键主动刷新。
          </>
        ),
      },
    },
  },

  breakdowns: {
    h2: "每日/周/月的 Token 消耗明细。",
    intro:
      "按模型占比、MCP、Skill 调用次数进行统计，一眼看出哪些模型更烧钱、经常用的是哪些工具。",
    costByModel: {
      title: "模型费用占比",
      sub: "每个周期，钱都花在哪些模型上。",
    },
    tools: {
      title: "你用过的工具",
      sub: "只显示你自己安装的 MCP 和 Skill。",
    },
    year: {
      title: "Token 消耗热图",
      sub: "过去十二个月的每日 Token 用量。",
    },
    cache: {
      title: "缓存改变一切",
      pctSuffix: "% 命中缓存",
      footnote:
        "Claude Code 会把长上下文写入提示缓存（cache write），下次同样的请求直接从缓存重放（cache read）。" +
        "缓存写入比普通输入贵约 25%，缓存命中的单价却只有普通输入的约 10%。" +
        "一段持续会话里，系统提示、项目文件、工具描述会被反复作为上下文携带，命中率越高越省钱。",
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
    mcpFootnote:
      "Anthropic 自带的所有 MCP 和内置工具已被过滤掉。",
    skillFootnotePrefix: "从你的",
    skillFootnotePath: "~/.claude/skills/",
    skillFootnoteSuffix: "目录读取。",
  },

  tokenMath: {
    h2: "你的 Claude Code Token 费用是怎么算出来的。",
    intro:
      "每条 JSONL 请求记录着用量。Tokenscope 会按会话汇总，分别乘以模型对应类型的单价，再把四项加起来，就得到了本次请求的总花费。",
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
    closingExample: {
      lead: "注意",
      cacheTokens: "2.4M 的缓存读取 Token",
      cacheCost: "只花了 $0.72。",
      mid: "而",
      outputTokens: "0.32M 的输出 Token",
      outputCost:
        "却花了 $4.80。消耗少了，费用反而高出六倍。费用由不同模型不同类型的输入输出单价合计，仅供参考，以实际账单为准。",
    },
  },

  install: {
    h2: "一行 Homebrew 命令即可安装。",
    intro:
      "Homebrew 会替你清除隔离标记，打开即用。之后每次开机都会自动运行在菜单栏中。",
    copyBtn: "复制",
    toastCopied: "已复制安装命令",
    toastFallback: "请手动选中并复制",
    directDownload: {
      lead: "想直接下载？去 GitHub Releases 下载通用版",
      linkText: ".dmg",
      tail: (
        <>
          。它是未签名构建，所以首次启动后需要右键单击选择打开，或者在命令行中运行一次{" "}
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
    intro: "大家在选择 Tokenscope 之前通常会问到的问题。",
    items: [
      {
        q: "Tokenscope 会不会把我的数据发送到网络上？",
        aPlain:
          "不会。Tokenscope 直接读取 Claude Code 写在 ~/.claude/projects/ 里的 JSONL 日志，用本地缓存的 models.dev 和 LiteLLM 价格快照计价，将统计结果显示在 dashboard 中。不收集遥测数据，不需要账号，也不需要 API key。",
        a: (
          <>
            不会。它直接读取 Claude Code 写在{" "}
            <code className={code}>~/.claude/projects/</code>{" "}
            里的 JSONL 日志，用本地缓存的{" "}
            <a
              href="https://models.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              models.dev
            </a>{" "}
            和{" "}
            <a
              href="https://github.com/BerriAI/litellm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              LiteLLM
            </a>{" "}
            价格快照计价，将统计结果显示在你的 dashboard
            中。不收集遥测数据，不需要账号，也不需要 API key。
          </>
        ),
      },
      {
        q: "为什么 .dmg 会提示来自未认证的开发者？",
        aPlain:
          "这个 cask 还没通过 Apple Developer 计划公证。Homebrew 会替你清除隔离标记，所以 brew 安装完即可使用。如果是直接下载 .dmg，第一次右键点击选择打开，或者运行一次 xattr -cr /Applications/Tokenscope.app 再打开。",
        a: (
          <>
            这个 cask 还没通过 Apple Developer 计划公证。Homebrew 会替你清除隔离标记，所以 brew 安装完即可使用。如果是直接下载{" "}
            <code className={code}>.dmg</code>，第一次右键 → 打开，或者运行一次{" "}
            <code className={code}>
              xattr -cr /Applications/Tokenscope.app
            </code>{" "}
            再打开。
          </>
        ),
      },
      {
        q: "花费计算",
        aPlain:
          "输入输出类型（输入、缓存写入、缓存读取、输出）分别按对应单价计算，价格优先从 models.dev 获取，其次 LiteLLM，离线时兜底使用内置快照。价格数据本地缓存有效期 24 小时。对于有公开报价的 Claude 模型，数字和 Anthropic 的账单精确到分；没有公开定价的模型暂时在面板里标记为 unpriced。",
        a: (
          <>
            输入输出类型——输入、缓存写入、缓存读取、输出——分别按对应单价计算，价格优先从{" "}
            <a
              href="https://models.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              models.dev
            </a>{" "}
            获取，其次{" "}
            <a
              href="https://github.com/BerriAI/litellm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              LiteLLM
            </a>
            ，离线时兜底使用内置快照。价格数据本地缓存有效期 24 小时。对于有公开报价的 Claude
            模型，数字和 Anthropic 的账单精确到分；没有公开定价的模型暂时在面板里标记为
            &ldquo;unpriced&rdquo;。
          </>
        ),
      },
      {
        q: "Tokenscope 和 ccusage 有什么不同？",
        aPlain:
          "ccusage（github.com/ryoppippi/ccusage）是一个终端命令行工具，读的是同一份 JSONL 文件。运行 npx ccusage 后，在 shell 里得到一次性汇总。Tokenscope 读同样的日志、用同样的 models.dev 和 LiteLLM 价格表，但以菜单栏 GUI 的形式呈现。今天的 Token 费用始终可见，面板里还有柱状图、圆环图、热力图。需要可脚本化的终端命令就用 ccusage；想随时可视化用量，就用 Tokenscope。",
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
            是一个终端命令行工具，读的是同一份 JSONL 文件。运行{" "}
            <code className={code}>npx ccusage</code>{" "}
            后，在 shell 里得到一次性汇总。Tokenscope 读同样的日志、用同样的{" "}
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
            价格表，但以菜单栏 GUI 的形式呈现：今天的 Token 费用始终可见，面板里还有柱状图、圆环图、热力图。需要可脚本化的终端命令就用 ccusage；想随时可视化用量，就用 Tokenscope。
          </>
        ),
      },
      {
        q: "会不会拖慢我的 Mac？",
        aPlain:
          "不会。菜单栏进程只监听项目目录的文件变化，仅重新解析 mtime 有变动的文件。空闲时 CPU 基本为零，内存稳定在40MB。刷新面板也只是从上次读取位置往后扫一遍新增的 JSONL 字节。性能足够优秀。",
        a: (
          <>
            菜单栏进程监听项目目录的文件变化，仅重新解析{" "}
            <code className={code}>mtime</code>{" "}
            有变动的文件。空闲时 CPU 基本为零，内存稳定在40MB。刷新面板也只是从上次读取位置往后扫一遍新增的 JSONL 字节。性能足够优秀。
          </>
        ),
      },
      {
        q: "支持 Cursor、Codex CLI 或者其他终端吗？",
        aPlain:
          "目前只解析 Claude Code 的 JSONL 格式。其他工具的日志格式各不相同。想去支持某个工具？去 GitHub repo 上提个 issue，附上脱敏后的日志样例，我会考虑增加一种支持。",
        a: (
          <>
            目前只解析 Claude Code 的 JSONL 格式。其他工具的日志格式各不相同——想要支持某个工具的话，去{" "}
            <a
              href="https://github.com/HduSy/tokenscope/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
              style={linkBorder}
            >
              repo
            </a>{" "}
            上提个 issue，附上脱敏后的日志样例，我会考虑增加一种支持。
          </>
        ),
      },
      {
        q: "真的完全免费吗？",
        aPlain:
          "是的。Tokenscope 采用 MIT 协议，没有付费版本，也不会出售你的数据。源码在 github.com/HduSy/tokenscope。",
        a: (
          <>
            是的。MIT 协议，没有付费版本，也不会出售你的数据。仓库地址：{" "}
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
    h2: "正在使用 Tokenscope 的开发者如何评价。",
    intro: "几位开发者装上 Tokenscope 之后就没卸载过，下面是他们的反馈。",
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
    h2: "开始关注你的 Token 用量。",
    sub: "免费，MIT 协议，常驻你的菜单栏。",
  },

  footer: {
    caption: "在 macOS 菜单栏中追踪你的 Claude Code Token 费用。",
    columns: {
      product: "产品",
      resources: "资源",
      install: "安装",
    },
    links: {
      breakdowns: "面板明细",
      how: "工作原理",
      pricing: "费用计算",
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
    emptyUsage: "该时段无使用记录",
    emptyMcp: "该时段无 MCP 调用",
    emptySkill: "该时段无 Skill 调用",
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
