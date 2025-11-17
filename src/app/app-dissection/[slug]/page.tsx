import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { allAppDissectionItems } from "@/data/app-dissection";
import { createArticleJsonLd, createMetadata, truncateDescription } from "@/lib/metadata";

import { AppDissectionDetail } from "./components/AppDissectionDetail";

export async function generateStaticParams() {
  return allAppDissectionItems.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = allAppDissectionItems.find((item) => item.slug === params.slug);

  if (!post) {
    return {
      title: "App Dissection Not Found",
    };
  }

  return createMetadata({
    title: `${post.title} - App Dissection`,
    description: truncateDescription(post.description),
    path: `/app-dissection/${post.slug}`,
    type: "article",
    publishedTime: post.createdAt,
  });
}

export default async function AppDissectionPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = allAppDissectionItems.find((item) => item.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Generate JSON-LD structured data
  const articleJsonLd = createArticleJsonLd({
    title: `${post.title} - App Dissection`,
    description: post.description,
    path: `/app-dissection/${post.slug}`,
    publishedTime: post.createdAt,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <AppDissectionDetail post={post} />
    </>
  );
}
