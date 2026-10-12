import { revalidateTag } from "next/cache";
import { after, NextResponse } from "next/server";
import { z } from "zod";

import { getRequestGeo, likeMetaFromRequest, recordLike } from "@/lib/activity";
import { getActivityStore } from "@/lib/activity-redis";
import { errorResponse } from "@/lib/api-utils";
import { track } from "@/lib/axiom";
import { LIKES_SERVER_CACHE_TAG } from "@/lib/likes-constants";
import {
  addLike,
  checkRateLimit,
  getLikeCount,
  getMaxLikesPerUser,
  getUserLikeCount,
  removeLike,
} from "@/lib/likes-redis";
import { logger } from "@/lib/logger";
import { withAxiom } from "@/lib/observability/axiom-route";
import { requestContext } from "@/lib/request-context";
import { getClientIp, hashUserIp } from "@/lib/user-hash";

function bustLikesServerSnapshot() {
  revalidateTag(LIKES_SERVER_CACHE_TAG, "max");
}

const paramsSchema = z.object({
  id: z.string().min(1).max(50),
});

const likeActivitySchema = z.object({
  title: z.string().max(200).optional(),
  href: z.string().max(500).optional(),
  content_type: z.string().max(50).optional(),
});

type LikeBody = z.infer<typeof likeActivitySchema>;

async function readLikeBody(request: Request): Promise<LikeBody> {
  try {
    const raw = await request.text();
    return raw ? likeActivitySchema.parse(JSON.parse(raw)) : {};
  } catch {
    return {};
  }
}

function likeItemFields(id: string, body: LikeBody) {
  return {
    item_id: id,
    item_type: body.content_type,
    item_title: body.title,
    item_href: body.href,
  };
}

async function getHandler(request: Request, props: { params: Promise<{ id: string }> }) {
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
    logger.error("Error fetching likes", error);
    return errorResponse("Failed to fetch likes");
  }
}

async function postHandler(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = paramsSchema.parse(params);

    const ip = getClientIp(request);
    const userId = hashUserIp(ip);
    const context = requestContext(request);

    // Check rate limit first
    const isRateLimited = await checkRateLimit(ip);
    if (isRateLimited) {
      track("like.rejected", {
        ...context,
        item_id: id,
        action: "add",
        reason: "rate_limited",
      });
      return errorResponse("Rate limit exceeded. Try again later.", 429);
    }

    // Check user's like cap
    const maxLikes = getMaxLikesPerUser();
    const userLikes = await getUserLikeCount(userId, id);
    if (userLikes >= maxLikes) {
      track("like.rejected", { ...context, item_id: id, action: "add", reason: "max_likes" });
      return errorResponse("Maximum likes reached for this item", 400);
    }

    // Add the like
    const newCount = await addLike(userId, id);
    bustLikesServerSnapshot();

    const body = await readLikeBody(request);
    const meta = likeMetaFromRequest(request, body);
    track("like.added", {
      ...context,
      ...likeItemFields(id, meta ?? body),
      count: newCount,
      user_likes: userLikes + 1,
    });

    if (meta) {
      const store = getActivityStore();
      if (store) {
        after(() => {
          void recordLike({ ...meta, pageId: id, ...getRequestGeo(request.headers) }, store).catch(
            (error) => {
              logger.error("[activity] like ingest failed", error);
            },
          );
        });
      }
    }

    return NextResponse.json({
      count: newCount,
      userLikes: userLikes + 1,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid page ID", 400);
    }
    logger.error("Error adding like", error);
    return errorResponse("Failed to add like");
  }
}

async function deleteHandler(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = paramsSchema.parse(params);

    const ip = getClientIp(request);
    const userId = hashUserIp(ip);
    const context = requestContext(request);

    // Check rate limit first
    const isRateLimited = await checkRateLimit(ip);
    if (isRateLimited) {
      track("like.rejected", {
        ...context,
        item_id: id,
        action: "remove",
        reason: "rate_limited",
      });
      return errorResponse("Rate limit exceeded. Try again later.", 429);
    }

    // Check if user has likes to remove
    const userLikes = await getUserLikeCount(userId, id);
    if (userLikes <= 0) {
      track("like.rejected", { ...context, item_id: id, action: "remove", reason: "no_likes" });
      return errorResponse("No likes to remove", 400);
    }

    // Remove the like
    const { count: newCount, userLikes: newUserLikes } = await removeLike(userId, id);
    bustLikesServerSnapshot();

    const body = await readLikeBody(request);
    track("like.removed", {
      ...context,
      ...likeItemFields(id, body),
      count: newCount,
      user_likes: newUserLikes,
    });

    return NextResponse.json({
      count: newCount,
      userLikes: newUserLikes,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid page ID", 400);
    }
    logger.error("Error removing like", error);
    return errorResponse("Failed to remove like");
  }
}

export const GET = withAxiom(getHandler, { name: "/api/likes/[id]" });
export const POST = withAxiom(postHandler, { name: "/api/likes/[id]" });
export const DELETE = withAxiom(deleteHandler, { name: "/api/likes/[id]" });
