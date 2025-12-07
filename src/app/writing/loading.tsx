import {
  List,
  ListItem,
  ListItemLabel,
  Section,
  SectionHeading,
} from "@/components/shared/ListComponents";
import { PageTitle } from "@/components/Typography";

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

export default function WritingLoading() {
  return (
    <div data-scrollable className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-xl flex-1 flex-col gap-16 py-16 leading-[1.6]">
        <Section>
          <PageTitle>Writing</PageTitle>
        </Section>
        {/* Show skeleton sections for a few years */}
        {["2025", "2024", "2023"].map((year) => (
          <Section key={year}>
            <SectionHeading>{year}</SectionHeading>
            <WritingListSkeleton />
          </Section>
        ))}
      </div>
    </div>
  );
}
