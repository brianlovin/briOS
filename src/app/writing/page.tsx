import type { Metadata } from "next";

import {
  List,
  ListItem,
  ListItemLabel,
  Section,
  SectionHeading,
} from "@/components/shared/ListComponents";
import { PageTitle } from "@/components/Typography";
import { createMetadata } from "@/lib/metadata";
import { buildSlug } from "@/lib/short-id";
import { getAllWritingPosts } from "@/lib/writing";

export const metadata: Metadata = createMetadata({
  title: "Writing",
  description:
    "Thoughts on design, engineering, and building products. Essays and reflections from Brian Lovin.",
  path: "/writing",
});

export const dynamic = "force-dynamic";

export default async function WritingPage() {
  const posts = await getAllWritingPosts();

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

  return (
    <div data-scrollable className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-xl flex-1 flex-col gap-16 py-16 leading-[1.6]">
        <Section>
          <PageTitle>Writing</PageTitle>
        </Section>
        {sortedYears.map((year) => (
          <Section key={year}>
            <SectionHeading>{year}</SectionHeading>
            <List>
              {postsByYear[year]
                .filter((post) => post.shortId) // Only show posts that have Short IDs
                .map((post) => (
                  <ListItem key={post.id} href={`/writing/${buildSlug(post.title, post.shortId!)}`}>
                    <ListItemLabel className="line-clamp-none">{post.title}</ListItemLabel>
                  </ListItem>
                ))}
            </List>
          </Section>
        ))}
      </div>
    </div>
  );
}
