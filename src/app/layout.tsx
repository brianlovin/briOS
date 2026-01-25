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
    <html
      lang="en"
      suppressHydrationWarning
      className="bg-white subpixel-antialiased dark:bg-black"
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#fff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="rgb(10, 10, 10)" media="(prefers-color-scheme: dark)" />
        <script
          defer
          src="https://my-analytics-broken-fog-8153.fly.dev/tracker.js"
          data-site-id="5de00909-54eb-48a0-bfa9-12e023184d22"
        />
      </head>
      <body className={cn(inter.variable, ptSerif.variable)}>
        <Providers>
          <ClientShell>{children}</ClientShell>
        </Providers>
      </body>
    </html>
  );
}
