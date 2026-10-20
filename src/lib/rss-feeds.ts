import type { Feed } from "feed";

import { getAmaQuestions } from "@/lib/ama";
import { computerTipLink, getComputerTips, publicComputerTips } from "@/lib/computer";
import { getGoodWebsitesForRss } from "@/lib/goodWebsites";
import { SITE_CONFIG, truncateDescription } from "@/lib/metadata";
import {
  getAmaItemContent,
  getAppDissectionDatabaseItems,
  getAppDissectionItemBySlug,
  getComputerItemContent,
  getTilItemContent,
  getWritingPostContent,
  type GoodWebsiteItemWithDate,
  type NotionAmaItem,
  type NotionAppDissectionItem,
  type NotionAppDissectionItemWithContent,
  type NotionComputerItem,
  type NotionStackItem,
  type NotionTilItem,
  type NotionWritingItem,
  type ProcessedBlock,
} from "@/lib/notion";
import { extractPreviewText, richTextPlainText } from "@/lib/notion/types";
import {
  anchorHtml,
  blocksToHtml,
  escapeHtml,
  imageHtml,
  linkHtml,
  videoLinkHtml,
} from "@/lib/notion-to-html";
import { addRssItem, createRssFeed } from "@/lib/rss";
import { buildSlug } from "@/lib/short-id";
import { getStacks } from "@/lib/stack";
import { getAllTilEntries } from "@/lib/til";
import { getAllWritingPosts } from "@/lib/writing";

const SUMMARY_MAX_LENGTH = 280;

/** One feed item plus its Notion body; `content` is null when the body fetch failed. */
export type FeedEntry<T, C> = { item: T; content: C | null };

/** `complete` is false when any body failed, so callers can shorten the cache life. */
export type FeedEntries<T, C> = { entries: FeedEntry<T, C>[]; complete: boolean };

async function withContent<T, C>(
  items: T[],
  load: (item: T) => Promise<C | null>,
): Promise<FeedEntries<T, C>> {
  let complete = true;
  const entries = await Promise.all(
    items.map(async (item) => {
      try {
        return { item, content: await load(item) };
      } catch {
        complete = false;
        return { item, content: null };
      }
    }),
  );
  return { entries, complete };
}

function summarize(text: string | null | undefined): string {
  const normalized = (text ?? "").replace(/\s+/g, " ").trim();
  return normalized ? truncateDescription(normalized, SUMMARY_MAX_LENGTH) : "";
}

const SUMMARY_FALLBACK_TYPES = new Set<ProcessedBlock["type"]>([
  "bulleted_list_item",
  "numbered_list_item",
  "quote",
  "callout",
  "toggle",
  "to_do",
]);

/** First paragraph, else the first list/quote/callout text, so list-only posts still get a summary. */
function blocksSummary(blocks: ProcessedBlock[] | undefined): string {
  if (!blocks) return "";
  const paragraph = summarize(extractPreviewText(blocks, { maxBlocks: 1 }));
  if (paragraph) return paragraph;
  for (const block of blocks) {
    if (SUMMARY_FALLBACK_TYPES.has(block.type) && "content" in block) {
      const text = summarize(richTextPlainText(block.content));
      if (text) return text;
    }
  }
  return "";
}

function paragraphHtml(text: string): string {
  return `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;
}

function readOnSiteHtml(url: string): string {
  return `<p>${linkHtml(url, "Read on brianlovin.com")}</p>`;
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** RSS readers treat `description` as HTML, so plain-text summaries are escaped. */
function addFeedItem(feed: Feed, item: Parameters<typeof addRssItem>[1]): void {
  addRssItem(feed, { ...item, description: item.description && escapeHtml(item.description) });
}

function joinHtml(parts: string[]): string {
  return parts.filter(Boolean).join("\n");
}

// ===== Writing =====

export type WritingFeedEntry = FeedEntry<NotionWritingItem, { blocks: ProcessedBlock[] }>;

export async function loadWritingFeedEntries(): Promise<
  FeedEntries<NotionWritingItem, { blocks: ProcessedBlock[] }>
> {
  const posts = (await getAllWritingPosts()).filter((post) => post.shortId);
  return withContent(posts, (post) => getWritingPostContent(post.id));
}

export function buildWritingFeed(entries: WritingFeedEntry[]): Feed {
  const feed = createRssFeed({
    title: "Writing",
    description: "Essays, guides, and thoughts on design, engineering, and product development",
    path: "/writing",
  });

  for (const { item: post, content } of entries) {
    if (!post.shortId) continue;
    const url = `${SITE_CONFIG.url}/writing/${buildSlug(post.title, post.shortId)}`;
    const date = new Date(post.published || post.createdTime);
    const body = content ? blocksToHtml(content.blocks) : "";

    addFeedItem(feed, {
      title: post.title,
      id: post.id,
      link: url,
      description: summarize(post.excerpt) || blocksSummary(content?.blocks) || post.title,
      content: joinHtml([
        body || (post.excerpt ? paragraphHtml(post.excerpt) : ""),
        readOnSiteHtml(url),
      ]),
      date,
      published: date,
      image: post.featureImage,
    });
  }

  return feed;
}

// ===== TIL =====

export type TilFeedEntry = FeedEntry<NotionTilItem, { blocks: ProcessedBlock[] }>;

export async function loadTilFeedEntries(): Promise<
  FeedEntries<NotionTilItem, { blocks: ProcessedBlock[] }>
> {
  const entries = (await getAllTilEntries()).filter((entry) => entry.shortId);
  return withContent(entries, (entry) => getTilItemContent(entry.id));
}

export function buildTilFeed(entries: TilFeedEntry[]): Feed {
  const feed = createRssFeed({
    title: "TIL",
    description: "Today I Learned - Quick notes and discoveries",
    path: "/til",
  });

  for (const { item: entry, content } of entries) {
    if (!entry.shortId) continue;
    const url = `${SITE_CONFIG.url}/til/${buildSlug(entry.title, entry.shortId)}`;
    const date = new Date(entry.published);

    addFeedItem(feed, {
      title: entry.title,
      id: entry.id,
      link: url,
      description: blocksSummary(content?.blocks) || entry.title,
      content: joinHtml([content ? blocksToHtml(content.blocks) : "", readOnSiteHtml(url)]),
      date,
      published: date,
    });
  }

  return feed;
}

// ===== AMA =====

export type AmaFeedEntry = FeedEntry<NotionAmaItem, { blocks: ProcessedBlock[] }>;

export async function loadAmaFeedEntries(): Promise<
  FeedEntries<NotionAmaItem, { blocks: ProcessedBlock[] }>
> {
  const questions = await getAmaQuestions();
  return withContent(questions, (question) => getAmaItemContent(question.id));
}

export function buildAmaFeed(entries: AmaFeedEntry[]): Feed {
  const feed = createRssFeed({
    title: "AMA",
    description: "Ask Me Anything - Questions and answers",
    path: "/ama",
  });

  for (const { item: question, content } of entries) {
    const url = `${SITE_CONFIG.url}/ama/${question.id}`;
    const date = new Date(question.answeredAt);
    const details = question.description?.trim();

    addFeedItem(feed, {
      title: question.title,
      id: question.id,
      link: url,
      description: blocksSummary(content?.blocks) || summarize(details) || `AMA: ${question.title}`,
      content: joinHtml([
        details ? `<blockquote>${paragraphHtml(details)}</blockquote>` : "",
        content ? blocksToHtml(content.blocks) : "",
        readOnSiteHtml(url),
      ]),
      date,
      published: date,
    });
  }

  return feed;
}

// ===== App Dissection =====

export type AppDissectionFeedEntry = FeedEntry<
  NotionAppDissectionItem,
  Pick<NotionAppDissectionItemWithContent, "introBlocks" | "details">
>;

export async function loadAppDissectionFeedEntries(): Promise<
  FeedEntries<NotionAppDissectionItem, NotionAppDissectionItemWithContent>
> {
  const items = await getAppDissectionDatabaseItems();
  return withContent(items, (item) => getAppDissectionItemBySlug(item.slug));
}

function appDissectionBodyHtml(
  content: Pick<NotionAppDissectionItemWithContent, "introBlocks" | "details">,
): string {
  return joinHtml([
    blocksToHtml(content.introBlocks),
    ...content.details.map((detail) =>
      joinHtml([
        `<h2>${escapeHtml(detail.title)}</h2>`,
        blocksToHtml(detail.descriptionBlocks),
        ...(detail.video?.urls ?? []).map((src, index, urls) =>
          videoLinkHtml(
            src,
            urls.length > 1 ? `Watch video ${index + 1} of ${urls.length}` : "Watch the video",
          ),
        ),
      ]),
    ),
  ]);
}

export function buildAppDissectionFeed(entries: AppDissectionFeedEntry[]): Feed {
  const feed = createRssFeed({
    title: "App Dissection",
    description: "Detailed design breakdowns of iOS and Android apps",
    path: "/app-dissection",
  });

  for (const { item, content } of entries) {
    const url = `${SITE_CONFIG.url}/app-dissection/${item.slug}`;
    const date = new Date(item.published);

    addFeedItem(feed, {
      title: item.name,
      id: item.slug,
      link: url,
      description: blocksSummary(content?.introBlocks) || `A design breakdown of ${item.name}`,
      content: joinHtml([content ? appDissectionBodyHtml(content) : "", readOnSiteHtml(url)]),
      date,
      published: date,
    });
  }

  return feed;
}

// ===== Computer tips =====

export type ComputerFeedEntry = FeedEntry<NotionComputerItem, { blocks: ProcessedBlock[] }>;

export async function loadComputerFeedEntries(): Promise<
  FeedEntries<NotionComputerItem, { blocks: ProcessedBlock[] }>
> {
  const tips = publicComputerTips(await getComputerTips()).sort(
    (a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime(),
  );
  return withContent(tips, (tip) => getComputerItemContent(tip.id));
}

export function buildComputerFeed(entries: ComputerFeedEntry[]): Feed {
  const feed = createRssFeed({
    title: "How to Computer Better",
    description: "A living list of tips to use your computer better",
    path: "/computer",
  });

  for (const { item: tip, content } of entries) {
    const link = computerTipLink(tip);
    if (!link) continue;
    const url = `${SITE_CONFIG.url}${link.href}`;
    const date = new Date(tip.createdTime);

    addFeedItem(feed, {
      title: tip.title,
      id: tip.id,
      link: url,
      description: blocksSummary(content?.blocks) || tip.title,
      content: joinHtml([content ? blocksToHtml(content.blocks) : "", readOnSiteHtml(url)]),
      date,
      published: date,
    });
  }

  return feed;
}

// ===== Stack =====

export async function loadStackFeedItems(): Promise<NotionStackItem[]> {
  return (await getStacks())
    .filter((item) => item.status?.toLowerCase() === "active")
    .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());
}

function screenshotHtml(name: string, image: string | undefined, href: string | undefined) {
  if (!image) return "";
  const img = imageHtml(image, `Screenshot of ${name}`);
  if (!img) return "";
  return `<figure>${href ? anchorHtml(href, img) : img}</figure>`;
}

export function buildStackFeed(items: NotionStackItem[]): Feed {
  const feed = createRssFeed({
    title: "Stack",
    description: "Apps, tools, and services I use every day",
    path: "/stack",
  });

  for (const item of items) {
    const date = new Date(item.createdTime);
    const description = item.description?.trim();

    addFeedItem(feed, {
      title: item.name,
      id: item.id,
      link: item.url || `${SITE_CONFIG.url}/stack`,
      description: summarize(description) || `${item.name} - part of my daily stack`,
      content: joinHtml([
        description ? paragraphHtml(description) : "",
        screenshotHtml(item.name, item.previewImage || item.image, item.url),
        item.platforms?.length ? `<p>Platforms: ${escapeHtml(item.platforms.join(", "))}</p>` : "",
        item.url ? `<p>${linkHtml(item.url, `Visit ${hostname(item.url)}`)}</p>` : "",
      ]),
      date,
      published: date,
    });
  }

  return feed;
}

// ===== Good Websites =====

export async function loadGoodWebsitesFeedItems(): Promise<GoodWebsiteItemWithDate[]> {
  return getGoodWebsitesForRss();
}

export function buildGoodWebsitesFeed(websites: GoodWebsiteItemWithDate[]): Feed {
  const feed = createRssFeed({
    title: "Good Websites",
    description: "A curated collection of inspirational good websites",
    path: "/sites",
  });

  for (const website of websites) {
    const date = new Date(website.createdTime);
    const tags = website.tags?.length ? website.tags.join(", ") : "";
    const site = website.url ? hostname(website.url) : "";

    addFeedItem(feed, {
      title: website.name,
      id: website.id,
      link: website.url || `${SITE_CONFIG.url}/sites`,
      description: [site, tags].filter(Boolean).join(" · ") || "A good website",
      content: joinHtml([
        screenshotHtml(website.name, website.previewImage, website.url),
        website.url ? `<p>${linkHtml(website.url, `Visit ${site}`)}</p>` : "",
        tags ? `<p>Tags: ${escapeHtml(tags)}</p>` : "",
        website.x ? `<p>${linkHtml(website.x, "On X")}</p>` : "",
      ]),
      date,
      published: date,
    });
  }

  return feed;
}
