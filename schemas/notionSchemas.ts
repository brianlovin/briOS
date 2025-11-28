// ⚠️ AUTO-GENERATED FILE — DO NOT EDIT MANUALLY
// Run `bun run generate-schemas` to regenerate.

import { z } from "zod";

export const StackSchema = z.object({
  Slug: z.string().optional(),
  Description: z.string().optional(),
  Image: z.string().optional(),
  URL: z.string().optional(),
  Platforms: z.array(z.enum(["Windows", "Web", "Physical", "macOS", "iOS"])).optional(),
  "Process icon": z.any().optional(),
  Status: z.enum(["Inactive", "Active"]).optional(),
  Name: z.string().optional(),
});

export type Stack = z.infer<typeof StackSchema>;

export const AMASchema = z.object({
  "Answered At": z.string().optional(),
  "Created At": z.string().optional(),
  Status: z.enum(["Won't answer", "Unanswered", "Answered"]).optional(),
  Button: z.any().optional(),
  Description: z.string().optional(),
  Name: z.string().optional(),
});

export type AMA = z.infer<typeof AMASchema>;

export const WritingSchema = z.object({
  Slug: z.string().optional(),
  Excerpt: z.string().optional(),
  Published: z.string().optional(),
  FeatureImage: z.string().optional(),
  "Optimize images": z.any().optional(),
  "Created time": z.string().optional(),
  Name: z.string().optional(),
});

export type Writing = z.infer<typeof WritingSchema>;

export const DesignDetailsEpisodesSchema = z.object({
  "Analytics Fetched": z.boolean().optional(),
  Status: z.enum(["draft", "published", "scheduled", "private"]).optional(),
  Description: z.string().optional(),
  "Top Country": z.string().optional(),
  "Top Country Downloads": z.number().optional(),
  Slug: z.string().optional(),
  "Total Downloads": z.number().optional(),
  "Analytics Error": z.string().optional(),
  "Duration (formatted)": z.string().optional(),
  "Duration (seconds)": z.number().optional(),
  "Published Date": z.string().optional(),
  "Has Description Content": z.boolean().optional(),
  "Episode transcripts": z.array(z.object({ id: z.string() })).optional(),
  "Content Migrated": z.boolean().optional(),
  "Audio URL (S3)": z.string().optional(),
  "Episode Number": z.number().optional(),
  "Downloads Last Updated": z.string().optional(),
  "Simplecast ID": z.string().optional(),
  "Original Audio URL": z.string().optional(),
  "Image URL": z.string().optional(),
  "Migration Status": z
    .enum(["pending", "downloading", "uploading", "completed", "failed"])
    .optional(),
  "Has Long Description": z.boolean().optional(),
  Name: z.string().optional(),
});

export type DesignDetailsEpisodes = z.infer<typeof DesignDetailsEpisodesSchema>;

export const MusicSchema = z.object({
  "Spotify ID": z.string().optional(),
  Duration: z.number().optional(),
  Journal: z.array(z.object({ id: z.string() })).optional(),
  "Spotify URL": z.string().optional(),
  "Dupe Key": z.string().optional(),
  Artist: z.string().optional(),
  Album: z.string().optional(),
  Popularity: z.number().optional(),
  "Played At": z.string().optional(),
  "Album Art": z.string().optional(),
  Explicit: z.boolean().optional(),
  Name: z.string().optional(),
});

export type Music = z.infer<typeof MusicSchema>;

export const GoodWebsitesSchema = z.object({
  X: z.string().optional(),
  Tags: z.array(z.enum(["Personal site", "Company"])).optional(),
  URL: z.string().optional(),
  "Process favicon": z.any().optional(),
  Name: z.string().optional(),
});

export type GoodWebsites = z.infer<typeof GoodWebsitesSchema>;

export const SpeakingSchema = z.object({
  URL: z.string().optional(),
  Date: z.string().optional(),
  Name: z.string().optional(),
});

export type Speaking = z.infer<typeof SpeakingSchema>;
