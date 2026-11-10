import { connection, NextResponse } from "next/server";

import { errorResponse, safeCompare } from "@/lib/api-utils";
import { logger } from "@/lib/logger";
import { sweepDatabases, sweepNotionImages } from "@/lib/notion/image-sweep";
import { annotate, withAxiom } from "@/lib/observability/axiom-route";
import { missingR2EnvVars } from "@/lib/r2/storage";

export const maxDuration = 300;

/** Leave headroom under maxDuration for the purge and response. */
const SWEEP_BUDGET_MS = 240_000;

/**
 * Daily sweep: persist every Notion-hosted temporary file (image/video blocks,
 * icons, covers, files and URL properties) across all `NOTION_*_DATABASE_ID`
 * databases to R2 and write the R2 URL back into Notion.
 *
 * GET /api/notion/persist-images            (Vercel cron, Bearer CRON_SECRET)
 * GET /api/notion/persist-images?dryRun=1   report only; no uploads or writes
 */
async function handler(request: Request) {
  await connection();

  const authHeader = request.headers.get("authorization");
  const providedToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!safeCompare(providedToken, process.env.CRON_SECRET)) {
    return errorResponse("Unauthorized", 401);
  }

  const dryRun = new URL(request.url).searchParams.get("dryRun") === "1";
  const missing = missingR2EnvVars();
  if (missing.length > 0 && !dryRun) {
    logger.error("[Notion images] Sweep skipped: R2 not configured", undefined, { missing });
    annotate({ outcome: "r2_not_configured" });
    return errorResponse("R2 is not configured", 500, { missing });
  }

  const databases = sweepDatabases();
  const summary = await sweepNotionImages({
    databases,
    dryRun,
    deadline: Date.now() + SWEEP_BUDGET_MS,
  });

  annotate({
    outcome: summary.complete ? "complete" : "partial",
    dry_run: dryRun,
    databases: databases.length,
    images_found: summary.found,
    images_persisted: summary.persisted,
    images_written_back: summary.writtenBack,
    images_failed: summary.failed,
    purged: summary.purged,
  });

  return NextResponse.json({ success: true, ...summary });
}

export const GET = withAxiom(handler, { name: "notion-persist-images", kind: "cron" });
