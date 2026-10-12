import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import { type EventFieldMap, track } from "@/lib/axiom";
import { parseClientEvent } from "@/lib/client-events-schema";
import { withAxiom } from "@/lib/observability/axiom-route";
import { requestContext } from "@/lib/request-context";

const MAX_BODY_BYTES = 4096;

/**
 * First-party analytics beacon. Accepts only the events in
 * ClientEventFieldMap, drops bots and cross-site posts, and forwards to Axiom
 * with coarse geo + hashed visitor id (never the raw IP).
 */
async function postHandler(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") {
    return new NextResponse(null, { status: 204 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return errorResponse("Payload too large", 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return errorResponse("Invalid JSON", 400);
  }

  const parsed = parseClientEvent(body);
  if (!parsed) {
    return errorResponse("Invalid event", 400);
  }

  const context = requestContext(request);
  if (context.is_bot) {
    return new NextResponse(null, { status: 204 });
  }

  // The Referer header is our own page; the beacon reports the page's external referrer.
  track(parsed.event, {
    ...parsed.data,
    ...context,
    path: parsed.path,
    referrer_host: parsed.referrer,
    referrer_path: undefined,
    source: "client",
  } as EventFieldMap[typeof parsed.event]);

  return new NextResponse(null, { status: 204 });
}

export const POST = withAxiom(postHandler, { name: "/api/events", quiet: true });
