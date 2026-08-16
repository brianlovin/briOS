import { createHash } from "crypto";

import {
  type ActivityGeo,
  countryCodeToName,
  formatVisitSummary,
  geoFromVisitMeta,
} from "./activity-geo";
import { githubActivityFromWebhook } from "./activity-github";
import { isRegisteredActivityEvent } from "./activity-registry";
import {
  ACTIVITY_ENVELOPE_VERSION,
  ACTIVITY_IDEMPOTENCY_TTL_SECONDS,
  ACTIVITY_META_MAX_BYTES,
  ACTIVITY_SOURCE_BRIOS,
  ACTIVITY_STREAM_MAXLEN,
  ACTIVITY_VISIT_STREAM_MAX_PER_SEC,
  type ActivityEvent,
  type ActivityFeedPayload,
  type ActivityIngestInput,
  type ActivityRef,
  activitySourceLabel,
  type ActivitySpeed,
  type ActivityTotal,
  findForbiddenPii,
  formatDownloadSummary,
  inferContentTypeFromPath,
  isActivityPath,
  likeActivityPayload,
  normalizeCaffeineDrink,
  resolveVisitTitle,
  sanitizeVisitTitle,
  shouldCountLifetimeTotal,
  shouldRecordVisit,
  visibleLifetimeTotals,
} from "./activity-shared";

export type { ActivityGeo } from "./activity-geo";
export {
  ANONYMOUS_VISIT_SUMMARY,
  countryCodeToName,
  formatVisitSummary,
  getRequestGeo,
} from "./activity-geo";
export type { GithubActivityDecision } from "./activity-github";
export {
  githubActivityFromWebhook,
  isDependabotActor,
  isGithubBotActor,
  verifyGithubWebhookSignature,
} from "./activity-github";
export { isRegisteredActivityEvent } from "./activity-registry";
export type { ActivityRollup } from "./activity-rollup";
export {
  ACTIVITY_ENTER_STAGGER_MAX,
  ACTIVITY_ENTER_STAGGER_STEP,
  activityEnterStaggerDelays,
  activityEventHref,
  activityRollupKey,
  activityStackReactKey,
  rollupActivityEvents,
  shouldPulseActivityRollup,
} from "./activity-rollup";
export type {
  ActivityEvent,
  ActivityFeedPayload,
  ActivityIngestInput,
  ActivityRef,
  ActivitySpeed,
  ActivityTotal,
  ActivityVisibility,
  LikeActivityPayload,
  LikeActivityTarget,
} from "./activity-shared";
export {
  ACTIVITY_ENVELOPE_VERSION,
  ACTIVITY_FEED_CACHE_CONTROL,
  ACTIVITY_FEED_DEDUPING_MS,
  ACTIVITY_FEED_POLL_MS,
  ACTIVITY_SOURCE_BRIOS,
  ACTIVITY_SOURCE_GITHUB,
  ACTIVITY_SOURCE_LABELS,
  ACTIVITY_STREAM_MAXLEN,
  ACTIVITY_VISIT_STREAM_MAX_PER_SEC,
  activityFeedRefreshInterval,
  activitySectionFromPath,
  activitySectionPhrase,
  activitySourceFaviconSrc,
  activitySourceLabel,
  activitySourceUrl,
  countryCodeToFlag,
  findForbiddenPii,
  formatActivityTitle,
  formatDownloadSummary,
  formatTotalLabel,
  getActivityRow,
  getCaffeineIcon,
  getMergedPullRequestDiff,
  getRequestCountry,
  inferContentTypeFromPath,
  inferTitleFromPath,
  isActivityFeedPayload,
  isActivityPath,
  isCoffeeFamilyDrink,
  isKnownActivityTitle,
  likeActivityPayload,
  looksLikeDehyphenatedSlug,
  looksLikeIdentifier,
  looksLikeShortId,
  normalizeCaffeineDrink,
  resolveActivitySourceHref,
  resolveVisitTitle,
  sanitizeActivityTitle,
  sanitizeVisitTitle,
  shouldCountLifetimeTotal,
  shouldRecordVisit,
  stripSiteTitleSuffix,
  stripTrailingShortIdToken,
  visibleLifetimeTotals,
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

export async function buildActivityFeed(store: ActivityStore | null): Promise<ActivityFeedPayload> {
  if (!store) return { events: [], totals: [] };
  const [events, totals] = await Promise.all([store.getTail(100), store.getTotals()]);
  return { events, totals: visibleLifetimeTotals(totals) };
}

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

function applyIngestDefaults(input: ActivityIngestInput): ActivityIngestInput {
  if (input.type === "visit") {
    const meta = isPlainObject(input.meta) ? { ...input.meta } : {};
    const path =
      typeof meta.path === "string" && meta.path ? meta.path : input.subject?.href || "/";
    const providedTitle = typeof meta.title === "string" ? meta.title : input.subject?.label;
    const title = resolveVisitTitle(path, providedTitle);
    const geo = geoFromVisitMeta(meta);
    const country = geo.country?.trim() || undefined;
    const countryName = geo.countryName || (country ? countryCodeToName(country) : undefined);
    const region = geo.region;
    const regionName = geo.regionName;
    const city = geo.city;
    const summary =
      input.summary?.trim() ||
      formatVisitSummary({ country, countryName, region, regionName, city });

    return {
      ...input,
      speed: input.speed ?? "signal",
      summary,
      subject: input.subject ?? {
        kind: inferContentTypeFromPath(path),
        label: title,
        href: path,
      },
      meta: {
        ...meta,
        ...(country ? { country } : {}),
        ...(countryName && countryName !== country ? { country_name: countryName } : {}),
        ...(region ? { region } : {}),
        ...(regionName ? { region_name: regionName } : {}),
        ...(city ? { city } : {}),
        path,
        title,
      },
    };
  }

  if (input.type === "download") {
    const label = input.subject?.label?.trim() || activitySourceLabel(input.source);
    return {
      ...input,
      speed: input.speed ?? "event",
      summary: input.summary?.trim() || formatDownloadSummary(input.source, label),
      subject: input.subject ?? { kind: "download", label },
    };
  }

  return input;
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
  if (!input.source || !input.type || !isRegisteredActivityEvent(input.source, input.type)) {
    return { ok: false, error: "unregistered source/type", status: 400 };
  }

  const normalized = applyIngestDefaults(input);
  const fieldError = validateIngestInput(normalized);
  if (fieldError) return { ok: false, error: fieldError, status: 400 };

  const pii = findForbiddenPii(normalized);
  if (pii) {
    return { ok: false, error: `payload contains forbidden data (${pii})`, status: 400 };
  }

  const receivedAt = now.toISOString();
  const event: ActivityEvent = {
    v: normalized.v ?? ACTIVITY_ENVELOPE_VERSION,
    id: normalized.id ?? crypto.randomUUID(),
    ts: normalized.ts ?? receivedAt,
    received_at: receivedAt,
    source: normalized.source,
    type: normalized.type,
    speed: normalized.speed ?? "event",
    summary: normalized.summary ?? "",
    visibility: normalized.visibility ?? "public",
    idempotency_key: normalized.idempotency_key,
    ...(normalized.actor ? { actor: normalized.actor } : {}),
    ...(normalized.subject ? { subject: normalized.subject } : {}),
    ...(normalized.meta ? { meta: normalized.meta } : {}),
  };

  const claimed = await store.claimIdempotency(
    event.idempotency_key,
    normalized.idempotencyTtlSeconds ?? ACTIVITY_IDEMPOTENCY_TTL_SECONDS,
  );

  if (!claimed) {
    return { ok: true, id: event.id, duplicate: true, streamed: false };
  }

  if (shouldCountLifetimeTotal(event.type)) {
    await store.incrementTotal(event.source, event.type, event.received_at);
  }

  const writeToStream = normalized.writeToStream !== false;
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

  const href = input.href;
  const title = sanitizeVisitTitle(input.title, href) || "a page";
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
  input: { path: string; title?: string } & ActivityGeo,
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult | { skipped: true; reason: string }> {
  if (!shouldRecordVisit(input.path)) {
    return { skipped: true, reason: "activity_path" };
  }

  const country = input.country?.trim() || undefined;
  const countryName =
    input.countryName?.trim() || (country ? countryCodeToName(country) : undefined);
  const region = input.region?.trim() || undefined;
  const regionName = input.regionName?.trim() || undefined;
  const city = input.city?.trim() || undefined;
  const summary = formatVisitSummary({ country, countryName, region, regionName, city });
  const title = resolveVisitTitle(input.path, input.title);
  const windowKey = `visit:${Math.floor(now.getTime() / 1000)}`;
  const windowCount = await store.incrementVisitWindow(windowKey, 2);
  const writeToStream = windowCount <= ACTIVITY_VISIT_STREAM_MAX_PER_SEC;

  return ingestActivityEvent(
    {
      source: ACTIVITY_SOURCE_BRIOS,
      type: "visit",
      speed: "signal",
      summary,
      visibility: "public",
      idempotency_key: `brios:visit:${crypto.randomUUID()}`,
      subject: {
        kind: inferContentTypeFromPath(input.path),
        label: title,
        href: input.path,
      },
      meta: {
        ...(country ? { country } : {}),
        ...(countryName && countryName !== country ? { country_name: countryName } : {}),
        ...(region ? { region } : {}),
        ...(regionName ? { region_name: regionName } : {}),
        ...(city ? { city } : {}),
        path: input.path,
        title,
      },
      writeToStream,
    },
    store,
    now,
  );
}

export async function recordGithubActivity(
  githubEvent: string,
  payload: unknown,
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult | { skipped: true; reason: string }> {
  const decision = githubActivityFromWebhook(githubEvent, payload);
  if (decision.status === "ignore") {
    return { skipped: true, reason: decision.reason };
  }
  return ingestActivityEvent(decision.input, store, now);
}

export async function recordCaffeine(
  input: { drink: string },
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult> {
  const drink = normalizeCaffeineDrink(input.drink);
  if (!drink) {
    return { ok: false, error: "drink is required", status: 400 };
  }

  const day = now.toISOString().slice(0, 10);
  const slug = drink.toLowerCase().replace(/\s+/g, "-");

  return ingestActivityEvent(
    {
      source: ACTIVITY_SOURCE_BRIOS,
      type: "caffeinated",
      speed: "event",
      summary: `Caffeinated with ${drink}`,
      visibility: "public",
      idempotency_key: `brios:caffeinated:${day}:${slug}:${crypto.randomUUID()}`,
      subject: { kind: "drink", label: drink },
      meta: { drink },
    },
    store,
    now,
  );
}

export async function recordBriosEvent(
  input: {
    type: string;
    summary: string;
    idempotency_key: string;
    subject?: ActivityRef;
    meta?: Record<string, unknown>;
    speed?: ActivitySpeed;
    permanent?: boolean;
  },
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult> {
  return ingestActivityEvent(
    {
      source: ACTIVITY_SOURCE_BRIOS,
      type: input.type,
      speed: input.speed ?? "event",
      summary: input.summary,
      visibility: "public",
      idempotency_key: input.idempotency_key,
      ...(input.subject ? { subject: input.subject } : {}),
      ...(input.meta ? { meta: input.meta } : {}),
      ...(input.permanent ? { idempotencyTtlSeconds: 0 } : {}),
    },
    store,
    now,
  );
}

export function hashDigestSubscriber(email: string): string {
  return createHash("sha256")
    .update(`brios:digest_subscribed:${email.trim().toLowerCase()}`)
    .digest("hex")
    .slice(0, 16);
}

export async function recordAmaAsked(
  input: { id: string; title: string },
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult> {
  const title = input.title.trim() || "a question";
  const href = `/ama/${input.id}`;
  return recordBriosEvent(
    {
      type: "ama_asked",
      summary: "Someone asked a question",
      idempotency_key: `brios:ama_asked:${input.id}`,
      subject: { kind: "ama", label: title, href },
      meta: { title, href },
      permanent: true,
    },
    store,
    now,
  );
}

export async function recordAmaAnswered(
  input: { id: string; title: string },
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult> {
  const title = input.title.trim() || "a question";
  const href = `/ama/${input.id}`;
  return recordBriosEvent(
    {
      type: "ama_answered",
      summary: "A question was answered",
      idempotency_key: `brios:ama_answered:${input.id}`,
      subject: { kind: "ama", label: title, href },
      meta: { title, href },
      permanent: true,
    },
    store,
    now,
  );
}

export async function recordDigestSubscribed(
  input: { email: string },
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult> {
  const subscriberHash = hashDigestSubscriber(input.email);
  return recordBriosEvent(
    {
      type: "digest_subscribed",
      summary: "Someone subscribed to the HN digest",
      idempotency_key: `brios:digest_subscribed:${subscriberHash}`,
      permanent: true,
    },
    store,
    now,
  );
}

export async function recordDigestSent(
  input: { date: string; postCount?: number },
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult> {
  return recordBriosEvent(
    {
      type: "digest_sent",
      summary: "The HN digest was sent",
      idempotency_key: `brios:digest_sent:${input.date}`,
      meta: input.postCount === undefined ? undefined : { post_count: input.postCount },
      permanent: true,
    },
    store,
    now,
  );
}

export async function recordWritingPublished(
  input: { id: string; title: string; slug: string },
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult> {
  const title = input.title.trim() || "a post";
  const href = `/writing/${input.slug}`;
  return recordBriosEvent(
    {
      type: "writing_published",
      summary: "A writing post was published",
      idempotency_key: `brios:writing_published:${input.id}`,
      subject: { kind: "writing", label: title, href },
      meta: { title, href },
      permanent: true,
    },
    store,
    now,
  );
}

export async function recordTilPublished(
  input: { id: string; title: string; href: string },
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult> {
  const title = input.title.trim() || "a TIL";
  const href = input.href;
  return recordBriosEvent(
    {
      type: "til_published",
      summary: "A TIL was published",
      idempotency_key: `brios:til_published:${input.id}`,
      subject: { kind: "til", label: title, href },
      meta: { title, href },
      permanent: true,
    },
    store,
    now,
  );
}

export async function recordStackAdded(
  input: { id: string; title: string },
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult> {
  const title = input.title.trim() || "a stack item";
  const href = "/stack";
  return recordBriosEvent(
    {
      type: "stack_added",
      summary: "A stack item was added",
      idempotency_key: `brios:stack_added:${input.id}`,
      subject: { kind: "stack", label: title, href },
      meta: { title, href },
      permanent: true,
    },
    store,
    now,
  );
}

export async function recordSiteAdded(
  input: { id: string; title: string },
  store: ActivityStore,
  now: Date = new Date(),
): Promise<IngestResult> {
  const title = input.title.trim() || "a site";
  const href = "/sites";
  return recordBriosEvent(
    {
      type: "site_added",
      summary: "A good website was added",
      idempotency_key: `brios:site_added:${input.id}`,
      subject: { kind: "site", label: title, href },
      meta: { title, href },
      permanent: true,
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

  return likeActivityPayload({
    title: body.title,
    href,
    contentType: body.content_type,
  });
}
