import type { Metadata } from "next";

import {
  InlineLink,
  List,
  ListItem,
  ListItemLabel,
  ListItemSubLabel,
  Section,
} from "@/components/shared/ListComponents";
import { PageTitle } from "@/components/Typography";
import { createMetadata } from "@/lib/metadata";
import { CONTACT_PARAGRAPHS, PUBLIC_PROFILES, SITE_REPO } from "@/lib/site-copy";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "How to reach Brian Lovin. Public channels only: X, GitHub, YouTube, and the AMA. No phone number or street address.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="text-primary mx-auto flex max-w-2xl flex-1 flex-col gap-16 py-16 leading-[1.6] sm:py-32">
          <Section>
            <PageTitle>Contact</PageTitle>
            {CONTACT_PARAGRAPHS.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="text-secondary text-2xl font-medium text-pretty"
              >
                {paragraph}
              </p>
            ))}
          </Section>

          <Section>
            <List>
              {PUBLIC_PROFILES.map((profile) => (
                <ListItem key={profile.href} href={profile.href}>
                  <ListItemLabel>{profile.name}</ListItemLabel>
                  <ListItemSubLabel>{profile.handle}</ListItemSubLabel>
                </ListItem>
              ))}
              <ListItem href="/ama">
                <ListItemLabel>AMA</ListItemLabel>
                <ListItemSubLabel>Ask a public question</ListItemSubLabel>
              </ListItem>
              <ListItem href={SITE_REPO}>
                <ListItemLabel>briOS on GitHub</ListItemLabel>
                <ListItemSubLabel>Source for this site</ListItemSubLabel>
              </ListItem>
            </List>
          </Section>

          <Section>
            <p className="text-secondary text-xl font-medium">
              See also <InlineLink href="/about">About</InlineLink> and{" "}
              <InlineLink href="/privacy">Privacy</InlineLink>.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
