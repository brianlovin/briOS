import { atomWithStorage } from "jotai/utils";

export type LikesSortOrder = "none" | "desc" | "asc";

export const sitesLikesSortOrderAtom = atomWithStorage<LikesSortOrder>(
  "sites-likes-sort-order",
  "none",
);

export const stackLikesSortOrderAtom = atomWithStorage<LikesSortOrder>(
  "stack-likes-sort-order",
  "none",
);
