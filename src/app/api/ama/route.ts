import { z } from "zod";

import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { createAmaQuestion, getAmaDatabaseItems } from "@/lib/notion";

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
    const cursor = searchParams.get("cursor") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const { items, nextCursor } = await getAmaDatabaseItems(cursor, limit);
    // Cache for 24 hours - Notion content doesn't change frequently
    return cachedResponse({ items, nextCursor }, 86400);
  } catch (error) {
    console.error("Error fetching AMA questions:", error);
    return errorResponse("Failed to fetch AMA questions");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createQuestionSchema.parse(body);

    const page = await createAmaQuestion(validatedData.title, validatedData.description);
    return cachedResponse({ id: page.id }, 0); // No cache for POST responses
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.issues);
    }

    // Handle other errors
    console.error("Error creating AMA question:", error);
    return errorResponse("Failed to create question");
  }
}
