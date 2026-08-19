import { type LikeData, MAX_LIKES_PER_USER } from "@/lib/likes-constants";

export const LIKES_VIEWER_STORAGE_KEY = "brios-likes-viewer";
export const LIKES_VIEWER_STORAGE_MAX_PAGES = 200;

export type ViewerLikeStore = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

function isStoredPageId(pageId: string): boolean {
  return pageId.length > 0 && pageId.length <= 50 && !/\s/.test(pageId);
}

function isStoredLikeData(value: unknown): value is LikeData {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.count === "number" &&
    Number.isFinite(record.count) &&
    record.count >= 0 &&
    typeof record.userLikes === "number" &&
    Number.isFinite(record.userLikes) &&
    record.userLikes >= 0 &&
    record.userLikes <= MAX_LIKES_PER_USER
  );
}

/** sessionStorage, or null when unavailable (SSR, privacy mode). */
export function getSessionViewerStore(): ViewerLikeStore | null {
  try {
    if (typeof sessionStorage === "undefined") return null;
    return sessionStorage;
  } catch {
    return null;
  }
}

type ViewerStoreListener = () => void;
const viewerStoreListeners = new Set<ViewerStoreListener>();
const EMPTY_VIEWER_LIKES: Record<string, LikeData> = {};

let snapshotRaw: string | null | undefined;
let snapshotValue: Record<string, LikeData> = EMPTY_VIEWER_LIKES;

function notifyStoredViewerLikes() {
  snapshotRaw = undefined;
  for (const listener of viewerStoreListeners) listener();
}

export function subscribeStoredViewerLikes(onStoreChange: () => void): () => void {
  viewerStoreListeners.add(onStoreChange);
  return () => {
    viewerStoreListeners.delete(onStoreChange);
  };
}

export function getStoredViewerLikesSnapshot(): Record<string, LikeData> {
  const store = getSessionViewerStore();
  let raw: string | null = null;
  try {
    raw = store?.getItem(LIKES_VIEWER_STORAGE_KEY) ?? null;
  } catch {
    raw = null;
  }
  if (raw === snapshotRaw) return snapshotValue;
  snapshotRaw = raw;
  snapshotValue = parseStoredViewerLikes(raw);
  return snapshotValue;
}

export function getServerViewerLikesSnapshot(): Record<string, LikeData> {
  return EMPTY_VIEWER_LIKES;
}

/** Parse a stored map. Corrupt JSON or entries are dropped. */
export function parseStoredViewerLikes(raw: string | null): Record<string, LikeData> {
  if (!raw) return EMPTY_VIEWER_LIKES;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return EMPTY_VIEWER_LIKES;

    const result: Record<string, LikeData> = {};
    for (const [pageId, value] of Object.entries(parsed)) {
      if (!isStoredPageId(pageId) || !isStoredLikeData(value)) continue;
      result[pageId] = { count: value.count, userLikes: value.userLikes };
    }
    return Object.keys(result).length === 0 ? EMPTY_VIEWER_LIKES : result;
  } catch {
    return EMPTY_VIEWER_LIKES;
  }
}

/**
 * Hint for one page. Missing / invalid entries are undefined.
 * `userLikes: 0` is valid (empty heart) and does not invent a like.
 */
export function storedViewerHint(
  stored: Record<string, LikeData>,
  pageId: string,
): LikeData | undefined {
  return stored[pageId];
}

export function storedViewerHints(
  stored: Record<string, LikeData>,
  pageIds: string[],
): Record<string, LikeData> | null {
  const hint: Record<string, LikeData> = {};
  let found = false;
  for (const pageId of pageIds) {
    const entry = storedViewerHint(stored, pageId);
    if (!entry) continue;
    hint[pageId] = entry;
    found = true;
  }
  return found ? hint : null;
}

export function mergeStoredViewerLikes(
  existing: Record<string, LikeData>,
  updates: Record<string, LikeData>,
  maxPages: number = LIKES_VIEWER_STORAGE_MAX_PAGES,
): Record<string, LikeData> {
  const next: Record<string, LikeData> = { ...existing };
  for (const [pageId, value] of Object.entries(updates)) {
    if (!isStoredPageId(pageId) || !isStoredLikeData(value)) continue;
    delete next[pageId];
    next[pageId] = { count: value.count, userLikes: value.userLikes };
  }

  const keys = Object.keys(next);
  if (keys.length <= maxPages) return next;

  const kept = keys.slice(-maxPages);
  const trimmed: Record<string, LikeData> = {};
  for (const key of kept) {
    trimmed[key] = next[key]!;
  }
  return trimmed;
}

export function readStoredViewerLikes(
  store: ViewerLikeStore | null = getSessionViewerStore(),
): Record<string, LikeData> {
  if (!store) return {};
  try {
    return parseStoredViewerLikes(store.getItem(LIKES_VIEWER_STORAGE_KEY));
  } catch {
    return {};
  }
}

export function writeStoredViewerLikes(
  updates: Record<string, LikeData>,
  store: ViewerLikeStore | null = getSessionViewerStore(),
): void {
  if (!store || Object.keys(updates).length === 0) return;
  try {
    const next = mergeStoredViewerLikes(readStoredViewerLikes(store), updates);
    store.setItem(LIKES_VIEWER_STORAGE_KEY, JSON.stringify(next));
    notifyStoredViewerLikes();
  } catch {
    // Quota, private mode, or a thrown Storage setter — fall through.
  }
}

export function writeStoredViewerLike(
  pageId: string,
  data: LikeData,
  store: ViewerLikeStore | null = getSessionViewerStore(),
): void {
  writeStoredViewerLikes({ [pageId]: data }, store);
}

export function readStoredViewerHint(
  pageId: string,
  store: ViewerLikeStore | null = getSessionViewerStore(),
): LikeData | undefined {
  return storedViewerHint(readStoredViewerLikes(store), pageId);
}
