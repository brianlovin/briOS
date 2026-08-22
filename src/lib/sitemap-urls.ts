import type { MetadataRoute } from "next";

import { getAmaQuestions } from "@/lib/ama";
import { SITE_CONFIG } from "@/lib/metadata";
import { getAppDissectionDatabaseItems, isPlaceholderNotionBuild } from "@/lib/notion";
import { buildSlug } from "@/lib/short-id";
import { INDEXABLE_SECTIONS } from "@/lib/site-copy";
import { getAllTilEntries } from "@/lib/til";
import { getAllWritingPosts } from "@/lib/writing";

function url(path: string): string {
  if (path === "/") return `${SITE_CONFIG.url}/`;
  return `${SITE_CONFIG.url}${path}`;
}

function entry(path: string, lastModified?: string | Date): MetadataRoute.Sitemap[number] {
  return {
    url: url(path),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
  };
}

async function safeList<T>(fn: () => Promise<T[]>, fallback: T[] = []): Promise<T[]> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

/**
 * Indexable public URLs for /sitemap.xml.
 * Honors robots: no /api/*, /dev/*, or noindex sandbox routes.
 */
export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    ...INDEXABLE_SECTIONS.map((section) => entry(section.href, now)),
    entry("/llms.txt", now),
    entry("/design-details", now),
  ];

  // INDEXABLE_SECTIONS already includes /app-dissection — don't duplicate.
  const unique = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const item of staticEntries) {
    unique.set(item.url, item);
  }

  if (isPlaceholderNotionBuild()) {
    return [...unique.values()];
  }

  const [posts, tils, ama, dissections] = await Promise.all([
    safeList(() => getAllWritingPosts()),
    safeList(() => getAllTilEntries()),
    safeList(() => getAmaQuestions()),
    safeList(() => getAppDissectionDatabaseItems()),
  ]);

  for (const post of posts) {
    if (!post.shortId) continue;
    unique.set(
      url(`/writing/${buildSlug(post.title, post.shortId)}`),
      entry(`/writing/${buildSlug(post.title, post.shortId)}`, post.published || post.createdTime),
    );
  }

  for (const til of tils) {
    if (!til.shortId) continue;
    unique.set(
      url(`/til/${buildSlug(til.title, til.shortId)}`),
      entry(`/til/${buildSlug(til.title, til.shortId)}`, til.published),
    );
  }

  for (const question of ama) {
    unique.set(
      url(`/ama/${question.id}`),
      entry(`/ama/${question.id}`, question.answeredAt || question.createdAt),
    );
  }

  for (const item of dissections) {
    unique.set(
      url(`/app-dissection/${item.slug}`),
      entry(`/app-dissection/${item.slug}`, item.published),
    );
  }

  return [...unique.values()];
}
