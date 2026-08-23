import type { Metadata } from "next";

import { PageTitle } from "@/components/Typography";
import { COMPUTER_INTRO, COMPUTER_TITLE } from "@/lib/computer";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: COMPUTER_TITLE,
  description: COMPUTER_INTRO,
  path: "/computer",
});

export default function ComputerPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 md:px-8 md:py-12">
      <PageTitle>{COMPUTER_TITLE}</PageTitle>
      <p className="text-secondary text-lg leading-relaxed">{COMPUTER_INTRO}</p>
    </div>
  );
}
