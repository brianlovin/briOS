import { NextResponse } from "next/server";

import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { getPostById } from "@/lib/hn";

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const params = await props.params;
  const { id } = params;

  try {
    const post = await getPostById(id, true);
    if (!post) {
      return errorResponse("Post not found", 404);
    }
    // Cache for 1 hour
    return cachedResponse(post, 3600);
  } catch (error) {
    console.error("Error fetching HN post:", error);
    return errorResponse("Failed to fetch post");
  }
}
