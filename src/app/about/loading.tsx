import { SpeakingListSkeleton } from "@/components/home/SpeakingListSkeleton";
import { Section, SectionHeading } from "@/components/shared/ListComponents";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function AboutLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="text-primary mx-auto flex max-w-2xl flex-1 flex-col gap-16 py-16 leading-[1.6] sm:py-32">
          <Section>
            <LoadingSkeleton className="mb-8 size-[60px] rounded-full" />
            <LoadingSkeleton className="h-8 w-3/4 rounded-lg" />
            <LoadingSkeleton className="h-8 w-full rounded-lg" />
            <LoadingSkeleton className="h-8 w-5/6 rounded-lg" />
            <LoadingSkeleton className="h-8 w-full rounded-lg" />
          </Section>
          <Section>
            <SectionHeading>Work</SectionHeading>
            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-5 w-3/4" />
              ))}
            </div>
          </Section>
          <Section>
            <SectionHeading>Projects</SectionHeading>
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-5 w-2/3" />
              ))}
            </div>
          </Section>
          <Section>
            <SectionHeading>Speaking</SectionHeading>
            <SpeakingListSkeleton />
          </Section>
        </div>
      </div>
    </div>
  );
}
