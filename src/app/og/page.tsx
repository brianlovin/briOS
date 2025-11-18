"use client";

import { useEffect, useState } from "react";

interface OGImage {
  title: string;
  url: string;
  path: string;
}

export default function OGTestingPage() {
  const [ogImages, setOgImages] = useState<OGImage[]>([
    {
      title: "Home Page",
      url: "/opengraph-image",
      path: "/opengraph-image",
    },
    {
      title: "Writing List",
      url: "/writing/opengraph-image",
      path: "/writing/opengraph-image",
    },
    {
      title: "AMA List",
      url: "/ama/opengraph-image",
      path: "/ama/opengraph-image",
    },
    {
      title: "Hacker News List",
      url: "/hn/opengraph-image",
      path: "/hn/opengraph-image",
    },
    {
      title: "App Dissection List",
      url: "/app-dissection/opengraph-image",
      path: "/app-dissection/opengraph-image",
    },
    {
      title: "Stack",
      url: "/stack/opengraph-image",
      path: "/stack/opengraph-image",
    },
    {
      title: "Listening History",
      url: "/listening-history/opengraph-image",
      path: "/listening-history/opengraph-image",
    },
  ]);

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Prevent duplicate fetches (React strict mode runs effects twice in dev)
    if (hasFetched) return;

    async function fetchDynamicExamples() {
      try {
        // Fetch a writing post
        const writingRes = await fetch("/api/writing");
        const writingData = await writingRes.json();
        const firstPost = writingData.items?.[0];

        const dynamicImages: OGImage[] = [];

        if (firstPost?.slug) {
          dynamicImages.push({
            title: `Writing: ${firstPost.title}`,
            url: `/writing/${firstPost.slug}/opengraph-image`,
            path: `/writing/${firstPost.slug}/opengraph-image`,
          });
        }

        // Fetch an AMA question
        const amaRes = await fetch("/api/ama");
        const amaData = await amaRes.json();
        const firstAma = amaData.items?.[0];

        if (firstAma?.id) {
          dynamicImages.push({
            title: `AMA: ${firstAma.title}`,
            url: `/ama/${firstAma.id}/opengraph-image`,
            path: `/ama/${firstAma.id}/opengraph-image`,
          });
        }

        // Add specific writing post example
        dynamicImages.push({
          title: "Writing: Team Communication is Broken",
          url: "/writing/team-communication-is-broken/opengraph-image",
          path: "/writing/team-communication-is-broken/opengraph-image",
        });

        // Add app dissection example (using hardcoded slug since it's from static data)
        dynamicImages.push({
          title: "App Dissection: Instagram",
          url: "/app-dissection/instagram-ios/opengraph-image",
          path: "/app-dissection/instagram-ios/opengraph-image",
        });

        // Add HN post example
        dynamicImages.push({
          title: "HN Post Example",
          url: "/hn/41854944/opengraph-image",
          path: "/hn/41854944/opengraph-image",
        });

        setOgImages((prev) => {
          // Filter out duplicates based on path
          const existingPaths = new Set(prev.map((img) => img.path));
          const newImages = dynamicImages.filter((img) => !existingPaths.has(img.path));
          return [...prev, ...newImages];
        });
        setHasFetched(true);
      } catch (error) {
        console.error("Failed to fetch dynamic examples:", error);
        setHasFetched(true);
      }
    }

    fetchDynamicExamples();
  }, [hasFetched]);

  return (
    <div className="min-h-svh w-full overflow-y-auto">
      <div className="bg-tertiary mx-auto">
        <div className="grid grid-cols-1 gap-px lg:grid-cols-2">
          {ogImages.map((image) => (
            <div key={image.path} className="bg-elevated p-6">
              <div className="mb-4">
                <h2 className="text-primary text-lg font-semibold">{image.title}</h2>
                <code className="text-tertiary line-clamp-1 text-sm">{image.url}</code>
              </div>
              <div className="overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={`OG Image: ${image.title}`}
                  className="border-secondary h-auto w-full rounded border shadow-sm"
                  style={{ aspectRatio: "1200/630" }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const errorDiv = document.createElement("div");
                    errorDiv.className =
                      "flex items-center justify-center h-full bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 p-4";
                    errorDiv.textContent = `Failed to load: ${image.url}`;
                    target.parentElement?.appendChild(errorDiv);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
