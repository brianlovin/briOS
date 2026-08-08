import { HomeHero } from "@/components/home/HomeHero";
import { List, ListItem, Section, SectionHeading } from "@/components/shared/ListComponents";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="text-primary mx-auto flex max-w-2xl flex-1 flex-col gap-16 py-16 leading-[1.6] sm:py-32">
          <HomeHero />

          <Section>
            <SectionHeading>Writing</SectionHeading>
            <List>
              {Array.from({ length: 5 }).map((_, index) => (
                <ListItem key={index} className="py-1">
                  <LoadingSkeleton className="h-3.5 max-w-sm flex-1" />
                </ListItem>
              ))}
            </List>
          </Section>

          <Section>
            <SectionHeading>Projects</SectionHeading>
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-5 w-2/3" />
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
