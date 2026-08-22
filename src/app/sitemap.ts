import type { MetadataRoute } from "next";

import { buildSitemapEntries } from "@/lib/sitemap-urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries();
}
