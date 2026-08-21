import { HOME_PROJECTS } from "@/components/home/ProjectsList";
import { getAmaQuestions } from "@/lib/ama";
import { getDesignDetailsEpisodes } from "@/lib/design-details";
import { getGoodWebsitesSource } from "@/lib/goodWebsites";
import { getPostById, getRankedHNPosts } from "@/lib/hn";
import {
  getAmaItemContent,
  getAppDissectionDatabaseItems,
  getAppDissectionItemBySlug,
  getListeningHistoryDatabaseItems,
  getTilByShortId,
  getWritingPostByShortId,
  getWritingPostContentBySlug,
  isPlaceholderNotionBuild,
} from "@/lib/notion";
import { blocksToMarkdown } from "@/lib/notion-to-markdown";
import { buildSlug, extractShortIdFromSlug } from "@/lib/short-id";
import {
  ABOUT_BIO_PARAGRAPHS,
  CONTACT_PARAGRAPHS,
  HOME_BIO_PARAGRAPHS,
  INDEXABLE_SECTIONS,
  joinParagraphs,
  markdownNotFoundBody,
  PRIVACY_PARAGRAPHS,
  PUBLIC_PROFILES,
  SITE_HOST,
  SITE_NAME,
  SITE_PRODUCT,
  SITE_REPO,
} from "@/lib/site-copy";
import { getStacks } from "@/lib/stack";
import { getAllTilEntries, tilEntryLink } from "@/lib/til";
import { stripHtmlTags } from "@/lib/utils";
import { getAllWritingPosts, recentWritingLinks, writingPostLink } from "@/lib/writing";

export type MarkdownResult = {
  status: 200 | 404;
  body: string;
  cacheTags: string[];
};

function md(status: 200 | 404, body: string, cacheTags: string[] = []): MarkdownResult {
  return { status, body: body.trim() + "\n", cacheTags };
}

function linkList(items: Array<{ title: string; href: string; note?: string }>): string {
  return items
    .map((item) => {
      const abs = item.href.startsWith("http") ? item.href : item.href;
      return item.note ? `- [${item.title}](${abs}): ${item.note}` : `- [${item.title}](${abs})`;
    })
    .join("\n");
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

async function homeMarkdown(): Promise<MarkdownResult> {
  const posts = isPlaceholderNotionBuild() ? [] : await safe(() => getAllWritingPosts(), []);
  const writing = recentWritingLinks(posts);

  const body = [
    `# ${SITE_NAME}`,
    "",
    `${SITE_NAME}'s personal site (${SITE_HOST} / ${SITE_PRODUCT}). Designer and software engineer in San Francisco.`,
    "",
    joinParagraphs(HOME_BIO_PARAGRAPHS),
    "",
    "## Writing",
    "",
    writing.length > 0
      ? linkList(writing.map((post) => ({ title: post.title, href: post.href })))
      : `- [All writing](/writing): essays on design, engineering, and product`,
    "",
    "## Projects",
    "",
    linkList(
      HOME_PROJECTS.map((project) => ({
        title: project.name,
        href: project.href,
        note: project.description,
      })),
    ),
    "",
    "## Elsewhere",
    "",
    linkList(PUBLIC_PROFILES.map((profile) => ({ title: profile.name, href: profile.href }))),
    "",
    "## Sections",
    "",
    linkList(
      INDEXABLE_SECTIONS.map((section) => ({
        title: section.title,
        href: section.href,
        note: section.note,
      })),
    ),
    "",
    `[Source](${SITE_REPO}) · [llms.txt](/llms.txt) · [sitemap](/sitemap.xml)`,
  ].join("\n");

  return md(200, body, ["notion:writing"]);
}

async function aboutMarkdown(): Promise<MarkdownResult> {
  const body = [
    `# About`,
    "",
    `${SITE_NAME} — ${SITE_HOST} / ${SITE_PRODUCT}.`,
    "",
    joinParagraphs(ABOUT_BIO_PARAGRAPHS),
    "",
    "## Contact",
    "",
    linkList([
      ...PUBLIC_PROFILES.map((profile) => ({ title: profile.name, href: profile.href })),
      { title: "Contact", href: "/contact" },
      { title: "Privacy", href: "/privacy" },
    ]),
  ].join("\n");
  return md(200, body);
}

async function contactMarkdown(): Promise<MarkdownResult> {
  const body = [
    `# Contact`,
    "",
    joinParagraphs(CONTACT_PARAGRAPHS),
    "",
    "## Public channels",
    "",
    linkList([
      ...PUBLIC_PROFILES.map((profile) => ({
        title: profile.name,
        href: profile.href,
        note: profile.handle,
      })),
      { title: "AMA", href: "/ama", note: "Questions other people may also want answered" },
      { title: `${SITE_PRODUCT} source`, href: SITE_REPO },
    ]),
  ].join("\n");
  return md(200, body);
}

async function privacyMarkdown(): Promise<MarkdownResult> {
  const body = [
    `# Privacy`,
    "",
    joinParagraphs(PRIVACY_PARAGRAPHS),
    "",
    "## Related",
    "",
    linkList([
      { title: "Contact", href: "/contact" },
      { title: "About", href: "/about" },
      { title: SITE_REPO, href: SITE_REPO, note: "how the site is built" },
    ]),
  ].join("\n");
  return md(200, body);
}

async function writingIndexMarkdown(): Promise<MarkdownResult> {
  const posts = isPlaceholderNotionBuild() ? [] : await safe(() => getAllWritingPosts(), []);
  const links = posts
    .map(writingPostLink)
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const body = [
    `# Writing`,
    "",
    `Essays and reflections from ${SITE_NAME} on design, engineering, and building products.`,
    "",
    "## Posts",
    "",
    links.length > 0
      ? linkList(links.map((item) => ({ title: item.title, href: item.href })))
      : "- No published posts are available in this build.",
    "",
    `[RSS](/writing/rss.xml)`,
  ].join("\n");
  return md(200, body, ["notion:writing"]);
}

async function writingPostMarkdown(slug: string): Promise<MarkdownResult> {
  if (isPlaceholderNotionBuild()) return notFoundMarkdown();

  const shortId = extractShortIdFromSlug(slug);
  const content = shortId
    ? await safe(() => getWritingPostByShortId(shortId), null)
    : await safe(() => getWritingPostContentBySlug(slug), null);

  if (!content) return notFoundMarkdown();

  const { blocks, metadata } = content;
  const canonicalSlug = metadata.shortId ? buildSlug(metadata.title, metadata.shortId) : slug;
  const published = metadata.published || metadata.createdTime;

  const body = [
    `# ${metadata.title}`,
    "",
    published ? `Published ${published}` : "",
    metadata.excerpt ? `\n${metadata.excerpt}\n` : "",
    blocksToMarkdown(blocks),
    "",
    `[All writing](/writing) · [HTML](/writing/${canonicalSlug})`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  return md(200, body, ["notion:writing"]);
}

async function hnIndexMarkdown(): Promise<MarkdownResult> {
  const posts = await safe(() => getRankedHNPosts(), []);
  const body = [
    `# Hacker News`,
    "",
    `A minimal Hacker News reader by ${SITE_NAME}. This is not Hacker News itself; story permalinks on this site still point at the discussion.`,
    "",
    "## Stories",
    "",
    posts.length > 0
      ? linkList(
          posts.map((post) => ({
            title: stripHtmlTags(post.title),
            href: `/hn/${post.id}`,
            note: post.domain || undefined,
          })),
        )
      : "- Stories are loaded from the HN API when available.",
    "",
    `[Original HN](https://news.ycombinator.com)`,
  ].join("\n");
  return md(200, body, ["hn:ranked"]);
}

async function hnPostMarkdown(id: string): Promise<MarkdownResult> {
  const post = await safe(() => getPostById(id, true), null);
  if (!post) return notFoundMarkdown();

  const comments = (post.comments ?? [])
    .slice(0, 12)
    .map((comment) => {
      const text = comment.content ? stripHtmlTags(comment.content) : "";
      return `- **${comment.user || "anonymous"}**: ${text}`;
    })
    .join("\n");

  const body = [
    `# ${stripHtmlTags(post.title)}`,
    "",
    post.user
      ? `By ${post.user} · ${post.points ?? 0} points · ${post.comments_count} comments`
      : "",
    post.content ? `\n${stripHtmlTags(post.content)}\n` : "",
    post.url ? `[Source](${post.url})` : "",
    `[HN discussion](https://news.ycombinator.com/item?id=${post.id})`,
    "",
    comments ? `## Comments\n\n${comments}` : "",
    "",
    `[All stories](/hn)`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  return md(200, body, ["hn:post"]);
}

async function stackMarkdown(): Promise<MarkdownResult> {
  const items = isPlaceholderNotionBuild() ? [] : await safe(() => getStacks(), []);
  const body = [
    `# Stack`,
    "",
    `Apps, tools, and services ${SITE_NAME} uses.`,
    "",
    "## Tools",
    "",
    items.length > 0
      ? linkList(
          items.map((item) => ({
            title: item.name,
            href: item.url || "/stack",
            note: item.description,
          })),
        )
      : "- Stack items load from Notion when available.",
    "",
    `[RSS](/stack/rss.xml)`,
  ].join("\n");
  return md(200, body, ["notion:stack"]);
}

async function sitesMarkdown(): Promise<MarkdownResult> {
  const items = isPlaceholderNotionBuild() ? [] : await safe(() => getGoodWebsitesSource(), []);
  const body = [
    `# Sites`,
    "",
    `A curated collection of well-designed websites, maintained by ${SITE_NAME}.`,
    "",
    "## Collection",
    "",
    items.length > 0
      ? linkList(
          items.slice(0, 200).map((item) => ({
            title: item.name,
            href: item.url || "/sites",
            note: item.tags?.join(", "),
          })),
        )
      : "- Sites load from Notion when available.",
    "",
    `[RSS](/sites/rss.xml)`,
  ].join("\n");
  return md(200, body, ["notion:good-websites"]);
}

async function tilIndexMarkdown(): Promise<MarkdownResult> {
  const entries = isPlaceholderNotionBuild() ? [] : await safe(() => getAllTilEntries(), []);
  const links = entries
    .map(tilEntryLink)
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const body = [
    `# TIL`,
    "",
    `Today I Learned — short notes from ${SITE_NAME}.`,
    "",
    "## Notes",
    "",
    links.length > 0
      ? linkList(links.map((item) => ({ title: item.title, href: item.href })))
      : "- TIL entries load from Notion when available.",
    "",
    `[RSS](/til/rss.xml)`,
  ].join("\n");
  return md(200, body, ["notion:til"]);
}

async function tilEntryMarkdown(slug: string): Promise<MarkdownResult> {
  if (isPlaceholderNotionBuild()) return notFoundMarkdown();
  const shortId = extractShortIdFromSlug(slug);
  if (!shortId) return notFoundMarkdown();

  const content = await safe(() => getTilByShortId(shortId), null);
  if (!content) return notFoundMarkdown();

  const canonicalSlug = content.shortId ? buildSlug(content.title, content.shortId) : slug;
  const body = [
    `# ${content.title}`,
    "",
    content.published ? `Published ${content.published}` : "",
    "",
    blocksToMarkdown(content.blocks),
    "",
    `[All TIL](/til) · [HTML](/til/${canonicalSlug})`,
  ].join("\n");
  return md(200, body, ["notion:til"]);
}

async function amaIndexMarkdown(): Promise<MarkdownResult> {
  const questions = isPlaceholderNotionBuild() ? [] : await safe(() => getAmaQuestions(), []);
  const body = [
    `# AMA`,
    "",
    `Ask ${SITE_NAME} anything. Answered questions are listed here.`,
    "",
    "## Answers",
    "",
    questions.length > 0
      ? linkList(questions.map((item) => ({ title: item.title, href: `/ama/${item.id}` })))
      : "- Answered questions load from Notion when available.",
    "",
    `[RSS](/ama/rss.xml)`,
  ].join("\n");
  return md(200, body, ["notion:ama"]);
}

async function amaItemMarkdown(id: string): Promise<MarkdownResult> {
  if (isPlaceholderNotionBuild()) return notFoundMarkdown();
  const item = await safe(() => getAmaItemContent(id), null);
  if (!item) return notFoundMarkdown();

  const body = [
    `# ${item.title}`,
    "",
    item.description || "",
    "",
    blocksToMarkdown(item.blocks),
    "",
    `[All AMA](/ama)`,
  ].join("\n");
  return md(200, body, ["notion:ama"]);
}

async function listeningMarkdown(): Promise<MarkdownResult> {
  const page = isPlaceholderNotionBuild()
    ? { items: [] }
    : await safe(() => getListeningHistoryDatabaseItems(undefined, 40), {
        items: [],
        nextCursor: null,
      });

  const body = [
    `# Listening`,
    "",
    `Recent listening from ${SITE_NAME}, synced from Spotify.`,
    "",
    "## Recent tracks",
    "",
    page.items.length > 0
      ? linkList(
          page.items.map((item) => ({
            title: `${item.name} — ${item.artist}`,
            href: item.url || "/listening",
            note: item.album,
          })),
        )
      : "- Listening history loads from Notion when available.",
  ].join("\n");
  return md(200, body, ["notion:listening"]);
}

async function activityMarkdown(): Promise<MarkdownResult> {
  const body = [
    `# Activity`,
    "",
    `A live stream of likes, visits, and other public events on ${SITE_HOST}. The HTML page is a client-rendered feed with a globe; this markdown page describes what you will find there.`,
    "",
    "Events can include anonymous likes on writing and collections, coarse visit geography (country or city, never a street address), GitHub pull requests and stars that I have chosen to publish, and HN digest subscriptions (the email itself is never shown).",
    "",
    "## Related",
    "",
    linkList([
      { title: "Writing", href: "/writing" },
      { title: "Privacy", href: "/privacy", note: "what the feed collects" },
      { title: "Home", href: "/" },
    ]),
  ].join("\n");
  return md(200, body);
}

async function appDissectionIndexMarkdown(): Promise<MarkdownResult> {
  const items = isPlaceholderNotionBuild()
    ? []
    : await safe(() => getAppDissectionDatabaseItems(), []);
  const body = [
    `# App Dissection`,
    "",
    `Breakdowns of well-designed apps by ${SITE_NAME}.`,
    "",
    "## Apps",
    "",
    items.length > 0
      ? linkList(
          items.map((item) => ({
            title: item.name,
            href: `/app-dissection/${item.slug}`,
            note: item.description,
          })),
        )
      : "- App dissections load from Notion when available.",
    "",
    `[RSS](/app-dissection/rss.xml)`,
  ].join("\n");
  return md(200, body, ["notion:app-dissection"]);
}

async function appDissectionMarkdown(slug: string): Promise<MarkdownResult> {
  if (isPlaceholderNotionBuild()) return notFoundMarkdown();
  const post = await safe(() => getAppDissectionItemBySlug(slug), null);
  if (!post) return notFoundMarkdown();

  const details = post.details
    .map((detail) => `## ${detail.title}\n\n${blocksToMarkdown(detail.descriptionBlocks)}`)
    .join("\n\n");

  const body = [
    `# ${post.name}`,
    "",
    blocksToMarkdown(post.introBlocks),
    "",
    details,
    "",
    `[All app dissections](/app-dissection)`,
  ].join("\n");
  return md(200, body, ["notion:app-dissection"]);
}

async function designDetailsIndexMarkdown(): Promise<MarkdownResult> {
  const episodes = isPlaceholderNotionBuild()
    ? []
    : await safe(() => getDesignDetailsEpisodes(), []);
  const body = [
    `# Design Details`,
    "",
    `Episode notes from the Design Details podcast. ${SITE_NAME} was a co-host for nine years.`,
    "",
    "## Episodes",
    "",
    episodes.length > 0
      ? linkList(
          episodes.map((item) => ({
            title: item.title,
            href: `/design-details/${item.id}`,
          })),
        )
      : "- Episodes load from Notion when available.",
  ].join("\n");
  return md(200, body);
}

async function designDetailsMarkdown(id: string): Promise<MarkdownResult> {
  if (isPlaceholderNotionBuild()) return notFoundMarkdown();
  const episodes = await safe(() => getDesignDetailsEpisodes(), []);
  const episode = episodes.find((item) => item.id === id);
  if (!episode) return notFoundMarkdown();

  const body = [
    `# ${episode.title}`,
    "",
    episode.description || `A Design Details episode.`,
    episode.audioUrl ? `\n[Audio](${episode.audioUrl})\n` : "",
    `[All episodes](/design-details)`,
  ].join("\n");
  return md(200, body);
}

async function numbersMarkdown(): Promise<MarkdownResult> {
  const body = [
    `# Numbers`,
    "",
    "A small live counter page on this site: estimated world population, births today, and deaths today. It is a visual toy, not a statistics API.",
    "",
    "[Home](/)",
  ].join("\n");
  return md(200, body);
}

export function notFoundMarkdown(): MarkdownResult {
  return md(404, markdownNotFoundBody());
}

/**
 * Render the markdown representation of a public page path (no query string).
 * Unknown paths return HTTP 404 markdown so agents can recover.
 */
export async function renderPageMarkdown(pathname: string): Promise<MarkdownResult> {
  const path = pathname === "" ? "/" : pathname.replace(/\/+$/, "") || "/";

  if (path === "/") return homeMarkdown();
  if (path === "/about") return aboutMarkdown();
  if (path === "/contact") return contactMarkdown();
  if (path === "/privacy") return privacyMarkdown();
  if (path === "/writing") return writingIndexMarkdown();
  if (path === "/hn") return hnIndexMarkdown();
  if (path === "/stack") return stackMarkdown();
  if (path === "/sites") return sitesMarkdown();
  if (path === "/til") return tilIndexMarkdown();
  if (path === "/ama") return amaIndexMarkdown();
  if (path === "/listening") return listeningMarkdown();
  if (path === "/activity") return activityMarkdown();
  if (path === "/app-dissection") return appDissectionIndexMarkdown();
  if (path === "/design-details") return designDetailsIndexMarkdown();
  if (path === "/numbers") return numbersMarkdown();

  const writing = path.match(/^\/writing\/([^/]+)$/);
  if (writing) return writingPostMarkdown(writing[1]);

  const hn = path.match(/^\/hn\/(\d+)$/);
  if (hn) return hnPostMarkdown(hn[1]);

  const til = path.match(/^\/til\/([^/]+)$/);
  if (til) return tilEntryMarkdown(til[1]);

  const ama = path.match(/^\/ama\/([^/]+)$/);
  if (ama) return amaItemMarkdown(ama[1]);

  const dissection = path.match(/^\/app-dissection\/([^/]+)$/);
  if (dissection) return appDissectionMarkdown(dissection[1]);

  const details = path.match(/^\/design-details\/([^/]+)$/);
  if (details) return designDetailsMarkdown(details[1]);

  return notFoundMarkdown();
}

export function markdownCacheTagsForPath(pathname: string): string[] {
  if (pathname === "/" || pathname.startsWith("/writing")) return ["notion:writing"];
  if (pathname.startsWith("/stack")) return ["notion:stack"];
  if (pathname.startsWith("/sites")) return ["notion:good-websites"];
  if (pathname.startsWith("/til")) return ["notion:til"];
  if (pathname.startsWith("/ama")) return ["notion:ama"];
  if (pathname.startsWith("/listening")) return ["notion:listening"];
  if (pathname.startsWith("/app-dissection")) return ["notion:app-dissection"];
  if (pathname === "/hn") return ["hn:ranked"];
  if (pathname.startsWith("/hn/")) return ["hn:post"];
  return [];
}
