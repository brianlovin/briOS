import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/lib/metadata";

/**
 * Honor-system robots.txt: search and retrieval crawlers are allowed;
 * training-only agents are opted out.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
        ],
        allow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "Google-Extended",
          "ClaudeBot",
          "Applebot-Extended",
          "CCBot",
          "Bytespider",
          "anthropic-ai",
        ],
        disallow: "/",
      },
    ],
  };
}
