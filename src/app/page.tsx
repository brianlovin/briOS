import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { SpeakingList } from "@/components/home/SpeakingList";
import { SpeakingListSkeleton } from "@/components/home/SpeakingListSkeleton";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
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
import { TopBar } from "@/components/TopBar";
import { createMetadata, createPersonJsonLd } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Brian Lovin",
  description:
    "Brian Lovin is a designer and software engineer living in San Francisco, currently designing AI products at Notion.",
  path: "/",
});

export default function Home() {
  const personJsonLd = createPersonJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div className="flex flex-1 flex-col">
        <TopBar className="border-b-0" />

        <div className="flex-1 overflow-y-auto">
          <div className="text-secondary mx-auto flex max-w-xl flex-1 flex-col gap-16 py-16 leading-[1.6]">
            <Section>
              <Image
                src="/img/avatar.jpg"
                alt="Brian Lovin"
                width={44}
                height={44}
                draggable={false}
                className="mb-8 rounded-full select-none"
              />
              <p className="text-pretty">
                Hey, I&apos;m Brian. I&apos;m a software designer currently living in San Francisco.
              </p>

              <p>
                I&apos;m currently designing AI products at{" "}
                <InlineLink href="https://notion.com">Notion</InlineLink>. Before Notion, I was the
                co-founder of <InlineLink href="https://campsite.com">Campsite</InlineLink>, an app
                that combined posts, docs, calls, and chat to enable thoughtful team collaboration.
              </p>
              <p>
                Before Campsite, I spent four years designing the{" "}
                <InlineLink href="https://github.com/mobile">GitHub Mobile</InlineLink> apps. I
                joined GitHub after they acquired my first startup,{" "}
                <InlineLink href="https://spectrum.chat">Spectrum</InlineLink>, a platform for
                branded communities to have better public conversations.
              </p>
              <p>
                Before Spectrum, I designed payments experiences at Facebook, working across{" "}
                <InlineLink href="https://facebook.com">Facebook</InlineLink>,{" "}
                <InlineLink href="https://messenger.com">Messenger</InlineLink>,{" "}
                <InlineLink href="https://whatsapp.com">WhatsApp</InlineLink>, and{" "}
                <InlineLink href="https://instagram.com">Instagram</InlineLink>. I originally cut my
                teeth as the first product designer at{" "}
                <InlineLink href="https://buffer.com">Buffer</InlineLink>.
              </p>
              <p>
                Along the way, I was a co-host of the{" "}
                <InlineLink href="https://designdetails.fm">Design Details</InlineLink> podcast for
                nine years, a weekly conversation about design process and culture. I also created{" "}
                <InlineLink href="https://staff.design">Staff Design</InlineLink>, an interview
                project about navigating the individual contributor career path.
              </p>
            </Section>

            <Section>
              <SectionHeading>Online</SectionHeading>
              <List>
                {socials.map(({ name, href, icon: Icon }) => (
                  <ListItem key={name} href={href}>
                    <Icon className="text-primary select-none" />
                    <ListItemLabel>{name}</ListItemLabel>
                  </ListItem>
                ))}
              </List>
            </Section>

            <Section>
              <SectionHeading>Work</SectionHeading>
              <List>
                {work.map(({ name, href, role, period, icon }) => (
                  <ListItem key={name} href={href}>
                    {icon.type === "image" ? (
                      <Image
                        width={40}
                        height={40}
                        src={icon.src}
                        alt={icon.alt}
                        className="h-5 w-5 rounded-md select-none"
                        draggable={false}
                      />
                    ) : (
                      <icon.component className="text-primary" />
                    )}
                    <ListItemLabel>{name}</ListItemLabel>
                    <ListItemSubLabel className="flex-1">{role}</ListItemSubLabel>
                    <ListItemSubLabel className="font-mono opacity-80">{period}</ListItemSubLabel>
                  </ListItem>
                ))}
              </List>
            </Section>

            <Section>
              <SectionHeading>Projects</SectionHeading>
              <List>
                {projects.map(({ name, href, description, external }) => (
                  <ListItem
                    key={name}
                    href={href}
                    className="flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <ListItemLabel className="sm:line-clamp-1">{name}</ListItemLabel>
                      {external && (
                        <ListItemSubLabel className="shrink-0 font-mono">
                          <ArrowUpRight className="text-primary" />
                        </ListItemSubLabel>
                      )}
                    </div>
                    <ListItemSubLabel className="flex-1">{description}</ListItemSubLabel>
                  </ListItem>
                ))}
              </List>
            </Section>

            <Section>
              <SectionHeading>Speaking</SectionHeading>
              <Suspense fallback={<SpeakingListSkeleton />}>
                <SpeakingList />
              </Suspense>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
}

// Data arrays
const socials = [
  {
    name: "X",
    href: "https://x.com/brian_lovin",
    icon: XIcon,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@brian_lovin",
    icon: YouTubeIcon,
  },
  {
    name: "GitHub",
    href: "https://github.com/brianlovin",
    icon: GitHubIcon,
  },
];

const projects = [
  {
    name: "HN",
    href: "/hn",
    description: "A minimal hacker news reader",
    external: false,
  },
  {
    name: "App Dissection",
    href: "/app-dissection",
    description: "Breaking down well-designed apps",
    external: false,
  },
  {
    name: "Stack",
    href: "/stack",
    description: "My favorite apps and tools",
    external: false,
  },
  {
    name: "AMA",
    href: "/ama",
    description: "Ask me anything",
    external: false,
  },
  {
    name: "Listening",
    href: "/listening",
    description: "What I'm listening to",
    external: false,
  },
  {
    name: "Good websites",
    href: "/sites",
    description: "A curated collection of good websites",
    external: false,
  },
  {
    name: "Staff Design",
    href: "https://staff.design",
    description: "Navigating the IC career path",
    external: true,
  },
  {
    name: "Design Details",
    href: "https://designdetails.fm",
    description: "A podcast about design and technology",
    external: true,
  },
  {
    name: "How to Computer Better",
    href: "https://brianlovin.notion.site/how-to-computer-better",
    description: "Get good at computering",
    external: true,
  },
  {
    name: "Crit",
    href: "https://www.youtube.com/playlist?list=PLJu44Klx1pB_8GSOUeDNDllPICvMJKSut",
    description: "App design critique",
    external: true,
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
