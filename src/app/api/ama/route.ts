import { revalidateTag } from "next/cache";
import { z } from "zod";

import { createAmaQuestion, getAmaQuestions } from "@/db/queries/ama";
import { cachedResponse, errorResponse } from "@/lib/api-utils";

const createQuestionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title must be 500 characters or less")
    .trim(),
  description: z
    .string()
    .max(5000, "Description must be 5000 characters or less")
    .trim()
    .optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursorRaw = searchParams.get("cursor");
    const limitRaw = searchParams.get("limit");
    const cursor = cursorRaw ? Number.parseInt(cursorRaw, 10) : 0;
    const limit = limitRaw ? Number.parseInt(limitRaw, 10) : 20;

    if (!Number.isFinite(cursor) || cursor < 0) {
      return errorResponse("Invalid cursor", 400);
    }
    if (!Number.isFinite(limit) || limit <= 0 || limit > 100) {
      return errorResponse("Invalid limit", 400);
    }

    const { items, nextCursor } = await getAmaQuestions(String(cursor), limit);
    return cachedResponse({ items, nextCursor }, 3600);
  } catch (error) {
    console.error("Error fetching AMA questions:", error);
    return errorResponse("Failed to fetch AMA questions");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createQuestionSchema.parse(body);

    const result = await createAmaQuestion(validatedData.title, validatedData.description);
    revalidateTag("ama", { expire: 0 });
    return cachedResponse({ id: result.id }, 0);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.issues);
    }

    console.error("Error creating AMA question:", error);
    return errorResponse("Failed to create question");
  }
}
