import { NextResponse } from "next/server";
import { z } from "zod";

import { errorResponse } from "@/lib/api-utils";
import { storeEvents, trackUser } from "@/lib/hn-cli-telemetry-redis";

const eventSchema = z.object({
  event: z.string().min(1).max(50),
  timestamp: z.number().int().positive(),
  properties: z.record(z.string(), z.unknown()).optional(),
});

const bodySchema = z.object({
  userId: z.string().uuid(),
  version: z.string().max(20).optional(),
  events: z.array(eventSchema).min(1).max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Invalid request body", 400, parsed.error.flatten());
    }

    const { userId, version, events } = parsed.data;

    await trackUser(userId);
    await storeEvents(userId, events, version);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[HN-CLI Telemetry] Error processing request:", error);
    return errorResponse("Failed to process telemetry", 500);
  }
}
