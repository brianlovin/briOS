import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { HomeHero } from "@/components/home/HomeHero";
import { ProjectsList } from "@/components/home/ProjectsList";
import { ChevronRight } from "@/components/icons/ChevronRight";
import { GitHubIcon, XIcon, YouTubeIcon } from "@/components/icons/SocialIcons";
import {
  List,
  ListItem,
  ListItemLabel,
  Section,
  SectionHeading,
} from "@/components/shared/ListComponents";
import { createMetadata, createPersonJsonLd } from "@/lib/metadata";
import { buildSlug } from "@/lib/short-id";
import { getAllWritingPosts } from "@/lib/writing";

export const metadata: Metadata = createMetadata({
  title: "Brian Lovin",
  description:
    "Brian Lovin is a designer and software engineer living in San Francisco, currently designing AI products at Notion.",
  path: "/",
});

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const personJsonLd = createPersonJsonLd();
  const allPosts = await getAllWritingPosts();
  const recentPosts = allPosts.slice(0, 5);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="text-primary mx-auto flex max-w-2xl flex-1 flex-col gap-16 py-16 leading-[1.6] sm:py-32">
            <HomeHero />

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
              <Link href="/writing" className="group flex items-center">
                <SectionHeading className="group-hover:text-primary transition-colors">
                  Writing
                </SectionHeading>
                <ChevronRight
                  size={32}
                  className="text-quaternary group-hover:text-primary transition-all duration-150 group-hover:translate-x-0.5"
                />
              </Link>
              <List>
                {recentPosts
                  .filter((post) => post.shortId)
                  .map((post) => {
                    return (
                      <ListItem
                        key={post.id}
                        href={`/writing/${buildSlug(post.title, post.shortId!)}`}
                      >
                        <ListItemLabel className="line-clamp-none">{post.title}</ListItemLabel>
                      </ListItem>
                    );
                  })}
              </List>
            </Section>

            <Section>
              <SectionHeading>Projects</SectionHeading>
              <ProjectsList />
            </Section>
          </div>
        </div>
      </div>
    </>
  );
}
