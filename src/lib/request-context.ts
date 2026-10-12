import { hashUserIp } from "@/lib/user-hash";

/**
 * Privacy-safe request fields for analytics events. Never includes the raw IP:
 * `visitor` is the same salted hash the likes system uses.
 */
export interface RequestContextFields {
  country?: string;
  region?: string;
  referrer_host?: string;
  referrer_path?: string;
  visitor?: string;
  user_agent?: string;
  is_bot: boolean;
}

const BOT_USER_AGENT =
  /bot|crawl|spider|slurp|preview|scanner|fetcher|monitor|headless|lighthouse|facebookexternalhit|embedly|curl|wget|python-requests|python-urllib|go-http-client|axios|node-fetch|httpclient|okhttp|java\//i;

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true;
  return BOT_USER_AGENT.test(userAgent);
}

function headerValue(headers: Headers, name: string): string | undefined {
  const value = headers.get(name)?.trim();
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function clientIp(headers: Headers): string | undefined {
  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    undefined
  );
}

/** Split a referrer into same-site path vs. external host. */
export function referrerFields(
  referrer: string | null | undefined,
  siteHost: string | undefined,
): Pick<RequestContextFields, "referrer_host" | "referrer_path"> {
  if (!referrer) return {};
  try {
    const url = new URL(referrer);
    if (siteHost && url.host === siteHost) return { referrer_path: url.pathname };
    return { referrer_host: url.host };
  } catch {
    return {};
  }
}

export function requestContext(request: Request): RequestContextFields {
  const { headers } = request;
  const userAgent = headers.get("user-agent") ?? undefined;
  const ip = clientIp(headers);

  return {
    country: headerValue(headers, "x-vercel-ip-country"),
    region: headerValue(headers, "x-vercel-ip-country-region"),
    ...referrerFields(headers.get("referer"), headers.get("host") ?? undefined),
    visitor: ip ? hashUserIp(ip) : undefined,
    user_agent: userAgent?.slice(0, 300),
    is_bot: isBotUserAgent(userAgent),
  };
}
