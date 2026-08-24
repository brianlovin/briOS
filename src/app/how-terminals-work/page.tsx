import type { Metadata } from "next";

import { Section } from "@/components/shared/ListComponents";
import { PageTitle } from "@/components/Typography";
import { HOW_TERMINALS_WORK_INTRO, HOW_TERMINALS_WORK_TITLE } from "@/lib/how-terminals-work";
import { createMetadata } from "@/lib/metadata";

import { HowTerminalsWorkGuide } from "./HowTerminalsWorkGuide";

export const metadata: Metadata = createMetadata({
  title: HOW_TERMINALS_WORK_TITLE,
  description: HOW_TERMINALS_WORK_INTRO,
  path: "/how-terminals-work",
});

export default function HowTerminalsWorkPage() {
  return (
    <div data-scrollable className="flex-1 overflow-y-auto">
      <article className="mx-auto flex max-w-3xl flex-1 flex-col gap-16 py-16 leading-[1.6]">
        <Section>
          <PageTitle>{HOW_TERMINALS_WORK_TITLE}</PageTitle>
          <p className="text-secondary text-pretty">{HOW_TERMINALS_WORK_INTRO}</p>
        </Section>
        <HowTerminalsWorkGuide />
      </article>
    </div>
  );
}
