import Image from "next/image";

import { AppDissectionDock } from "@/components/AppDissectionDock";
import { renderBlocks } from "@/components/renderBlocks";
import { PageTitle } from "@/components/Typography";
import { FancySeparator } from "@/components/ui/FancySeparator";
import {
  formatPublishedDate,
  type NotionAppDissectionItem,
  type NotionAppDissectionItemWithContent,
} from "@/lib/notion/types";

import { DesignDetailMedia } from "./DetailMedia";

interface Props {
  post: NotionAppDissectionItemWithContent;
  allItems: NotionAppDissectionItem[];
}

export function AppDissectionDetail({ post, allItems }: Props) {
  const date = formatPublishedDate(post.published);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-12 md:px-6 lg:px-8 lg:py-16 xl:py-20">
        {/* Header with icon and title */}
        <div className="flex flex-col gap-6">
          {post.icon && (
            <Image
              src={post.icon}
              width={80}
              height={80}
              quality={100}
              alt={`${post.name} icon`}
              className="border-secondary rounded-2xl border shadow-xs"
            />
          )}
          <div className="flex flex-col gap-1">
            <PageTitle>{post.name}</PageTitle>
            <span className="text-tertiary">{date}</span>
          </div>
        </div>

        {/* Intro description from Notion blocks */}
        <div className="prose-lg">{renderBlocks(post.introBlocks)}</div>

        {/* Details */}
        <div className="flex flex-col gap-12">
          {post.details.map((detail, i) => (
            <DesignDetailMedia detail={detail} key={`${detail.title}-${i}`} />
          ))}
        </div>

        <FancySeparator />

        {/* macOS-style Dock Navigation */}
        <AppDissectionDock items={allItems} currentSlug={post.slug} />
      </div>
    </div>
  );
}
