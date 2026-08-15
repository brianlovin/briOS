import { NextResponse } from "next/server";
import { z } from "zod";

import { errorResponse } from "@/lib/api-utils";
import {
  addLike,
  checkRateLimit,
  getLikeCount,
  getMaxLikesPerUser,
  getUserLikeCount,
  removeLike,
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

    const [count, userLikes] = await Promise.all([getLikeCount(id), getUserLikeCount(userId, id)]);

    return NextResponse.json({
      count,
      userLikes,
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
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid page ID", 400);
    }
    console.error("Error adding like:", error);
    return errorResponse("Failed to add like");
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
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

    // Check if user has likes to remove
    const userLikes = await getUserLikeCount(userId, id);
    if (userLikes <= 0) {
      return errorResponse("No likes to remove", 400);
    }

    // Remove the like
    const { count: newCount, userLikes: newUserLikes } = await removeLike(userId, id);

    return NextResponse.json({
      count: newCount,
      userLikes: newUserLikes,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid page ID", 400);
    }
    console.error("Error removing like:", error);
    return errorResponse("Failed to remove like");
  }
}
