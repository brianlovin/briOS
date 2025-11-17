"use client";

import React, { createContext, useContext } from "react";

import { HackerNewsPost } from "@/types/hackernews";

interface HNPostsContextType {
  posts: (HackerNewsPost | null)[] | undefined;
  isLoading: boolean;
  isError: any;
}

const HNPostsContext = createContext<HNPostsContextType>({
  posts: undefined,
  isLoading: false,
  isError: undefined,
});

export function HNPostsProvider({
  children,
  posts,
  isLoading,
  isError,
}: {
  children: React.ReactNode;
  posts: (HackerNewsPost | null)[] | undefined;
  isLoading: boolean;
  isError: any;
}) {
  return (
    <HNPostsContext.Provider value={{ posts, isLoading, isError }}>
      {children}
    </HNPostsContext.Provider>
  );
}

export function useHNPostsContext() {
  return useContext(HNPostsContext);
}
