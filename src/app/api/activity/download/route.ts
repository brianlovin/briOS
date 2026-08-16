import { z } from "zod";

import { recordDownload } from "@/lib/activity";
import { activityPingJson, activityPingOptions, applyActivityPingCors } from "@/lib/activity-cors";
import { getActivityStore } from "@/lib/activity-redis";
import { ACTIVITY_DOWNLOAD_SOURCES } from "@/lib/activity-shared";
import { errorResponse } from "@/lib/api-utils";

const bodySchema = z.object({
  source: z.enum(ACTIVITY_DOWNLOAD_SOURCES),
  platform: z.string().max(100).optional(),
});

export function OPTIONS(request: Request) {
  return activityPingOptions(request);
}

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const store = getActivityStore();
    if (!store) {
      return activityPingJson(request, { ok: true, skipped: true });
    }

    const result = await recordDownload({ source: body.source, platform: body.platform }, store);

    if (!result.ok) {
      return applyActivityPingCors(request, errorResponse(result.error, result.status));
    }

    return activityPingJson(request, { ok: true, skipped: false });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const sourceIssue = error.issues.some((issue) => issue.path.includes("source"));
      return applyActivityPingCors(
        request,
        errorResponse(sourceIssue ? "Unknown source" : "Invalid body", 400),
      );
    }
    console.error("[activity] download failed", error);
    return activityPingJson(request, { ok: true, skipped: true });
  }
}
