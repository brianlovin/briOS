import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { getFullContent } from "@/lib/notion";
import { withAxiom } from "@/lib/observability/axiom-route";

async function getHandler(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await Promise.resolve(await context.params);

  try {
    const blocks = await getFullContent(id);
    return NextResponse.json(blocks, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    logger.error("Error fetching content", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export const GET = withAxiom(getHandler, { name: "/api/notion/content/[id]" });
