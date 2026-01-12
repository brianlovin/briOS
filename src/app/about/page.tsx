import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { SpeakingList } from "@/components/home/SpeakingList";
import { SpeakingListSkeleton } from "@/components/home/SpeakingListSkeleton";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import { BufferLogoSVG, GitHubIcon, XIcon, YouTubeIcon } from "@/components/icons/SocialIcons";
import {
  List,
  ListItem,
  ListItemLabel,
  ListItemSubLabel,
  Section,
  SectionHeading,
} from "@/components/shared/ListComponents";
import { createMetadata, createPersonJsonLd } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  path: "/about",
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

              <h1 id="home-title" className="text-2xl font-semibold">
                Brian Lovin
              </h1>

              <p className="text-secondary text-2xl font-semibold text-pretty">
                I’m a software designer living in San Francisco, currently making AI products at{" "}
                Notion.
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
                        className="mb-2 size-7 rounded-md select-none sm:mb-0 sm:size-5"
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

const projects = [
  {
    name: "Clean HN",
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
    name: "My Stack",
    href: "/stack",
    description: "My favorite apps and tools",
    external: false,
  },
  {
    name: "Listening",
    href: "/listening",
    description: "What I'm listening to",
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
