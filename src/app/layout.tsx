import "./globals.css";

import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { PropsWithChildren } from "react";

import { ClientShell } from "@/components/ClientShell";
import { DEFAULT_METADATA, SITE_CONFIG } from "@/lib/metadata";
import { cn } from "@/lib/utils";

import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const ptSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  ...DEFAULT_METADATA,
  alternates: {
    types: {
      "application/rss+xml": `${SITE_CONFIG.url}/writing/rss.xml`,
    },
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-[#fcfcfc] antialiased dark:bg-black">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#fff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="rgb(10, 10, 10)" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={cn(inter.variable, ptSerif.variable)}>
        <Providers>
          <ClientShell>{children}</ClientShell>
        </Providers>
      </body>
    </html>
  );
}
