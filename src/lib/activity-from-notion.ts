import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import {
  type ActivityStore,
  recordAmaAnswered,
  recordSiteAdded,
  recordStackAdded,
  recordTilPublished,
  recordWritingPublished,
} from "./activity";
import { notion } from "./notion/client";
import { richText, select, title } from "./notion/properties";
import { type PurgeableContentType } from "./notion/purge";
import { isFullPage, type PageResponse } from "./notion/types";
import { buildSlug } from "./short-id";

export function titleFromNotionPage(page: unknown, propertyName = "Name"): string {
  if (!page || typeof page !== "object") return "Untitled";
  if (!isFullPage(page as PageResponse)) return "Untitled";
  return title((page as PageObjectResponse).properties, propertyName) ?? "Untitled";
}

export async function ingestActivityFromContentPurge(
  type: PurgeableContentType,
  pageId: string,
  store: ActivityStore,
): Promise<void> {
  const page = await notion.pages.retrieve({ page_id: pageId });
  if (!isFullPage(page)) return;

  const properties = page.properties;

  switch (type) {
    case "writing": {
      const postTitle = title(properties, "Name") ?? "Untitled";
      const slug = richText(properties, "Slug") ?? "";
      const shortId = richText(properties, "Short ID");
      const hrefSlug = slug || (shortId ? buildSlug(postTitle, shortId) : pageId);
      await recordWritingPublished({ id: pageId, title: postTitle, slug: hrefSlug }, store);
      return;
    }
    case "til": {
      const tilTitle = title(properties, "Title") ?? "Untitled";
      const shortId = richText(properties, "Short ID");
      const href = shortId ? `/til/${buildSlug(tilTitle, shortId)}` : `/til/${pageId}`;
      await recordTilPublished({ id: pageId, title: tilTitle, href }, store);
      return;
    }
    case "ama": {
      if (select(properties, "Status") !== "Answered") return;
      const amaTitle = title(properties, "Name") ?? "Untitled";
      await recordAmaAnswered({ id: pageId, title: amaTitle }, store);
      return;
    }
    case "stack": {
      await recordStackAdded({ id: pageId, title: title(properties, "Name") ?? "Untitled" }, store);
      return;
    }
    case "sites": {
      await recordSiteAdded({ id: pageId, title: title(properties, "Name") ?? "Untitled" }, store);
      return;
    }
  }
}
