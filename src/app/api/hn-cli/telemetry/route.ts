import { NextResponse } from "next/server";
import { z } from "zod";

import { errorResponse } from "@/lib/api-utils";
import { track } from "@/lib/axiom";
import { storeEvents, trackUser } from "@/lib/hn-cli-telemetry-redis";
import { logger } from "@/lib/logger";
import { withAxiom } from "@/lib/observability/axiom-route";

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

async function postHandler(request: Request) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Invalid request body", 400, parsed.error.flatten());
    }

    const { userId, version, events } = parsed.data;

    await trackUser(userId);
    await storeEvents(userId, events, version);
    track("hn_cli.telemetry_received", {
      event_count: events.length,
      event_names: [...new Set(events.map((event) => event.event))],
      version,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("[HN-CLI Telemetry] Error processing request", error);
    return errorResponse("Failed to process telemetry", 500);
  }
}

export const POST = withAxiom(postHandler, { name: "/api/hn-cli/telemetry" });
