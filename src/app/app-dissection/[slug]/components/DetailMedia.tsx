"use client";

import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { AppDissectionItemDetailType } from "@/data/app-dissection";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface Props {
  detail: AppDissectionItemDetailType;
}

export function DesignDetailMedia(props: Props) {
  const { detail } = props;
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  return (
    <div ref={ref} className="flex flex-col">
      <h2 className="text-primary mb-4 text-2xl font-semibold">{detail.title}</h2>
      <div className="prose-lg">
        <MarkdownRenderer>{detail.description}</MarkdownRenderer>
      </div>

      {isVisible && detail.media && (
        <div className="bg-tertiary dark:bg-secondary mt-8 mb-4 flex items-center justify-center rounded-xl p-2 md:p-4 xl:rounded-2xl">
          {detail.media.map((src) => (
            <video
              playsInline
              muted
              loop
              autoPlay
              preload="metadata"
              key={src}
              style={{
                minHeight: `${detail.orientation === "landscape" ? "320px" : "680px"}`,
                maxWidth: `${detail.orientation === "landscape" ? "100%" : "400px"}`,
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
