import { List, ListItem, Section } from "@/components/shared/ListComponents";
import { PageTitle } from "@/components/Typography";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function WritingLoading() {
  return (
    <div data-scrollable className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-xl flex-1 flex-col gap-16 py-16 leading-[1.6]">
        <Section>
          <PageTitle>Writing</PageTitle>
        </Section>
        <Section>
          <List>
            {Array.from({ length: 6 }).map((_, index) => (
              <ListItem key={index} className="py-1">
                <LoadingSkeleton className="h-3.5 max-w-sm flex-1" />
              </ListItem>
            ))}
          </List>
        </Section>
      </div>
    </div>
  );
}
