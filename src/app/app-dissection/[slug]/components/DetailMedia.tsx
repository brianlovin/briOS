"use client";

import { renderBlocks } from "@/components/renderBlocks";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { AppDissectionDetail } from "@/lib/notion/types";

interface Props {
  detail: AppDissectionDetail;
}

export function DesignDetailMedia({ detail }: Props) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const orientation = detail.video?.orientation || "portrait";
  const videoUrls = detail.video?.urls || [];

  return (
    <div ref={ref} className="flex flex-col">
      <h2 className="text-primary mb-4 text-2xl font-semibold">{detail.title}</h2>
      <div className="notion-blocks prose-lg">{renderBlocks(detail.descriptionBlocks)}</div>

      {isVisible && videoUrls.length > 0 && (
        <div className="bg-tertiary dark:bg-secondary mt-8 mb-4 flex items-center justify-center rounded-xl p-2 md:p-4 xl:rounded-2xl">
          {videoUrls.map((src) => (
            <video
              playsInline
              muted
              loop
              autoPlay
              preload="metadata"
              key={src}
              style={{
                minHeight: orientation === "landscape" ? "320px" : "680px",
                maxWidth: orientation === "landscape" ? "100%" : "400px",
              }}
              className="h-full w-full overflow-hidden rounded-md"
            >
              <source src={`${src}#t=0.1`} />
            </video>
          ))}
        </div>
      )}
    </div>
  );
}
