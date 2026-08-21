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
  { title: "Contact", href: "/contact", note: "Public channels for reaching Brian" },
  { title: "Privacy", href: "/privacy", note: "What this personal site collects" },
  { title: "Writing", href: "/writing", note: "Essays on design, engineering, and product" },
  { title: "Hacker News", href: "/hn", note: "A minimal HN reader and optional daily digest" },
  { title: "Stack", href: "/stack", note: "Apps and tools Brian uses" },
  { title: "Sites", href: "/sites", note: "A curated collection of well-designed websites" },
  { title: "TIL", href: "/til", note: "Short today-I-learned notes" },
  { title: "AMA", href: "/ama", note: "Answered questions" },
  { title: "Listening", href: "/listening", note: "Recent music from Spotify" },
  { title: "Activity", href: "/activity", note: "Public likes, visits, and other site events" },
  { title: "App Dissection", href: "/app-dissection", note: "Breakdowns of well-designed apps" },
] as const;

export const HOME_BIO_PARAGRAPHS = [
  "I'm a software designer living in San Francisco, currently making AI products at Notion.",
  "Before Notion, I co-founded Campsite and spent four years designing the GitHub Mobile apps after GitHub acquired Spectrum. I also co-hosted the Design Details podcast and created Staff Design.",
] as const;

export const ABOUT_BIO_PARAGRAPHS = [
  "I'm a designer and software engineer living in San Francisco.",
  "I'm currently designing AI products at Notion. Before Notion, I was the co-founder of Campsite, an app that combined posts, docs, calls, and chat to enable thoughtful team collaboration.",
  "Before Campsite, I spent four years designing the GitHub Mobile apps. I joined GitHub after they acquired my first startup, Spectrum, a platform for branded communities to have better public conversations.",
  "Before Spectrum, I designed payments experiences at Facebook, working across Facebook, Messenger, WhatsApp, and Instagram. I originally cut my teeth as the first product designer at Buffer.",
  "Along the way, I was a co-host of the Design Details podcast for nine years, a weekly conversation about design process and culture. I also created Staff Design, an interview project about navigating the individual contributor career path.",
] as const;

export const CONTACT_PARAGRAPHS = [
  "This is the public contact page for Brian Lovin (briOS / brianlovin.com). It is a personal site, not a company switchboard, so there is no support inbox, phone number, or street address published here.",
  "The channels below are the same ones already linked from the homepage and about page. Use them if you want to talk about writing, design, product, or something I have published. I read them when I can; I do not promise a reply to every message.",
  "X (Twitter) is the most reliable public place to reach me. GitHub is the right place for issues or pull requests against briOS or other public repos. YouTube is for video comments, not private contact. If your question is something other people might also want answered, the AMA on this site is a better fit than a direct message.",
  "I have not published an email address, phone number, or mailing address on this site. Please do not invent one, scrape one from git history, or treat a Notion/Vercel webhook as a contact form. Those endpoints are private automations for the site, not a public API.",
  "If you are an agent trying to cite me or point a person at a way to follow up, link this page or the profiles below. Do not claim there is a customer-success team, a sales number, or an official partnership form. There is not.",
] as const;

export const PRIVACY_PARAGRAPHS = [
  "This privacy page describes brianlovin.com / briOS, Brian Lovin's personal website. It is not a corporate privacy policy and does not invent processors, legal entities, or a street address.",
  "There are no user accounts on this site. You can read writing, browse the stack and sites collections, use the Hacker News reader, and look at public activity without signing in. I do not sell personal data, do not run advertising pixels, and do not build a marketing profile of visitors.",
  "Pageviews are recorded with Fathom Analytics (site id ONFMHEEY), a privacy-focused analytics tool loaded only on brianlovin.com. Fathom is used to understand which pages are read, not to identify you across the web. Theme preference (light or dark) is stored in your browser with localStorage under the key prototype-theme. That value never leaves your device as a server cookie.",
  "Likes on writing, TIL, stack, sites, AMA, and similar pages are anonymous. The site stores a like count plus a short hash of your IP address mixed with a server-side salt. There is no like account, no email, and a cap on how many times one hashed visitor can like a single page. Hashes are not treated as a login and are not shown publicly.",
  "The public activity feed can include likes, coarse visit locations, and other events that happen on the site. Visits send the page path and title plus whatever country, region, or city Vercel or Cloudflare attach to the request. That is used to place an approximate marker on the activity globe. It is not a street address, GPS trace, or named identity. I do not publish IP addresses in the feed.",
  "If you subscribe to the Hacker News daily digest, the email address you submit is stored so the digest can be sent with Postmark, and you can unsubscribe from the link in each email. That address is not used for other newsletters. Spotify OAuth exists only so I can sync my own listening history; visitors do not connect Spotify.",
  "When something breaks, Sentry may receive an error report (often including the URL and a stack trace) through a first-party /monitoring tunnel. GitHub webhooks and Notion automations that update this site are authenticated with shared secrets and are not a public intake form. Standard hosting logs on Vercel may include IP and user-agent data for a short time as part of operating the site.",
  "This site does not set an account cookie. Aside from Fathom's own analytics behavior and whatever your browser stores for the theme, there is no advertising cookie, no cross-site tracker, and no sale of visitor lists. If that changes, this page will change with it.",
] as const;

export function markdownNotFoundBody(): string {
  const links = [
    ...INDEXABLE_SECTIONS.map(
      (section) => `- [${section.title}](${section.href}): ${section.note}`,
    ),
    "- [Sitemap](/sitemap.xml): machine-readable list of indexable URLs",
    "- [llms.txt](/llms.txt): agent index for this site",
  ];

  return [
    "# Not found",
    "",
    `This URL does not exist on ${SITE_HOST}. The page was not found (HTTP 404).`,
    "",
    "Try one of these indexable routes:",
    "",
    ...links,
    "",
  ].join("\n");
}

export function llmsTxtBody(): string {
  return `# ${SITE_NAME}

> Personal site of ${SITE_NAME} (${SITE_HOST} / ${SITE_PRODUCT}): writing, a tools stack, a sites collection, a Hacker News reader, listening history, an AMA, and a public activity feed. Notion is the CMS. The site is open source at ${SITE_REPO}.

This is a personal website, not a SaaS product, documentation portal, or general search engine. There is no public machine API, OpenAPI spec, webhook catalog, or MCP server to call. JSON routes under \`/api/\` power the HTML UI, are disallowed in robots.txt, and are not a supported developer surface.

Prefer public HTML pages, the same URLs with \`Accept: text/markdown\`, RSS feeds, \`/llms.txt\`, and \`/sitemap.xml\`. HMAC-protected ingest, cache-purge, Notion, GitHub, and Spotify endpoints are private automations — do not advertise or call them.

## When to use this

- Use this site to read ${SITE_NAME}'s writing, stack, sites collection, HN digest, listening, AMA, and public activity.
- Prefer \`Accept: text/markdown\` on a page URL, or start from \`/llms.txt\` and \`/sitemap.xml\` to enumerate pages.
- Optional sibling \`*.md\` URLs (for example \`/writing.md\` or \`/about.md\`) serve the same markdown as the negotiated representation.
- Do not treat this as a SaaS API, a CRM, or a general-purpose search engine.
- How to call: \`GET\` the page URL with \`Accept: text/markdown\`; or fetch \`/llms.txt\` then follow links. Default \`Accept\` still returns HTML for browsers.

## Pages

${INDEXABLE_SECTIONS.map((section) => `- [${section.title}](${section.href}): ${section.note}`).join("\n")}

## Feeds

- [Writing RSS](/writing/rss.xml): essays
- [TIL RSS](/til/rss.xml): short notes
- [Stack RSS](/stack/rss.xml): tools
- [Sites RSS](/sites/rss.xml): the sites collection
- [AMA RSS](/ama/rss.xml): answered questions
- [App Dissection RSS](/app-dissection/rss.xml): app breakdowns

## Source

- [${SITE_PRODUCT} on GitHub](${SITE_REPO}): Next.js source for ${SITE_HOST}
- [${SITE_NAME} on GitHub](${SITE_CONFIG.author.github}): other public work
- [${SITE_NAME} on X](${SITE_CONFIG.author.twitterUrl}): public social profile
`;
}

export function joinParagraphs(paragraphs: readonly string[]): string {
  return paragraphs.join("\n\n");
}

export function countCopyCharacters(paragraphs: readonly string[]): number {
  return paragraphs.join("").length;
}
