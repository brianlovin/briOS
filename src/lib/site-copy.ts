import { SITE_CONFIG } from "@/lib/metadata";

export const SITE_NAME = "Brian Lovin";
export const SITE_PRODUCT = "briOS";
export const SITE_HOST = "brianlovin.com";
export const SITE_REPO = "https://github.com/brianlovin/briOS";

export const PUBLIC_PROFILES = [
  { name: "X", href: SITE_CONFIG.author.twitterUrl, handle: SITE_CONFIG.author.twitter },
  { name: "GitHub", href: SITE_CONFIG.author.github, handle: "brianlovin" },
  { name: "YouTube", href: "https://www.youtube.com/@brian_lovin", handle: "@brian_lovin" },
] as const;

export const INDEXABLE_SECTIONS = [
  { title: "Home", href: "/", note: "Introduction, recent writing, and projects" },
  { title: "About", href: "/about", note: "Bio, work history, speaking, and investments" },
  { title: "Writing", href: "/writing", note: "Essays on design, engineering, and product" },
  { title: "Hacker News", href: "/hn", note: "A minimal HN reader and optional daily digest" },
  { title: "Stack", href: "/stack", note: "Apps and tools Brian uses" },
  { title: "Sites", href: "/sites", note: "A curated collection of well-designed websites" },
  { title: "TIL", href: "/til", note: "Short today-I-learned notes" },
  { title: "AMA", href: "/ama", note: "Answered questions" },
  {
    title: "How to Computer Better",
    href: "/computer",
    note: "Tips for shortcuts, hotkeys, and workflows",
  },
  {
    title: "How Terminals Work",
    href: "/how-terminals-work",
    note: "An interactive guide to understanding terminals",
  },
  { title: "Listening", href: "/listening", note: "Recent music from Spotify" },
  { title: "Activity", href: "/activity", note: "Public likes, visits, and other site events" },
  { title: "App Dissection", href: "/app-dissection", note: "Breakdowns of well-designed apps" },
] as const;

export const HOME_BIO_PARAGRAPHS = [
  "I'm a software designer living in San Francisco, currently making AI products at Notion.",
] as const;

export const ABOUT_BIO_PARAGRAPHS = [
  "I'm a designer and software engineer living in San Francisco.",
  "I'm currently designing AI products at Notion. Before Notion, I was the co-founder of Campsite, an app that combined posts, docs, calls, and chat to enable thoughtful team collaboration.",
  "Before Campsite, I spent four years designing the GitHub Mobile apps. I joined GitHub after they acquired my first startup, Spectrum, a platform for branded communities to have better public conversations.",
  "Before Spectrum, I designed payments experiences at Facebook, working across Facebook, Messenger, WhatsApp, and Instagram. I originally cut my teeth as the first product designer at Buffer.",
  "Along the way, I was a co-host of the Design Details podcast for nine years, a weekly conversation about design process and culture. I also created Staff Design, an interview project about navigating the individual contributor career path.",
] as const;

export function markdownNotFoundBody(): string {
  const links = [
    ...INDEXABLE_SECTIONS.map(
      (section) => `- [${section.title}](${section.href}): ${section.note}`,
    ),
    "- [Sitemap](/sitemap.xml): indexable URLs",
    "- [llms.txt](/llms.txt): site index for agents",
  ];

  return [
    "# Not found",
    "",
    `This URL does not exist on ${SITE_HOST}. The page was not found (HTTP 404).`,
    "",
    "Try one of these routes:",
    "",
    ...links,
    "",
  ].join("\n");
}

export function llmsTxtBody(): string {
  return `# ${SITE_NAME}

> Personal site of ${SITE_NAME} (${SITE_HOST} / ${SITE_PRODUCT}): writing, a tools stack, a sites collection, a Hacker News reader, listening history, an AMA, computer tips, an interactive terminals guide, and a public activity feed. Source: ${SITE_REPO}.

Prefer public HTML pages, the same URLs with \`Accept: text/markdown\`, RSS feeds, \`/llms.txt\`, and \`/sitemap.xml\`. There is no public API.

## Pages

${INDEXABLE_SECTIONS.map((section) => `- [${section.title}](${section.href}): ${section.note}`).join("\n")}

## Feeds

- [Writing RSS](/writing/rss.xml)
- [TIL RSS](/til/rss.xml)
- [Stack RSS](/stack/rss.xml)
- [Sites RSS](/sites/rss.xml)
- [AMA RSS](/ama/rss.xml)
- [App Dissection RSS](/app-dissection/rss.xml)

## Source

- [${SITE_PRODUCT} on GitHub](${SITE_REPO})
- [${SITE_NAME} on GitHub](${SITE_CONFIG.author.github})
- [${SITE_NAME} on X](${SITE_CONFIG.author.twitterUrl})
`;
}

export function joinParagraphs(paragraphs: readonly string[]): string {
  return paragraphs.join("\n\n");
}
