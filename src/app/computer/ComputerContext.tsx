"use client";

import React, { createContext, useContext } from "react";

import type { ComputerTip } from "@/lib/computer";

interface ComputerTipsContextType {
  tips: ComputerTip[];
  isLoading: boolean;
  isError: unknown;
}

const ComputerTipsContext = createContext<ComputerTipsContextType>({
  tips: [],
  isLoading: false,
  isError: undefined,
});

export function ComputerTipsProvider({
  children,
  tips,
  isLoading,
  isError,
}: {
  children: React.ReactNode;
  tips: ComputerTip[];
  isLoading: boolean;
  isError: unknown;
}) {
  return (
    <ComputerTipsContext.Provider value={{ tips, isLoading, isError }}>
      {children}
    </ComputerTipsContext.Provider>
  );
}

export function useComputerTipsContext() {
  return useContext(ComputerTipsContext);
}
