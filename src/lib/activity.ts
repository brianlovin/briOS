import { createHash } from "crypto";

import { lookupCmsPostTitle } from "./activity-cms";
import {
  type ActivityGeo,
  countryCodeToName,
  formatVisitSummary,
  geoFromVisitMeta,
} from "./activity-geo";
import { githubActivityFromWebhook } from "./activity-github";
import { lookupHnStoryTitle } from "./activity-hn";
import { isRegisteredActivityEvent } from "./activity-registry";
import {
  ACTIVITY_ENVELOPE_VERSION,
  ACTIVITY_IDEMPOTENCY_TTL_SECONDS,
  ACTIVITY_META_MAX_BYTES,
  ACTIVITY_SOURCE_BRIOS,
  ACTIVITY_STREAM_MAXLEN,
  ACTIVITY_VISIT_STREAM_MAX_PER_SEC,
  ACTIVITY_VISIT_TITLE_MAX,
  type ActivityEvent,
  type ActivityFeedPayload,
  type ActivityIngestInput,
  type ActivityRef,
  activitySourceLabel,
  type ActivitySpeed,
  cmsPostRefFromPath,
  findForbiddenPii,
  formatDownloadSummary,
  hnStoryIdFromPath,
  inferContentTypeFromPath,
  isActivityPath,
  isGenericHnStoryTitle,
  likeActivityPayload,
  normalizeCaffeineDrink,
  resolveVisitTitle,
  sanitizeVisitTitle,
  shouldLookupCmsPostTitle,
  shouldRecordVisit,
  stripSiteTitleSuffix,
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
  nextActivityEnterState,
  rollupActivityEvents,
  shouldPulseActivityRollup,
} from "./activity-rollup";
export type {
  ActivityEvent,
  ActivityFeedPayload,
  ActivityIngestInput,
  ActivityRef,
  ActivitySpeed,
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
  ACTIVITY_TRACKED_SINCE,
  ACTIVITY_TRACKED_SINCE_TOOLTIP,
  ACTIVITY_VISIT_STREAM_MAX_PER_SEC,
  activityFeedRefreshInterval,
  activitySectionFromPath,
  activitySectionPhrase,
  activitySourceFaviconSrc,
  activitySourceLabel,
  activitySourceUrl,
  appendKnownSectionSuffix,
  cmsPostRefFromPath,
  countryCodeToFlag,
  findForbiddenPii,
  formatActivityTitle,
  formatDownloadSummary,
  formatTrackedEventsLabel,
  getActivityRow,
  getCaffeineIcon,
  getMergedPullRequestDiff,
  getRequestCountry,
  hnStoryIdFromPath,
  inferContentTypeFromPath,
  inferTitleFromPath,
  isAbsoluteHttpUrl,
  isActivityFeedPayload,
  isActivityPath,
  isCoffeeFamilyDrink,
  isGenericHnStoryTitle,
  isKnownActivitySection,
  isKnownActivityTitle,
  isSlugLikeActivityTitle,
  isUnusableActivityTitle,
  likeActivityPayload,
  looksLikeDehyphenatedSlug,
  looksLikeIdentifier,
  looksLikeShortId,
  normalizeCaffeineDrink,
  pathnameFromHref,
  resolveActivitySourceHref,
  resolveVisitTitle,
  sanitizeActivityTitle,
  sanitizeVisitTitle,
  shouldLookupCmsPostTitle,
  shouldRecordVisit,
  stripSiteTitleSuffix,
  stripTrailingShortIdToken,
} from "./activity-shared";

export type IngestResult =
  | { ok: true; id: string; duplicate: boolean; streamed: boolean }
  | { ok: false; error: string; status: number };

export type ActivityStore = {
  claimIdempotency(key: string, ttlSeconds: number): Promise<boolean>;
  incrementCount(): Promise<void>;
  addToStream(event: ActivityEvent): Promise<void>;
  getTail(limit: number): Promise<ActivityEvent[]>;
  getCount(): Promise<number>;
  getStreamLength(): Promise<number>;
  incrementVisitWindow(windowKey: string, ttlSeconds: number): Promise<number>;
};

export async function buildActivityFeed(store: ActivityStore | null): Promise<ActivityFeedPayload> {
  if (!store) return { events: [], count: 0 };
  const [events, count] = await Promise.all([
    store.getTail(ACTIVITY_STREAM_MAXLEN),
    store.getCount(),
  ]);
  return { events, count };
}

export function createMemoryActivityStore(options: { maxLen?: number } = {}): ActivityStore {
  const maxLen = options.maxLen ?? ACTIVITY_STREAM_MAXLEN;
  const events: ActivityEvent[] = [];
  const claimed = new Set<string>();
  const visitWindows = new Map<string, number>();
  let count = 0;

  return {
    async claimIdempotency(key: string): Promise<boolean> {
      if (claimed.has(key)) return false;
      claimed.add(key);
      return true;
    },
    async incrementCount(): Promise<void> {
      count += 1;
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
    async getCount(): Promise<number> {
      return count;
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

/** Store a CMS title exactly — no slug title-casing. */
function exactCmsActivityTitle(title: string): string | null {
  const stripped = stripSiteTitleSuffix(title.trim());
  if (!stripped || /^brian lovin$/i.test(stripped)) return null;
  if (findForbiddenPii(stripped)) return null;
  if (stripped === "a page") return null;
  return stripped.slice(0, ACTIVITY_VISIT_TITLE_MAX);
}

/**
 * Sanitize a visit title, then look up HN / writing / TIL when the client
 * title is missing, generic, or slug-like. Ingest-only — the activity feed
 * render path stays sync.
 */
export async function resolveIngestVisitTitle(path: string, title?: string): Promise<string> {
  const resolved = resolveVisitTitle(path, title);

  const hnId = hnStoryIdFromPath(path);
  if (hnId && isGenericHnStoryTitle(resolved, hnId)) {
    try {
      const lookedUp = await lookupHnStoryTitle(hnId);
      if (lookedUp) {
        const fromHn = resolveVisitTitle(path, lookedUp);
        if (!isGenericHnStoryTitle(fromHn, hnId)) return fromHn;
      }
    } catch {
      return resolved;
    }
    return resolved;
  }

  const cms = cmsPostRefFromPath(path);
  if (cms && shouldLookupCmsPostTitle(title, path)) {
    try {
      const lookedUp = await lookupCmsPostTitle(cms.kind, cms.slug);
      const exact = lookedUp ? exactCmsActivityTitle(lookedUp) : null;
      if (exact) return exact;
    } catch {
      return resolved;
    }
  }

  return resolved;
}

async function applyIngestDefaults(input: ActivityIngestInput): Promise<ActivityIngestInput> {
  if (input.type === "visit") {
    const meta = isPlainObject(input.meta) ? { ...input.meta } : {};
    const path =
      typeof meta.path === "string" && meta.path ? meta.path : input.subject?.href || "/";
    const providedTitle = typeof meta.title === "string" ? meta.title : input.subject?.label;
    const title = await resolveIngestVisitTitle(path, providedTitle);
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
      subject: {
        kind: input.subject?.kind ?? inferContentTypeFromPath(path),
        label: title,
        href: input.subject?.href ?? path,
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

  if (input.source === "shiori" && (input.type === "link_saved" || input.type === "link_clicked")) {
    return {
      ...input,
      speed: input.speed ?? "event",
      summary:
        input.summary?.trim() ||
        (input.type === "link_clicked"
          ? "Someone clicked a link on Shiori"
          : "Someone saved a link on Shiori"),
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

  const normalized = await applyIngestDefaults(input);
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

  await store.incrementCount();

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
  const title = await resolveIngestVisitTitle(input.path, input.title);
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
