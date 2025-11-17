import type { Metadata } from "next";
import Image from "next/image";

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
        <TopBar>
          <div className="flex-1 text-sm font-semibold">About</div>
        </TopBar>

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
                Hey, I&apos;m Brian Lovin. I&apos;m a designer and software engineer living in San
                Francisco.
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
                    <ListItemLabel className="sm:line-clamp-1">{name}</ListItemLabel>
                    <div className="flex flex-1 items-center gap-2">
                      <ListItemSubLabel className="flex-1">{description}</ListItemSubLabel>
                      {external && (
                        <ListItemSubLabel className="shrink-0 font-mono opacity-80">
                          <ArrowUpRight />
                        </ListItemSubLabel>
                      )}
                    </div>
                  </ListItem>
                ))}
              </List>
            </Section>

            <Section>
              <SectionHeading>Speaking</SectionHeading>
              <List>
                {speaking.map(({ title, date, href }) => (
                  <ListItem href={href} key={title}>
                    <ListItemLabel className="flex-1">{title}</ListItemLabel>
                    <ListItemSubLabel className="font-mono opacity-80">{date}</ListItemSubLabel>
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

// Data arrays
const speaking = [
  {
    title: "Founder Fridays with Brian Lovin",
    date: "Aug '25",
    href: "https://www.youtube.com/watch?v=VZgrsDkZjHU",
  },
  {
    title: "Design Founders Night with Designer Fund",
    date: "Jun '25",
    href: "https://designerfounders.substack.com/p/brian-lovin-notion-campsite",
  },
  {
    title: "How Campsite built a design-led company",
    date: "Sep '24",
    href: "https://www.youtube.com/watch?v=aa_srknxkQw",
  },
  {
    title: "FocusTime: Boring routines and capturing inspiration",
    date: "Aug '24",
    href: "https://risecalendar.com/blog/focus-time-brian-lovin",
  },
  {
    title: "Full Stack Whatever with Ryan Nystrom",
    date: "Dec '23",
    href: "https://fullstackwhatever.com/episode/brian-lovin-ryan-nystrom-surrounded-by-people-doing-interesting-work",
  },
  {
    title: "Deep Dive: How to level up as an IC designer",
    date: "Nov '23",
    href: "https://www.youtube.com/watch?v=ozU063JY4ko&t=2s",
  },
  {
    title: "Deep Dive: Lessons from Campsite",
    date: "Nov '23",
    href: "https://www.youtube.com/watch?v=njO9OJTDSGM&t=19s",
  },
  {
    title: "Design, engineering, and starting a company",
    date: "Aug '23",
    href: "https://open.spotify.com/episode/5rR19EwPx7wKevfaitnrZL?si=74837d42237240bd",
  },
  {
    title: "Full Stack Whatever",
    date: "Jan '23",
    href: "https://fullstackwhatever.com/episode/brian-lovin-its-all-about-having-fun",
  },
  {
    title: "The Art of Product: The art and pain of design",
    date: "Mar '22",
    href: "https://artofproductpodcast.com/episode-202",
  },
  {
    title: "Metamuse: Personal brand",
    date: "Mar '22",
    href: "https://museapp.com/podcast/51-personal-brand/",
  },
  {
    title: "Optimal Path: The Spectrum of design",
    date: "Jan '22",
    href: "https://maze.co/podcast/#brian-lovin",
  },
  {
    title: "UI Breakfast: Design advising",
    date: "Dec '21",
    href: "https://uibreakfast.com/228-design-advisory-with-brian-lovin/",
  },
  {
    title: "Design MBA: Managing side projects",
    date: "Nov '21",
    href: "https://designmba.show/episodes/brian-lovin",
  },
  {
    title: "Progression: The rise of the senior IC",
    date: "Jun '21",
    href: "https://progressionapp.com/blog/podcast-26-brian-lovin-github-spectrum-design-details-on-the-rise-of-the-senior-ic/",
  },
  {
    title: "Layout.fm",
    date: "Jan '21",
    href: "https://layout.fm/episodes/194/",
  },
  {
    title: "Software Engineering Daily: GitHub Mobile",
    date: "Jul '20",
    href: "https://softwareengineeringdaily.com/'20/07/15/github-mobile-with-brian-lovin-and-ryan-nystrom/",
  },
  {
    title: "Swift by Sundell: Building for open source",
    date: "Feb '20",
    href: "https://www.swiftbysundell.com/podcast/67/",
  },
  {
    title: "Figma Config: Extend what's possible with Plugins",
    date: "Feb '20",
    href: "https://www.youtube.com/watch?v=SyS3h3kmBnY",
  },
  {
    title: "Lovers Magazine",
    date: "Jan '18",
    href: "https://www.loversmagazine.com/interviews/brian-lovin",
  },
  {
    title: "GraphQL Summit: Designing with GraphQL",
    date: "Nov '17",
    href: "https://www.youtube.com/watch?v=6MBBTdu8v6E",
  },
  {
    title: "Design Details",
    date: "Aug '17",
    href: "https://designdetails.fm/episodes/3e342ac0",
  },
];

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
    name: "My Stack",
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
    name: "Listening history",
    href: "/listening-history",
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
