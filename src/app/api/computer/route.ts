import { z } from "zod";

import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { computerTipLink, publicComputerTips } from "@/lib/computer";
import { createComputerTip, getComputerDatabaseItems } from "@/lib/notion";

const createTipSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title must be 500 characters or less")
    .trim(),
  details: z.string().max(5000, "Details must be 5000 characters or less").trim().optional(),
});

export async function GET() {
  try {
    const items = publicComputerTips(await getComputerDatabaseItems()).map((item) => ({
      ...item,
      href: computerTipLink(item)?.href,
    }));
    return cachedResponse({ items }, 86400);
  } catch (error) {
    console.error("Error fetching computer tips:", error);
    return errorResponse("Failed to fetch computer tips");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createTipSchema.parse(body);

    const page = await createComputerTip({
      title: validatedData.title,
      body: validatedData.details,
    });
    return cachedResponse({ id: page.id }, 0);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.issues);
    }

    console.error("Error creating computer tip:", error);
    return errorResponse("Failed to create tip");
  }
}
