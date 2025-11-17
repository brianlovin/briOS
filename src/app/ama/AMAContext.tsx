"use client";

import React, { createContext, useContext } from "react";

import { AmaQuestion } from "@/lib/ama";

interface AMAQuestionsContextType {
  questions: AmaQuestion[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isReachingEnd: boolean;
  isError: unknown;
  size: number;
  setSize: (size: number | ((size: number) => number)) => Promise<unknown>;
}

const AMAQuestionsContext = createContext<AMAQuestionsContextType>({
  questions: [],
  isLoading: false,
  isLoadingMore: false,
  isReachingEnd: false,
  isError: undefined,
  size: 1,
  setSize: async () => {},
});

export function AMAQuestionsProvider({
  children,
  questions,
  isLoading,
  isLoadingMore,
  isReachingEnd,
  isError,
  size,
  setSize,
}: {
  children: React.ReactNode;
  questions: AmaQuestion[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isReachingEnd: boolean;
  isError: unknown;
  size: number;
  setSize: (size: number | ((size: number) => number)) => Promise<unknown>;
}) {
  return (
    <AMAQuestionsContext.Provider
      value={{
        questions,
        isLoading,
        isLoadingMore,
        isReachingEnd,
        isError,
        size,
        setSize,
      }}
    >
      {children}
    </AMAQuestionsContext.Provider>
  );
}

export function useAMAQuestionsContext() {
  return useContext(AMAQuestionsContext);
}
