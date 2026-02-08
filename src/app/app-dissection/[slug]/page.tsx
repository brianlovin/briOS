import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAppDissectionBySlug, getAppDissections } from "@/db/queries/app-dissection";
import { createArticleJsonLd, createMetadata, truncateDescription } from "@/lib/metadata";

import { AppDissectionDetail } from "./components/AppDissectionDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getAppDissectionBySlug(params.slug);

  if (!post) {
    return {
      title: "App Dissection Not Found",
    };
  }

  // Use intro content as description preview
  const descriptionText = post.introContent
    .slice(0, 200)
    .replace(/[#*_\n]/g, " ")
    .trim();

  return createMetadata({
    title: `${post.name} - App Dissection`,
    description: truncateDescription(descriptionText),
    path: `/app-dissection/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function AppDissectionPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const [post, allItems] = await Promise.all([
    getAppDissectionBySlug(params.slug),
    getAppDissections(),
  ]);

  if (!post) {
    notFound();
  }

  // Use intro content as description preview
  const descriptionText = post.introContent
    .slice(0, 200)
    .replace(/[#*_\n]/g, " ")
    .trim();

  // Generate JSON-LD structured data
  const articleJsonLd = createArticleJsonLd({
    title: `${post.name} - App Dissection`,
    description: descriptionText,
    path: `/app-dissection/${post.slug}`,
    publishedTime: post.publishedAt,
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
