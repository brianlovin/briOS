import Image from "next/image";
import Link from "next/link";

import { AppDissectionDock } from "@/components/AppDissectionDock";
import { ChevronLeft } from "@/components/icons/ChevronLeft";
import { ChevronRight } from "@/components/icons/ChevronRight";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { TopBar } from "@/components/TopBar";
import { FancySeparator } from "@/components/ui/FancySeparator";
import { allAppDissectionItems, AppDissectionItemType } from "@/data/app-dissection";

import { DesignDetailMedia } from "./DetailMedia";

interface Props {
  post: AppDissectionItemType;
}

export function AppDissectionDetail({ post }: Props) {
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Find current index and calculate prev/next
  const currentIndex = allAppDissectionItems.findIndex((item) => item.slug === post.slug);
  const previousItem = currentIndex > 0 ? allAppDissectionItems[currentIndex - 1] : null;
  const nextItem =
    currentIndex < allAppDissectionItems.length - 1
      ? allAppDissectionItems[currentIndex + 1]
      : null;

  return (
    <>
      <TopBar className="pr-3">
        <div className="flex flex-1 items-center gap-2">
          <Link
            href="/app-dissection"
            className="text-secondary hover:text-primary text-sm font-medium"
          >
            App Dissection
          </Link>
          <div className="text-quaternary text-sm font-medium">/</div>
          <div className="line-clamp-1 text-sm font-medium">{post.title}</div>
        </div>
      </TopBar>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-12 md:px-6 lg:px-8 lg:py-16 xl:py-20">
          {/* Header with icon and title */}
          <div className="flex flex-col items-center justify-center gap-6">
            <Image
              src={`/img/app-dissection/${post.slug}.jpeg`}
              width={80}
              height={80}
              alt={`${post.title} icon`}
              className="border-secondary rounded-2xl border shadow-xs"
            />
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-primary text-3xl font-bold xl:text-4xl">{post.title}</h1>
              <span className="text-tertiary text-sm">{date}</span>
            </div>
          </div>

          <FancySeparator />

          {/* Description */}
          <div className="prose">
            <MarkdownRenderer>{post.description}</MarkdownRenderer>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-12">
            {post.details.map((detail, i) => (
              <DesignDetailMedia detail={detail} key={`${detail.title}-${i}`} />
            ))}
          </div>

          <FancySeparator />

          {/* macOS-style Dock Navigation */}
          <AppDissectionDock currentSlug={post.slug} />

          {/* Previous/Next Navigation (hidden for now) */}
          <div className="hidden items-center justify-between gap-4">
            {previousItem ? (
              <Link
                href={`/app-dissection/${previousItem.slug}`}
                className="hover:bg-secondary dark:hover:bg-tertiary text-tertiary hover:text-primary flex flex-1 items-center gap-3 rounded-lg bg-transparent p-4"
              >
                <ChevronLeft size={32} />
                <Image
                  src={`/img/app-dissection/${previousItem.slug}.jpeg`}
                  width={40}
                  height={40}
                  alt={`${previousItem.title} icon`}
                  className="border-secondary rounded-lg border"
                />
                <span className="text-sm font-semibold">{previousItem.title}</span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextItem ? (
              <Link
                href={`/app-dissection/${nextItem.slug}`}
                className="hover:bg-secondary dark:hover:bg-tertiary text-tertiary hover:text-primary flex flex-1 items-center justify-end gap-3 rounded-lg bg-transparent p-4"
              >
                <span className="text-sm font-semibold">{nextItem.title}</span>
                <Image
                  src={`/img/app-dissection/${nextItem.slug}.jpeg`}
                  width={40}
                  height={40}
                  alt={`${nextItem.title} icon`}
                  className="border-secondary rounded-lg border"
                />
                <ChevronRight size={32} />
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
