import type { MetadataRoute } from "next";

/**
 * Honor-system robots.txt: search and retrieval crawlers are allowed;
 * training-only agents are opted out. No sitemap until /sitemap.xml exists.
 */
export default function robots(): MetadataRoute.Robots {
  return {
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
