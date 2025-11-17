"use client";

import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";

import Fathom from "@/components/Fathom";
import { swrConfig } from "@/lib/swr-config";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SWRConfig value={swrConfig}>
      <ThemeProvider storageKey="prototype-theme" attribute="class" disableTransitionOnChange>
        <Fathom />
        {children}
      </ThemeProvider>
    </SWRConfig>
  );
}
