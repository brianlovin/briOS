/**
 * Allowed (source, type) pairs for activity ingest.
 * HMAC and in-repo producers both go through ingestActivityEvent, which
 * rejects anything not in this registry.
 */
export const ACTIVITY_REGISTRY = {
  brios: [
    "visit",
    "like",
    "ama_asked",
    "ama_answered",
    "digest_subscribed",
    "digest_sent",
    "writing_published",
    "til_published",
    "stack_added",
    "site_added",
    "design_details_added",
    "app_dissection_published",
    "pr_opened",
    "pr_merged",
    "repo_starred",
    "caffeinated",
  ],
  shiori: ["link_saved", "signed_up", "subscription_started", "download"],
  "tax-ui": ["visit", "download"],
  "staff-design": ["visit"],
  "design-details": ["visit"],
} as const;

export type ActivityRegistrySource = keyof typeof ACTIVITY_REGISTRY;

export function isRegisteredActivityEvent(source: string, type: string): boolean {
  const types = ACTIVITY_REGISTRY[source as ActivityRegistrySource];
  if (!types) return false;
  return (types as readonly string[]).includes(type);
}
