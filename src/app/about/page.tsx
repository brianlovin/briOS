import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { ProjectsList } from "@/components/home/ProjectsList";
import { SpeakingList } from "@/components/home/SpeakingList";
import { SpeakingListSkeleton } from "@/components/home/SpeakingListSkeleton";
import { BufferLogoSVG, GitHubIcon, XIcon, YouTubeIcon } from "@/components/icons/SocialIcons";
import {
  InlineLink,
  List,
  ListItem,
  ListItemLabel,
  ListItemSubLabel,
  Section,
  SectionHeading,
} from "@/components/shared/ListComponents";
import { createMetadata, createPersonJsonLd } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "Brian Lovin is a designer and software engineer living in San Francisco, currently designing AI products at Notion.",
  path: "/about",
});

export default function About() {
  const personJsonLd = createPersonJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="text-primary mx-auto flex max-w-2xl flex-1 flex-col gap-16 py-16 leading-[1.6] sm:py-32">
            <Section>
              <Image
                src="/img/avatar.jpg"
                alt="Brian Lovin"
                width={60}
                height={60}
                draggable={false}
                className="mb-8 rounded-full select-none"
              />

              <p className="text-secondary text-2xl font-medium text-pretty">
                I&apos;m a designer and software engineer living in San Francisco.
              </p>

              <p className="text-secondary text-2xl font-medium">
                I&apos;m currently designing AI products at{" "}
                <InlineLink href="https://notion.com">Notion</InlineLink>. Before Notion, I was the
                co-founder of <InlineLink href="https://campsite.com">Campsite</InlineLink>, an app
                that combined posts, docs, calls, and chat to enable thoughtful team collaboration.
              </p>
              <p className="text-secondary text-2xl font-medium">
                Before Campsite, I spent four years designing the{" "}
                <InlineLink href="https://github.com/mobile">GitHub Mobile</InlineLink> apps. I
                joined GitHub after they acquired my first startup,{" "}
                <InlineLink href="https://spectrum.chat">Spectrum</InlineLink>, a platform for
                branded communities to have better public conversations.
              </p>
              <p className="text-secondary text-2xl font-medium">
                Before Spectrum, I designed payments experiences at Facebook, working across{" "}
                <InlineLink href="https://facebook.com">Facebook</InlineLink>,{" "}
                <InlineLink href="https://messenger.com">Messenger</InlineLink>,{" "}
                <InlineLink href="https://whatsapp.com">WhatsApp</InlineLink>, and{" "}
                <InlineLink href="https://instagram.com">Instagram</InlineLink>. I originally cut my
                teeth as the first product designer at{" "}
                <InlineLink href="https://buffer.com">Buffer</InlineLink>.
              </p>
              <p className="text-secondary text-2xl font-medium">
                Along the way, I was a co-host of the{" "}
                <InlineLink href="https://designdetails.fm">Design Details</InlineLink> podcast for
                nine years, a weekly conversation about design process and culture. I also created{" "}
                <InlineLink href="https://staff.design">Staff Design</InlineLink>, an interview
                project about navigating the individual contributor career path.
              </p>
            </Section>

            <Section className="flex flex-row gap-2">
              <ListItem href="https://x.com/brian_lovin" className="group -ml-1 p-2">
                <XIcon size={28} className="text-quaternary group-hover:text-primary select-none" />
              </ListItem>
              <ListItem href="https://www.youtube.com/@brian_lovin" className="group p-2">
                <YouTubeIcon
                  size={32}
                  className="text-quaternary select-none group-hover:text-[#FF0302]"
                  playIconClassName="fill-[var(--background-color-main)] sm:fill-[var(--background-color-elevated)]  group-hover:fill-white"
                />
              </ListItem>
              <ListItem href="https://github.com/brianlovin" className="group p-2">
                <GitHubIcon
                  size={28}
                  className="text-quaternary group-hover:text-primary select-none"
                />
              </ListItem>
            </Section>

            <Section>
              <SectionHeading>Work</SectionHeading>
              <List className="gap-8">
                {work.map(({ name, href, role, period, icon }) => (
                  <ListItem
                    key={name}
                    href={href}
                    className="flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-3"
                  >
                    {icon.type === "image" ? (
                      <Image
                        width={40}
                        height={40}
                        src={icon.src}
                        alt={icon.alt}
                        className="mb-2 size-7 select-none sm:mb-0 sm:size-5"
                        draggable={false}
                      />
                    ) : (
                      <icon.component className="text-primary mb-2 size-7 sm:mb-0 sm:size-5" />
                    )}
                    <div className="flex items-center gap-2 sm:contents">
                      <ListItemLabel>{name}</ListItemLabel>
                      <ListItemSubLabel>{role}</ListItemSubLabel>
                    </div>
                    <ListItemSubLabel className="font-mono text-[19px] opacity-80 sm:ml-auto">
                      {period}
                    </ListItemSubLabel>
                  </ListItem>
                ))}
              </List>
            </Section>

            <Section>
              <SectionHeading>Projects</SectionHeading>
              <ProjectsList exclude={["How Terminals Work"]} />
            </Section>

            <Section>
              <SectionHeading>Speaking</SectionHeading>
              <Suspense fallback={<SpeakingListSkeleton />}>
                <SpeakingList />
              </Suspense>
            </Section>

            <Section>
              <SectionHeading>Investments</SectionHeading>
              <List>
                {investments.map(({ name, href, sublabel }) => (
                  <ListItem key={name} href={href}>
                    <ListItemLabel>{name}</ListItemLabel>
                    {sublabel && (
                      <ListItemSubLabel className="select-none">{sublabel}</ListItemSubLabel>
                    )}
                  </ListItem>
                ))}
              </List>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
}

const investments = [
  {
    name: "Dashworks",
    href: "https://dashworks.ai",
    sublabel: "Acquired",
  },
  {
    name: "Liveblocks",
    href: "https://liveblocks.io",
  },
  {
    name: "Zed",
    href: "https://zed.dev",
  },
  {
    name: "Ambrook",
    href: "https://ambrook.com",
  },
  {
    name: "Muse",
    href: "https://museapp.com",
  },
  {
    name: "Equals",
    href: "https://equals.com",
  },
  {
    name: "tldraw",
    href: "https://tldraw.com",
  },
  {
    name: "Diagram",
    href: "https://diagram.com",
    sublabel: "Acquired",
  },
  {
    name: "Copilot",
    href: "https://copilot.money/",
  },
  {
    name: "Hex",
    href: "https://hex.tech",
  },
  {
    name: "Stellate",
    href: "https://stellate.co",
    sublabel: "Acquired",
  },
  {
    name: "Eraser",
    href: "https://eraser.io",
  },
  {
    name: "Gumroad",
    href: "https://gumroad.com",
  },
  {
    name: "Any Distance",
    href: "https://apps.apple.com/us/app/any-distance-running-tracker/id1545233932",
  },
];

type WorkIcon =
  | { type: "image"; src: string; alt: string }
  | { type: "svg"; component: React.ComponentType<{ className?: string }> };

interface WorkItem {
  name: string;
  href: string;
  role: string;
  period: string;
  icon: WorkIcon;
}

const work: WorkItem[] = [
  {
    name: "Notion",
    href: "https://notion.com",
    role: "Product Designer",
    period: "Current",
    icon: {
      type: "image",
      src: "/img/notion.png",
      alt: "Notion",
    },
  },
  {
    name: "Campsite",
    href: "https://campsite.com",
    role: "Co-founder",
    period: "2022–25",
    icon: {
      type: "image",
      src: "/img/campsite.png",
      alt: "Campsite",
    },
  },
  {
    name: "GitHub",
    href: "https://github.com/mobile",
    role: "Product Designer",
    period: "2018–22",
    icon: {
      type: "svg",
      component: GitHubIcon,
    },
  },
  {
    name: "Spectrum",
    href: "https://spectrum.chat",
    role: "Co-founder",
    period: "2017–18",
    icon: {
      type: "image",
      src: "/img/spectrum.png",
      alt: "Spectrum",
    },
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    role: "Product Designer",
    period: "2015–17",
    icon: {
      type: "image",
      src: "/img/facebook.png",
      alt: "Facebook",
    },
  },
  {
    name: "Buffer",
    href: "https://buffer.com",
    role: "Product Designer",
    period: "2013–15",
    icon: {
      type: "svg",
      component: BufferLogoSVG,
    },
  },
];
