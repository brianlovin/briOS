"use client";

import React from "react";

import { type ComputerTip } from "@/lib/computer";
import { useComputerTips } from "@/lib/hooks/useComputer";

import { ComputerTipsProvider } from "./ComputerContext";

export function ComputerLayoutClient({
  children,
  initialTips,
}: {
  children: React.ReactNode;
  initialTips?: ComputerTip[];
}) {
  const { tips, isLoading, isError } = useComputerTips(initialTips);

  return (
    <ComputerTipsProvider tips={tips} isLoading={isLoading ?? false} isError={isError}>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </ComputerTipsProvider>
  );
}
