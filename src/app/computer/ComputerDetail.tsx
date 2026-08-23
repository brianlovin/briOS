"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

import { LikeButton } from "@/components/likes/LikeButton";
import { renderBlocks } from "@/components/renderBlocks";
import { PageTitle } from "@/components/Typography";
import { FancySeparator } from "@/components/ui/FancySeparator";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { computerTipLink } from "@/lib/computer";
import { useComputerTip } from "@/lib/hooks/useComputer";
import type { NotionComputerItemWithContent } from "@/lib/notion";

export default function ComputerDetail({
  initialTip,
}: {
  initialTip?: NotionComputerItemWithContent | null;
}) {
  const { slug } = useParams<{ slug: string }>();
  const { tip, isLoading, isError } = useComputerTip(slug, initialTip);

  useEffect(() => {
    if (tip?.title) {
      document.title = `${tip.title} | Brian Lovin`;
    }
  }, [tip?.title]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!tip || isError) {
    return <p>Tip not found</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 p-4 md:px-8 md:py-12">
      <div className="flex flex-col gap-6">
        <PageTitle>{tip.title}</PageTitle>
        <div className="w-fit">
          <LikeButton
            pageId={tip.id}
            title={tip.title}
            href={computerTipLink(tip)?.href ?? `/computer/${slug}`}
            contentType="computer"
          />
        </div>
      </div>

      <FancySeparator />

      <div className="notion-blocks flex flex-col gap-6 text-lg">{renderBlocks(tip.blocks)}</div>
    </div>
  );
}
