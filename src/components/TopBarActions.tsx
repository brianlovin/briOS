"use client";

import { useAtomValue } from "jotai";
import { createContext, type ReactNode, useContext, useLayoutEffect, useState } from "react";

import { sidebarAtom } from "@/atoms/sidebar";

type TopBarActionsContextType = {
  content: ReactNode;
  setContent: (content: ReactNode) => void;
};

const TopBarActionsContext = createContext<TopBarActionsContextType | null>(null);

export function TopBarActionsProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>(null);

  return (
    <TopBarActionsContext.Provider value={{ content, setContent }}>
      {children}
    </TopBarActionsContext.Provider>
  );
}

export function useTopBarActions(content: ReactNode) {
  const context = useContext(TopBarActionsContext);
  if (!context) {
    throw new Error("useTopBarActions must be used within TopBarActionsProvider");
  }

  useLayoutEffect(() => {
    context.setContent(content);
    return () => context.setContent(null);
  }, [content, context]);
}

export function TopBarActionsSlot() {
  const isOpen = useAtomValue(sidebarAtom);
  const context = useContext(TopBarActionsContext);

  if (!context?.content) return null;
  if (isOpen) return null;

  return <div className="ml-auto">{context.content}</div>;
}
