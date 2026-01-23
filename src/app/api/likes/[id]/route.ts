import { NextResponse } from "next/server";
import { z } from "zod";

import { errorResponse } from "@/lib/api-utils";
import {
  addLike,
  checkRateLimit,
  getLikeCount,
  getMaxLikesPerUser,
  getUserLikeCount,
  hasUserLiked,
} from "@/lib/likes-redis";
import { getClientIp, hashUserIp } from "@/lib/user-hash";

const paramsSchema = z.object({
  id: z.string().min(1).max(50),
});

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = paramsSchema.parse(params);

    const ip = getClientIp(request);
    const userId = hashUserIp(ip);

    const [count, userLikes, hasLiked] = await Promise.all([
      getLikeCount(id),
      getUserLikeCount(userId, id),
      hasUserLiked(userId, id),
    ]);

    const maxLikes = getMaxLikesPerUser();

    return NextResponse.json({
      count,
      userLikes,
      hasLiked,
      canLike: userLikes < maxLikes,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid page ID", 400);
    }
    console.error("Error fetching likes:", error);
    return errorResponse("Failed to fetch likes");
  }
}

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = paramsSchema.parse(params);

    const ip = getClientIp(request);
    const userId = hashUserIp(ip);

    // Check rate limit first
    const isRateLimited = await checkRateLimit(ip);
    if (isRateLimited) {
      return errorResponse("Rate limit exceeded. Try again later.", 429);
    }

    // Check user's like cap
    const maxLikes = getMaxLikesPerUser();
    const userLikes = await getUserLikeCount(userId, id);
    if (userLikes >= maxLikes) {
      return errorResponse("Maximum likes reached for this item", 400);
    }

    // Add the like
    const newCount = await addLike(userId, id);

    return NextResponse.json({
      count: newCount,
      userLikes: userLikes + 1,
      hasLiked: true,
      canLike: userLikes + 1 < maxLikes,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid page ID", 400);
    }
    console.error("Error adding like:", error);
    return errorResponse("Failed to add like");
  }
}
