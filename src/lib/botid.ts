export const HN_BOTID_ADVANCED_OPTIONS = {
  checkLevel: "basic",
} as const;

export const HN_BOTID_PROTECTED_ROUTES = [
  {
    path: "/api/hn",
    method: "GET",
    advancedOptions: HN_BOTID_ADVANCED_OPTIONS,
  },
  {
    path: "/api/hn/[id]",
    method: "GET",
    advancedOptions: HN_BOTID_ADVANCED_OPTIONS,
  },
] as const;
