import "server-only";

import { headers } from "next/headers";

import { getBatchUserLikeData, type LikeData } from "./likes-redis";
import { getClientIpFromHeaders, hashUserIp } from "./user-hash";

export type { LikeData };

/**
 * Server-side function to get batch like data for multiple pages
 * Call this from server components to get initial like data
 */
export async function getServerLikes(pageIds: string[]): Promise<Record<string, LikeData>> {
  if (pageIds.length === 0) return {};

  const headersList = await headers();
  const ip = getClientIpFromHeaders(headersList);
  const userId = hashUserIp(ip);

  const likeData = await getBatchUserLikeData(userId, pageIds);

  // Convert Map to Record for easier serialization
  const result: Record<string, LikeData> = {};
  likeData.forEach((data, pageId) => {
    result[pageId] = data;
  });

  return result;
}
