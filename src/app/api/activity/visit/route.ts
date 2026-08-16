import { NextResponse } from "next/server";
import { z } from "zod";

import { getRequestGeo, recordVisit } from "@/lib/activity";
import { getActivityStore } from "@/lib/activity-redis";
import { errorResponse } from "@/lib/api-utils";

const bodySchema = z
  .object({
    path: z.string().min(1).max(500),
    title: z.string().max(500).optional(),
  })
  .strict();

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const store = getActivityStore();
    if (!store) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const result = await recordVisit(
      { path: body.path, title: body.title, ...getRequestGeo(request.headers) },
      store,
    );

    if ("skipped" in result) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    return NextResponse.json({ ok: true, skipped: false });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid body", 400);
    }
    console.error("[activity] visit failed", error);
    return NextResponse.json({ ok: true, skipped: true });
  }
}
