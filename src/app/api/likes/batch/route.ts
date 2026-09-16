import { NextResponse } from "next/server";
import { z } from "zod";

import { errorResponse } from "@/lib/api-utils";
import { LIKES_BATCH_MAX_IDS } from "@/lib/likes-constants";
import { checkRateLimit, getBatchUserLikeData, getBatchViewerLikeData } from "@/lib/likes-redis";
import { getClientIp, hashUserIp } from "@/lib/user-hash";

const querySchema = z.object({
  ids: z.string().min(1),
  fields: z.enum(["viewer"]).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { ids, fields } = querySchema.parse({
      ids: searchParams.get("ids"),
      fields: searchParams.get("fields") ?? undefined,
    });

    const pageIds = ids.split(",").filter((id) => id.length > 0 && id.length <= 50);

    if (pageIds.length === 0) {
      return errorResponse("No valid page IDs provided", 400);
    }

    if (pageIds.length > LIKES_BATCH_MAX_IDS) {
      return errorResponse(`Too many page IDs (max ${LIKES_BATCH_MAX_IDS})`, 400);
    }

    const ip = getClientIp(request);

    // Check rate limit
    const isRateLimited = await checkRateLimit(ip);
    if (isRateLimited) {
      return errorResponse("Rate limit exceeded. Try again later.", 429);
    }

    const userId = hashUserIp(ip);

    if (fields === "viewer") {
      const userLikes = await getBatchViewerLikeData(userId, pageIds);
      const payload: Record<string, { userLikes: number }> = {};
      for (const pageId of pageIds) {
        payload[pageId] = { userLikes: userLikes.get(pageId) ?? 0 };
      }
      return NextResponse.json(payload);
    }

    const likeData = await getBatchUserLikeData(userId, pageIds);

    return NextResponse.json(Object.fromEntries(likeData));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid request parameters", 400);
    }
    console.error("Error fetching batch likes:", error);
    return errorResponse("Failed to fetch likes");
  }
}
