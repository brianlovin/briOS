/**
 * Accept: text/markdown negotiation (acceptmarkdown.com).
 * Parses q-values and specificity per RFC 9110 §12.5.1. Do not substring-match.
 */

export const MARKDOWN_PRODUCES = ["text/html", "text/markdown"] as const;

export type AcceptEntry = { type: string; q: number; specificity: number };

const NEXT_INTERNAL_HEADER_NAMES = [
  "rsc",
  "next-router-prefetch",
  "next-router-state-tree",
  "next-router-segment-prefetch",
  "next-action",
] as const;

const SKIP_PREFIXES = ["/api/", "/_next/", "/_vercel/", "/monitoring"];

const SKIP_EXACT = new Set([
  "/monitoring",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/favicon.ico",
]);

const BINARY_OR_FEED_EXTENSION =
  /\.(?:avif|bmp|gif|ico|jpe?g|png|svg|webp|woff2?|ttf|otf|eot|mp3|mp4|webm|pdf|zip|xml|json|webmanifest|map)$/i;

export function parseAccept(header: string): AcceptEntry[] {
  return header.split(",").map((raw) => {
    const parts = raw
      .trim()
      .split(";")
      .map((s) => s.trim());
    const type = (parts[0] || "").toLowerCase();
    let q = 1;
    for (const param of parts.slice(1)) {
      const [name, value] = param.split("=").map((s) => s.trim());
      if (name === "q") {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
      }
    }
    const specificity = type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2;
    return { type, q, specificity };
  });
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === "*/*") return true;
  if (entry.type.endsWith("/*")) return candidate.startsWith(entry.type.slice(0, -1));
  return entry.type === candidate;
}

/**
 * Pick the preferred representation among {@link MARKDOWN_PRODUCES}.
 * Missing/empty Accept → text/html. Exclusive unsupported types → null (406).
 */
export function preferredType(header: string | null | undefined): string | null {
  if (!header || header.trim() === "") return MARKDOWN_PRODUCES[0];
  const entries = parseAccept(header);
  if (entries.length === 0) return MARKDOWN_PRODUCES[0];

  let bestType: string | null = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of MARKDOWN_PRODUCES) {
    let matched: AcceptEntry | null = null;
    let matchedPosition = Infinity;
    for (let idx = 0; idx < entries.length; idx++) {
      const entry = entries[idx];
      if (!matches(entry, candidate)) continue;
      if (
        matched === null ||
        entry.specificity > matched.specificity ||
        (entry.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = entry;
        matchedPosition = idx;
      }
    }
    if (matched === null) continue;
    if (matched.q <= 0) continue;

    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestQ = matched.q;
      bestPosition = matchedPosition;
      bestType = candidate;
    }
  }

  return bestType;
}

export function appendVaryAccept(headers: Headers): void {
  const existing = headers.get("Vary");
  if (!existing) {
    headers.set("Vary", "Accept");
    return;
  }
  const tokens = existing.split(",").map((s) => s.trim().toLowerCase());
  if (!tokens.includes("accept")) {
    headers.set("Vary", `${existing}, Accept`);
  }
}

export function isNextInternalRequest(headers: Headers): boolean {
  for (const name of NEXT_INTERNAL_HEADER_NAMES) {
    if (headers.get(name)) return true;
  }
  const accept = headers.get("accept") ?? "";
  return accept.toLowerCase().includes("text/x-component");
}

export function isMarkdownNegotiablePath(pathname: string): boolean {
  if (SKIP_EXACT.has(pathname)) return false;
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return false;
  if (pathname !== "/" && BINARY_OR_FEED_EXTENSION.test(pathname)) return false;
  return true;
}

export function markdownRewritePath(pathname: string): string {
  const stripped = pathname.endsWith(".md") ? pathname.slice(0, -3) || "/" : pathname;
  const normalized = stripped === "" ? "/" : stripped;
  return `/api/markdown${normalized === "/" ? "" : normalized}`;
}

export function notAcceptableBody(): string {
  return "Not Acceptable\n\nAvailable: text/html, text/markdown\n";
}
