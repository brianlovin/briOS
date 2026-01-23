import { NextResponse } from "next/server";
import { z } from "zod";

import { errorResponse } from "@/lib/api-utils";
import { checkRateLimit, getBatchUserLikeData } from "@/lib/likes-redis";
import { getClientIp, hashUserIp } from "@/lib/user-hash";

const querySchema = z.object({
  ids: z.string().min(1),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { ids } = querySchema.parse({ ids: searchParams.get("ids") });

    const pageIds = ids.split(",").filter((id) => id.length > 0 && id.length <= 50);

    if (pageIds.length === 0) {
      return errorResponse("No valid page IDs provided", 400);
    }

    if (pageIds.length > 100) {
      return errorResponse("Too many page IDs (max 100)", 400);
    }

    const ip = getClientIp(request);

    // Check rate limit
    const isRateLimited = await checkRateLimit(ip);
    if (isRateLimited) {
      return errorResponse("Rate limit exceeded. Try again later.", 429);
    }

    const userId = hashUserIp(ip);

    const likeData = await getBatchUserLikeData(userId, pageIds);

    // Convert Map to object for JSON serialization
    const result: Record<
      string,
      { count: number; userLikes: number; hasLiked: boolean; canLike: boolean }
    > = {};
    likeData.forEach((data, pageId) => {
      result[pageId] = data;
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid request parameters", 400);
    }
    console.error("Error fetching batch likes:", error);
    return errorResponse("Failed to fetch likes");
  }
}
