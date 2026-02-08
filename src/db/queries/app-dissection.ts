import { asc, desc, eq } from "drizzle-orm";

import { db } from "../client";
import { appDissectionDetails, appDissections } from "../schema/app-dissection";

export type AppDissectionItem = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  status: string | null;
  publishedAt: string;
  notionId: string | null;
};

export type AppDissectionVideoMetadata = {
  type: "app-dissection-video";
  urls: string[];
  orientation: "portrait" | "landscape";
};

export type AppDissectionDetailItem = {
  title: string;
  description: string;
  video?: AppDissectionVideoMetadata;
};

export type AppDissectionItemWithContent = AppDissectionItem & {
  introContent: string;
  details: AppDissectionDetailItem[];
};

export async function getAppDissections(): Promise<AppDissectionItem[]> {
  const rows = await db
    .select({
      id: appDissections.id,
      name: appDissections.name,
      slug: appDissections.slug,
      icon: appDissections.icon,
      status: appDissections.status,
      publishedAt: appDissections.publishedAt,
      notionId: appDissections.notionId,
    })
    .from(appDissections)
    .where(eq(appDissections.status, "Published"))
    .orderBy(desc(appDissections.publishedAt));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon,
    status: row.status,
    publishedAt: row.publishedAt?.toISOString() ?? "",
    notionId: row.notionId,
  }));
}

export async function getAppDissectionBySlug(
  slug: string,
): Promise<AppDissectionItemWithContent | null> {
  const [appRow] = await db
    .select()
    .from(appDissections)
    .where(eq(appDissections.slug, slug))
    .limit(1);

  if (!appRow) return null;

  const detailRows = await db
    .select()
    .from(appDissectionDetails)
    .where(eq(appDissectionDetails.appDissectionId, appRow.id))
    .orderBy(asc(appDissectionDetails.sortOrder));

  const details: AppDissectionDetailItem[] = detailRows.map((row) => {
    const result: AppDissectionDetailItem = {
      title: row.title,
      description: row.description ?? "",
    };

    if (row.videoMetadata) {
      const meta = row.videoMetadata as AppDissectionVideoMetadata;
      if (meta.type === "app-dissection-video" && Array.isArray(meta.urls)) {
        result.video = meta;
      }
    }

    return result;
  });

  return {
    id: appRow.id,
    name: appRow.name,
    slug: appRow.slug,
    icon: appRow.icon,
    status: appRow.status,
    publishedAt: appRow.publishedAt?.toISOString() ?? "",
    notionId: appRow.notionId,
    introContent: appRow.introContent ?? "",
    details,
  };
}

export async function getAllAppDissectionSlugs(): Promise<{ slug: string }[]> {
  const rows = await db
    .select({ slug: appDissections.slug })
    .from(appDissections)
    .where(eq(appDissections.status, "Published"))
    .orderBy(desc(appDissections.publishedAt));

  return rows;
}
