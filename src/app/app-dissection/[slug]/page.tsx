import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createArticleJsonLd, createMetadata, truncateDescription } from "@/lib/metadata";
import { getAppDissectionDatabaseItems, getAppDissectionItemBySlug } from "@/lib/notion/queries";
import { extractPreviewText } from "@/lib/notion/types";

import { AppDissectionDetail } from "./components/AppDissectionDetail";

export const revalidate = 3600;

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getAppDissectionItemBySlug(params.slug);

  if (!post) {
    return {
      title: "App Dissection Not Found",
    };
  }

  const descriptionText = extractPreviewText(post.introBlocks, { separator: " " });

  return createMetadata({
    title: `${post.name} - App Dissection`,
    description: truncateDescription(descriptionText),
    path: `/app-dissection/${post.slug}`,
    type: "article",
    publishedTime: post.published,
  });
}

export default async function AppDissectionPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const [post, allItems] = await Promise.all([
    getAppDissectionItemBySlug(params.slug),
    getAppDissectionDatabaseItems(),
  ]);

  if (!post) {
    notFound();
  }

  const descriptionText = extractPreviewText(post.introBlocks, { separator: " " });

  // Generate JSON-LD structured data
  const articleJsonLd = createArticleJsonLd({
    title: `${post.name} - App Dissection`,
    description: descriptionText,
    path: `/app-dissection/${post.slug}`,
    publishedTime: post.published,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <AppDissectionDetail post={post} allItems={allItems} />
    </>
  );
}
