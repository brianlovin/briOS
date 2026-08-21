import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import {
  List,
  ListItem,
  ListItemLabel,
  Section,
  SectionHeading,
} from "@/components/shared/ListComponents";
import { PageTitle } from "@/components/Typography";
import { createMetadata, SITE_CONFIG } from "@/lib/metadata";
import { isPlaceholderNotionBuild } from "@/lib/notion";
import { buildSlug } from "@/lib/short-id";
import { getAllWritingPosts } from "@/lib/writing";

export const metadata: Metadata = createMetadata({
  title: "Writing",
  description:
    "Thoughts on design, engineering, and building products. Essays and reflections from Brian Lovin.",
  path: "/writing",
  rss: `${SITE_CONFIG.url}/writing/rss.xml`,
});

export default function WritingPage() {
  return (
    <div data-scrollable className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-xl flex-1 flex-col gap-16 py-16 leading-[1.6]">
        <Section>
          <PageTitle>Writing</PageTitle>
        </Section>
        <WritingPosts />
      </div>
    </div>
  );
}

async function WritingPosts() {
  "use cache";
  cacheLife("days");
  cacheTag("notion:writing");
  const posts = isPlaceholderNotionBuild() ? [] : await getAllWritingPosts();

  // Group posts by year
  const postsByYear: Record<string, typeof posts> = {};
  posts.forEach((post) => {
    const publishedDate = post.published || post.createdTime;
    const year = new Date(publishedDate).getFullYear().toString();
    if (!postsByYear[year]) {
      postsByYear[year] = [];
    }
    postsByYear[year].push(post);
  });

  // Sort years in descending order
  const sortedYears = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return sortedYears.map((year) => (
    <Section key={year}>
      <SectionHeading>{year}</SectionHeading>
      <List>
        {postsByYear[year]
          .filter((post) => post.shortId)
          .map((post) => (
            <ListItem key={post.id} href={`/writing/${buildSlug(post.title, post.shortId!)}`}>
              <ListItemLabel className="line-clamp-none">{post.title}</ListItemLabel>
            </ListItem>
          ))}
      </List>
    </Section>
  ));
}
