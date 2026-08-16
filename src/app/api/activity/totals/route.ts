import { NextResponse } from "next/server";

import { getActivityStore } from "@/lib/activity-redis";
import { errorResponse } from "@/lib/api-utils";

export async function GET() {
  const store = getActivityStore();
  if (!store) {
    return NextResponse.json(
      { totals: [] },
      { headers: { "Cache-Control": "public, s-maxage=1" } },
    );
  }

  try {
    const totals = await store.getTotals();
    return NextResponse.json({ totals }, { headers: { "Cache-Control": "public, s-maxage=1" } });
  } catch (error) {
    console.error("[activity] totals failed", error);
    return errorResponse("Failed to load activity totals");
  }
}
