import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import {
  List,
  ListItem,
  ListItemLabel,
  Section,
  SectionHeading,
} from "@/components/shared/ListComponents";
import { TopBar } from "@/components/TopBar";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createMetadata } from "@/lib/metadata";
import { getAllWritingPosts } from "@/lib/writing";

export const metadata: Metadata = createMetadata({
  title: "Writing",
  description:
    "Thoughts on design, engineering, and building products. Essays and reflections from Brian Lovin.",
  path: "/writing",
});

export default async function WritingPage() {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.writingPosts);

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
    <>
      <TopBar>
        <div className="flex-1 text-sm font-medium">Writing</div>
      </TopBar>
      <div data-scrollable className="flex-1 overflow-y-auto">
        <div className="text-secondary mx-auto flex max-w-xl flex-1 flex-col gap-16 py-16 leading-[1.6]">
          {sortedYears.map((year) => (
            <Section key={year}>
              <SectionHeading>{year}</SectionHeading>
              <List>
                {postsByYear[year]
                  .filter((post) => post.slug) // Only show posts that have slugs
                  .map((post) => (
                    <ListItem key={post.id} href={`/writing/${post.slug}`}>
                      <ListItemLabel className="line-clamp-none">{post.title}</ListItemLabel>
                    </ListItem>
                  ))}
              </List>
            </Section>
          ))}
        </div>
      </div>
    </>
  );
}
