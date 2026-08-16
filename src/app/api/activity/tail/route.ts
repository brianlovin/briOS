import { NextResponse } from "next/server";

import { getActivityStore } from "@/lib/activity-redis";
import { errorResponse } from "@/lib/api-utils";

export async function GET() {
  const store = getActivityStore();
  if (!store) {
    return NextResponse.json(
      { events: [] },
      { headers: { "Cache-Control": "public, s-maxage=1" } },
    );
  }

  try {
    const events = await store.getTail(100);
    return NextResponse.json({ events }, { headers: { "Cache-Control": "public, s-maxage=1" } });
  } catch (error) {
    console.error("[activity] tail failed", error);
    return errorResponse("Failed to load activity");
  }
}
