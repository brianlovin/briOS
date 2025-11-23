"use client";

import { useAtomValue } from "jotai";
import React from "react";

import { hnSubscribedAtom } from "@/atoms/hnSubscription";
import { ListDetailLayout } from "@/components/ListDetailLayout";
import { HackerNewsPost } from "@/types/hackernews";

import { HNStoriesListClient } from "./HNStoriesListClient";
import { SubscribeDialog } from "./SubscribeDialog";

interface HNLayoutClientProps {
  children: React.ReactNode;
  initialPosts: (HackerNewsPost | null)[];
}

export function HNLayoutClient({ children, initialPosts }: HNLayoutClientProps) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const hnSubscribed = useAtomValue(hnSubscribedAtom);

  return (
    <ListDetailLayout
      title="Hacker News"
      backHref="/hn"
      list={<HNStoriesListClient initialPosts={initialPosts} />}
      headerChildren={
        <>
          <div className="text-quaternary hidden text-sm sm:flex">{formattedDate}</div>
          {!hnSubscribed && <SubscribeDialog />}
        </>
      }
    >
      {children}
    </ListDetailLayout>
  );
}
