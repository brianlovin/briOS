import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";

export async function POST(request: Request) {
  const secret = process.env.REVALIDATION_SECRET;
  const provided = request.headers.get("x-revalidation-secret");

  if (!secret || provided !== secret) {
    return errorResponse("Unauthorized", 401);
  }

  const body = await request.json();
  const tags: unknown = body.tags;

  if (!Array.isArray(tags) || tags.length === 0 || !tags.every((t) => typeof t === "string")) {
    return errorResponse("Request body must include a non-empty `tags` string array", 400);
  }

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({ revalidated: tags });
}
