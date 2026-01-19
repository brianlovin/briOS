import type { Metadata } from "next";
import Image from "next/image";

import { ProjectsList } from "@/components/home/ProjectsList";
import { GitHubIcon, XIcon, YouTubeIcon } from "@/components/icons/SocialIcons";
import {
  List,
  ListItem,
  ListItemLabel,
  Section,
  SectionHeading,
} from "@/components/shared/ListComponents";
import { createMetadata, createPersonJsonLd } from "@/lib/metadata";
import { getWritingDatabaseItems } from "@/lib/notion";
import { buildSlug } from "@/lib/short-id";

export const metadata: Metadata = createMetadata({
  title: "Brian Lovin",
  description:
    "Brian Lovin is a designer and software engineer living in San Francisco, currently designing AI products at Notion.",
  path: "/",
});

export const revalidate = 3600;

export default async function Home() {
  const personJsonLd = createPersonJsonLd();
  const { items: recentPosts } = await getWritingDatabaseItems(undefined, 5);

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
                I&apos;m a software designer living in San Francisco, currently making AI products
                at Notion.
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
              <ProjectsList />
            </Section>

            <Section>
              <SectionHeading>Recent writing</SectionHeading>
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
          </div>
        </div>
      </div>
    </>
  );
}
