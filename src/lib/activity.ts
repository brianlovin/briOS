import {
  ACTIVITY_ENVELOPE_VERSION,
  ACTIVITY_IDEMPOTENCY_TTL_SECONDS,
  ACTIVITY_META_MAX_BYTES,
  ACTIVITY_SOURCE_BRIOS,
  ACTIVITY_STREAM_MAXLEN,
  ACTIVITY_VISIT_STREAM_MAX_PER_SEC,
  type ActivityEvent,
  type ActivityIngestInput,
  type ActivityTotal,
  findForbiddenPii,
  inferContentTypeFromPath,
  inferTitleFromPath,
  isActivityPath,
  shouldRecordVisit,
} from "./activity-shared";

export type {
  ActivityEvent,
  ActivityIngestInput,
  ActivityRef,
  ActivitySpeed,
  ActivityTotal,
  ActivityVisibility,
} from "./activity-shared";
export {
  ACTIVITY_ENVELOPE_VERSION,
  ACTIVITY_SOURCE_BRIOS,
  ACTIVITY_STREAM_MAXLEN,
  ACTIVITY_VISIT_STREAM_MAX_PER_SEC,
  findForbiddenPii,
  formatTotalLabel,
  getActivityRow,
  getRequestCountry,
  inferContentTypeFromPath,
  inferTitleFromPath,
  isActivityPath,
  shouldRecordVisit,
} from "./activity-shared";

export type IngestResult =
  | { ok: true; id: string; duplicate: boolean; streamed: boolean }
  | { ok: false; error: string; status: number };

export type ActivityStore = {
  claimIdempotency(key: string, ttlSeconds: number): Promise<boolean>;
  incrementTotal(source: string, type: string, firstSeen: string): Promise<void>;
  addToStream(event: ActivityEvent): Promise<void>;
  getTail(limit: number): Promise<ActivityEvent[]>;
  getTotals(): Promise<ActivityTotal[]>;
  getStreamLength(): Promise<number>;
  incrementVisitWindow(windowKey: string, ttlSeconds: number): Promise<number>;
};

export function createMemoryActivityStore(options: { maxLen?: number } = {}): ActivityStore {
  const maxLen = options.maxLen ?? ACTIVITY_STREAM_MAXLEN;
  const events: ActivityEvent[] = [];
  const totals = new Map<string, ActivityTotal>();
  const claimed = new Set<string>();
  const visitWindows = new Map<string, number>();

  return {
    async claimIdempotency(key: string): Promise<boolean> {
      if (claimed.has(key)) return false;
      claimed.add(key);
      return true;
    },
    async incrementTotal(source: string, type: string, firstSeen: string): Promise<void> {
      const id = `${source}:${type}`;
      const existing = totals.get(id);
      if (existing) {
        existing.count += 1;
        return;
      }
      totals.set(id, { source, type, count: 1, first_seen: firstSeen });
    },
    async addToStream(event: ActivityEvent): Promise<void> {
      events.push(event);
      if (events.length > maxLen) {
        events.splice(0, events.length - maxLen);
      }
    },
    async getTail(limit: number): Promise<ActivityEvent[]> {
      return events.slice().reverse().slice(0, limit);
    },
    async getTotals(): Promise<ActivityTotal[]> {
      return Array.from(totals.values()).sort((a, b) => b.count - a.count);
    },
    async getStreamLength(): Promise<number> {
      return events.length;
    },
    async incrementVisitWindow(windowKey: string): Promise<number> {
      const next = (visitWindows.get(windowKey) ?? 0) + 1;
      visitWindows.set(windowKey, next);
      return next;
    },
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateRef(name: string, value: unknown): string | null {
  if (value === undefined) return null;
  if (!isPlainObject(value)) return `${name} must be an object`;
  if (typeof value.kind !== "string" || value.kind.length === 0) {
    return `${name}.kind is required`;
  }
  if (typeof value.label !== "string" || value.label.length === 0) {
    return `${name}.label is required`;
  }
  if (value.href !== undefined && typeof value.href !== "string") {
    return `${name}.href must be a string`;
  }
  return null;
}

export function validateIngestInput(input: ActivityIngestInput): string | null {
  if (!input.source || typeof input.source !== "string") return "source is required";
  if (!input.type || typeof input.type !== "string") return "type is required";
  if (!input.summary || typeof input.summary !== "string") return "summary is required";
  if (!input.idempotency_key || typeof input.idempotency_key !== "string") {
    return "idempotency_key is required";
  }
  if (input.speed !== "event" && input.speed !== "signal") {
    return "speed must be event or signal";
  }
  if (input.visibility && input.visibility !== "public" && input.visibility !== "private") {
    return "visibility must be public or private";
  }
  const actorError = validateRef("actor", input.actor);
  if (actorError) return actorError;
  const subjectError = validateRef("subject", input.subject);
  if (subjectError) return subjectError;
  if (input.meta !== undefined) {
    if (!isPlainObject(input.meta)) return "meta must be an object";
    const metaBytes = new TextEncoder().encode(JSON.stringify(input.meta)).byteLength;
    if (metaBytes > ACTIVITY_META_MAX_BYTES) return "meta exceeds 2kb";
  }
  return null;
}

export async function ingestActivityEvent(
  input: ActivityIngestInput,
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult> {
  const fieldError = validateIngestInput(input);
  if (fieldError) return { ok: false, error: fieldError, status: 400 };

  const pii = findForbiddenPii(input);
  if (pii) {
    return { ok: false, error: `payload contains forbidden data (${pii})`, status: 400 };
  }

  const receivedAt = now.toISOString();
  const event: ActivityEvent = {
    v: input.v ?? ACTIVITY_ENVELOPE_VERSION,
    id: input.id ?? crypto.randomUUID(),
    ts: input.ts ?? receivedAt,
    received_at: receivedAt,
    source: input.source,
    type: input.type,
    speed: input.speed,
    summary: input.summary,
    visibility: input.visibility ?? "public",
    idempotency_key: input.idempotency_key,
    ...(input.actor ? { actor: input.actor } : {}),
    ...(input.subject ? { subject: input.subject } : {}),
    ...(input.meta ? { meta: input.meta } : {}),
  };

  const claimed = await store.claimIdempotency(
    event.idempotency_key,
    ACTIVITY_IDEMPOTENCY_TTL_SECONDS,
  );

  if (!claimed) {
    return { ok: true, id: event.id, duplicate: true, streamed: false };
  }

  await store.incrementTotal(event.source, event.type, event.received_at);

  const writeToStream = input.writeToStream !== false;
  if (writeToStream) {
    await store.addToStream(event);
  }

  return { ok: true, id: event.id, duplicate: false, streamed: writeToStream };
}

export async function recordLike(
  input: { title: string; href: string; content_type: string; pageId?: string },
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult | { skipped: true; reason: string }> {
  if (isActivityPath(input.href)) {
    return { skipped: true, reason: "activity_path" };
  }

  const title = input.title.trim() || "a page";
  const href = input.href;
  const contentType = input.content_type || inferContentTypeFromPath(href);

  return ingestActivityEvent(
    {
      source: ACTIVITY_SOURCE_BRIOS,
      type: "like",
      speed: "event",
      summary: `Someone liked ${title}`,
      visibility: "public",
      idempotency_key: `brios:like:${input.pageId ?? href}:${crypto.randomUUID()}`,
      subject: { kind: contentType, label: title, href },
      meta: { content_type: contentType, title, href },
    },
    store,
    now,
  );
}

export async function recordVisit(
  input: { path: string; country?: string | null },
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult | { skipped: true; reason: string }> {
  if (!shouldRecordVisit(input.path)) {
    return { skipped: true, reason: "activity_path" };
  }

  const country = input.country?.trim() || undefined;
  const windowKey = `visit:${Math.floor(now.getTime() / 1000)}`;
  const windowCount = await store.incrementVisitWindow(windowKey, 2);
  const writeToStream = windowCount <= ACTIVITY_VISIT_STREAM_MAX_PER_SEC;

  return ingestActivityEvent(
    {
      source: ACTIVITY_SOURCE_BRIOS,
      type: "visit",
      speed: "signal",
      summary: country ? `Visit from ${country}` : "Visit",
      visibility: "public",
      idempotency_key: `brios:visit:${crypto.randomUUID()}`,
      meta: country ? { country } : undefined,
      writeToStream,
    },
    store,
    now,
  );
}

export function likeMetaFromRequest(
  request: Request,
  body: { title?: string; href?: string; content_type?: string } = {},
): { title: string; href: string; content_type: string } | null {
  let href = body.href;
  if (!href) {
    const referer = request.headers.get("referer");
    if (referer) {
      try {
        href = new URL(referer).pathname;
      } catch {
        href = undefined;
      }
    }
  }

  if (!href) href = "/";
  if (isActivityPath(href)) return null;

  return {
    href,
    title: body.title?.trim() || inferTitleFromPath(href),
    content_type: body.content_type || inferContentTypeFromPath(href),
  };
}
