import type { Metadata } from "next";

import { InlineLink, Section } from "@/components/shared/ListComponents";
import { PageTitle } from "@/components/Typography";
import { createMetadata } from "@/lib/metadata";
import { PRIVACY_PARAGRAPHS } from "@/lib/site-copy";

export const metadata: Metadata = createMetadata({
  title: "Privacy",
  description:
    "What brianlovin.com collects: Fathom Analytics, anonymous likes, coarse visit geography for the activity feed, and an optional HN digest email. No accounts, no selling data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="text-primary mx-auto flex max-w-2xl flex-1 flex-col gap-16 py-16 leading-[1.6] sm:py-32">
          <Section>
            <PageTitle>Privacy</PageTitle>
            {PRIVACY_PARAGRAPHS.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="text-secondary text-2xl font-medium text-pretty"
              >
                {paragraph}
              </p>
            ))}
            <p className="text-secondary text-xl font-medium">
              Questions: <InlineLink href="/contact">Contact</InlineLink> or{" "}
              <InlineLink href="/about">About</InlineLink>.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
