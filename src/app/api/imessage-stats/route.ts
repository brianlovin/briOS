import { z } from "zod";

import { errorResponse } from "@/lib/api-utils";

const analyticsSchema = z.object({
  contacts: z.number().int().min(0),
  messages: z.number().int().min(0),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = analyticsSchema.parse(body);

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
      contacts: validatedData.contacts,
      messages: validatedData.messages,
      timestamp,
    };

    const summaryData = {
      runId,
      contacts: validatedData.contacts,
      messages: validatedData.messages,
    };

    // Execute Redis commands via Upstash REST API pipeline
    const pipelineCommands = [
      ["HSET", `run:${runId}`, "data", JSON.stringify(runData)],
      ["ZADD", "runs", timestamp, JSON.stringify(summaryData)],
      ["INCRBY", "total:contacts", validatedData.contacts],
      ["INCRBY", "total:messages", validatedData.messages],
      ["INCR", "total:runs"],
    ];

    const response = await fetch(`${restUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${restToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pipelineCommands),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upstash pipeline error:", errorText);
      return errorResponse("Failed to store analytics", 500);
    }

    return Response.json({ success: true, runId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.issues);
    }

    console.error("Error storing iMessage stats:", error);
    return errorResponse("Failed to store analytics");
  }
}
