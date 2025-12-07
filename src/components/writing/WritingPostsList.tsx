import {
  List,
  ListItem,
  ListItemLabel,
  Section,
  SectionHeading,
} from "@/components/shared/ListComponents";
import { getAllWritingPosts } from "@/lib/writing";

export async function WritingPostsList() {
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
    </>
  );
}
