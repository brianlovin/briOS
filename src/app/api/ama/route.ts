import { z } from "zod";

import { recordAmaAsked } from "@/lib/activity";
import { afterActivity } from "@/lib/activity-schedule";
import { cachedResponse, errorResponse, parsePaginationParams } from "@/lib/api-utils";
import { track } from "@/lib/axiom";
import { logger } from "@/lib/logger";
import { createAmaQuestion, getAmaDatabaseItems } from "@/lib/notion";
import { withAxiom } from "@/lib/observability/axiom-route";
import { requestContext } from "@/lib/request-context";

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

async function getHandler(request: Request) {
  try {
    const { cursor, limit } = parsePaginationParams(request);
    const { items, nextCursor } = await getAmaDatabaseItems(cursor, limit);
    // Cache for 24 hours - Notion content doesn't change frequently
    return cachedResponse({ items, nextCursor }, 86400);
  } catch (error) {
    logger.error("Error fetching AMA questions", error);
    return errorResponse("Failed to fetch AMA questions");
  }
}

async function postHandler(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createQuestionSchema.parse(body);

    const page = await createAmaQuestion(validatedData.title, validatedData.description);
    track("ama.question_asked", {
      ...requestContext(request),
      question_id: page.id,
      title_length: validatedData.title.length,
      has_description: Boolean(validatedData.description),
    });
    afterActivity((store) => recordAmaAsked({ id: page.id, title: validatedData.title }, store));
    return cachedResponse({ id: page.id }, 0); // No cache for POST responses
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      track("ama.question_rejected", { ...requestContext(request), reason: "validation" });
      return errorResponse("Validation failed", 400, error.issues);
    }

    // Handle other errors
    logger.error("Error creating AMA question", error);
    return errorResponse("Failed to create question");
  }
}

export const GET = withAxiom(getHandler, { name: "/api/ama" });
export const POST = withAxiom(postHandler, { name: "/api/ama" });
