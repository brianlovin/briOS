import {
  List,
  ListItem,
  ListItemLabel,
  Section,
  SectionHeading,
} from "@/components/shared/ListComponents";

function WritingListSkeleton() {
  return (
    <List>
      {Array.from({ length: 6 }).map((_, i) => (
        <ListItem key={i} className="animate-pulse py-1">
          <ListItemLabel>
            <div className="bg-tertiary h-4 w-full max-w-md rounded-full" />
          </ListItemLabel>
        </ListItem>
      ))}
    </List>
  );
}

export function WritingPostsListSkeleton() {
  return (
    <>
      {["2025", "2024", "2023"].map((year) => (
        <Section key={year}>
          <SectionHeading>{year}</SectionHeading>
          <WritingListSkeleton />
        </Section>
      ))}
    </>
  );
}
