import { z } from "zod";
import { Redis } from "@upstash/redis";

import { errorResponse } from "@/lib/api-utils";

const redis = new Redis({
  url: process.env.UPSTASH_IMESSAGE_STATS_REST_URL!,
  token: process.env.UPSTASH_IMESSAGE_STATS_REST_TOKEN!,
});

const analyticsSchema = z.object({
  contacts: z.number().int().min(0),
  messages: z.number().int().min(0),
  years: z.number().min(0),
  words: z.number().int().min(0),
  llmUsed: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = analyticsSchema.parse(body);

    const restUrl = process.env.UPSTASH_IMESSAGE_STATS_REST_URL;
    const restToken = process.env.UPSTASH_IMESSAGE_STATS_REST_TOKEN;

    if (!restUrl || !restToken) {
      console.error("Missing Upstash configuration");
      return errorResponse("Server configuration error", 500);
    }

    const runId = crypto.randomUUID();
    const timestamp = Date.now();

    const runData = {
      runId,
      contacts: data.contacts,
      messages: data.messages,
      years: data.years,
      words: data.words,
      llmUsed: data.llmUsed,
      timestamp,
    };

    // Store run data in sorted set, scored by timestamp for time-based queries
    await redis.zadd("runs", {
      score: timestamp,
      member: JSON.stringify(runData),
    });

    return Response.json({ success: true, runId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.issues);
    }

    console.error("Error storing iMessage stats:", error);
    return errorResponse("Failed to store analytics");
  }
}
